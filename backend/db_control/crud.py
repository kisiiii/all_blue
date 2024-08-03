# uname() error回避
import platform
print("platform", platform.uname())
 

from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker
import json
import pandas as pd

from db_control.connect import engine
from db_control.mymodels import Users, Dogs, DogBooks, Locations, Encounts, EarnPoints, UsePoints
 

def myinsert(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    query = insert(mymodel).values(values)
    try:
        # トランザクションを開始
        with session.begin():
            # データの挿入
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()

    # セッションを閉じる
    session.close()
    return "inserted"

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
        return rows
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


"""不要
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

"""


def myupdate(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    customer_id = values.pop("customer_id")#values辞書からcustomer_idの値を取得
    query = update(mymodel).where(mymodel.customer_id == customer_id).values(**values)##E0002対応

    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
    # セッションを閉じる
    session.close()
    return "PUT"

def mydelete(mymodel, customer_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = delete(mymodel).where(mymodel.customer_id==customer_id)
    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()

    # セッションを閉じる
    session.close()
    return customer_id + " is deleted"