"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const RegisterDogPage = () => {
  const [formData, setFormData] = useState({
    dog_name: "",
    dog_breed: "",
    dog_birthdate: "",
    dog_gender: "",
    dog_photo: null,
  });
  const params = useParams();
  const router = useRouter();
  const user_id = params.user_id;

  useEffect(() => {
    if (user_id) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user_id,
      }));
    }
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 画像をまず `/upload` エンドポイントに送信
      const imageData = new FormData();
      imageData.append("file", formData.dog_photo);

      const uploadRes = await fetch(`${process.env.API_ENDPOINT}/upload`, {
        method: "POST",
        body: imageData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const uploadResult = await uploadRes.json();
      const imageUrl = uploadResult.url;

      const dogData = {
        dog_name: formData.dog_name,
        dog_breed: formData.dog_breed,
        dog_birthdate: formData.dog_birthdate,
        dog_gender: formData.dog_gender,
        dog_photo: imageUrl,
        user_id: formData.user_id,
      };

      const dogRes = await fetch(`${process.env.API_ENDPOINT}/dogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });

      if (!dogRes.ok) {
        const errorData = await dogRes.json();
        throw new Error(errorData.error || "Failed to register dog");
      }

      const dogResult = await dogRes.json();
      //alert("Dog registered successfully"); 必要なら表示
      router.push(`/home/${formData.user_id}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <h1>愛犬を登録する</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-box">
          <label>犬の名前:</label>
          <input
            type="text"
            name="dog_name"
            value={formData.dog_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label>犬の品種:</label>
          <input
            type="text"
            name="dog_breed"
            value={formData.dog_breed}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label>犬の誕生日:</label>
          <input
            type="date"
            name="dog_birthdate"
            value={formData.dog_birthdate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label>犬の性別:</label>
          <select
            name="dog_gender"
            value={formData.dog_gender}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="オス">オス</option>
            <option value="メス">メス</option>
          </select>
        </div>
        <div className="input-box">
          <label>写真を選択:</label>
          <input
            type="file"
            name="dog_photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
      <style jsx>{`
        .register-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          width: 300px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #fff;
        }
        .input-box {
          margin-bottom: 15px;
        }
        .input-box label {
          display: block;
          margin-bottom: 5px;
        }
        .input-box input,
        .input-box select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};
export default RegisterDogPage;
