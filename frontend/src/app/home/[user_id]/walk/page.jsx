"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WalkPage = ({ params }) => {
  const { user_id } = params;
  const router = useRouter();

  useEffect(() => {
    let interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toISOString();

          fetch(`${process.env.API_ENDPOINT}/locations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id,
              latitude,
              longitude,
              location_datetime: timestamp,
            }),
          });
        });
      }
    }, 30000); // 30秒ごとに実行

    return () => clearInterval(interval);
  }, [user_id]);

  const handleEndWalk = () => {
    router.push(`/home/${user_id}`);
  };

  return (
    <div>
      <h1>散歩中</h1>
      <button className="styled-button" onClick={handleEndWalk}>
        散歩終了
      </button>
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

export default WalkPage;
