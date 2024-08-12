"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const UserHomePage = ({ params }) => {
  const { user_id } = params;
  const router = useRouter();

  const handleStartWalk = () => {
    router.push(`/home/${user_id}/walk`);
  };

  return (
    <div className="container">
      <div className="points-container">
        <div className="points">
          <p>累計ポイント</p>
          <p>1500 P</p>
        </div>
        <div className="points">
          <p>今日のポイント</p>
          <p>100 P</p>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-border">
          <img
            src="/path-to-image/moana.png" // 画像パスを適切に変更してください
            alt="Moana"
            className="profile-image"
          />
        </div>
        <p className="dog-name">モアナ</p>
        <p className="pawpo-level">PAWPOレベル</p>
        <div className="level-icons">
          <span role="img" aria-label="medal">🏅</span>
          <span role="img" aria-label="medal">🏅</span>
        </div>
      </div>

      <p className="instruction">タップしてからおさんぽスタート</p>
      <button className="walk-button" onClick={handleStartWalk}>
        さんぽスタート
      </button>
    <style jsx>{`
      .container {
        display:flex;
        width: 390px;
        height: 844px;
        flex-grow: 0;
        padding: 73px 4px 7px 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #c6a286;
      }
      .points-container {
        display:flex;
        width: 336px;
        height: 170px;
        margin: 0 21px 24px 29px;
        padding: 32px 20px 34px 13px;
        border-radius: 20px;
        background-color: #fff;
      }
      .points {
        max-width: 303px;
        max-height: 43px;
        margin: 0 0 18px;
        padding: 7px 23px 8px 26px;
        border-radius: 50px;
        background-color: #e3f6f4;
      }
        .profile-container {
          text-align: center;
          margin-bottom: 20px;
        }
        .profile-border {
          padding: 5px;
          background-color: #bae0d8;
          border-radius: 50%;
          display: inline-block;
        }
        .profile-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid white;
        }
        .dog-name {
          font-size: 18px;
          margin: 10px 0;
        }
        .pawpo-level {
          font-size: 16px;
          color: #666;
        }
        .level-icons {
          font-size: 24px;
          color: #f39c12;
        }
        .instruction {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        .walk-button {
          padding: 15px 30px;
          background-color: #f39c12;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .walk-button:hover {
          background-color: #e67e22;
        }
      `}</style>
    </div>
  );
};

export default UserHomePage;
