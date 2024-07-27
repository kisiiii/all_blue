import platform
print(platform.uname())

from mymodels import Base
from connect import engine
from sqlalchemy.orm import sessionmaker

# 一度テーブルを削除
# print("Dropping existing tables >>>")
# Base.metadata.drop_all(bind=engine)

# テーブルを追加
print("Creating new tables >>>")
Base.metadata.create_all(bind=engine)

print("Tables created successfully.")