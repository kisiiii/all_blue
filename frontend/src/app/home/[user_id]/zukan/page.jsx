"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from "next/head";
import Image from 'next/image';
import Menu from "../../../../components/Menu";

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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>図鑑</title>
      </Head>
      <div className="container flex flex-col items-center justify-between min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
          <div className="mt-10 mb-5"> {/* 上下のマージンを半分に */}
            <div className="relative rounded-31xl bg-azure w-[350px] h-[43px] mx-auto">
              <div className="absolute top-[6px] left-[30px] leading-[28px] font-extrabold inline-block w-[254px] h-7">
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
            <div>
              <Menu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DogsGrid;
