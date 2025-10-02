import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../dark-mode/ThemeContext";

const BoardData = (props) => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleClick = () => {
    navigate(`/board/detail/${props.code}`);
  };

  return (
    <div onClick={handleClick}>
      <div
        className={`shadow-md rounded-lg p-4 flex justify-between items-center 
                    hover:scale-105 transition-transform duration-200 border-b ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700" : "bg-white border-black text-gray-900 hover:bg-gray-100"}`}
      >
        {/* 왼쪽 : 제목 */}
        <div className="font-GowunBatangBold my-1 text-xs">{props.title}</div>

        {/* 오른쪽 : 닉네임 + 날짜 */}
        <div className={`flex space-x-4 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <div>{props.authorNickName}</div>
          <div>{props.createdAt}</div>
        </div>
      </div>
    </div>
  );
};

export default BoardData;
