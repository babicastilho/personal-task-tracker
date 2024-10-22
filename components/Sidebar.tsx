import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaTasks, FaUser, FaPowerOff, FaBookmark, FaChevronDown, FaChevronUp, FaSun } from 'react-icons/fa';
import { BsFillMoonStarsFill } from "react-icons/bs";
import Title from '@/components/Title';
import { logoutAndRedirect } from '@/lib/auth';
import { useRouterContext } from "@/context/RouterContext"; // Importa o contexto do router

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
  const { currentPath } = useRouterContext(); // Usa o currentPath do contexto
  const [isTasksViewOpen, setIsTasksViewOpen] = useState(false);

  useEffect(() => {
    console.log("Current Path from RouterContext:", currentPath); // Verifica o caminho atual
    // Abre a seção de "View Tasks" se o caminho atual for uma das páginas relacionadas às tasks
    if (
      currentPath === '/tasks/board' ||
      currentPath === '/tasks/list' ||
      currentPath === '/tasks/calendar' ||
      currentPath === '/tasks'
    ) {
      setIsTasksViewOpen(true);
    } else {
      setIsTasksViewOpen(false);
    }
  }, [currentPath]); // O efeito será executado sempre que currentPath mudar

  const isActive = (path: string) => currentPath === path;

  const toggleTasksView = () => {
    setIsTasksViewOpen(!isTasksViewOpen);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-200 dark:bg-gray-900 p-4 z-30 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <Title text="TO DO App" />
      <hr className="my-6 border-gray-400" />

      <nav>
        <ul className="mt-8 space-y-4">
          <li>
            <Link href="/dashboard" className={`flex items-center p-2 rounded ${isActive('/dashboard') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
              <FaCalendarAlt className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/categories" className={`flex items-center p-2 rounded ${isActive('/categories') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
              <FaBookmark className="w-5 h-5 mr-2" />
              Categories
            </Link>
          </li>

          {/* View Tasks Section */}
          <li>
            <div className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={toggleTasksView}>
              <FaTasks className="w-5 h-5 mr-2" />
              View Tasks
              {isTasksViewOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
            </div>

            {/* Slider for View Tasks Options with smooth animation */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isTasksViewOpen ? 'text-sm max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="mt-2 pl-6 space-y-2">
                <li>
                  <Link href="/tasks/board" className={`block p-2 rounded ${isActive('/tasks/board') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
                    Board
                  </Link>
                </li>
                <li>
                  <Link href="/tasks/list" className={`block p-2 rounded ${isActive('/tasks/list') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
                    List
                  </Link>
                </li>
                <li>
                  <Link href="/tasks/calendar" className={`block p-2 rounded ${isActive('/tasks/calendar') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className={`block p-2 rounded ${isActive('/tasks') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
                    Cards
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link href="/profile" className={`flex items-center p-2 rounded ${isActive('/profile') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`} onClick={handleClose}>
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
              logoutAndRedirect();
              handleClose();
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
