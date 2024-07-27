from sqlalchemy import ForeignKey, Column, String, Float, Integer, DateTime, Date
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()

# データ挿入時に自動でidを発行
def generate_uuid():
    return str(uuid.uuid4())

# ユーザーDB
class Users(Base):
    __tablename__ = 'users'
    user_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_name = Column(String, nullable=False)
    user_birthdate = Column(Date, nullable=False)
    user_gender = Column(String)
    mail = Column(String, unique=True) # 一意制約
    password = Column(String, nullable=False)

# ドッグDB
class Dogs(Base):
    __tablename__ = 'dogs'
    dog_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    dog_breed = Column(String)
    dog_birthdate = Column(Date)
    dog_gender = Column(String)

# 図鑑DB
class DogBooks(Base):
    __tablename__ = 'dog_books'
    dog_book_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    dog_id = Column(String, ForeignKey('dogs.dog_id'), nullable=False, index=True)

# GPS_DB
class Locations(Base):
    __tablename__ = 'locations'
    location_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_datetime = Column(DateTime, nullable=False)

# ポイントDB
class Points(Base):
    __tablename__ = 'points'
    point_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    point = Column(Integer, nullable=False)
    point_datetime = Column(DateTime, nullable=False)
