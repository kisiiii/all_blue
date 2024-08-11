"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import registerUser from "./fetchUsers";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        user_name: userName,
        user_birthdate: birthdate,
        user_gender: gender,
        mail: email,
        password: password,
      };
      const result = await registerUser(userData);

      // ユーザー登録が成功したら、/register_dog/${result.user_id}にリダイレクト
      router.push(`/register_dog/${result.user_id}`);
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-box">
          <label>ユーザー名:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>生年月日:</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>性別:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="答えたくない">答えたくない</option>
          </select>
        </div>
        <div className="input-box">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">登録する</button>
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
        .input-box input {
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

export default Register;
