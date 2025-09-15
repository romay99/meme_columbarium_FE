import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-center items-center">
        {/* 메뉴 */}
        <div className="hidden md:flex space-x-8">
          {["홈", "게시판", "소개"].map((menu, idx) => (
            <Link key={idx} to={menu === "홈" ? "/" : `/${menu.toLowerCase()}`} className="font-GowunBatang px-4 py-2 font-medium text-lg hover:text-gray-300 transition-colors">
              {menu}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* 모바일 햄버거 메뉴 (선택) */}
        {/* <div className="md:hidden">
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div> */}
      </div>
    </nav>
  );
}

export default NavBar;
