import React from 'react';
import { FaGithub, FaMoon, FaPowerOff, FaSun } from 'react-icons/fa';
import { HiMenu, HiOutlineX } from 'react-icons/hi';
import Title from '@/components/Title';

// Define the props for the Header component, including the logout function
interface HeaderProps {
  toggleTheme: () => void;  // Function to toggle between themes
  theme: string;            // Current theme ('light' or 'dark')
  isAuthenticated: boolean; // User authentication status
  handleMenuToggle: () => void; // Function to toggle the mobile menu
  isMenuOpen: boolean;      // State for whether the mobile menu is open
  logout: () => void;       // Logout function
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  theme,
  isAuthenticated,
  handleMenuToggle,
  isMenuOpen,
  logout
}) => {
  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-50">
      {/* App title */}
      <Title text="TO DO App" />
      
      {/* Mobile menu toggle button */}
      <div className="lg:hidden relative z-50">
        <button
          onClick={handleMenuToggle}
          className="p-2"
          data-cy="menu-toggle-button"
        >
          {/* Show the menu icon or close icon based on whether the menu is open */}
          {isMenuOpen ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Header actions (theme toggle, GitHub link, logout button) */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Theme toggle button */}
        <button onClick={toggleTheme} className="p-2">
          {theme === "light" ? (
            <FaSun className="w-6 h-6 text-yellow-500" />
          ) : (
            <FaMoon className="w-6 h-6 text-gray-300" />
          )}
        </button>

        {/* Link to GitHub repository */}
        <a href="https://github.com/babicastilho" target="_blank" className="p-2">
          <FaGithub className="w-6 h-6" />
        </a>

        {/* Show the logout button if the user is authenticated */}
        {isAuthenticated && (
          <button
            onClick={() => {
              logout(); // Call the logout function to remove the token
              window.location.href = '/login'; // Redirect to login page after logout
            }}
            className="p-2"
          >
            <FaPowerOff className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
