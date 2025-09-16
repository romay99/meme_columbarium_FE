import React from "react";
import { useNavigate } from "react-router-dom";

const MemeData = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/meme/detail/${props.code}`);
  };
  return (
    <div onClick={handleClick}>
      <div
        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center 
                hover:scale-105 transition-transform duration-200"
      >
        <img src="/assets/test.png" alt={props.title} className="w-40 h-70 object-cover rounded"></img>
        <div className="font-GowunBatangBold my-1">{props.title}</div>
        <div className="font-GowunBatang text-sm">
          {props.startDate}~{props.endDate}
        </div>
      </div>
    </div>
  );
};

export default MemeData;
