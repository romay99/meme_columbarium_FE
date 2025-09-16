import React, { useState } from "react";
import NavBar from "../nav-bar/navBar";
import Footer from "../footer/Footer";
import axios from "axios";

const SignUpPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    email: "",
    nickname: "",
  });

  const [idAvailable, setIdAvailable] = useState(null); // true/false/null
  const [emailValid, setEmailValid] = useState(true);

  // 입력 변화 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 이메일 형식 체크
    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(regex.test(value));
    }
  };

  // ID 중복 체크
  const checkId = async () => {
    if (!formData.id) return alert("아이디를 입력해주세요.");
    try {
      const response = await axios.get(`${serverUrl}/member/check-id/${formData.id}`);
      setIdAvailable(response.data.available); // 서버에서 { available: true/false } 반환한다고 가정
      if (response.data.available) alert("사용 가능한 아이디입니다!");
      else alert("이미 사용 중인 아이디입니다.");
    } catch (error) {
      console.error(error);
      alert("ID 중복 확인 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idAvailable) return alert("ID 중복 체크를 해주세요.");
    if (!emailValid) return alert("올바른 이메일 형식이 아닙니다.");
    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");

    try {
      const { id, password, email, nickname } = formData;
      const response = await axios.post(`${serverUrl}/member/signup`, { id, password, email, nickname });
      alert(response.data);
    } catch (error) {
      alert(error.response?.data || "회원가입 실패");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">회원가입</h2>
            <p className="mt-2 text-sm text-center text-gray-500">계정 정보를 입력해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 아이디 */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">아이디</label>
              <div className="flex gap-2 mt-1">
                <input type="text" name="id" value={formData.id} onChange={handleChange} required className="flex-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" placeholder="아이디를 입력하세요" />
                <button type="button" onClick={checkId} className="px-4 rounded-xl bg-gray-300 hover:bg-gray-400 transition">
                  중복확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" placeholder="비밀번호를 입력하세요" />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className={`mt-1 w-full rounded-xl border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 ${formData.passwordConfirm && formData.password !== formData.passwordConfirm ? "border-red-500" : "border-gray-300"}`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {formData.passwordConfirm && formData.password !== formData.passwordConfirm && <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 w-full rounded-xl border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 ${!emailValid ? "border-red-500" : "border-gray-300"}`}
                placeholder="이메일을 입력하세요"
              />
              {!emailValid && <p className="text-red-500 text-sm mt-1">올바른 이메일 형식이 아닙니다.</p>}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">닉네임</label>
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" placeholder="닉네임을 입력하세요" />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
              회원가입
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
