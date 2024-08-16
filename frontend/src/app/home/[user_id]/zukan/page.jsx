"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from "next/head";
import Image from 'next/image';

const DogsGrid = ({ userId }) => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    axios.get(`/encounts?user_id=${userId}`)
      .then(response => setDogs(response.data))
      .catch(error => console.error(error));
  }, [userId]);

  const dummyImageUrl =
    "https://webdesign-trends.net/wp/wp-content/uploads/2021/08/dummy-images.jpg";

  return (
    <div className="container flex flex-col items-center justify-between min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
        <div className="mt-5 mb-5"> {/* 上下のマージンを半分に */}
            <div className="relative rounded-31xl bg-azure w-[303px] h-[43px] mx-auto cursor-pointer">
            <div className="absolute top-[6px] left-[36px] leading-[28px] font-extrabold inline-block w-[254px] h-7">
                PAWPO図鑑
            </div>
            </div>
        </div>
        <div className="relative w-full h-auto mt-4 flex justify-center">
            <div className="w-[72%]" style={{ borderRadius: '15px', overflow: 'hidden', marginBottom: '10px' }}> {/* 90%に縮小、マージンを半分に */}
                <Image src="/zukan.png" alt="図鑑" layout="responsive" width={700} height={300} objectFit="cover" />
            </div>
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
        <div className="absolute top-[752px] left-[-4px] bg-tan w-[390px] h-[85px] text-mini text-colors-black-800">
          <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[4.36%] leading-[16px] font-extrabold inline-block">
            ホーム
          </div>
          <img
            className="absolute h-[62.35%] w-[13.51%] top-[14.12%] right-[82.13%] bottom-[23.53%] left-[4.36%] max-w-full overflow-hidden max-h-full"
            alt="dummy"
            src={dummyImageUrl}
          />
          <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[24.62%] leading-[16px] font-extrabold text-colors-black inline-block">
            さんぽ
          </div>
          <img
            className="absolute h-[55.29%] w-[12.82%] top-[15.29%] right-[62.82%] bottom-[29.41%] left-[24.36%] max-w-full overflow-hidden max-h-full object-cover"
            alt="dummy"
            src={dummyImageUrl}
          />
          <div className="absolute h-[20.82%] w-[16.9%] top-[78.82%] left-[41.79%] leading-[16px] font-extrabold inline-block">
            ポイント
          </div>
          <img
            className="absolute h-[56.47%] w-[12.31%] top-[20%] right-[43.59%] bottom-[23.53%] left-[44.1%] max-w-full overflow-hidden max-h-full"
            alt="dummy"
            src={dummyImageUrl}
          />
          <div className="absolute h-[20.82%] w-[8.46%] top-[78.82%] left-[66.41%] leading-[16px] font-extrabold inline-block">
            図鑑
          </div>
          <img
            className="absolute h-[52.94%] w-[11.54%] top-[20%] right-[23.85%] bottom-[27.06%] left-[64.62%] max-w-full overflow-hidden max-h-full"
            alt="dummy"
            src={dummyImageUrl}
          />
          <div className="absolute h-[20.82%] w-[8.46%] top-[78.82%] left-[84.87%] leading-[16px] font-extrabold inline-block">
            設定
          </div>
          <img
            className="absolute h-[55.29%] w-[12.05%] top-[17.65%] right-[5.13%] bottom-[27.06%] left-[82.82%] max-w-full overflow-hidden max-h-full"
            alt="dummy"
            src={dummyImageUrl}
          />
        </div>
    </div>
    </div>
  );
};

export default DogsGrid;
