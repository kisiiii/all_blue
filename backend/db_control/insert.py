from sqlalchemy.orm import sessionmaker
from mymodels import Users, Dogs, DogBooks, Locations, Points
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
