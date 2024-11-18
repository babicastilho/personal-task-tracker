/**
 * ProfilePage.tsx
 *
 * Page for managing and editing the user's profile information.
 *
 * Features:
 * - Fetches and displays profile information for authenticated users, including fields for first name, last name, nickname, and bio.
 * - Provides functionality to upload and preview a profile picture.
 * - Handles profile updates through an API, with status and error messages displayed to the user.
 * - Protects the page to ensure it’s only accessible to authenticated users.
 *
 * @returns A form that allows the user to view and update their profile information.
 *
 * Dependencies:
 * - `useProtectedPage`: Custom hook for handling authentication.
 * - `useUserProfile`: Context hook for managing global profile data.
 * - `Dropdown`: Component to select the preferred name option.
 */

"use client";
import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "@/lib/user"; // API functions for fetching and updating profile
import Image from "next/image"; // Next.js Image component for optimized images
import { Spinner } from "@/components/Loading"; // Loading spinner component
import { useProtectedPage } from "@/hooks/useProtectedPage"; // Custom hook to handle protected pages
import { useUserProfile } from "@/context/UserProfileProvider";
import Dropdown from "@/components/common/Dropdown";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useProtectedPage(); // Access authentication state (isAuthenticated, loading)
  const { refreshUserProfile } = useUserProfile();

  // State to manage profile data
  const [profile, setProfile] = useState({
    _id: "",
    username: "",
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    profilePicture: "",
    preferredNameOption: "username",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to manage profile picture preview
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // Status message for profile update
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for profile fetch or update

  useEffect(() => {
    // Function to fetch profile data from the API
    const getProfile = async () => {
      try {
        const data = await fetchProfile(); // Fetch profile data
        const { profile: fetchedProfile } = data;
        // Update state with the fetched profile data
        setProfile({
          _id: fetchedProfile._id || "",
          username: fetchedProfile.username || "",
          firstName: fetchedProfile.firstName || "",
          lastName: fetchedProfile.lastName || "",
          nickname: fetchedProfile.nickname || "",
          bio: fetchedProfile.bio || "",
          profilePicture: fetchedProfile.profilePicture || "",
          preferredNameOption: fetchedProfile.preferredNameOption || "username",
        });

        // If a profile picture exists, set the preview
        if (fetchedProfile.profilePicture) {
          setImagePreview(fetchedProfile.profilePicture);
        }
      } catch (error) {
        setErrorMessage("Failed to load profile. Please try again."); // Handle profile fetch error
      }
    };

    if (isAuthenticated) {
      getProfile(); // Fetch profile only if the user is authenticated
    }
  }, [isAuthenticated]); // Run effect when authentication state changes

  // Render a spinner while checking authentication state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -my-20 p-4">
        <Spinner /> {/* Show loading spinner */}
      </div>
    );
  }

  // Return null if the user is not authenticated (handled by the useProtectedPage hook)
  if (!isAuthenticated) {
    return null;
  }

  // Handle form submission for profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form behavior
    setStatusMessage(null); // Clear any previous status messages
    setErrorMessage(null); // Clear any previous error messages

    try {
      // Make API request to update the profile
      const response = await updateProfile(profile);
      if (response.success) {
        setStatusMessage(t("profile.update_success")); // Show success message
        await refreshUserProfile(); // Refresh user profile context after update
      } else {
        setErrorMessage(t("profile.update_failure")); // Show failure message
      }
    } catch (error) {
      setErrorMessage(t("profile.update_error")); // Handle API request error
    }
  };
  
   // Handle dropdown selection for the preferred name
   const handleDropdownSelect = (value: string) => {
    setProfile((prevProfile) => ({ ...prevProfile, preferredNameOption: value })); // Update the selected option
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));

    // Certifique-se de limpar mensagens ao alterar o valor
    setStatusMessage(null);
    setErrorMessage(null);
  };

  // Handle file input changes for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set the profile picture preview
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result as string,
        })); // Update profile picture
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Render the profile form and related fields
  return (
    <div className="mt-24 p-8 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4">{t("profile.edit")}</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-cy="edit-profile"
      >
        {/* Profile Picture */}
        <div className="space-y-4">
          <label className="block mb-1 font-bold">{t("profile.picture")}</label>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="User Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="font-bold text-gray-500">?</span>{" "}
                {/* Default profile picture */}
              </div>
            )}
            <input type="file" onChange={handleFileChange} />{" "}
            {/* File input for profile picture */}
          </div>
        </div>
        <hr />
        {/* Username and Preferred Name fields */}
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          {/* Username (read-only) */}
          <div className="relative flex flex-col w-full md:w-1/2 mb-4 md:mb-0 space-y-2">
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username} // Display the username
              readOnly
              placeholder=" "
              className="p-3 text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600 rounded w-full bg-transparent cursor-not-allowed peer focus:outline-none"
            />
            <label
              htmlFor="username"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              {t("profile.username")}
            </label>
          </div>

          {/* Preferred Name Option */}
          <div className="relative flex flex-col w-full md:w-1/2 space-y-2 z-40">
          <Dropdown
            testIdPrefix="preferred-name-option"
            options={["username", "firstName", "lastName", "nickname", "fullName"]}
            selectedValue={profile.preferredNameOption}
            onSelect={handleDropdownSelect} // Updates the selected value
            bordered={true}
            data-cy="dropdown-preferred-name"
            data-testid="dropdown-preferred-name"
          />
            
            <label
              htmlFor="preferredNameOption"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              {t("profile.preferred_name")}
            </label>
          </div>
        </div>

        {/* First Name and Last Name */}
        <div className="flex space-x-4">
          <div className="relative flex flex-col w-1/2 space-y-2">
            <input
              type="text"
              name="firstName"
              value={profile.firstName} // Display first name
              onChange={handleChange} // Handle input changes
              placeholder=" "
              className="p-3 w-full peer bg-transparent 
              border border-gray-300 dark:border-gray-600 rounded 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              data-cy="first-name-input"
              data-testid="first-name-input"
            />
            <label
              htmlFor="firstName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              {t("profile.first_name")}
            </label>
          </div>

          <div className="relative flex flex-col w-1/2 space-y-2">
            <input
              type="text"
              name="lastName"
              value={profile.lastName} // Display last name
              onChange={handleChange}
              placeholder=" "
              className="p-3 w-full peer bg-transparent 
              border border-gray-300 dark:border-gray-600 rounded 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              data-cy="last-name-input"
            />
            <label
              htmlFor="lastName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              {t("profile.last_name")}
            </label>
          </div>
        </div>

        {/* Nickname */}
        <div className="relative flex flex-col space-y-2">
          <input
            type="text"
            name="nickname"
            value={profile.nickname} // Display nickname
            onChange={handleChange}
            placeholder=" "
            className="p-3 w-full peer bg-transparent 
              border border-gray-300 dark:border-gray-600 rounded 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            data-cy="nickname-input"
          />
          <label
            htmlFor="nickname"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
          >
            {t("profile.nickname")}
          </label>
        </div>

        {/* Bio */}
        <div className="relative flex flex-col space-y-2">
          <textarea
            name="bio"
            value={profile.bio} // Display bio
            onChange={handleChange}
            placeholder=" "
            className="p-3 w-full peer bg-transparent 
              border border-gray-300 dark:border-gray-600 rounded 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            maxLength={500}
            data-cy="bio-textarea"
          ></textarea>
          <label
            htmlFor="bio"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
          >
            {t("profile.biography")}
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          data-cy="save-profile"
        >
          {t("profile.save")}
        </button>

        {/* Display status or error messages */}
        {statusMessage && (
          <p className="text-green-500" data-cy="status-message">
            {statusMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500" data-cy="error-message">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
