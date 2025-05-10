
import React from "react";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-green-50">
      <header className="bg-white border-b border-green-100 py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-green-800 hover:text-green-700 transition-colors flex items-center">
              <span className="mr-2">💰</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                FinancialWise
              </span>
            </Link>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-[#2b2b2b] hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/budget" className="text-[#2b2b2b] hover:text-green-600 transition-colors">
                  Budget
                </Link>
              </li>
              <li>
                <Link to="/investments" className="text-[#2b2b2b] hover:text-green-600 transition-colors">
                  Investments
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-[#2b2b2b] hover:text-green-600 transition-colors">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/score" className="text-[#2b2b2b] hover:text-green-600 transition-colors">
                  Financial Score
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">{children}</main>
      <footer className="bg-white border-t border-green-100 py-2 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2025 FinancialWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
