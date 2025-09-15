import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import MemeBoardListPage from "./meme-board-page/MemeBoardListPage";
import MemePostPage from "./meme-board-page/MemePostPage";
import MemeDetailPage from "./meme-board-page/MemeDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meme" element={<MemeBoardListPage />} />
        <Route path="/meme/post" element={<MemePostPage />} />
        <Route path="/meme/detail/:code" element={<MemeDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
