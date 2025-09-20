import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './main-page/MainPage';
import MemeBoardListPage from './meme-board-page/MemeBoardListPage';
import MemePostPage from './meme-board-page/MemePostPage';
import MemeDetailPage from './meme-board-page/MemeDetailPage';
import LoginPage from './auth-page/LoginPage';
import SignUpPage from './auth-page/SignUpPage';
import { MyPage } from './auth-page/MyPage';
import { IntroPage } from './intro-page/IntroPage';
import { BoardPage } from './board-page/BoardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meme" element={<MemeBoardListPage />} />
        <Route path="/meme/post" element={<MemePostPage />} />
        <Route path="/meme/detail/:code" element={<MemeDetailPage />} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<SignUpPage></SignUpPage>} />
        <Route path="/mypage" element={<MyPage></MyPage>}></Route>
        <Route path="/intro" element={<IntroPage />}></Route>
        <Route path="/board" element={<BoardPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
