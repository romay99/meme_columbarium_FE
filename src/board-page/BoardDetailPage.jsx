import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import MDEditor from '@uiw/react-md-editor';

const BoardDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState('');
  const [loading, setLoading] = useState(true);

  // ============================
  // 목록으로 이동
  // ============================
  const handleNavigateToList = () => navigate('/board');

  // ============================
  // 게시판 상세 데이터 불러오기
  // ============================
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/board/info?code=${code}`
        );
        setBoard(response.data);
      } catch (error) {
        console.error('상세 데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, []);
  return (
    <div>
      <NavBar></NavBar>

      <main className="flex-grow container mx-auto px-6 py-10">
        {/* 게시글 제목 */}
        <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-black-100">
          {board.title}
        </h1>
        {/* 게시글 내용 */}
        <div className="shadow-lg rounded-xl p-8 border">
          <MDEditor.Markdown
            source={board.contents}
            className="prose prose-invert max-w-none leading-relaxed"
          />
        </div>

        <div className="border-t border-gray-600 my-6 w-1/2 mx-auto"></div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default BoardDetailPage;
