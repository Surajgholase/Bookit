import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center space-x-2">
    <span className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full font-bold text-lg">
      HD
    </span>
    <span className="font-semibold text-xl text-gray-800">highway delite</span>
  </Link>
);

const Header = () => {
  return (
    <nav className="bg-white shadow-sm w-full border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
        <Logo />
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search experiences"
            className="px-4 py-2 w-72 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
          <button className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors text-sm">
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
