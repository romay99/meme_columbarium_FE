import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname");

  return (
    <nav className="shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* 메뉴 */}
        <div className="hidden md:flex space-x-8">
          {["홈", "게시판", "소개"].map((menu, idx) => (
            <Link key={idx} to={menu === "홈" ? "/" : `/${menu.toLowerCase()}`} className="font-GowunBatang px-4 py-2 font-medium text-lg hover:text-gray-300 transition-colors">
              {menu}
            </Link>
          ))}
        </div>

        {/* 로그인/마이페이지 버튼 */}
        <div>
          {!token ? (
            <Link to="/login" className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-blue-700">
              로그인
            </Link>
          ) : (
            <Link to="/mypage" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              {nickname}님의 마이페이지
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
