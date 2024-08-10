"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const WalkPage = ({ params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user_id = params.user_id || pathname.split("/")[2]; // URLからuser_idを取得
  const intervalRef = useRef(null);
  const [isInserted, setIsInserted] = useState(false);
  const initialLoadRef = useRef(true); // 初回実行を制御するフラグ

  const insertRTLocation = (latitude, longitude) => {
    console.log("Inserting RT Location");
    fetch(`${process.env.API_ENDPOINT}/insert_rtlocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        latitude,
        longitude,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("GPS情報とエンカウント処理が完了しました", data);
        setIsInserted(true);
      })
      .catch((error) => {
        console.error("挿入エラーが発生しました:", error);
      });
  };

  const updateRTLocation = (latitude, longitude) => {
    console.log("Updating RT Location");
    fetch(`${process.env.API_ENDPOINT}/update_rtlocation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        latitude,
        longitude,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("GPS情報を更新しました", data);
      })
      .catch((error) => {
        console.error("更新エラーが発生しました:", error);
      });
  };

  const clearRTLocation = () => {
    console.log("Clearing RT Location");
    fetch(`${process.env.API_ENDPOINT}/clear_rtlocation`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("GPS情報をクリアしました", data);
      })
      .catch((error) => {
        console.error("クリアエラーが発生しました:", error);
      });
  };

  const getCurrentPositionAndUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // 現在の日時を日本時間で取得
        const now = new Date();
        const jstOffset = 9 * 60; // 日本時間はUTC+9時間
        const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);
        // ISO 形式の文字列としてフォーマット
        const timestamp = jstTime.toISOString();

        // locationsエンドポイントに位置情報を送信
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
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("位置情報がlocationsテーブルに挿入されました", data);
          })
          .catch((error) => {
            console.error("位置情報の挿入エラーが発生しました:", error);
          });

        // リアルタイムGPS情報の挿入または更新
        if (!isInserted) {
          insertRTLocation(latitude, longitude); // ここで挿入とエンカウント処理が行われる
        } else {
          updateRTLocation(latitude, longitude); // 更新のみ
        }
      });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      clearRTLocation();
    };

    if (initialLoadRef.current) {
      getCurrentPositionAndUpdate(); // ページに来た瞬間にGPS情報を一度取得
      initialLoadRef.current = false;
      //↑ 初回実行済みとしてフラグを下げる。getCurrentPositionAndUpdate();が２回実行されるのを防ぐ
    }

    // 10秒ごとにGPS情報を取得
    intervalRef.current = setInterval(getCurrentPositionAndUpdate, 10000);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user_id, isInserted]);

  const handleEndWalk = () => {
    clearInterval(intervalRef.current);
    clearRTLocation();
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
