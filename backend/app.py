from flask import Flask, request
from flask import jsonify
import json
from flask_cors import CORS

from db_control import crud, mymodels

import requests
from datetime import datetime, date

app = Flask(__name__)
CORS(app)

## flask --app app run
@app.route("/")
def index():
    return "<p>Flask top page!</p>"


"""
http://localhost:5000/search?model=Users&column=user_id&value=2ef7b8ea-6399-4827-b4f3-c092d48608ee
APIエンドポイントの書き方
onst res = await fetch(process.env.API_ENDPOINT+`/search?model=Users&column=user_id&value=${id}`, {cache: "no-cache"});
"""
@app.route("/search", methods=['GET'])
def search():
    model_name = request.args.get('model')
    column_name = request.args.get('column')
    value = request.args.get('value')
    model = getattr(mymodels, model_name)    # モデルの取得
    result = crud.myselect(model, column_name, value)    # データベースからデータを取得
    return jsonify(result), 200

# Users
@app.route("/allusers", methods=['GET'])
def read_all_Users():
    model = mymodels.Users
    result = crud.myselectAll(model)
    return result, 200

@app.route("/users", methods=['GET'])
def read_one_User():
    model = mymodels.Users
    target_id = request.args.get('user_id')
    result = crud.myselect(model, 'user_id', target_id)
    return jsonify(result), 200

@app.route("/users", methods=['POST'])
def create_Users():
    model = mymodels.Users
    values = request.get_json()
    
    # user_birthdateをdateオブジェクトに変換
    if 'user_birthdate' in values:
        values['user_birthdate'] = datetime.strptime(values['user_birthdate'], '%Y-%m-%d').date()
    
    tmp = crud.myinsert(model, values)
    result = crud.myselect(model, 'user_id', values.get("user_id"))
    return jsonify(result), 200

@app.route("/users", methods=['PUT'])
def update_user():
    values = request.get_json()
    values_original = values.copy()
    model = mymodels.Users
    tmp = crud.myupdate(model, values)
    result = crud.myselect(model, values_original.get("user_id"))
    return jsonify(result), 200

#Dogs
@app.route("/alldogs", methods=['GET'])
def read_all_Dogs():
    model = mymodels.Dogs
    result = crud.myselectAll(model)
    return result, 200

@app.route("/dogs", methods=['GET'])
def read_one_Dog():
    model = mymodels.Dogs
    target_id = request.args.get('dog_id')
    result = crud.myselect(model, 'dog_id', target_id)
    return jsonify(result), 200


@app.route("/dogs", methods=['POST'])
def create_Dogs():
    model = mymodels.Dogs
    values = request.get_json()
    tmp = crud.myinsert(model, values)
    result = crud.myselect(model, 'dog_id', values.get("dog_id"))
    return jsonify(result), 200


# GPR履歴を取得
@app.route("/alllocations", methods=['GET'])
def read_all_Locations():
    model = mymodels.Locations
    result = crud.myselectAll(model)
    return result, 200

@app.route("/locations", methods=['GET'])
def read_one_Location():
    model = mymodels.Locations
    target_id = request.args.get('location_id')
    result = crud.myselect(model, 'location_id', target_id)
    return jsonify(result), 200


@app.route("/locations", methods=['POST'])
def create_Locations():
    model = mymodels.Locations
    values = request.get_json()
    if "location_datetime" in values:
        values["location_datetime"] = datetime.fromisoformat(values["location_datetime"]).replace(microsecond=0)
    
    result = crud.myinsert(model, values)
    if result["status"] == "error":
        return jsonify({"error": result["message"]}), 400

    selected_data = crud.myselect(model, "location_id", result["location_id"])
    return jsonify(selected_data), 200


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



@app.route("/users", methods=['GET'])
# http://127.0.0.1:5000/users?user_id=2ef7b8ea-6399-4827-b4f3-c092d48608ee
def read_one_user():
    target_id = request.args.get('user_id')
    result = crud.myselectUser(mymodels.Users, target_id)
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


@app.route("/dogs", methods=['GET'])
def read_one_dog():
    target_id = request.args.get('dog_id')
    result = crud.myselect(mymodels.Dogs, target_id)
    if not result:
        return jsonify({"error": "Dog not found"}), 404
    # シリアライズしてJSON形式で返す
    dog_data = []
    for dog in result:
        dog_data.append({
            "user_id": dog.user_id,
            "dog_name": dog.dog_name,
            "dog_birthdate ": dog.dog_birthdate.strftime('%Y-%m-%d'),
            "dog_breed": dog.user_gender,
            "dog_gender": dog.dog_gender,
        })
    return jsonify(dog_data), 200

"""

if __name__ == "__main__":
    app.run(debug=True)