import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // 돋보기 아이콘

const SearchBar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="flex w-7/12 border border-gray-300 rounded-full overflow-hidden shadow-sm">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress} placeholder={placeholder || "검색어를 입력하세요..."} className="flex-grow p-3 focus:outline-none text-lg" />
        <button onClick={() => onSearch(query)} className="bg-gray-500 text-white px-4 flex items-center justify-center hover:bg-slate-600 transition-colors duration-200">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
