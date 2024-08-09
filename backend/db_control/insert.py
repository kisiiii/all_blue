from sqlalchemy.orm import sessionmaker
from mymodels import Users, Dogs, DogBooks, Locations, Encounts, EarnPoints, UsePoints, RTLocations
from connect import engine
from datetime import datetime

# セッションの作成
Session = sessionmaker(bind=engine)
session = Session()

"""# ユーザー情報の挿入
new_users = [
    Users(
        user_id="0e2f49a7-888b-40cc-b692-bae1bb81f959",
        user_name="きっしー",
        user_birthdate=datetime.strptime("1988-12-29", "%Y-%m-%d"),
        user_gender="男",
        mail="kishikishi@example.com",
        password="securepassword"
    ),
    Users(
        user_id="a462d8c9-7b53-45b3-9a46-d5d2113e1580",
        user_name="たなごん",
        user_birthdate=datetime.strptime("1986-05-22", "%Y-%m-%d"),
        user_gender="女",
        mail="tanagon@example.com",
        password="password"
    ),
]

session.add_all(new_users)
try:
    session.commit()
    print(f"New user_ID: {new_users.user_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")

# ドッグ情報の挿入
new_dogs = [
    Dogs(
    user_id = "0e2f49a7-888b-40cc-b692-bae1bb81f959",
    dog_name = "チョコ",
    dog_breed = "パグ",
    dog_birthdate = datetime.strptime("2020-6-29", "%Y-%m-%d"),
    dog_gender = "オス",
    dog_photo=b'binary data here'  # バイナリデータを挿入
    ),
    Dogs(
    user_id = "a462d8c9-7b53-45b3-9a46-d5d2113e158",
    dog_name = "ぽこ",
    dog_breed = "トイプードル",
    dog_birthdate = datetime.strptime("2023-05-18", "%Y-%m-%d"),
    dog_gender = "オス",
    dog_photo=b'binary data here'  # バイナリデータを挿入
    ),
    Dogs(
    user_id = "a462d8c9-7b53-45b3-9a46-d5d2113e158",
    dog_name = "さちこ",
    dog_breed = "柴犬",
    dog_birthdate = datetime.strptime("2022-08-12", "%Y-%m-%d"),
    dog_gender = "メス",
    dog_photo=b'binary data here'  # バイナリデータを挿入
    )
]

session.add_all(new_dogs)
try:
    session.commit()
    print(f"New dog_ID: {new_dogs.dog_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")"""


# RT_GPS情報の挿入
new_rt_location = RTLocations(
    user_id = "a462d8c9-7b53-45b3-9a46-d5d2113e1580",
    latitude = 34.6336961,
    longitude = 133.891408,
)
session.add(new_rt_location)
try:
    session.commit()
    print(f"New rt_location_ID: {new_rt_location.rt_location_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")