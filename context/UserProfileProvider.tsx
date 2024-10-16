// context/UserProfileProvider.tsx
/**
 * UserProfileProvider.tsx
 * Context provider to manage and access the user's profile information globally.
 *
 * This context fetches the user profile only if a valid token is present, avoiding
 * unnecessary fetch attempts if the user is not authenticated. It also provides
 * helper functions to refresh the profile and get the user's preferred name.
 *
 * @returns Provides user profile data, loading state, and utility functions across the app.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchProfile } from "@/lib/user";
import { getToken } from "@/lib/tokenUtils"; // Import function to retrieve token from storage

// Define UserProfile type to structure user data
interface UserProfile {
  username: string;
  preferredNameOption?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  profilePicture?: string;
}

// Define context properties for easier consumption in components
interface UserProfileContextProps {
  user: UserProfile | null;
  loadingProfile: boolean;
  refreshUserProfile: () => Promise<void>;
  getPreferredName: () => string;
}

// Create the UserProfileContext with an undefined initial value
const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined
);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /**
   * Function to fetch and update the user profile.
   *
   * Checks if a valid token is available. If no token is found, it skips the fetch
   * and sets the user as logged out (user = null). If a token exists, it attempts
   * to fetch the profile data. Errors during the fetch are caught and handled.
   */
  const refreshUserProfile = async () => {
    setLoadingProfile(true);

    const token = getToken(); // Retrieve the token from storage (localStorage, session, etc.)

    if (!token) {
      console.warn("No token found, skipping profile fetch.");
      setLoadingProfile(false);
      setUser(null); // Set user to null to reflect the logged-out state
      return;
    }

    try {
      const data = await fetchProfile(); // Attempt to fetch profile data
      if (data && data.profile) {
        setUser(data.profile); // Update user state with fetched profile
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null); // Set user to null on fetch failure to handle session expiration
    } finally {
      setLoadingProfile(false); // Set loading state to false once fetch is complete
    }
  };

  // useEffect to load profile data when the provider mounts
  useEffect(() => {
    refreshUserProfile();
  }, []);

  /**
   * Function to get the user's preferred name based on their profile settings.
   *
   * Depending on the user's choice, it returns the preferred name option.
   * If no user is logged in, it returns an empty string.
   */
  const getPreferredName = () => {
    if (!user) return "";
    // console.log("Preferred Name Option:", user.preferredNameOption);
    // console.log("First Name:", user.firstName);
    // console.log("Last Name:", user.lastName);
    // console.log("Nickname:", user.nickname);
    switch (user.preferredNameOption) {
      case "firstName":
        return user.firstName || user.username;
      case "lastName":
        return user.lastName || user.username;
      case "nickname":
        return user.nickname || user.username; // Fallback to username if nickname is empty
      case "fullName":
        return (
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.username
        );
      case "username":
      default:
        return user.username;
    }
  };

  // Provide user profile data, loading state, and utility functions
  return (
    <UserProfileContext.Provider
      value={{ user, loadingProfile, refreshUserProfile, getPreferredName }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to consume the UserProfileContext
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
