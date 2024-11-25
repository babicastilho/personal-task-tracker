import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaTasks, FaUser, FaPowerOff, FaBookmark, FaChevronDown, FaChevronUp, FaSun } from 'react-icons/fa';
import { BsFillMoonStarsFill } from "react-icons/bs";
import Title from '@/components/layout/Title';
import { logoutAndRedirect } from '@/lib/auth';
import { useRouterContext } from "@/context/RouterContext";

interface SidebarProps {
  isOpen: boolean;
  handleClose: () => void;
  toggleTheme: () => void;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleClose, toggleTheme, theme }) => {
  const { t } = useTranslation();
  const { currentPath } = useRouterContext();
  const [isTasksViewOpen, setIsTasksViewOpen] = useState(false);

  useEffect(() => {
    if (['/tasks/board', '/tasks/list', '/tasks/calendar', '/tasks'].includes(currentPath)) {
      setIsTasksViewOpen(true);
    } else {
      setIsTasksViewOpen(false);
    }
  }, [currentPath]);

  const isActive = (path: string) => currentPath === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-200 dark:bg-gray-900 p-4 z-30 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <Title mainText="personal" subText="tasks tracker" />
      <hr className="my-6 border-gray-400" />

      <nav>
        <ul className="mt-8 space-y-4">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded ${isActive('/dashboard') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
              onClick={handleClose}
              data-cy="sidebar-dashboard"
              data-testid="sidebar-dashboard"
            >
              <FaCalendarAlt className="w-5 h-5 mr-2" />
              {t('sidebar.dashboard')}
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className={`flex items-center p-2 rounded ${isActive('/categories') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
              onClick={handleClose}
              data-cy="sidebar-categories"
              data-testid="sidebar-categories"
            >
              <FaBookmark className="w-5 h-5 mr-2" />
              {t('sidebar.categories')}
            </Link>
          </li>
          <li>
            <div
              className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => setIsTasksViewOpen(!isTasksViewOpen)}
              data-cy="sidebar-view-tasks"
              data-testid="sidebar-view-tasks"
            >
              <FaTasks className="w-5 h-5 mr-2" />
              {t('sidebar.viewTasks')}
              {isTasksViewOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isTasksViewOpen ? 'text-sm max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}
              data-cy="sidebar-tasks-options"
              data-testid="sidebar-tasks-options"
            >
              <ul className="mt-2 pl-6 space-y-2">
                <li>
                  <Link
                    href="/tasks/board"
                    className={`block p-2 rounded ${isActive('/tasks/board') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                    onClick={handleClose}
                    data-cy="sidebar-tasks-board"
                    data-testid="sidebar-tasks-board"
                  >
                    {t('sidebar.tasks.board')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks/list"
                    className={`block p-2 rounded ${isActive('/tasks/list') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                    onClick={handleClose}
                    data-cy="sidebar-tasks-list"
                    data-testid="sidebar-tasks-list"
                  >
                    {t('sidebar.tasks.list')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks/calendar"
                    className={`block p-2 rounded ${isActive('/tasks/calendar') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                    onClick={handleClose}
                    data-cy="sidebar-tasks-calendar"
                    data-testid="sidebar-tasks-calendar"
                  >
                    {t('sidebar.tasks.calendar')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    className={`block p-2 rounded ${isActive('/tasks') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                    onClick={handleClose}
                    data-cy="sidebar-tasks-cards"
                    data-testid="sidebar-tasks-cards"
                  >
                    {t('sidebar.tasks.cards')}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link
              href="/profile"
              className={`flex items-center p-2 rounded ${isActive('/profile') ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
              onClick={handleClose}
              data-cy="sidebar-profile"
              data-testid="sidebar-profile"
            >
              <FaUser className="w-5 h-5 mr-2" />
              {t('sidebar.profile')}
            </Link>
          </li>
        </ul>
        <hr className="my-4 border-gray-400" />
        <div className="mt-6 space-y-4 lg:hidden">
          <button
            onClick={() => { toggleTheme(); handleClose(); }}
            className="w-full flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
            data-cy="toggle-theme"
            data-testid="toggle-theme"
          >
            {theme === 'light' ? <FaSun className="w-5 h-5 mr-2" /> : <BsFillMoonStarsFill className="w-5 h-5 mr-2" />}
            {t(`sidebar.themeMode.${theme}`)}
          </button>
          <button
            onClick={() => { logoutAndRedirect(); handleClose(); }}
            className="w-full flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
            data-cy="logout-button"
            data-testid="logout-button"
          >
            <FaPowerOff className="w-5 h-5 mr-2" />
            {t('sidebar.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
