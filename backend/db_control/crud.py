# uname() error回避
import platform
print("platform", platform.uname())
 

from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError,SQLAlchemyError
from sqlalchemy.sql import func
import json
import pandas as pd
from datetime import datetime, date
from math import radians, cos, sin, sqrt, atan2

from db_control.connect import engine
from db_control.mymodels import Users, Dogs, DogBooks, Locations, Encounts, EarnPoints, UsePoints
 

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
        today = datetime.now().date()

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
                        encount_date=datetime.now()
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

        return {"status": "success", "data": result}
    except SQLAlchemyError as e:
        session.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        session.close()


