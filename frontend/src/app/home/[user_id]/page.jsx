"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation"; // useRouterをインポート
import Head from "next/head";
import Menu from "../../../components/Menu";

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

  const onRectangleClick = useCallback(() => {
    router.push(`/home/${userId}/walk`); // home/[user_id]/walk に移動
  }, [router, userId]);

  const dummyImageUrl =
    "https://webdesign-trends.net/wp/wp-content/uploads/2021/08/dummy-images.jpg";

  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Page</title>
      </Head>
      <div className="container flex flex-col items-center justify-center min-h-screen w-full p-10 md:p-0">
        <div className="relative w-full max-w-md bg-tan h-[844px] overflow-hidden text-center text-base text-black font-montserrat">
          <div className="absolute top-[73px] left-[32px] relative rounded-xl bg-white w-[336px] h-[170px]">
            <div className="absolute top-[32px] left-[10px] rounded-31xl bg-azure w-[303px] h-[43px] cursor-pointer" />
            <div className="absolute top-[39px] left-[36px] leading-[28px] font-extrabold inline-block w-[254px] h-7">
              累計ポイント 　　　　　{points.total_points} P
            </div>

            <div className="absolute top-[93px] left-[10px] rounded-31xl bg-azure w-[303px] h-[43px]" />
            <div className="absolute top-[101px] left-[32px] leading-[28px] font-extrabold inline-block w-[264px] h-[27px]">
              今日のポイント　　　　 {points.today_points} P
            </div>
          </div>

          <div className="absolute top-[98px] left-[32px] relative rounded-xl bg-white w-[336px] h-[282px]">
            <div className="absolute top-[186px] left-1/2 transform -translate-x-1/2 text-5xl leading-[28px] font-extrabold text-tan">
              {dogData.dog_name}
            </div>
            <div className="absolute top-[34px] left-[100px] rounded-full border-4 border-paleturquoise w-32 h-32 flex items-center justify-center">
              <img
                className="rounded-full w-full h-full object-cover"
                alt="dog"
                src={dogData.dog_photo}
              />
            </div>
            <div className="absolute top-[224px] left-[16px] rounded-31xl bg-azure w-[303px] h-[43px]" />
            <b className="absolute top-[232px] left-[53px] leading-[28px]">
              PAWPOレベル
            </b>
            <img
              className="absolute top-[235px] left-[190px] w-6 h-6 overflow-hidden"
              alt="level"
              src="/level.png"
            />
            <img
              className="absolute top-[235px] left-[222px] w-6 h-6 overflow-hidden"
              alt="level"
              src="/level.png"
            />
          </div>

          <div className="absolute top-[120px] left-[32px] relative rounded-xl bg-white w-[336px] h-[172px]">
            <div className="absolute top-[15px] left-[10px] leading-[25px] font-extrabold inline-block w-[323px] h-[51px]">
              <p className="[margin-block-start:0] [margin-block-end:1px]">
                タップしてからおさんぽスタート
              </p>
              <p className="m-0">PAWPO’Sとすれ違ってポイントゲット！</p>
            </div>
            <img
              className="absolute top-[66px] left-[19px] rounded-31xl bg-paleturquoise w-[294px] h-[90px] cursor-pointer"
              alt="sanpostart"
              src="/sanpostart.png"
              onClick={onRectangleClick}
            />
          </div>
  return (
    <div>
      <Menu />
    </div>
  );
        </div>
      </div>
    </>
  );
};

export default Component;
