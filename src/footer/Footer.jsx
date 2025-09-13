import React from "react";

function Footer() {
  return (
    <footer className="h-40 bg-gray-900 text-gray-100 flex flex-col items-end justify-end p-4 shadow-md">
      <img src="/assets/logo.png" className="w-40 h-20 object-cover mb-2" alt="로고" />
      <p className="font-GowunBatang">© 2025 밈 납골당</p>
      <p className="font-GowunBatang">CONTACT : romaydev@naver.com</p>
    </footer>
  );
}

export default Footer;
