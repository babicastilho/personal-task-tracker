/**
 * UserProfileMenu.tsx
 * 
 * A user profile menu component with options for viewing the profile and logging out.
 * - Displays user's preferred name and profile picture from the context.
 * - Uses outside click detection to close the menu when clicking outside.
 * 
 * @component
 * @param {function} onLogout - Callback function to handle logout action.
 * 
 * @returns A dropdown menu component accessible from the profile icon.
 */

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaPowerOff } from "react-icons/fa";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useUserProfile } from "@/context/UserProfileProvider";

const UserProfileMenu: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { user, getPreferredName } = useUserProfile(); // Obtemos o usuário e o nome preferido do contexto
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setMenuOpen(false));

  if (!user) {
    return null; // Não renderiza o menu se o usuário não está carregado
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center"
      >
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="User Profile Picture"
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-500">?</span>
          </div>
        )}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg p-2 z-10"
        >
          <div className="text-gray-900 dark:text-white px-4 pt-1">
            {getPreferredName()} {/* Mostra o nome preferido */}
          </div>
          <div className="text-gray-600 dark:text-gray-400 px-4 pb-1 text-sm">
            {user.username} {/* Exibe o username */}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

          <Link
            href="/profile"
            className="flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
            onClick={() => setMenuOpen(false)}
          >
            <FaUser className="w-5 h-5 mr-2" />
            Profile
          </Link>

          <button
            onClick={() => {
              onLogout();
              setMenuOpen(false);
            }}
            className="w-full flex items-center p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
          >
            <FaPowerOff className="w-5 h-5 mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
