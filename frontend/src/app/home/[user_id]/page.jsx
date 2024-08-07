"use client";

import { useRouter } from "next/navigation";
import Link from 'next/link';

const UserHomePage = ({ params }) => {
  const { user_id } = params;
  const router = useRouter();

  const startWalk = () => {
    let interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toISOString();

          fetch(`${process.env.API_ENDPOINT}/locations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, latitude, longitude, location_datetime: timestamp }),
          });
        });
      }
    }, 30000); // 30秒ごとに実行

    return () => clearInterval(interval);
  };

  const handleStartWalk = () => {
    startWalk();
    router.push(`/home/${user_id}/walk`);
  };

  return (
    <div>
      <h1>Welcome, User {user_id}</h1>
      <p>This is your home page.</p>
      <Link href={`/home/${user_id}/register_dog`}>
        <button className="styled-button">愛犬を登録する</button>
      </Link>
      <button className="styled-button" onClick={handleStartWalk}>散歩スタート</button>
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


