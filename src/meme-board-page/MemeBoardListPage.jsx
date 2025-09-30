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

  const fetchList = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/meme/list?page=${page}`);
      setRes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNavigateToPost = () => navigate("/meme/post");

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <NavBar />

      <section className="flex flex-col justify-center items-center my-1">
        <img src="/assets/logo.png" className="w-80 h-50 object-cover" alt="로고" />
        <p className="mt-4 text-center text-lg font-GowunBatang">{darkMode ? "한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…" : "한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…"}</p>
      </section>

      <SearchBar />

      <div className="flex-grow mx-12">
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
