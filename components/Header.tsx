// Header.tsx

import React, { useEffect, useState } from "react";
import { FaSun, FaPowerOff } from "react-icons/fa";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { BsFillMoonStarsFill } from "react-icons/bs";
import Title from "@/components/Title";
import { logoutAndRedirect } from "@/lib/auth";
import { fetchProfile } from "@/lib/user";
import UserProfileMenu from "@/components/UserProfileMenu";

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
          <BsFillMoonStarsFill className="w-6 h-6 text-gray-300" />
        )}
      </button>
    </>
  );

  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    preferredNameOption: string;
    profilePicture?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) { // Execute fetch only if user is authenticated
      const fetchUser = async () => {
        try {
          const data = await fetchProfile(); // Fetch user profile data
          setUser(data.profile); // Set user profile data in state
        } catch (error) {
          console.error("Failed to fetch user:", error); // Log any errors that occur during fetch
        }
      };
  
      fetchUser(); // Call the fetch function to retrieve user data
    }
  }, [isAuthenticated]); // Add isAuthenticated as a dependency to rerun effect on authentication change

  return (
    <header className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 fixed top-0 w-full flex justify-between items-center z-50">
      <Title text="TO DO App" />

      <div className="flex items-center space-x-4 justify-end flex-1">
        {!isAuthenticated && renderGitHubAndThemeToggle()}

        {isAuthenticated && (
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {renderGitHubAndThemeToggle()}

            {user && (
              <UserProfileMenu onLogout={logoutAndRedirect} />
            )}
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
