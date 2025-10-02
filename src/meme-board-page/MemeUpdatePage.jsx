import React, { useState, useRef, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import Navbar from "../nav-bar/navBar";
import Footer from "../footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../dark-mode/ThemeContext";

function MemeUpdatePage() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const { darkMode } = useContext(ThemeContext);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contents, setContents] = useState("");
  const [category, setCategory] = useState("1");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchMemeDetail();
  }, []);

  const fetchMemeDetail = async () => {
    try {
      const token = localStorage.getItem("token") || null;
      const headers = { Authorization: token ? token : null };

      const response = await axios.get(`${serverUrl}/meme/info?code=${code}`, { headers });
      setTitle(response.data.title);
      setContents(response.data.contents);
      setStartDate(response.data.startDate.slice(0, 7));
      setEndDate(response.data.endDate.slice(0, 7));
    } catch (error) {
      console.error("상세 데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${serverUrl}/meme/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("카테고리 불러오기 실패", error);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate || !category || !contents.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    setShowConfirmModal(true);
  };

  const updateMeme = async () => {
    const postData = { title, startDate, endDate, contents, category, code };
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${serverUrl}/meme/update`, postData, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });
      alert("수정 성공!");
      navigate("/meme");
    } catch (error) {
      console.error("업로드 에러:", error);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) return <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>로딩 중...</div>;

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <Navbar />

      {/* 기존 안내 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className={darkMode ? "bg-gray-800 text-white rounded-lg shadow-lg z-10 w-96 p-6 flex flex-col space-y-4 font-GowunBatang" : "bg-white text-black rounded-lg shadow-lg z-10 w-96 p-6 flex flex-col space-y-4 font-GowunBatang"}>
            <h2 className="text-lg font-bold text-center">수정 유의사항</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>이 밈 게시물은 수정 내역이 기록됩니다. 신중하게 편집해주세요.</li>
              <li>타인의 게시물은 존중하며, 허락 없이 변경하지 말아주세요.</li>
            </ul>
            <p className="text-sm text-center">아래 버튼으로 동의 여부를 선택해주세요.</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-400 transition" onClick={() => setShowModal(false)}>
                예
              </button>
              <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400 transition" onClick={() => navigate("/meme")}>
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className={darkMode ? "bg-gray-800 text-white rounded-lg shadow-lg z-10 w-96 p-6 flex flex-col space-y-4" : "bg-white text-black rounded-lg shadow-lg z-10 w-96 p-6 flex flex-col space-y-4"}>
            <h2 className="text-lg font-bold text-center">수정 확인</h2>
            <p className="text-center">정말로 수정하시겠습니까?</p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-400 transition"
                onClick={() => {
                  updateMeme();
                  setShowConfirmModal(false);
                }}
              >
                예
              </button>
              <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400 transition" onClick={() => setShowConfirmModal(false)}>
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 flex flex-col space-y-4">
        {/* 제목 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">제목</label>
          <input className={darkMode ? "border rounded p-2 w-full bg-gray-700 text-white" : "border rounded p-2 w-full bg-white text-black"} placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* 날짜 */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">밈 흥한 날짜</label>
            <input type="month" className={darkMode ? "border rounded p-2 w-full bg-gray-700 text-white" : "border rounded p-2 w-full bg-white text-black"} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">밈 망한 날짜</label>
            <input type="month" className={darkMode ? "border rounded p-2 w-full bg-gray-700 text-white" : "border rounded p-2 w-full bg-white text-black"} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">카테고리</label>
          <select className={darkMode ? "border rounded p-2 w-full bg-gray-700 text-white" : "border rounded p-2 w-full bg-white text-black"} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 마크다운 에디터 */}
        <div className="border rounded p-2" data-color-mode={darkMode ? "dark" : "light"}>
          <MDEditor value={contents} onChange={setContents} height={400} textareaProps={{ ref: editorRef, placeholder: "마크다운 작성" }} />
        </div>

        {/* 미리보기 */}
        <div data-color-mode={darkMode ? "dark" : "light"}>
          <h3 className="font-semibold mb-2">미리보기</h3>
          <MDEditor.Markdown source={contents} />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button className="w-35 bg-gray-500 rounded-lg text-white px-4 py-2 hover:bg-gray-400 transition" onClick={handleSubmit}>
            수정 완료
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MemeUpdatePage;
