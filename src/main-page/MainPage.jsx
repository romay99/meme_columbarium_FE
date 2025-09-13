import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  const handleNavigateToCommunity = () => {
    navigate("/meme");
  };
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 백그라운드 이미지 */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/장례식이미지.jpg')" }}></div>
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-8 flex flex-col justify-between min-h-screen">
        {/* 제목 */}
        <h1 className="text-7xl md:text-9xl mt-8 font-bold bg-gradient-to-r from-gray-400 via-gray-400 to-blue-400 bg-clip-text text-transparent mb-8">밈 납골당</h1>

        {/* 부제목 */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light tracking-wide opacity-80">오늘도 먼저 간 밈들에게 안부를..</p>

        {/* 버튼 */}
        <button onClick={handleNavigateToCommunity} className="group relative mt-11 px-12 py-4 bg-gradient-to-r from-gray-100 to-gray-600 text-white text-xl font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 active:scale-95">
          <span className="relative z-10 flex items-center justify-center gap-2">🌸 꽃 한송이 놓으러 가기</span>

          {/* 버튼 hover 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* 버튼 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
        </button>
      </div>
    </div>
  );
}

export default MainPage;
