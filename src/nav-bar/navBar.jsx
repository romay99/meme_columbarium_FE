import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 로고/사이트명 */}
        <div className="text-2xl font-bold">밈 납골당</div>

        {/* 메뉴 */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-pink-400 transition-colors">
            홈
          </Link>
          <Link to="/board" className="hover:text-pink-400 transition-colors">
            게시판
          </Link>
          <Link to="/about" className="hover:text-pink-400 transition-colors">
            소개
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
