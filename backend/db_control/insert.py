from sqlalchemy.orm import sessionmaker
from mymodels import Users, Dogs, DogBooks, Locations, Encounts, EarnPoints, UsePoints
from connect import engine
from datetime import datetime

# セッションの作成
Session = sessionmaker(bind=engine)
session = Session()

# ユーザー情報の挿入
new_user = Users(
    user_name="きっしー",
    user_birthdate=datetime.strptime("1988-12-29", "%Y-%m-%d"),
    user_gender="男",
    mail="kisikishi@example.com",
    password="securepassword"
)
session.add(new_user)
try:
    session.commit()
    print(f"New user_ID: {new_user.user_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")


# ドッグ情報の挿入
new_dog = Dogs(
    user_id = "0e2f49a7-888b-40cc-b692-bae1bb81f958",
    dog_name = "チョコ",
    dog_breed = "パグ",
    dog_birthdate = datetime.strptime("2020-6-29", "%Y-%m-%d"),
    dog_gender = "オス"
)
session.add(new_dog)
try:
    session.commit()
    print(f"New dog_ID: {new_dog.dog_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")


# GPS情報の挿入
new_location = Locations(
    user_id = "0e2f49a7-888b-40cc-b692-bae1bb81f958",
    latitude = 133.9195,
    longitude = 34.6551,
    location_datetime = datetime.now()
)
session.add(new_location)
try:
    session.commit()
    print(f"New location_ID: {new_location.location_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")