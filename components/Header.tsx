import React from "react";
import { FaGithub, FaMoon, FaSun, FaPowerOff } from "react-icons/fa";
import { logout } from "@/lib/auth";

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
  isAuthenticated: boolean; // New property
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme, isAuthenticated }) => {
  // Function to handle logout and refresh the page
  const handleLogout = () => {
    logout();
    window.location.reload(); // Reloads the page
  };

  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-10">
      <h1 className="text-4xl text-center flex-1">TO DO App</h1>
      <div className="flex items-center">
        <button onClick={toggleTheme} className="toggle-button p-2">
          {theme === "light" ? (
            <FaSun className="w-6 h-6 text-yellow-500" />
          ) : (
            <FaMoon className="w-6 h-6 text-gray-300" />
          )}
        </button>
        <span className="mx-3">|</span>
        <a
          href="https://github.com/babicastilho"
          className="flex items-center"
          target="_blank"
        >
          <FaGithub className="w-6 h-6" />
        </a>
        {isAuthenticated && (
          <>
            <span className="mx-3">|</span>
            <button onClick={handleLogout} className="flex items-center">
              <FaPowerOff className="w-6 h-6 text-red-500" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
