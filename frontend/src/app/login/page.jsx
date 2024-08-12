"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fetchUsers from "./fetchUsers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await fetchUsers(email, password);
      router.push(`/home/${user.user_id}`);
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ fontSize: '30px', color: '#333' }}>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-box">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => router.push("/register")} className="register-button">
        アカウントを作成する
      </button>
      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          font-family: Montserrat;
          font-size: 18px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          width: 382px;
          margin: 60px 0 43px;
          padding: 24px 31px 22px 24px;
          background-color: #fff;
        }
        .input-box {
          margin-bottom: 15px;
          border-radius: 16px;
          border: solid 2px #18191f;
        }
        .input-box input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 16px;
        }
        button {
          padding: 10px;
          background-color: #c6a286;
          color: white;
          border: none;
          border-radius: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #b7906c;
        }
        .register-button {
          padding: 10px;
          background-color: #fff;
          color: black;
          width: 382px;
          border-radius: 16px;
          cursor: pointer;
          margin-bottom: 15px;
          border-radius: 16px;
          border: solid 2px #18191f;
        }
        .register-button:hover {
          background-color: #f7e7cf;
        }
      `}</style>
    </div>
  );
};

export default Login;
