import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// コンポーネントの定義
export default function Menu() {
  return (
    <div className="absolute top-[752px] left-[30px] bg-tan w-[390px] h-[85px] text-mini text-colors-black-800">
      <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[4.36%] leading-[16px] font-extrabold inline-block">
        ホーム
      </div>
      <img
        className="absolute h-[62.35%] w-[13.51%] top-[14.12%] right-[82.13%] bottom-[23.53%] left-[4.36%] max-w-full overflow-hidden max-h-full"
        alt="home"
        src="/home.png"
      />

      <div className="absolute h-[20.82%] w-[12.67%] top-[78.82%] left-[24.62%] leading-[16px] font-extrabold inline-block">
        さんぽ
      </div>
      <img
        className="absolute h-[55.29%] w-[12.82%] top-[15.29%] right-[62.82%] bottom-[29.41%] left-[24.36%] max-w-full overflow-hidden max-h-full object-cover"
        alt="sanpo"
        src="/sanpo.png"
      />

      <div className="absolute h-[20.82%] w-[16.9%] top-[78.82%] left-[41.79%] leading-[16px] font-extrabold inline-block">
        ポイント
      </div>
      <img
        className="absolute h-[56.47%] w-[12.31%] top-[20%] right-[43.59%] bottom-[23.53%] left-[44.1%] max-w-full overflow-hidden max-h-full"
        alt="point"
        src="/point.png"
      />

      <div className="absolute h-[20.82%] w-[8.46%] top-[78.82%] left-[66.41%] leading-[16px] font-extrabold inline-block">
        図鑑
      </div>
      <img
        className="absolute h-[52.94%] w-[11.54%] top-[20%] right-[23.85%] bottom-[27.06%] left-[64.62%] max-w-full overflow-hidden max-h-full"
        alt="zukan"
        src="/zukanicon.png"
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
  );
}
