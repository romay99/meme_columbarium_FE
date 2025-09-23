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
        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center 
                hover:scale-105 transition-transform duration-200"
      >
        <div className="font-GowunBatangBold my-1">{props.title}</div>
        <div>{props.authorNickName}</div>
        <div>{props.createdAt}</div>
      </div>
    </div>
  );
};

export default BoardData;
