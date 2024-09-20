import React from "react";
import { FaGithub, FaMoon, FaSun, FaPowerOff } from "react-icons/fa";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { logout } from "@/lib/auth";
import Title from "@/components/Title";

interface HeaderProps {
  toggleTheme: () => void; // Function to toggle between themes
  theme: string; // Current theme ('light' or 'dark')
  isAuthenticated: boolean; // User authentication status
  handleMenuToggle: () => void; // Function to toggle the mobile menu
  isMenuOpen: boolean; // State for whether the mobile menu is open
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  theme,
  isAuthenticated,
  handleMenuToggle,
  isMenuOpen,
}) => {
  // Function to render GitHub and theme toggle buttons
  const renderGitHubAndThemeToggle = () => (
    <>
      {/* Theme toggle button */}
      <button onClick={toggleTheme} className="p-2" data-cy="toggle-button">
        {theme === "light" ? (
          <FaSun className="w-6 h-6 text-yellow-500" />
        ) : (
          <FaMoon className="w-6 h-6 text-gray-300" />
        )}
      </button>

      {/* GitHub link */}
      <a href="https://github.com/babicastilho" target="_blank" className="p-2">
        <FaGithub className="w-6 h-6" />
      </a>
    </>
  );

  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-50">
      {/* App title (Always visible) */}
      <Title text="TO DO App" />

      {/* Actions for all screen sizes */}
      <div className="flex items-center space-x-4 justify-end flex-1">
        {/* Show GitHub and theme toggle when not authenticated */}
        {!isAuthenticated && renderGitHubAndThemeToggle()}

        {/* Mobile menu toggle button (only for authenticated users on smaller screens) */}
        {isAuthenticated && (
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
        )}

        {/* Logout button, GitHub, and theme toggle (only for authenticated users on larger screens) */}
        {isAuthenticated && (
          <div className="hidden lg:flex">
            {renderGitHubAndThemeToggle()}

            <button
              onClick={() => {
                logout(); // Call the logout function to remove the token
              }}
              className="p-2"
            >
              <FaPowerOff className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
