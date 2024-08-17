"use client";

import React, { useState, useEffect } from "react";

const WalkReplay = ({ params }) => {
  const user_id = params.user_id;

  const [date, setDate] = useState("");
  const [locations, setLocations] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchLatestLocation = async () => {
      try {
        let response = await fetch(
          `${
            process.env.API_ENDPOINT
          }/locations/history?user_id=${user_id}&date=${
            new Date().toISOString().split("T")[0]
          }`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        if (data.length > 0) {
          const latestLocation = data[data.length - 1];
          initializeMap(latestLocation.latitude, latestLocation.longitude);
        } else {
          response = await fetch(
            `${process.env.API_ENDPOINT}/locations/history/latest?user_id=${user_id}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          data = await response.json();

          if (data.length > 0) {
            const latestLocation = data[0];
            initializeMap(latestLocation.latitude, latestLocation.longitude);
          } else {
            initializeMap(0, 0); // データが全くない場合のデフォルト
          }
        }
      } catch (error) {
        console.error("Error fetching latest location:", error);
        initializeMap(0, 0); // エラーが発生した場合もデフォルトの場所
      }
    };

    const initializeMap = (lat, lng) => {
      const loadGoogleMaps = () => {
        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}&callback=initMap`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          script.onload = () => {
            initMap(lat, lng);
          };
        } else {
          initMap(lat, lng);
        }
      };

      window.initMap = () => {
        const mapInstance = new google.maps.Map(
          document.getElementById("map"),
          {
            zoom: 17, // おおよそ200m範囲に設定
            center: { lat, lng },
          }
        );

        setMap(mapInstance);
      };

      loadGoogleMaps();
    };

    fetchLatestLocation();
  }, [user_id]);

  useEffect(() => {
    if (date && user_id && map) {
      fetch(
        `${process.env.API_ENDPOINT}/locations/history?user_id=${user_id}&date=${date}`
      )
        .then((response) => response.json())
        .then((data) => {
          setLocations(data);
          plotLocationsOnMap(data);
        });
    }
  }, [date, user_id, map]);

  const plotLocationsOnMap = (locations) => {
    if (locations.length > 1) {
      const path = locations.map((loc) => ({
        lat: loc.latitude,
        lng: loc.longitude,
      }));

      // 軌跡を赤線で描画
      const walkPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      walkPath.setMap(map);

      // マップの表示領域を、すべての位置情報を含むように調整
      const bounds = new google.maps.LatLngBounds();
      path.forEach((pos) => bounds.extend(pos));
      map.fitBounds(bounds);

      // 最小表示領域を200m以上に設定
      const minZoomLevel = 17; // 200m範囲程度のズームレベル
      google.maps.event.addListenerOnce(map, "bounds_changed", function () {
        if (map.getZoom() > minZoomLevel) {
          map.setZoom(minZoomLevel);
        }
      });
    } else {
      console.warn("少なくとも2つの位置情報が必要です。");
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div>
      <input type="date" value={date} onChange={handleDateChange} />
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default WalkReplay;
