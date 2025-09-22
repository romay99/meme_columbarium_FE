import React, { useState } from "react";
import axios from "axios";
import NavBar from "../nav-bar/navBar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "", // 서버 DTO에 맞춤
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUpPage = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        serverUrl + "/member/login", // API 엔드포인트
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, type, id, nickname, role } = response.data;

      // 👉 로컬스토리지 저장
      localStorage.setItem("token", `${type} ${token}`); // Bearer 붙여서 저장
      localStorage.setItem("nickname", nickname);

      alert(`${nickname}님, 환영합니다!`);
      window.location.href = "/meme"; // 밈 게시판으로 리다이렉트
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          {/* 헤더 */}
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">로그인</h2>
            <p className="mt-2 text-sm text-center text-gray-500">계정 정보를 입력해주세요</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">아이디</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange} required className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" placeholder="아이디를 입력하세요" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" placeholder="비밀번호를 입력하세요" />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
              로그인
            </button>
          </form>

          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <button className="hover:text-blue-600" onClick={handleSignUpPage}>
              회원가입
            </button>
            <button className="hover:text-blue-600">비밀번호 찾기</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
