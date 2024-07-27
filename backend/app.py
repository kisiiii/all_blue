from flask import Flask, request
from flask import jsonify
import json
from flask_cors import CORS

from db_control import crud, mymodels

import requests

app = Flask(__name__)
CORS(app)

# flask --app app run
@app.route("/")
def index():
    return "<p>Flask top page!</p>"


@app.route("/users", methods=['POST'])
def create_users():
    values = request.get_json()
    tmp = crud.myinsert(mymodels.Users, values)
    result = crud.myselect(mymodels.Users, values.get("user_id"))
    return result, 200


# http://127.0.0.1:5000/users?user_id=71455b5b-89af-4396-9a4e-43b36db3689d
@app.route("/users", methods=['GET'])
def read_one_user():
    target_id = request.args.get('user_id')
    result = crud.myselect(mymodels.Users, target_id)
    if not result:
        return jsonify({"error": "User not found"}), 404
    # シリアライズしてJSON形式で返す
    user_data = []
    for user in result:
        user_data.append({
            "user_id": user.user_id,
            "user_name": user.user_name,
            "user_birthdate": user.user_birthdate.strftime('%Y-%m-%d'),
            "user_gender": user.user_gender,
            "mail": user.mail,
            "password": user.password
        })
    
    return jsonify(user_data), 200


@app.route("/allusers", methods=['GET'])
def read_all_Users():
    model = mymodels.Users
    result = crud.myselectAll(mymodels.Users)
    return result, 200

"""
@app.route("/customers", methods=['PUT'])
def update_customer():
    print("I'm in")
    values = request.get_json()
    print(values)
    values_original = values.copy()
    model = mymodels.Customers
    # values = {  "customer_id": "C004",
    #             "customer_name": "鈴木C子",
    #             "age": 44,
    #             "gender": "男"}
    tmp = crud.myupdate(model, values)
    result = crud.myselect(mymodels.Customers, values_original.get("customer_id"))
    return result, 200

@app.route("/customers", methods=['DELETE'])
def delete_customer():
    model = mymodels.Customers
    target_id = request.args.get('customer_id') #クエリパラメータ
    result = crud.mydelete(model, target_id)
    return result, 200

@app.route("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json(), 200
"""