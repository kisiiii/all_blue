"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import registerDog from './registerDog';

const RegisterDogPage = () => {
  const [formData, setFormData] = useState({
    dog_name: '',
    dog_breed: '',
    dog_birthdate: '',
    dog_gender: ''
  });
  const params = useParams();
  const router = useRouter();
  const user_id = params.user_id;

  useEffect(() => {
    if (user_id) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user_id
      }));
    }
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerDog(formData);
      alert('Dog registered successfully');
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



