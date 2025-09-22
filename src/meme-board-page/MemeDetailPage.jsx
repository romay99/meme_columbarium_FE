import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../nav-bar/navBar.jsx";
import Footer from "../footer/Footer";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";

const MemeDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleNavigateToList = () => navigate("/meme");

  // ============================
  // 좋아요 클릭 처리 함수
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
        // 좋아요 제거
        await axios.post(`${serverUrl}/likes/rm`, { memeCode: meme.code }, { headers });
        alert("꽃을 거두어 갑니다.");
        setMeme((prev) => ({ ...prev, likes: false }));
      } else {
        // 좋아요 추가
        await axios.post(`${serverUrl}/likes/add`, { memeCode: meme.code }, { headers });
        alert("꽃 한송이 놓고갑니다.");
        setMeme((prev) => ({ ...prev, likes: true }));
      }
    } catch (error) {
      alert("로그인이 필요합니다");
      navigate("/login");
    }
  };

  // ============================
  // 데이터 불러오기
  // ============================
  useEffect(() => {
    const fetchMemeDetail = async () => {
      try {
        const token = localStorage.getItem("token") || null;
        const headers = { Authorization: token ? token : null };

        const response = await axios.get(`${serverUrl}/meme/info?code=${code}`, { headers });
        setMeme(response.data);
      } catch (error) {
        console.error("상세 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemeDetail();
  }, [code]);

  if (loading) return <p className="text-center py-10 text-gray-400">⏳ 로딩 중...</p>;
  if (!meme) return <p className="text-center py-10 text-gray-500">데이터 없음</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b font-GowunBatang">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-black-100">{meme.title}</h1>
        <div className="border-t border-gray-600 my-6 w-1/2 mx-auto"></div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
          <span>📂 {meme.category}</span>
          <span>👤 작성자 닉네임: {meme.authorNickName}</span>
          <span>🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}</span>
          {meme.updatedAt && <span>🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}</span>}
          <span>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>
        <div className="shadow-lg rounded-xl p-8 border">
          <MDEditor.Markdown source={meme.contents} className="prose prose-invert max-w-none leading-relaxed" />
        </div>

        {/* 좋아요 버튼 */}
        <section className="flex justify-center mt-10">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200
              ${meme.likes ? "bg-orange-100 hover:bg-orange-200" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <img src="/assets/국화-아이콘.png" alt="꽃" className="w-7 h-7 object-contain" />
            <span className="text-gray-900 font-GowunBatangBold text-sm">꽃 한송이</span>
          </button>
          <a href="https://www.flaticon.com/kr/free-icons/" title="국화 아이콘" className="hidden">
            국화 아이콘 제작자: istar_design_bureau - Flaticon
          </a>
        </section>

        <section className="flex justify-end">
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
