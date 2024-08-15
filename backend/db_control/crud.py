# uname() error回避
import platform
print("platform", platform.uname())

from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError,SQLAlchemyError
from sqlalchemy.sql import func, and_
import pandas as pd
from datetime import datetime, timedelta, timezone
from math import radians, cos, sin, sqrt, atan2

from db_control.connect import engine
from db_control.mymodels import Users, Dogs, DogBooks, Locations, Encounts, EarnPoints, UsePoints

# 日本時間のタイムゾーン
JST = timezone(timedelta(hours=9))
def get_current_time():
    return datetime.now(JST)



def myinsert(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    new_instance = mymodel(**values)
    session.add(new_instance)
    try:
        session.commit()  # 明示的にコミット
        return {"status": "success"}
    except IntegrityError as e:
        print("一意制約違反により、挿入に失敗しました", e)
        session.rollback()
        return {"status": "error", "message": "一意制約違反により、挿入に失敗しました"}
    except Exception as e:
        session.rollback()
        print(f"エラーが発生しました: {e}")
        return {"status": "error", "message": f"エラーが発生しました: {e}"}
    finally:
        session.close()

def myselect(mymodel, column_name, value):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # カラム名を動的に取得
        column = getattr(mymodel, column_name)
        # 特定のカラムに一致するデータを選択
        query = select(mymodel).where(column == value)
        result = session.execute(query)
        # 結果をリストに変換
        rows = result.scalars().all()
        result_list = []
        for row in rows:
            row_dict = row.__dict__.copy()
            row_dict.pop('_sa_instance_state', None)  # SQLAlchemyの内部状態を削除
            result_list.append(row_dict)
            return result_list
    finally:
        # セッションを閉じる
        session.close()


def myselectAll(mymodel):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = select(mymodel)
    try:
        # トランザクションを開始
        with session.begin():
            df = pd.read_sql_query(query, con=engine)
            result_json = df.to_json(orient='records', force_ascii=False)

    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        result_json = None

    # セッションを閉じる
    session.close()
    return result_json


def myselectUser(mymodel, user_id):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 特定のユーザーidに一致するデータを選択
        query = select(mymodel).where(mymodel.user_id == user_id)
        result = session.execute(query)
        # 結果をリストに変換
        rows = result.scalars().all()
        return rows
    finally:
        # セッションを閉じる
        session.close()


def myupdate(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    user_id = values.pop("user_id")#values辞書からcustomer_idの値を取得
    query = update(mymodel).where(mymodel.user_id == user_id).values(**values)##E0002対応

    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
    # セッションを閉じる
    session.close()
    return "PUT"

def mydelete(mymodel, user_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = delete(mymodel).where(mymodel.user_id==user_id)
    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()

    # セッションを閉じる
    session.close()
    return user_id + " is deleted"

# 距離計算
def haversine(lon1, lat1, lon2, lat2):
    # 地球の半径（メートル）
    R = 6371e3
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    delta_phi = radians(lat2 - lat1)
    delta_lambda = radians(lon2 - lon1)

    a = sin(delta_phi/2)**2 + cos(phi1) * cos(phi2) * sin(delta_lambda/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    distance = R * c
    return distance

# すれ違い検知
def check_and_save_encounters(user_id, RTLocations, Encounts):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 対象のユーザーの位置情報を取得
        target_user_location = session.query(RTLocations).filter(RTLocations.user_id == user_id).first()
        if not target_user_location:
            print(f"User with ID {user_id} not found in RTLocations")
            return {"status": "error", "message": f"User with ID {user_id} not found in RTLocations"}

        # 他のユーザーの位置情報を取得（対象のユーザーは除外）
        other_users_locations = session.query(RTLocations).filter(RTLocations.user_id != user_id).all()
        today = get_current_time().date()

        for loc in other_users_locations:
            distance = haversine(target_user_location.longitude, target_user_location.latitude, loc.longitude, loc.latitude)
            print(f"Calculated distance between {user_id} and {loc.user_id}: {distance} meters")

            if distance <= 10:
                # 既にその日のエンカウントがあるかを確認
                existing_encounter = session.query(Encounts).filter(
                    Encounts.user_id == user_id,
                    Encounts.partner_user_id == loc.user_id,
                    func.date(Encounts.encount_date) == today
                ).first()

                if not existing_encounter:
                    print(f"Inserting encounter between {user_id} and {loc.user_id}")
                    # 新しいエンカウントを挿入
                    new_encounter = Encounts(
                        user_id=user_id,
                        latitude=target_user_location.latitude,
                        longitude=target_user_location.longitude,
                        partner_user_id=loc.user_id,
                        partner_latitude=loc.latitude,
                        partner_longitude=loc.longitude,
                        encount_date=get_current_time()
                    )
                    session.add(new_encounter)

        session.commit()
        return {"status": "Encounters processed"}
    except Exception as e:
        session.rollback()
        print(f"Error occurred: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
        session.close()


# すれ違いポイント計算
def calculate_and_add_points(encount_id, user_id):
    print(f"Calculating points for user_id: {user_id} and encount_id: {encount_id}")
    # セッションの作成
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # encountsテーブルの情報を取得
        encount = session.query(Encounts).filter(Encounts.encount_id == encount_id).first()
        print(f"Encount retrieved: {encount}")

        if encount:
            # EarnPointsテーブルに同じencount_idが既に存在するか確認
            existing_earn_point = session.query(EarnPoints).filter(EarnPoints.encount_id == encount_id).first()
            if existing_earn_point:
                print(f"EarnPoint with encount_id {encount_id} already exists, skipping insert.")
                return

            # dogsテーブルからパートナーユーザーに対応する犬の数をカウント
            dog_count = session.query(func.count(Dogs.dog_id)).filter(Dogs.user_id == encount.partner_user_id).scalar()
            print(f"Dog count for partner_user_id {encount.partner_user_id}: {dog_count}")

            # ポイント計算: すれ違ったユーザーの飼っている犬の数 × 100
            points = dog_count * 100

            # earn_pointsテーブルに挿入
            new_earn_point = EarnPoints(
                user_id=user_id,
                encount_id=encount_id,
                point=points,
                earn_point_datetime=get_current_time()
            )
            session.add(new_earn_point)
            print(f"Earn points record created: {new_earn_point}")

            # ユーザーの総ポイントを更新
            user = session.query(Users).filter(Users.user_id == user_id).first()
            if user:
                user.point += points
                print(f"Updated user {user_id} points to {user.point}")

            session.commit()
            print(f"{points}ポイントがユーザー{user_id}に追加されました。")
        else:
            print(f"Encount ID {encount_id} が見つかりません。")

    except Exception as e:
        session.rollback()
        print(f"ポイントの追加中にエラーが発生しました: {e}")
        raise e  # 例外を再スローして上位でキャッチできるようにする
    finally:
        session.close()



# RTLocationsへのデータ挿入とエンカウント処理を行う
def insert_rtlocation_and_process_encounters(RTLocations, Encounts, user_id, latitude, longitude):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # RTLocationsにデータを挿入
        new_location = RTLocations(user_id=user_id, latitude=latitude, longitude=longitude)
        session.add(new_location)
        session.commit()

        # 挿入後、エンカウント処理を実行
        result = check_and_save_encounters(user_id, RTLocations, Encounts)

        if result["status"] == "error":
            session.rollback()
            return {"status": "error", "message": result["message"]}

        # ここで新しく挿入されたエンカウントを取得し、ポイントを計算する
        new_encounters = session.query(Encounts).filter(
            Encounts.user_id == user_id,
            Encounts.latitude == latitude,
            Encounts.longitude == longitude
        ).all()

        for new_encounter in new_encounters:
            print(f"New encounter detected: {new_encounter}")
            calculate_and_add_points(new_encounter.encount_id, new_encounter.user_id)

        session.commit()
        return {"status": "success", "data": result}

    except Exception as e:
        session.rollback()
        print(f"Error during processing: {str(e)}")
        raise e
    finally:
        session.close()



# RTLocationsへのデータ更新とエンカウント処理を行う
def update_rt_location_and_process_encounters(user_id, latitude, longitude, RTLocations, Encounts):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # RTLocationsテーブルのユーザーの位置情報を更新
        session.query(RTLocations).filter(RTLocations.user_id == user_id).update({
            RTLocations.latitude: latitude,
            RTLocations.longitude: longitude
        })
        session.commit()

        # すれ違いの検出とエンカウント処理を実行
        result = check_and_save_encounters(user_id, RTLocations, Encounts)

        # エンカウントが挿入された後にポイントを計算して付与する
        new_encounters = session.query(Encounts).filter(
            Encounts.user_id == user_id,
            Encounts.latitude == latitude,
            Encounts.longitude == longitude
        ).all()

        for new_encounter in new_encounters:
            print(f"New encounter detected: {new_encounter}")
            calculate_and_add_points(new_encounter.encount_id, new_encounter.user_id)

        if result["status"] == "error":
            session.rollback()
            return {"status": "error", "message": result["message"]}

        session.commit()
        return {"status": "success", "data": result}

    except SQLAlchemyError as e:
        session.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        session.close()


# dog情報を一つだけ取得
def get_dog_data_by_user_id(user_id):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # dog_idが若い順にソートして最初のレコードを取得
        dog = session.query(Dogs).filter(Dogs.user_id == user_id).order_by(Dogs.dog_id.asc()).first()
        if dog:
            print(f"Found dog: {dog.dog_name}, {dog.dog_photo}")  # デバッグ用
            return {"dog_name": dog.dog_name, "dog_photo": dog.dog_photo}
        print("No dog found")  # デバッグ用
        return None
    finally:
        session.close()


# 今日の獲得ポイントの取得
def get_today_points(user_id, today):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 今日の日付のポイント合計を計算
        today_points = session.query(func.sum(EarnPoints.point)).filter(
            and_(
                EarnPoints.user_id == user_id,
                func.date(EarnPoints.earn_point_datetime) == today
            )
        ).scalar()
        return today_points or 0
    finally:
        session.close()


# 累計ポイントの取得
def get_total_points(user_id):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # usersテーブルから累計ポイントを取得
        total_points = session.query(Users.point).filter(Users.user_id == user_id).scalar()
        return total_points or 0
    finally:
        session.close()

