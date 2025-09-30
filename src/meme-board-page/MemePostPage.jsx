import React, { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import Navbar from "../nav-bar/navBar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";

function MemePostPage() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contents, setContents] = useState("");
  const [category, setCategory] = useState("1");
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const editorRef = useRef(null);

  // 페이지 로드 시 모달 자동 표시
  useEffect(() => {
    setShowModal(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${serverUrl}/meme/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("카테고리 불러오기 실패", error);
      }
    };
    fetchCategories();
  }, [serverUrl]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/meme/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      const imageUrl = response.data;
      const textarea = editorRef.current?.textarea;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = contents.substring(0, start) + `![이미지](${imageUrl})` + contents.substring(end);
        setContents(newText);
      } else {
        setContents((prev) => prev + `![이미지](${imageUrl})`);
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleImageUpload(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const uploadMeme = async () => {
    const postData = { title, startDate, endDate, contents, category };
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${serverUrl}/meme/upload`, postData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      alert("업로드 성공!");
      navigate("/meme");
    } catch (error) {
      console.error("업로드 에러:", error);
      if (error.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
        navigate("/login");
      } else {
        alert("업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate || !category || !contents.trim()) {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }
    uploadMeme();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 flex flex-col space-y-4">
        {/* 제목 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">제목</label>
          <input className="border rounded p-2 w-full" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* 날짜 */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">밈 흥한 날짜</label>
            <input type="month" className="border rounded p-2 w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">밈 망한 날짜</label>
            <input type="month" className="border rounded p-2 w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">카테고리</label>
          <select className="border rounded p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 마크다운 에디터 */}
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border rounded p-2">
          <MDEditor
            value={contents}
            onChange={setContents}
            height={400}
            textareaProps={{
              ref: editorRef,
              placeholder: "마크다운 작성 (이미지 드래그앤드롭 가능)",
            }}
          />
        </div>

        {/* 미리보기 */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">미리보기</h3>
          <MDEditor.Markdown source={contents} />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button className="w-35 bg-gray-500 rounded-lg text-white px-4 py-2 hover:bg-gray-400 transition" onClick={handleSubmit}>
            작성 완료
          </button>
        </div>
      </div>
      <Footer />

      {/* 정책 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-GowunBatang">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">업로드 전 확인</h2>
            <p className="mb-4">
              아래 내용을 확인하고 동의해주세요. <br />
              예를 누르면 동의한 것으로 간주됩니다.
            </p>
            <ul className="text-left mb-6 list-disc list-inside space-y-2 font-GowunBatang">
              <li>모든 콘텐츠는 저작권 및 초상권을 준수해야 합니다.</li>
              <li>타인을 비방하거나 혐오, 폭력적, 성적인 내용은 금지됩니다.</li>
              <li>업로드한 밈은 삭제 요청이 있어도 즉시 삭제되지 않을 수 있습니다.</li>
              <li>업로드 후 발생하는 문제에 대한 책임은 작성자에게 있습니다.</li>
              <li>본 서비스를 통해 공유되는 모든 밈은 커뮤니티 가이드라인을 따릅니다.</li>
            </ul>
            <div className="flex justify-end gap-4">
              <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition" onClick={() => navigate("/meme")}>
                아니오
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition" onClick={() => setShowModal(false)}>
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemePostPage;
