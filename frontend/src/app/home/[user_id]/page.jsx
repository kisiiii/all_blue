"use client";

import { useRouter } from "next/navigation";
import Link from 'next/link';

const UserHomePage = ({ params }) => {
  const { user_id } = params;

  return (
    <div>
      <h1>Welcome, User {user_id}</h1>
      <p>This is your home page.</p>
      <Link href={`/home/${user_id}/register_dog`}>
        <button className="styled-button">愛犬を登録する</button>
      </Link>
      <style jsx>{`
        .styled-button {
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .styled-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default UserHomePage;

