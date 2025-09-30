import React from 'react';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const MemeUpdateHistory = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;

  const { code } = useParams();
  const [res, setRes] = useState({ page: 1, totalPages: 1, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 데이터 fetch
  const fetchList = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${serverUrl}/meme/history?page=${page}&code=${code}`
      );
      setRes(response.data); // 서버에서 받아온 데이터로 세팅
      console.log(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 바뀔 때마다 fetch
  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();
  return (
    <div>
      <NavBar></NavBar>
      <Footer></Footer>
    </div>
  );
};

export default MemeUpdateHistory;
