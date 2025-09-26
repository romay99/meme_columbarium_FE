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

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [totalCount, setTotalCount] = useState(0);

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

  // ============================
  // 댓글 불러오기
  // ============================
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${serverUrl}/comment/board/list`, {
          params: { page: commentPage, board: code },
        });
        setComments(response.data.data);
        setTotalCommentPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };

    fetchComments();
  }, [commentPage]);

  // ============================
  // 댓글 등록
  // ============================
  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const headers = { Authorization: token };
      await axios.post(
        `${serverUrl}/comment/board/post`,
        { boardCode: board.code, contents: newComment },
        { headers }
      );

      alert('댓글이 등록되었습니다.');
      setNewComment('');
      setCommentPage(1); // 최신 댓글 페이지로 이동

      // 페이지 새로고침
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        // 토큰이 만료되었거나 유효하지 않음
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token'); // 토큰 제거
        navigate('/login');
      }
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // 게시글 삭제
  const boardDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const headers = { Authorization: token };

      await axios.delete(`${serverUrl}/board/delete`, {
        params: { boardCode: board.code },
        headers,
      });

      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
      }
      alert('게시글 삭제에 실패했습니다.');
    }
  };
  return (
    <div>
      <NavBar></NavBar>

      <main className="flex-grow container mx-auto px-6 py-10">
        {/* 게시글 제목 */}
        <div className="mx-5 text-4xl font-bold text-left mb-6 tracking-wide text-black-100">
          {board.title}
        </div>
        {/* 작성자 + 수정/삭제 버튼 */}
        <div className="mx-5 flex justify-between items-center mb-6">
          <span className="text-sm font-GowunBatang text-left tracking-wide text-black-100">
            작성자 : {board.authorNickName}
          </span>

          {/* 닉네임 일치 시 버튼 표시 */}
          {localStorage.getItem('nickname') === board.authorNickName && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/board/update/${board.code}`)}
                className="px-3 py-1 text-sm bg-blue-400 hover:bg-yellow-500 text-white rounded"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    boardDelete();
                  }
                }}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {/* 게시글 내용 */}
        <div className="mx-5 shadow-lg rounded-xl p-8 border">
          <MDEditor.Markdown
            source={board.contents}
            className="prose prose-invert max-w-none leading-relaxed"
          />
        </div>

        <div className="border-t border-gray-600 my-6 w-1/2 mx-auto"></div>
        {/* 댓글 섹션 */}
        <section className="mt-10">
          <span>{totalCount}개의 댓글</span>

          {/* 댓글 입력 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleAddComment}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              등록
            </button>
          </div>

          {/* 댓글 리스트 */}
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.code} className="border rounded px-4 py-2">
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>{c.authorNickName}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.contents}</p>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-4 gap-2">
            {/** 한 블록당 보여줄 페이지 수 **/}
            {(() => {
              const pageLimit = 10; // 한 블록에 보여줄 페이지 수
              const startPage =
                Math.floor((commentPage - 1) / pageLimit) * pageLimit + 1;
              const endPage = Math.min(
                startPage + pageLimit - 1,
                totalCommentPages
              );

              const pages = [];
              // 이전 블록 버튼
              pages.push(
                <button
                  key="prev-block"
                  disabled={startPage === 1}
                  onClick={() => setCommentPage(startPage - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  &lt;
                </button>
              );

              // 번호 버튼
              for (let page = startPage; page <= endPage; page++) {
                pages.push(
                  <button
                    key={page}
                    onClick={() => setCommentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === commentPage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              }

              // 다음 블록 버튼
              pages.push(
                <button
                  key="next-block"
                  disabled={endPage === totalCommentPages}
                  onClick={() => setCommentPage(endPage + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  &gt;
                </button>
              );

              return pages;
            })()}
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
};

export default BoardDetailPage;
