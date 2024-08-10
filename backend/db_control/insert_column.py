# 特定のテーブルにカラムを追加

from sqlalchemy import Column, Integer, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect
from connect import engine

# セッションの作成
Session = sessionmaker(bind=engine)
session = Session()

# テーブルにカラムが存在するか確認
inspector = inspect(engine)
columns = [col['name'] for col in inspector.get_columns('users')]

if 'points' not in columns:
    # usersテーブルにpointsカラムをing型デフォルト値0で追加
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE users ADD COLUMN point INTEGER DEFAULT 0'))
    print("pointsカラムが追加されました。")
else:
    print("pointsカラムは既に存在します。")

