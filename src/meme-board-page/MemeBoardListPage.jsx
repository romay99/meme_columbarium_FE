import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../footer/Footer";
import NavBar from "../nav-bar/navBar";
import MemeData from "./MemeData";
import SearchBar from "./SearchBar";
import { ThemeContext } from "../dark-mode/ThemeContext";

const MemeBoardListPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { darkMode } = useContext(ThemeContext);

  const [res, setRes] = useState({ page: 1, totalPages: 1, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest"); // latest: 최신순, likes: 좋아요 순

  const handleSearch = (query) => {
    setSearchQuery(query); // 검색어 상태 저장
    setCurrentPage(1); // 검색 시 페이지 1로 초기화
    fetchList(1, query); // 검색어를 서버 요청에 반영
  };

  const fetchList = async (page, query = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/meme/list?page=${page}&sort=${sortOption}&keyWord=${encodeURIComponent(query)}`);
      setRes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(currentPage, searchQuery);
  }, [currentPage, sortOption, searchQuery]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNavigateToPost = () => navigate("/meme/post");

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <NavBar />

      <section className="flex flex-col justify-center items-center my-1">
        <img src="/assets/logo.png" className={`w-80 h-50 object-cover ${darkMode ? "filter invert" : ""}`} alt="로고" />
        <p className="mt-4 text-center text-lg font-GowunBatang">{darkMode ? "한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…" : "한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…"}</p>
      </section>
      <SearchBar onSearch={handleSearch} />

      <div className="flex-grow mx-12">
        <div className="flex justify-end my-4 relative w-40">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={`block w-full px-4 py-2 pr-8 rounded-lg border appearance-none shadow-sm transition-colors duration-300
      ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500" : "bg-white text-black border-gray-300 focus:ring-blue-500"} focus:outline-none focus:ring-2`}
          >
            <option value="latest">최신 순</option>
            <option value="likes">좋아요 순</option>
          </select>
          {/* 커스텀 화살표 */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-8 p-6">
          {res.data.length > 0 ? (
            res.data.map((item) => (
              <MemeData
                key={item.code}
                code={item.code}
                title={item.title}
                startDate={item.startDate}
                endDate={item.endDate}
                category={item.category}
                darkMode={darkMode} // 필요하면 MemeData 안에서도 다크모드 적용
              />
            ))
          ) : (
            <p className="col-span-5 text-center text-gray-500 dark:text-gray-400 font-GowunBatang">데이터가 존재하지 않습니다.</p>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 mb-6">
        {Array.from({ length: res.totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded transition-colors duration-300
              ${currentPage === i + 1 ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-end mx-7">
        <button
          className={`font-GowunBatang mx-6 my-5 px-4 py-2 rounded transition-colors duration-300
            ${darkMode ? "bg-gray-700 text-white hover:bg-blue-600" : "bg-gray-100 text-black hover:bg-blue-300"}`}
          onClick={handleNavigateToPost}
        >
          밈 등록하기
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default MemeBoardListPage;
