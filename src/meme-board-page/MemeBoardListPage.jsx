import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../footer/Footer";
import NavBar from "../nav-bar/navBar";
import { useNavigate } from "react-router-dom";
import MemeData from "./MemeData";
import SearchBar from "./SearchBar";

const BoardPage = () => {
  const tmpRes = {
    page: "1",
    totalPages: "5",
    data: [
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
      {
        code: "1",
        title: "책 제목",
        thumbnail: "https://placehold.co/600x400",
        startDate: "2022.02",
        endDate: "2022.10",
      },
    ],
  };
  const [res, setRes] = useState(tmpRes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 처음 켜질때
    const fetchList = async () => {
      try {
        // const response = await axios.get("URL");
        setRes(tmpRes); // 일단 임시 JSON 으로 넣어놓는다.
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const navigate = useNavigate();
  const handleNavigateToPost = () => {
    navigate("/meme/post");
  };
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar></NavBar>
      <section className="flex flex-col justify-center items-center my-1">
        <img src="/assets/logo.png" className="w-80 h-50 object-cover" alt="로고" />
        <p className="mt-4 text-center text-lg text-gray-900 font-GowunBatang">한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…</p>
      </section>

      <SearchBar></SearchBar>
      <div className="flex-grow">
        <div className="grid grid-cols-5 gap-8 p-6">
          {res.data.map((item, index) => (
            <MemeData key={index} title={item.title} startDate={item.startDate} endDate={item.endDate}></MemeData>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleNavigateToPost} class="font-GowunBatang rounded-2xl mx-6 my-5 bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
          밈 등록하기
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default BoardPage;
