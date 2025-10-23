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
import { BoardListPage } from './board-page/BoardListPage';
import BoardPostPage from './board-page/BoardPostPage';
import BoardDetailPage from './board-page/BoardDetailPage';
import BoardUpdatePage from './board-page/BoardUpdatePage';
import MemeUpdatePage from './meme-board-page/MemeUpdatePage';
import MemeUpdateHistory from './meme-board-page/MemeUpdateHistory';
import { ThemeProvider } from './dark-mode/ThemeContext';
import usePageTracking from './api/usePageTracking';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <PageTrackingWrapper /> {/* Router 안에서 호출되도록 */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/meme" element={<MemeBoardListPage />} />
          <Route path="/meme/post" element={<MemePostPage />} />
          <Route path="/meme/detail/:code" element={<MemeDetailPage />} />
          <Route path="/login" element={<LoginPage></LoginPage>} />
          <Route path="/signup" element={<SignUpPage></SignUpPage>} />
          <Route path="/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/intro" element={<IntroPage />}></Route>
          <Route path="/board" element={<BoardListPage />}></Route>
          <Route path="/board/post" element={<BoardPostPage />} />
          <Route path="/board/detail/:code" element={<BoardDetailPage />} />
          <Route path="/board/update/:code" element={<BoardUpdatePage />} />
          <Route path="/meme/update/:code" element={<MemeUpdatePage />} />
          <Route
            path="/meme/update-history/:code"
            element={<MemeUpdateHistory />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Router 안에서 페이지 트래킹 훅 호출
function PageTrackingWrapper() {
  usePageTracking();
  return null; // UI 렌더링 없음
}

export default App;
