from sqlalchemy import ForeignKey, Column, String, Float, Integer, DateTime, Date, UniqueConstraint, BINARY
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
    dog_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    dog_name = Column(String, nullable=False)
    dog_breed = Column(String)
    dog_birthdate = Column(Date)
    dog_gender = Column(String)
    dog_photo = Column(BINARY)  # 新しいバイナリデータ用のカラム

# 図鑑DB
class DogBooks(Base):
    __tablename__ = 'dog_books'
    dog_book_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    dog_id = Column(String, ForeignKey('dogs.dog_id'), nullable=False, index=True)

# GPS_DB
class Locations(Base):
    __tablename__ = 'locations'
    location_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_datetime = Column(DateTime, nullable=False)

# リアルタイム_GPS_DB
class RTLocations(Base):
    __tablename__ = 'rt_locations'
    rt_location_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    latitude = Column(Float)
    longitude = Column(Float)

# すれ違い_DB
class Encounts(Base):
    __tablename__ = 'encounts'
    encount_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    partner_user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    partner_latitude = Column(Float, nullable=False)
    partner_longitude = Column(Float, nullable=False)
    encount_date = Column(DateTime, nullable=False)

# 獲得ポイントDB
class EarnPoints(Base):
    __tablename__ = 'earn_points'
    earn_point_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    encount_id = Column(String, ForeignKey('encounts.encount_id'), nullable=False, index=True)
    point = Column(Integer, nullable=False)
    earn_point_datetime = Column(DateTime, nullable=False)

# 利用ポイントDB
class UsePoints(Base):
    __tablename__ = 'use_points'
    use_point_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    use_point = Column(Integer, nullable=False)
    use_point_datetime = Column(DateTime, nullable=False)
