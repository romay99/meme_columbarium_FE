import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../nav-bar/navBar.jsx";
import axios from "axios";
import Footer from "../footer/Footer";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";

const MemeDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleNavigateToList = () => {
    navigate("/meme");
  };

  const tmpJson = {
    code: 0,
    title: "故 임시 제목",
    contents: `# 영면을 기원하며  
이곳은 우리의 추억을 담은 공간입니다.  

> 고인의 웃음을 기억하며...`,
    startDate: "2025-09-15",
    endDate: "2025-09-20",
    createdAt: "2025-09-15T11:23:47.062Z",
    version: 1,
    orgVersionCode: 0,
    updatedAt: "2025-09-16T09:12:47.062Z",
    category: "추모",
    authorCode: 101,
    updaterCode: 202,
  };

  useEffect(() => {
    const fetchMemeDetail = async () => {
      try {
        const response = await axios.get(`${serverUrl}/meme/info?code=${code}`);
        setMeme(response.data);
        // setMeme(tmpJson);
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
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-black-100">{meme.title}</h1>

        {/* 얇은 구분선 */}
        <div className="border-t border-gray-600 my-6 w-1/2 mx-auto"></div>

        {/* 메타 정보 */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
          <span>📂 {meme.category}</span>
          <span>👤 작성자 코드: {meme.authorCode}</span>
          <span>🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}</span>
          <span>🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}</span>
          <span>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>

        {/* 본문 */}
        <div className="shadow-lg rounded-xl p-8 border ">
          <MDEditor.Markdown source={meme.contents} className="prose prose-invert max-w-none leading-relaxed" />
        </div>
        <section className="flex justify-center mt-10">
          {/* 버튼 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-orange-50 rounded-full shadow-md transition-all duration-200">
            {/* 왼쪽 이미지 */}
            <img
              src="/assets/국화-아이콘.png" // 가져온 작은 이미지 경로
              alt="꽃"
              className="w-7 h-7 object-contain"
            />
            {/* 오른쪽 텍스트 */}
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
