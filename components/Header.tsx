
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-magic text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ClipClean AI
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Tools</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Batch</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">API</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Pricing</a>
          </nav>
          <div>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-md">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
