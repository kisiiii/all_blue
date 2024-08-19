"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation"; // useRouterをインポート
import Head from "next/head";
import Image from "next/image";
import Menu from "../../../../../components/Menu";

const Component = () => {
  const [dogData, setDogData] = useState({
    dog_name: "ハチ",
    dog_photo:
      "https://thumb.ac-illust.com/c4/c4ae42183f9805b1c0b24c353355dad8_t.jpeg",
  });
  const [points, setPoints] = useState({ today_points: 0, total_points: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter(); // useRouterを使用

  // URLからuser_idを取得
  const userId = params.user_id || pathname.split("/")[2]; // URLパスに基づいて適切なインデックスを指定

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const [dogResponse, pointsResponse] = await Promise.all([
            fetch(`${process.env.API_ENDPOINT}/get_dog_data?user_id=${userId}`),
            fetch(
              `${process.env.API_ENDPOINT}/get_user_points?user_id=${userId}`
            ),
          ]);

          if (!dogResponse.ok || !pointsResponse.ok) {
            throw new Error("Failed to fetch data");
          }

          const dogData = await dogResponse.json();
          const pointsData = await pointsResponse.json();

          if (dogData && dogData.dog_name) {
            setDogData(dogData);
          }

          setPoints(pointsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false); // データ取得完了後にローディング状態を解除
        }
      };

      fetchData();
    }
  }, [userId]);

  const onHomeClick = useCallback(() => {
    router.push(`/home/${userId}`); // home/[user_id] に移動
  }, [router, userId]);

  const onSanpoClick = useCallback(() => {
    router.push(`/home/${userId}/walk/result`); // home/[user_id]/zukan に移動
  }, [router, userId]);

  const onPointClick = useCallback(() => {
    router.push(`/home/${userId}/point`); // home/[user_id]/point に移動
  }, [router, userId]);

  const onZukanClick = useCallback(() => {
    router.push(`/home/${userId}/zukan`); // home/[user_id]/zukan に移動
  }, [router, userId]);

  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>さんぽの記録</title>
      </Head>
      <div className="container flex flex-col items-center justify-between min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
          <div className="mt-10 mb-5">
            {/* 上下のマージンを半分に */}
            <div className="relative rounded-31xl bg-azure w-[350px] h-[43px] mx-auto">
              <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 leading-[28px] font-extrabold inline-block w-[254px] h-7 text-black">
                最近のさんぽ記録
              </div>
            </div>
            <div className="relative w-full h-auto mt-4 flex justify-center">
              <img
                className="w-4/5" // 幅を親の80%に設定
                alt="最近の記録"
                src="/kiroku.png"
              />
            </div>
            <div className="absolute top-[10px] relative rounded-xl bg-white w-[350px] h-[135px] mx-auto">
              <div className="absolute top-[10px] left-[10px] leading-[25px] font-extrabold inline-block w-[323px] h-[51px]">
                <p className="text-lg [margin-block-start:0] [margin-block-end:1px]">
                  すれちがったPAWPO'S
                </p>
                <p className="text-2xl m-0">5</p>
              </div>
              <img
                className="absolute top-[80px] left-[4Px] relative w-[300px] cursor-pointer"
                alt="結果"
                src="/sanpo_log.png"
              />
            </div>
            <div className="absolute top-[752px] left-[30px] bg-tan w-[390px] h-[85px] text-mini text-colors-black-800">
              <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[4.36%] leading-[16px] font-extrabold inline-block">
                ホーム
              </div>
              <img
                className="absolute h-[62.35%] w-[13.51%] top-[14.12%] right-[82.13%] bottom-[23.53%] left-[4.36%] max-w-full overflow-hidden max-h-full"
                alt="home"
                src="/home.png"
                onClick={onHomeClick}
              />

              <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[24.62%] leading-[16px] font-extrabold inline-block">
                さんぽ
              </div>
              <img
                className="absolute h-[55.29%] w-[12.82%] top-[15.29%] right-[62.82%] bottom-[29.41%] left-[24.36%] max-w-full overflow-hidden max-h-full object-cover"
                alt="sanpo"
                src="/sanpo.png"
                onClick={onSanpoClick}
              />

              <div className="absolute h-[20.82%] w-[16.9%] top-[78.82%] left-[41.79%] leading-[16px] font-extrabold inline-block">
                ポイント
              </div>
              <img
                className="absolute h-[56.47%] w-[12.31%] top-[20%] right-[43.59%] bottom-[23.53%] left-[44.1%] max-w-full overflow-hidden max-h-full"
                alt="point"
                src="/point.png"
                onClick={onPointClick}
              />

              <div className="absolute h-[20.82%] w-[8.46%] top-[78.82%] left-[66.41%] leading-[16px] font-extrabold inline-block">
                図鑑
              </div>
              <img
                className="absolute h-[52.94%] w-[11.54%] top-[20%] right-[23.85%] bottom-[27.06%] left-[64.62%] max-w-full overflow-hidden max-h-full"
                alt="zukan"
                src="/zukanicon.png"
                onClick={onZukanClick}
              />

              <div className="absolute h-[20.82%] w-[8.46%] top-[78.82%] left-[84.87%] leading-[16px] font-extrabold inline-block">
                設定
              </div>
              <img
                className="absolute h-[55.29%] w-[12.05%] top-[17.65%] right-[5.13%] bottom-[27.06%] left-[82.82%] max-w-full overflow-hidden max-h-full"
                alt="settei"
                src="/set.png"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
