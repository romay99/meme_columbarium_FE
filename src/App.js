import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import MemeBoardListPage from "./meme-board-page/MemeBoardListPage";
import PostPage from "./board-page/PostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meme" element={<MemeBoardListPage />} />
        <Route path="/meme/post" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
