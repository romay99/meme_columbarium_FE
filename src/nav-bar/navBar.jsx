import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname");
  const navigate = useNavigate();

  // 메뉴 이름과 경로를 매핑
  const menus = [
    { name: "홈", path: "/" },
    { name: "밈 납골당", path: "/meme" },
    { name: "자유 게시판", path: "/board" },
    { name: "소개", path: "/intro" },
    { name: "마이 페이지", path: "/mypage" },
  ];

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.clear(); // 모든 로컬스토리지 삭제
    window.location.reload(); // 로그아웃 하고 페이지 새로고침
  };

  return (
    <nav className="shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* 메뉴 */}
        <div className="hidden md:flex space-x-8">
          {menus.map((menu, idx) => {
            // "마이 페이지"는 로그인 되어있을 때만 렌더링
            if (menu.name === "마이 페이지" && !token) return null;
            return (
              <Link key={idx} to={menu.path} className="font-GowunBatangBold px-4 py-2 font-medium text-lg hover:text-gray-300 transition-colors">
                {menu.name}
              </Link>
            );
          })}
        </div>

        {/* 로그인/마이페이지 버튼 */}
        <div>
          {!token ? (
            <Link to="/login" className="font-GowunBatangBold px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-blue-700">
              로그인
            </Link>
          ) : (
            <button onClick={handleLogout} className="font-GowunBatangBold px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-green-700">
              로그아웃
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
