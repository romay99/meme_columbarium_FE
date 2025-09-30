import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../dark-mode/ThemeContext";

function NavBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const menus = [
    { name: "홈", path: "/" },
    { name: "밈 납골당", path: "/meme" },
    { name: "자유 게시판", path: "/board" },
    { name: "소개", path: "/intro" },
    { name: "마이 페이지", path: "/mypage" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <nav className={`shadow-md transition-colors duration-500 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* 메뉴 */}
        <div className="hidden md:flex space-x-8">
          {menus.map((menu, idx) => {
            if (menu.name === "마이 페이지" && !token) return null;
            return (
              <Link
                key={idx}
                to={menu.path}
                className={`font-GowunBatangBold px-4 py-2 font-medium text-lg transition-colors duration-300 
                  ${darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-500"}`}
              >
                {menu.name}
              </Link>
            );
          })}
        </div>

        {/* 로그인/다크모드 버튼 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded transition-colors duration-300
              ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 text-black hover:bg-gray-400"}`}
          >
            {darkMode ? "라이트 모드" : "다크 모드"}
          </button>

          {!token ? (
            <Link
              to="/login"
              className={`font-GowunBatangBold px-4 py-2 rounded-lg transition-colors duration-300
                ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-600 text-white hover:bg-blue-700"}`}
            >
              로그인
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className={`font-GowunBatangBold px-4 py-2 rounded-lg transition-colors duration-300
                ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-600 text-white hover:bg-green-700"}`}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
