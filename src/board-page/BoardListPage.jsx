import React from 'react';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BoardData from './BoardData';

export const BoardListPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;

  const navigate = useNavigate();
  const handleNavigateToPost = () => {
    navigate('/board/post');
  };

  const [res, setRes] = useState({ page: 1, totalPages: 1, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 데이터 fetch
  const fetchList = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/board/list?page=${page}`);
      setRes(response.data); // 서버에서 받아온 데이터로 세팅
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 바뀔 때마다 fetch
  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div flex flex-col min-h-screen>
      <NavBar></NavBar>

      {/* 데이터 섹션 */}
      <div className="flex justify-center my-5">
        <div className="w-[70%]">
          {res.data.length > 0 ? (
            res.data.map((item) => {
              const formattedDate = new Date(
                item.createdAt
              ).toLocaleDateString();
              return (
                <BoardData
                  code={item.code}
                  title={item.title}
                  authorNickName={item.authorNickName}
                  createdAt={formattedDate}
                ></BoardData>
              );
            })
          ) : (
            <p className="text-center text-gray-500 font-GowunBatang py-4">
              데이터가 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 mb-6">
        {Array.from({ length: res.totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-300 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-end mx-7">
        <button
          className="font-GowunBatang mx-6 my-5 bg-gray-100 text-black px-4 py-2 rounded hover:bg-blue-300 transition-colors duration-300"
          onClick={handleNavigateToPost}
        >
          글 쓰기
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
};
