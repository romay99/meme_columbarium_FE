import React from "react";
import { useNavigate } from "react-router-dom";

const MemeData = ({ code, title, startDate, endDate, category, darkMode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/meme/detail/${code}`);
  };

  return (
    <div onClick={handleClick}>
      <div
        className={`shadow-md rounded-lg p-4 flex flex-col items-center text-center
          hover:scale-105 transition-transform duration-200
          ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
      >
        {/* 🔹 relative 부모로 감싸기 */}
        <div className="relative w-40 h-40 mb-2">
          {/* 메인 이미지 */}
          <img src="/assets/test.png" alt={title} className="w-full h-full object-cover rounded" />

          {/* 오버레이 이미지 (겹쳐서 표시) */}
          <img src="/assets/25.10.06_rip image_200dpi.png" alt="overlay" className="absolute top-0 left-0 w-full h-full object-cover opacity-80" />
        </div>
        <div className="font-GowunBatangBold my-1">{title}</div>
        <div className="font-GowunBatang text-sm">
          {startDate} ~ {endDate}
        </div>
        <img src={`/assets/badge/${category}.svg`} alt="카테고리" className="mt-2 w-26 h-6" />
      </div>
    </div>
  );
};

export default MemeData;
