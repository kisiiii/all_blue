"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation"; // useRouterをインポート
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Menu from "../../../../components/Menu";

const DogsGrid = () => {
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const userId = params.user_id || pathname.split("/")[2]; // URLからuser_idを取得

  useEffect(() => {
    axios
      .get(`/encounts?user_id=${userId}`)
      .then((response) => setDogs(response.data))
      .catch((error) => console.error(error));
  }, [userId]);

  const onHomeClick = useCallback(() => {
    router.push(`/home/${userId}`); // home/[user_id] に移動
  }, [router, userId]);

  const onSanpoClick = useCallback(() => {
    router.push(`/home/${userId}/walk/result`); // home/[user_id]/walk/result に移動
  }, [router, userId]);

  const onPointClick = useCallback(() => {
    router.push(`/home/${userId}/point`); // home/[user_id]/point に移動
  }, [router, userId]);

  const onZukanClick = useCallback(() => {
    router.push(`/home/${userId}/zukan`); // home/[user_id]/zukan に移動
  }, [router, userId]);

  const dummyImageUrl =
    "https://webdesign-trends.net/wp/wp-content/uploads/2021/08/dummy-images.jpg";

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>図鑑</title>
      </Head>
      <div className="container flex flex-col items-center justify-between min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
          <div className="mt-10 mb-5">
            {/* 上下のマージンを半分に */}
            <div className="relative rounded-31xl bg-azure w-[350px] h-[43px] mx-auto">
              <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 leading-[28px] font-extrabold inline-block w-[254px] h-7 text-black">
                PAWPO図鑑
              </div>
            </div>
            <div className="relative w-full h-auto mt-4 flex justify-center">
              <img
                className="absolute top-[13px] w-5/6" // 幅を親の50%に設定
                src="/zukantouka.png"
                alt="図鑑"
              />
            </div>
            {/*一旦無効化
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {dogs.length > 0 ? dogs.map((dog, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                  <img
                      src={dog.photo || 'https://via.placeholder.com/150/808080/FFFFFF?text=No+Image'}
                      alt={dog.name}
                      style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                  />
                  <p>{dog.name}</p>
                  </div>
              )) : (
                  Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                      <img
                      src='https://via.placeholder.com/150/808080/FFFFFF?text=No+Image'
                      alt='No Image'
                      style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                      />
                      <p>No Name</p>
                  </div>
                  ))
              )}
              </div>/
            */}
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

export default DogsGrid;
