// Sidebar.tsx

import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaTasks, FaUser, FaGithub, FaPowerOff, FaBookmark, FaSun, FaMoon } from 'react-icons/fa';
import { BsFillMoonStarsFill } from "react-icons/bs";
import Title from '@/components/Title';
import { logoutAndRedirect } from '@/lib/auth'; 

interface SidebarProps {
  isOpen: boolean;
  handleClose: () => void;
  toggleTheme: () => void;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  handleClose,
  toggleTheme,
  theme,
}) => {
  return (
    <aside
      className={`fixed lg:relative top-0 left-0 w-64 min-h-screen bg-gray-200 dark:bg-gray-900 p-4 z-30 lg:z-0 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <Title text="TO DO App" />
      <hr className="my-6 border-gray-400" />

      <nav>
        <ul className="mt-8 space-y-4">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" onClick={handleClose}>
              <FaCalendarAlt className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/categories" className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" onClick={handleClose}>
              <FaBookmark className="w-5 h-5 mr-2" />
              Categories
            </Link>
          </li>

          <li>
            <Link href="/tasks" className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" onClick={handleClose}>
              <FaTasks className="w-5 h-5 mr-2" />
              Tasks
            </Link>
          </li>

          <li>
            <Link href="/profile" className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" onClick={handleClose}>
              <FaUser className="w-5 h-5 mr-2" />
              Profile
            </Link>
          </li>
        </ul>
        <hr className="my-4 border-gray-400" />

        <div className="mt-6 space-y-4 lg:hidden">
          <button
            onClick={() => {
              toggleTheme();
              handleClose();
            }}
            className="w-full flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
          >
            {theme === 'light' ? (
              <FaSun className="w-5 h-5 mr-2" />
            ) : (
              <BsFillMoonStarsFill className="w-5 h-5 mr-2" />
            )}
            {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
          </button>

          {/* Logout button */}
          <button
            onClick={() => {
              logoutAndRedirect(); // Call the new function here
              handleClose(); // Close the sidebar
            }}
            className="w-full flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
          >
            <FaPowerOff className="w-5 h-5 mr-2" />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
