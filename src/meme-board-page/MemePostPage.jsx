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
  const [category, setCategory] = useState("1"); // 선택된 카테고리(기본값 1 = 인공지능)
  const [categories, setCategories] = useState([]); // DB에서 받아올 카테고리

  const editorRef = useRef(null);

  // 컴포넌트 마운트 시 카테고리 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${serverUrl}/meme/categories`);
        setCategories(response.data); // 서버에서 배열로 내려온다고 가정
      } catch (error) {
        console.error("카테고리 불러오기 실패", error);
      }
    };
    fetchCategories();
  }, [serverUrl]);

  // 이미지 업로드 및 커서 위치 삽입
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // JWT 토큰 확인
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

      // 커서 위치에 이미지 삽입
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
    }
  };

  // 드래그앤드롭 이벤트
  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleImageUpload(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleSubmit = async () => {
    const postData = { title, startDate, endDate, contents, category };

    // 유효성 검사
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!startDate) {
      alert("밈 흥한 날짜를 선택해주세요.");
      return;
    }
    if (!endDate) {
      alert("밈 망한 날짜를 선택해주세요.");
      return;
    }
    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!contents.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // JWT 토큰 확인
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/meme/upload`, postData, {
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
        // 토큰이 만료되었거나 유효하지 않음
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token"); // 토큰 제거
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
        navigate("/login");
      } else {
        alert("업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div>
      <Navbar></Navbar>
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

        {/* 마크다운 에디터 + 드래그 이미지 */}
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

        {/* 실시간 미리보기 */}
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
      <Footer></Footer>
    </div>
  );
}

export default MemePostPage;
