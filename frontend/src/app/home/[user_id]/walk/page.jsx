"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Head from "next/head";

const WalkPage = ({ params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user_id = params.user_id || pathname.split("/")[2]; // URLからuser_idを取得
  const intervalRef = useRef(null);
  const [isInserted, setIsInserted] = useState(false);
  const initialLoadRef = useRef(true); // 初回実行を制御するフラグ
  const [nearbyDogs, setNearbyDogs] = useState([]); // 近くにいる犬の情報を保持する状態

  const insertRTLocation = (latitude, longitude) => {
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
        setIsInserted(true);
      })
      .catch((error) => {
        console.error("挿入エラーが発生しました:", error);
      });
  };

  const updateRTLocation = (latitude, longitude) => {
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
      .then((data) => {})
      .catch((error) => {
        console.error("更新エラーが発生しました:", error);
      });
  };

  const clearRTLocation = () => {
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
      .then((data) => {})
      .catch((error) => {
        console.error("クリアエラーが発生しました:", error);
      });
  };

  const fetchNearbyDogs = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/nearby_dogs?user_id=${user_id}&latitude=${latitude}&longitude=${longitude}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("犬の情報取得エラーが発生しました:", error);
      return [];
    }
  };

  const getCurrentPositionAndUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // 現在の日時を日本時間で取得
        const now = new Date();
        const jstOffset = 9 * 60; // 日本時間はUTC+9時間
        const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);
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
          .then((data) => {});

        // リアルタイムGPS情報の挿入または更新
        if (!isInserted) {
          insertRTLocation(latitude, longitude); // ここで挿入とエンカウント処理が行われる
        } else {
          updateRTLocation(latitude, longitude); // 更新のみ
        }

        // 近くの犬の情報を取得
        const dogs = await fetchNearbyDogs(latitude, longitude);
        setNearbyDogs(dogs); // 犬の情報を状態に保存
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
    router.push(`/home/${user_id}/walk/result`);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>散歩中</title>
      </Head>
      <div className="container flex flex-col items-center justify-between min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
          <div className="mt-10 mb-5">
            <div className="relative rounded-31xl bg-azure w-[350px] h-[43px] mx-auto">
              <div className="absolute top-[6px] left-[30px] leading-[28px] font-extrabold inline-block w-[254px] h-7">
                ちかくにいるPAWPO'S
              </div>
            </div>
          </div>
          <div className="relative rounded-xl bg-white w-[350px] h-[500px] mx-auto">
            <div className="absolute top-[30px] font-bold w-full">
              {nearbyDogs.length === 0 ? (
                <p className="text-lg">・・・だれもいないようです・・・</p>
              ) : (
                <ul className="space-y-5">
                  {nearbyDogs.map((dog, index) => (
                    <li key={index} className="flex items-center space-x-8">
                      <img
                        src={dog.dog_photo}
                        alt={dog.dog_name}
                        className="rounded-full w-20 h-20 object-cover"
                      />
                      <div className="text-left">
                        <p className="font-bold text-black">{dog.dog_name}</p>
                        <p className="text-tan">{dog.distance.toFixed(1)}m</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="absolute top-[40px] relative rounded-xl bg-white w-[350px] h-[150px] mx-auto">
            <img
              className="absolute top-[30px] left-[5px] relative w-[300px] cursor-pointer"
              alt="sanpostop"
              src="/sanpo_stop.png"
              onClick={handleEndWalk}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WalkPage;
