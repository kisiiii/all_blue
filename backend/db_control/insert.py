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
    print(f"New user ID: {new_user.user_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")

# ドッグ情報の挿入
new_dog = Dogs(
    user_id = "31ecc6fc-bdca-4cb8-9814-36bd0af81441",
    dog_name = "チョコ",
    dog_breed = "パグ",
    dog_birthdate = datetime.strptime("2020-6-29", "%Y-%m-%d"),
    dog_gender = "オス"
)

session.add(new_dog)

try:
    session.commit()
    print(f"New Dog ID: {new_dog.dog_id}")
except Exception as e:
    session.rollback()
    print(f"Error: {e}")