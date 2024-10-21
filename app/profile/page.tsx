"use client";
import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "@/lib/user"; // API functions for fetching and updating profile
import Image from "next/image"; // Next.js Image component for optimized images
import { Spinner } from "@/components/Loading"; // Loading spinner component
import { useProtectedPage } from "@/hooks/useProtectedPage"; // Custom hook to handle protected pages
import { useUserProfile } from "@/context/UserProfileProvider";

const ProfilePage = () => {
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

  // Handle profile form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setStatusMessage(null); // Clear previous status messages
    setErrorMessage(null); // Clear previous error messages

    try {
      const response = await updateProfile(profile); // Update profile via API
      if (response.success) {
        setStatusMessage("Profile updated successfully!"); // Show success message
        await refreshUserProfile(); // Atualiza o contexto após o sucesso
      } else {
        setErrorMessage("Failed to update profile."); // Show error message on failure
      }
    } catch (error) {
      setErrorMessage("Error updating profile. Please try again."); // Handle profile update error
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // Update the profile state based on form inputs
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
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
    <div className="p-8 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-cy="edit-profile"
      >
        {/* Profile Picture */}
        <div className="space-y-4">
          <label className="block mb-1 font-bold">Profile Picture</label>
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
              className="p-3 text-gray-400 dark:text-gray-600 border border-gray-300 rounded w-full bg-transparent cursor-not-allowed peer focus:outline-none"
            />
            <label
              htmlFor="username"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              Username
            </label>
          </div>

          {/* Preferred Name Option */}
          <div className="relative flex flex-col w-full md:w-1/2 space-y-2">
            <select
              name="preferredNameOption"
              value={profile.preferredNameOption} // Display the selected preferred name option
              onChange={handleChange} // Handle changes
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            >
              <option value="username">Username</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="nickname">Nickname</option>
              <option value="fullName">Full Name</option>
            </select>

            <label
              htmlFor="preferredNameOption"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              Preferred Name
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
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            />
            <label
              htmlFor="firstName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              First Name
            </label>
          </div>

          <div className="relative flex flex-col w-1/2 space-y-2">
            <input
              type="text"
              name="lastName"
              value={profile.lastName} // Display last name
              onChange={handleChange}
              placeholder=" "
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            />
            <label
              htmlFor="lastName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              Last Name
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
            className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
          />
          <label
            htmlFor="nickname"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
          >
            Nickname
          </label>
        </div>

        {/* Bio */}
        <div className="relative flex flex-col space-y-2">
          <textarea
            name="bio"
            value={profile.bio} // Display bio
            onChange={handleChange}
            placeholder=" "
            className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            maxLength={500}
          ></textarea>
          <label
            htmlFor="bio"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
          >
            Biography
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

        {/* Display status or error messages */}
        {statusMessage && <p className="text-green-500">{statusMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
