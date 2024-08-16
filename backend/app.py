from flask import Flask, request
from flask import jsonify
from flask_cors import CORS

from db_control import crud, mymodels

from datetime import datetime, timezone
from google.cloud import storage
import os
from dotenv import load_dotenv
import uuid


# .envファイルを読み込む
load_dotenv()

# Google Cloud Storageの設定
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
storage_client = storage.Client()
bucket_name = os.getenv("BUCKET_NAME")
bucket = storage_client.bucket(bucket_name)

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

    # 手動でuser_idを生成
    user_id = str(uuid.uuid4())
    values['user_id'] = user_id

    # データベースに挿入
    result = crud.myinsert(model, values)

    # 挿入が成功した場合
    if result["status"] == "success":
        return jsonify({"message": "User created successfully", "user_id": user_id}), 200
    else:
        return jsonify({"error": result["message"]}), 400

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
    target_id = request.args.get('user_id')
    result = crud.myselect(model, 'user_id', target_id)
    return jsonify(result), 200


@app.route("/dogs", methods=['POST'])
def create_Dogs():
    try:
        app.logger.debug("Request headers: %s", request.headers)
        app.logger.debug("Request JSON: %s", request.get_json())

        data = request.get_json()  # JSONデータを取得

        # 必須フィールドのチェック
        if 'dog_photo' not in data or not data['dog_photo']:
            return jsonify({"error": "dog_photo URL is required"}), 400
        if 'user_id' not in data or not data['user_id']:
            return jsonify({"error": "user_id is required"}), 400

        # `dog_birthdate` を `date` オブジェクトに変換
        if 'dog_birthdate' in data:
            try:
                data['dog_birthdate'] = datetime.strptime(data['dog_birthdate'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format, should be YYYY-MM-DD"}), 400

        # データベースにデータを挿入
        model = mymodels.Dogs
        crud.myinsert(model, data)

        # 成功メッセージを返す
        return jsonify({"message": "Dog registered successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/get_dog_data', methods=['GET'])
def get_dog_data():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    dog_data = crud.get_dog_data_by_user_id(user_id)
    if dog_data:
        return jsonify(dog_data), 200
    else:
        return jsonify({"error": "No data found for the provided user_id"}), 404



# GPS_DB
@app.route("/alllocations", methods=['GET'])
def read_all_Locations():
    model = mymodels.Locations
    result = crud.myselectAll(model)
    return result, 200

@app.route("/locations", methods=['GET'])
def read_one_Location():
    model = mymodels.Locations
    target_id = request.args.get('user_id')
    result = crud.myselect(model, 'user_id', target_id)
    return jsonify(result), 200


@app.route("/locations", methods=['POST'])
def create_Locations():
    model = mymodels.Locations
    values = request.get_json()
    if "location_datetime" in values:
        values["location_datetime"] = datetime.fromisoformat(values["location_datetime"]).replace(microsecond=0, tzinfo=timezone.utc)
    
    result = crud.myinsert(model, values)
    if result["status"] == "error":
        return jsonify({"error": result["message"]}), 400

    selected_data = crud.myselect(model, "location_id", values.get("location_id"))
    return jsonify(selected_data), 200


# リアルタイム_GPS_DB
@app.route("/allrtlocations", methods=['GET'])
def read_all_RTLocations():
    model = mymodels.RTLocations
    result = crud.myselectAll(model)
    return result, 200

@app.route("/rtlocations", methods=['GET'])
def read_one_RTLocations():
    model = mymodels.RTLocations
    target_id = request.args.get('user_id')
    result = crud.myselect(model, 'user_id', target_id)
    return jsonify(result), 200


# リアルタイムでユーザーのGPS情報を作成するエンドポイント
@app.route("/insert_rtlocation", methods=['POST'])
def insert_rtlocation():
    values = request.get_json()
    user_id = values.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    latitude = values.get("latitude")
    longitude = values.get("longitude")

    # crud.pyの関数を呼び出して処理を行う
    result = crud.insert_rtlocation_and_process_encounters(mymodels.RTLocations, mymodels.Encounts, user_id, latitude, longitude)

    if result["status"] == "error":
        return jsonify({"error": result["message"]}), 500

    return jsonify(result), 200

# リアルタイムでユーザーのGPS情報を更新するエンドポイント
@app.route("/update_rtlocation", methods=['PUT'])
def update_rtlocation():
    values = request.get_json()
    user_id = values.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    latitude = values.get("latitude")
    longitude = values.get("longitude")

    result = crud.update_rt_location_and_process_encounters(user_id, latitude, longitude, mymodels.RTLocations, mymodels.Encounts)

    if result["status"] == "error":
        return jsonify({"error": result["message"]}), 500

    return jsonify(result), 200


# ページを離れた際にユーザーのrt_locationsのデータを削除するエンドポイント
@app.route("/clear_rtlocation", methods=['DELETE'])
def clear_rtlocation():
    values = request.get_json()
    user_id = values.get("user_id")
    model = mymodels.RTLocations

    # 該当のuser_idデータを削除
    tmp = crud.mydelete(model, user_id)
    return jsonify({"message": "User GPS data cleared"}), 200

# 画像をGCPにアップロード
@app.route("/upload", methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # ファイル名に一意の識別子を追加
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    # バケットにアップロード
    blob = bucket.blob(unique_filename)
    try:
        blob.upload_from_file(file)
    except Exception as e:
        return jsonify({"error": f"Failed to upload file: {str(e)}"}), 500

    # ファイルの公開URLを取得
    blob.make_public()
    public_url = blob.public_url

    return jsonify({"url": public_url}), 200

# home画面のポイント表示
@app.route('/get_user_points', methods=['GET'])
def get_user_points():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        # 今日の日付のポイント合計
        today = datetime.now().date()
        today_points = crud.get_today_points(user_id, today)

        # 累計ポイント
        total_points = crud.get_total_points(user_id)

        return jsonify({
            "today_points": today_points,
            "total_points": total_points
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#すれ違いDB
@app.route("/encounts", methods=['GET'])
def get_encounts():
    user_id = request.args.get('user_id')
    encounts = crud.myselectAll(mymodels.Encounts, mymodels.Encounts.user_id == user_id)
    partner_ids = [encount.partner_user_id for encount in encounts]
    
    dogs = crud.myselectAll(mymodels.Dogs, mymodels.Dogs.user_id.in_(partner_ids))
    dog_data = [{'name': dog.dog_name, 'photo': dog.dog_photo} for dog in dogs]
    
    return jsonify(dog_data), 200

if __name__ == "__main__":
    app.run(debug=True)