import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../nav-bar/navBar.jsx";
import Footer from "../footer/Footer";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { ThemeContext } from "../dark-mode/ThemeContext";

const MemeDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const handleNavigateToList = () => navigate("/meme");

  // 좋아요 클릭 처리
  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token") || null;
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const headers = { Authorization: token };

      if (meme.likes) {
        await axios.post(`${serverUrl}/likes/rm`, { memeCode: meme.code }, { headers });
        alert("꽃을 거두어 갑니다.");
        setMeme((prev) => ({ ...prev, likes: false }));
        setLikesCount((prev) => prev - 1);
      } else {
        await axios.post(`${serverUrl}/likes/add`, { memeCode: meme.code }, { headers });
        alert("꽃 한송이 놓고갑니다.");
        setMeme((prev) => ({ ...prev, likes: true }));
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      alert("로그인이 필요합니다");
      navigate("/login");
    }
  };

  // 밈 상세 데이터 불러오기
  useEffect(() => {
    const fetchMemeDetail = async () => {
      try {
        const token = localStorage.getItem("token") || null;
        const headers = { Authorization: token ? token : null };

        const response = await axios.get(`${serverUrl}/meme/info?code=${code}`, { headers });
        setMeme(response.data);
        setLikesCount(response.data.likesCount || 0);
      } catch (error) {
        console.error("상세 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemeDetail();
  }, [code]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${serverUrl}/comment/meme/list`, {
          params: { page: commentPage, meme: code },
        });
        setComments(response.data.data);
        setTotalCommentPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };
    fetchComments();
  }, [commentPage]);

  // 댓글 등록
  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const headers = { Authorization: token };
      await axios.post(`${serverUrl}/comment/meme/post`, { memeCode: meme.code, contents: newComment }, { headers });

      alert("댓글이 등록되었습니다.");
      setNewComment("");
      setCommentPage(1);
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  if (loading) return <p className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>⏳ 로딩 중...</p>;
  if (!meme) return <p className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>데이터 없음</p>;

  return (
    <div
      className={`flex flex-col min-h-screen font-GowunBatang
      ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-colors duration-500`}
    >
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10">
        {/* 밈 제목 */}
        <h1 className="text-4xl font-bold text-center mb-6 tracking-wide">{meme.title}</h1>

        <div className={`border-t my-6 w-1/2 mx-auto ${darkMode ? "border-gray-700" : "border-gray-600"}`}></div>

        {/* 밈 정보 */}
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
          <span className={darkMode ? "text-gray-300" : "text-gray-500"}>📂 {meme.category}</span>
          <span className={darkMode ? "text-gray-300" : "text-gray-500"}>👤 작성자: {meme.authorNickName}</span>
          <span className={darkMode ? "text-gray-300" : "text-gray-500"}>🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}</span>
          {meme.updatedAt && <span className={darkMode ? "text-gray-300" : "text-gray-500"}>🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}</span>}
          <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>

        {/* 밈 내용 */}
        <div
          className={`shadow-lg rounded-xl p-8 border
          ${darkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-black"}`}
        >
          <MDEditor.Markdown source={meme.contents} className="prose max-w-none leading-relaxed dark:prose-invert" />
        </div>

        {/* 좋아요 */}
        <section className="flex justify-center mt-10 items-center gap-3">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200
              ${meme.likes ? "bg-orange-100 hover:bg-orange-200 dark:bg-orange-200 dark:hover:bg-orange-300" : `bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600`}`}
          >
            <img src="/assets/국화-아이콘.png" alt="꽃" className="w-7 h-7 object-contain" />
            <span className="text-sm font-GowunBatangBold text-black dark:text-white">꽃 한송이</span>
          </button>
          <span className="text-lg font-GowunBatangBold text-gray-700 dark:text-gray-300">총 {likesCount} 송이</span>
        </section>

        {/* 댓글 */}
        <section className="mt-10">
          <span className="mb-2 block">{totalCount}개의 댓글</span>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className={`flex-1 border rounded px-3 py-2
                ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            />
            <button onClick={handleAddComment} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors">
              등록
            </button>
          </div>

          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.code} className={`border rounded px-4 py-2 ${darkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={darkMode ? "text-gray-300" : "text-gray-500"}>{c.authorNickName}</span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-500"}>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.contents}</p>
              </li>
            ))}
          </ul>

          {/* 댓글 페이지네이션 */}
          <div className="flex justify-center mt-4 gap-2">
            {(() => {
              const pageLimit = 10;
              const startPage = Math.floor((commentPage - 1) / pageLimit) * pageLimit + 1;
              const endPage = Math.min(startPage + pageLimit - 1, totalCommentPages);
              const pages = [];

              pages.push(
                <button key="prev-block" disabled={startPage === 1} onClick={() => setCommentPage(startPage - 1)} className={`px-3 py-1 rounded ${darkMode ? "bg-gray-700 text-white disabled:opacity-50" : "bg-gray-200 disabled:opacity-50"}`}>
                  &lt;
                </button>
              );

              for (let page = startPage; page <= endPage; page++) {
                pages.push(
                  <button key={page} onClick={() => setCommentPage(page)} className={`px-3 py-1 rounded ${page === commentPage ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}>
                    {page}
                  </button>
                );
              }

              pages.push(
                <button key="next-block" disabled={endPage === totalCommentPages} onClick={() => setCommentPage(endPage + 1)} className={`px-3 py-1 rounded ${darkMode ? "bg-gray-700 text-white disabled:opacity-50" : "bg-gray-200 disabled:opacity-50"}`}>
                  &gt;
                </button>
              );

              return pages;
            })()}
          </div>
        </section>

        {/* 목록 버튼 */}
        <section className="flex justify-end mt-10">
          <button
            className={`font-GowunBatang mx-3 my-5 px-4 py-2 rounded transition-colors duration-300
              ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-blue-300"}`}
            onClick={handleNavigateToList}
          >
            목록
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MemeDetailPage;
