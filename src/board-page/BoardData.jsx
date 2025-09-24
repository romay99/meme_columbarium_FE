import React from "react";
import { useNavigate } from "react-router-dom";

const BoardData = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/detail/${props.code}`);
  };

  return (
    <div onClick={handleClick}>
      <div
        className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center 
                   hover:scale-105 transition-transform duration-200 border-b border-black"
      >
        {/* 왼쪽 : 제목 */}
        <div className="font-GowunBatangBold my-1 text-xs">{props.title}</div>

        {/* 오른쪽 : 닉네임 + 날짜 */}
        <div className="flex space-x-4 text-gray-600 text-xs">
          <div>{props.authorNickName}</div>
          <div>{props.createdAt}</div>
        </div>
      </div>
    </div>
  );
};

export default BoardData;
