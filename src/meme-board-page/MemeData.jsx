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
        <img src="/assets/test.png" alt={title} className="w-40 h-70 object-cover rounded mb-2" />
        <div className="font-GowunBatangBold my-1">{title}</div>
        <div className="font-GowunBatang text-sm">
          {startDate} ~ {endDate}
        </div>
        <div>{category}</div>
      </div>
    </div>
  );
};

export default MemeData;
