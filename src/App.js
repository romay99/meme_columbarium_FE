import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import MemeBoardListPage from "./meme-board-page/MemeBoardListPage";
import MemePostPage from "./meme-board-page/MemePostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meme" element={<MemeBoardListPage />} />
        <Route path="/meme/post" element={<MemePostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
