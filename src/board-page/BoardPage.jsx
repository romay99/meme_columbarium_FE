import React from "react";
import { motion } from "framer-motion";
import Footer from "../footer/Footer";
import NavBar from "../nav-bar/navBar";
import { useNavigate } from "react-router-dom";

const BoardPage = () => {
  const navigate = useNavigate();
  const handleNavigateToPost = () => {
    navigate("/post");
  };
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar></NavBar>
      <div className="flex-grow">
        <div className="h-[80vh] w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">{/* Board 컨텐츠 */}</div>
      </div>
      <div>
        <button onClick={handleNavigateToPost} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
          밈 등록하기
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default BoardPage;
