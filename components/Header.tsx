// Header.tsx

import React from "react";
import { FaGithub, FaMoon, FaSun, FaPowerOff } from "react-icons/fa";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import Title from "@/components/Title";
import { logoutAndRedirect } from "@/lib/auth"; // Use the new function

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
  isAuthenticated: boolean;
  handleMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  theme,
  isAuthenticated,
  handleMenuToggle,
  isMenuOpen,
}) => {
  const renderGitHubAndThemeToggle = () => (
    <>
      <button onClick={toggleTheme} className="p-2" data-cy="toggle-button">
        {theme === "light" ? (
          <FaSun className="w-6 h-6 text-yellow-500" />
        ) : (
          <FaMoon className="w-6 h-6 text-gray-300" />
        )}
      </button>

      <a href="https://github.com/babicastilho" target="_blank" className="p-2">
        <FaGithub className="w-6 h-6" />
      </a>
    </>
  );

  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-50">
      <Title text="TO DO App" />

      <div className="flex items-center space-x-4 justify-end flex-1">
        {!isAuthenticated && renderGitHubAndThemeToggle()}

        {isAuthenticated && (
          <div className="hidden lg:flex">
            {renderGitHubAndThemeToggle()}

            {/* Logout button */}
            <button
              onClick={logoutAndRedirect} // Use the new function here
              className="p-2"
            >
              <FaPowerOff className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="lg:hidden relative z-50">
          <button
            onClick={handleMenuToggle}
            className="p-2"
            data-cy="menu-toggle-button"
          >
            {isMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
