import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../nav-bar/navBar.jsx";
import Footer from "../footer/Footer";
import MDEditor from "@uiw/react-md-editor";
import { ThemeContext } from "../dark-mode/ThemeContext.js";
import api from "../api/api.js";

const MemeDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // ThemeContext 사용

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const handleNavigateToList = () => navigate("/meme");

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const headers = { Authorization: token };
      if (meme.likes) {
        await api.post(`${serverUrl}/likes/rm`, { memeCode: meme.code });
        setMeme((prev) => ({ ...prev, likes: false }));
        setLikesCount((prev) => prev - 1);
        alert("꽃 한송이 거두어갑니다.");
      } else {
        await api.post(`${serverUrl}/likes/add`, { memeCode: meme.code });
        setMeme((prev) => ({ ...prev, likes: true }));
        setLikesCount((prev) => prev + 1);
        alert("꽃 한송이 놓고갑니다.");
      }
    } catch (err) {
      alert("로그인이 필요합니다");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const res = await api.get(`${serverUrl}/meme/info?code=${code}`, {});
        console.log(res);
        setMeme(res.data);
        setLikesCount(res.data.likesCount || 0);
        if (res.data.newAccessToken !== null) {
          // 만약 새로운 액세스 토큰이 발급되었다면 토큰 갈아끼우기
          localStorage.setItem("token", "Bearer " + res.data.newAccessToken);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeme();
  }, [code]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`${serverUrl}/comment/meme/list`, {
          params: { page: commentPage, meme: code },
        });
        setComments(res.data.data);
        setTotalCommentPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [commentPage]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
      const headers = { Authorization: token };
      await api.post(`${serverUrl}/comment/meme/post`, { memeCode: meme.code, contents: newComment }, { headers });
      setNewComment("");
      setCommentPage(1);
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
        alert("댓글 등록 실패");
      }
    }
  };

  if (loading) return <p className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>⏳ 로딩 중...</p>;
  if (!meme) return <p className={`text-center py-10 ${darkMode ? "text-gray-500" : "text-gray-700"}`}>데이터 없음</p>;

  return (
    <div className={`flex flex-col min-h-screen font-GowunBatang transition-colors ${darkMode ? "bg-[rgb(13,17,23)] text-gray-100" : "bg-white-100 text-gray-900"}`}>
      <Header />
      <main className="flex-grow container mx-auto px-6 py-10">
        <h1 className={`text-4xl font-bold text-center mb-6 tracking-wide`}>{meme.title}</h1>

        <div className={`border-t my-6 w-1/2 mx-auto ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>

        <div className={`flex flex-wrap justify-center gap-6 text-sm mb-8`}>
          <span>📂 {meme.category}</span>
          <span>👤 작성자: {meme.authorNickName}</span>
          <span>🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}</span>
          {meme.updatedAt && <span>🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}</span>}
          <span>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative inline-block">
            {/* 썸네일 */}
            <img
              // src="/assets/test.png"
              src={meme.thumbnail}
              alt="밈 썸네일"
              className="w-64 h-64 rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        <div className={`mx-16 min-h-[200px] rounded-xl ${darkMode ? "bg-black-900" : "bg-white-50"}`} data-color-mode={darkMode ? "dark" : "light"}>
          <MDEditor.Markdown source={meme.contents} className={`prose ${darkMode ? "prose-invert" : ""} max-w-none`} />
        </div>

        <section className="flex justify-center mt-10 items-center gap-3">
          <button onClick={handleLikeClick} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200 ${meme.likes ? "bg-orange-600 hover:bg-orange-500" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400 text-gray-900"}`}>
            <img src="/assets/국화-아이콘.png" alt="꽃" className="w-7 h-7 object-contain" />
            <span className="font-GowunBatangBold text-sm">꽃 한송이</span>
          </button>
          <span className="font-GowunBatangBold text-lg">총 {likesCount} 송이</span>
        </section>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => navigate(`/meme/update/${code}`)} className={`px-4 py-2 rounded ${darkMode ? "bg-green-700 hover:bg-green-500 text-white" : "bg-green-300 hover:bg-green-400 text-gray-900"}`}>
            밈 수정하기
          </button>
          <button onClick={() => navigate(`/meme/update-history/${meme.orgMemeCode}`)} className={`px-4 py-2 rounded ${darkMode ? "bg-blue-700 hover:bg-blue-500 text-white" : "bg-blue-300 hover:bg-blue-400 text-gray-900"}`}>
            수정기록 열람
          </button>
        </div>

        <section className="mt-10 mx-14">
          <span>{totalCount}개의 댓글</span>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" className={`flex-1 border rounded px-3 py-2 ${darkMode ? "bg-gray-700 text-gray-100 placeholder-gray-400" : "bg-gray-200 text-gray-900 placeholder-gray-500"}`} />
            <button onClick={handleAddComment} className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-400 hover:bg-gray-300 text-gray-900"}`}>
              등록
            </button>
          </div>

          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.code} className={`border rounded px-4 py-2 ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.authorNickName}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.contents}</p>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalCommentPages }, (_, i) => (
              <button key={i} onClick={() => setCommentPage(i + 1)} className={`px-3 py-1 rounded ${i + 1 === commentPage ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </section>

        <section className="flex justify-end mt-10">
          <button onClick={handleNavigateToList} className={`mx-3 my-5 px-4 py-2 rounded ${darkMode ? "bg-gray-700 hover:bg-blue-600 text-white" : "bg-gray-300 hover:bg-blue-400 text-gray-900"}`}>
            목록
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MemeDetailPage;
