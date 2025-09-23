import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../nav-bar/navBar.jsx";
import Footer from "../footer/Footer";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";

const MemeDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const navigate = useNavigate();

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // ============================
  // 목록으로 이동
  // ============================
  const handleNavigateToList = () => navigate("/meme");

  // ============================
  // 좋아요 클릭 처리
  // ============================
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

  // ============================
  // 밈 상세 데이터 불러오기
  // ============================
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

  // ============================
  // 댓글 불러오기
  // ============================
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

  // ============================
  // 댓글 등록
  // ============================
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
      setCommentPage(1); // 최신 댓글 페이지로 이동

      // 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-400">⏳ 로딩 중...</p>;
  if (!meme) return <p className="text-center py-10 text-gray-500">데이터 없음</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b font-GowunBatang">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-10">
        {/* 밈 제목 */}
        <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-black-100">{meme.title}</h1>

        <div className="border-t border-gray-600 my-6 w-1/2 mx-auto"></div>

        {/* 밈 정보 */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
          <span>📂 {meme.category}</span>
          <span>👤 작성자 닉네임: {meme.authorNickName}</span>
          <span>🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}</span>
          {meme.updatedAt && <span>🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}</span>}
          <span>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>

        {/* 밈 내용 */}
        <div className="shadow-lg rounded-xl p-8 border">
          <MDEditor.Markdown source={meme.contents} className="prose prose-invert max-w-none leading-relaxed" />
        </div>

        {/* 좋아요 버튼 + 총 꽃 수 */}
        <section className="flex justify-center mt-10 items-center gap-3">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200
              ${meme.likes ? "bg-orange-100 hover:bg-orange-200" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <img src="/assets/국화-아이콘.png" alt="꽃" className="w-7 h-7 object-contain" />
            <span className="text-gray-900 font-GowunBatangBold text-sm">꽃 한송이</span>
          </button>
          <span className="text-gray-700 font-GowunBatangBold text-lg">총 {likesCount} 송이</span>
        </section>

        {/* 댓글 섹션 */}
        <section className="mt-10">
          <span>{totalCount}개의 댓글</span>

          {/* 댓글 입력 */}
          <div className="flex gap-2 mb-4">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" className="flex-1 border rounded px-3 py-2" />
            <button onClick={handleAddComment} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              등록
            </button>
          </div>

          {/* 댓글 리스트 */}
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.code} className="border rounded px-4 py-2">
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>{c.authorNickName}</span>
                  <span>{new Date(c.createAt).toLocaleString()}</span>
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
              const startPage = Math.floor((commentPage - 1) / pageLimit) * pageLimit + 1;
              const endPage = Math.min(startPage + pageLimit - 1, totalCommentPages);

              const pages = [];
              // 이전 블록 버튼
              pages.push(
                <button key="prev-block" disabled={startPage === 1} onClick={() => setCommentPage(startPage - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                  &lt;
                </button>
              );

              // 번호 버튼
              for (let page = startPage; page <= endPage; page++) {
                pages.push(
                  <button key={page} onClick={() => setCommentPage(page)} className={`px-3 py-1 rounded ${page === commentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    {page}
                  </button>
                );
              }

              // 다음 블록 버튼
              pages.push(
                <button key="next-block" disabled={endPage === totalCommentPages} onClick={() => setCommentPage(endPage + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                  &gt;
                </button>
              );

              return pages;
            })()}
          </div>
        </section>

        {/* 목록/수정 버튼 */}
        <section className="flex justify-end mt-10">
          <button className="font-GowunBatang mx-3 my-5 bg-gray-200 text-black px-4 py-2 rounded hover:bg-blue-300 transition-colors duration-300" onClick={handleNavigateToList}>
            목록
          </button>
          <button className="font-GowunBatang mx-3 my-5 bg-gray-200 text-black px-4 py-2 rounded hover:bg-blue-300 transition-colors duration-300">밈 수정하기</button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MemeDetailPage;
