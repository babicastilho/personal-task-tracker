// components/Header.tsx
import React from "react";
import { FaGithub, FaMoon, FaSun } from "react-icons/fa";
import { SignInButton } from "@clerk/nextjs";

interface HeaderProps {
  toggleTheme: () => void; 
  theme: string; 
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-10">
      <h1 className="text-4xl text-center flex-1">TO DO App</h1>
      <div className="flex items-center">
        <button onClick={toggleTheme}>
          {theme === "light" ? (
            <FaSun className="w-4 h-4" />
          ) : (
            <FaMoon className="w-4 h-4" />
          )}
        </button>
        <span className="mx-3">|</span>
        <a
          href="https://github.com/babicastilho"
          className="flex items-center"
          target="_blank"
        >
          <FaGithub className="w-4 h-4 " />
        </a>
        <span className="mx-3">|</span>
        <SignInButton />
      </div>
    </header>
  );
};

export default Header;
