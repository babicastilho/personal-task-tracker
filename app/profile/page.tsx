"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // Custom hook to manage authentication state
import { fetchProfile, updateProfile } from "@/lib/user"; // API functions for getting and updating profile
import Image from "next/image";
import { Spinner } from "@/components/Loading";

const ProfilePage = () => {
  const { isAuthenticated, logout } = useAuth(); // Access authentication state and logout function
  const [loading, setLoading] = useState(true); // Loading state for profile data
  const [profile, setProfile] = useState({
    _id: "", // Unique identifier by default
    username: "", // Username (readonly)
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    profilePicture: "",
    preferredNameOption: "username", // Default to 'username' if no name is provided
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store image preview
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // To show success or error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  // Fetch user profile on component mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchProfile(); // Fetch profile data from API
        console.log("Fetched profile data:", data); // Log the fetched profile data for debugging

        // Access profile inside the returned object
        const { profile: fetchedProfile } = data;

        // Set the profile state with the fetched data or empty strings
        setProfile({
          _id: fetchedProfile._id || "",
          username: fetchedProfile.username || "", // Username (readonly)
          firstName: fetchedProfile.firstName || "", // Ensure it's never undefined
          lastName: fetchedProfile.lastName || "", // Ensure it's never undefined
          nickname: fetchedProfile.nickname || "", // Ensure it's never undefined
          bio: fetchedProfile.bio || "", // Ensure it's never undefined
          profilePicture: fetchedProfile.profilePicture || "", // Ensure it's never undefined
          preferredNameOption: fetchedProfile.preferredNameOption || "username", // Default to username
        });

        // Set the image preview if a profile picture exists
        if (fetchedProfile.profilePicture) {
          setImagePreview(fetchedProfile.profilePicture);
        }
      } catch (error) {
        setErrorMessage("Failed to load profile. Please try again.");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Stop loading after profile is fetched
      }
    };

    getProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    // Send updated profile data to the server
    try {
      const response = await updateProfile(profile); // Update profile API call

      if (response.success) {
        setStatusMessage("Profile updated successfully!"); // Show success message
        console.log("Profile updated successfully:", profile); // Log profile data for debugging
      } else {
        setErrorMessage("Failed to update profile."); // Show error message
      }
    } catch (error) {
      setErrorMessage("Error updating profile. Please try again."); // Show error message
      console.error("Error updating profile:", error);
    }
  };

  // Handle input changes for text fields, textareas, and select
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set image preview
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result as string,
        })); // Store image in profile
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -my-20 p-4">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username and Preferred Name fields side by side */}
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex flex-col w-full md:w-1/2 space-y-2">
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username} // Display the username
              readOnly
              placeholder=" "
              className="p-3 border border-gray-300 rounded w-full bg-transparent cursor-not-allowed peer focus:outline-none"
            />
            <label
              htmlFor="username"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
            >
              Username
            </label>
          </div>

          <div className="relative flex flex-col w-full md:w-1/2 space-y-2">
            <select
              name="preferredNameOption"
              value={profile.preferredNameOption} // Display the current preferred name option or default
              onChange={handleChange} // Updated handleChange function
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            >
              <option value="username">Username</option>
              <option value="name">First Name</option>
              <option value="surname">Last Name</option>
              <option value="nickname">Nickname</option>
              <option value="fullName">Full Name</option>
            </select>
            <label
              htmlFor="preferredNameOption"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
            >
              Preferred Name
            </label>
          </div>
        </div>

        {/* First Name and Last Name side by side */}
        <div className="flex space-x-4">
          <div className="relative flex flex-col w-1/2 space-y-2">
            <input
              type="text"
              name="firstName"
              value={profile.firstName} // Display the current first name or empty string
              onChange={handleChange}
              placeholder=" "
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            />
            <label
              htmlFor="firstName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
            >
              First Name
            </label>
          </div>

          <div className="relative flex flex-col w-1/2 space-y-2">
            <input
              type="text"
              name="lastName"
              value={profile.lastName} // Display the current last name or empty string
              onChange={handleChange}
              placeholder=" "
              className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            />
            <label
              htmlFor="lastName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
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
            value={profile.nickname} // Display the current nickname or empty string
            onChange={handleChange}
            placeholder=" "
            className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
          />
          <label
            htmlFor="nickname"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
          >
            Nickname
          </label>
        </div>

        {/* Bio */}
        <div className="relative flex flex-col space-y-2">
          <textarea
            name="bio"
            value={profile.bio} // Display the current bio or empty string
            onChange={handleChange}
            placeholder=" "
            className="p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            maxLength={500}
          ></textarea>
          <label
            htmlFor="bio"
            className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10
              bg-white dark:bg-slate-800           
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                peer-focus:scale-75 peer-focus:-translate-y-3
                peer-focus:bg-transparent"
          >
            Biography
          </label>
        </div>

        {/* Profile Picture */}
        <div className="relative flex flex-col space-y-2">
          <label className="block mb-1 font-bold">Profile Picture</label>
          <input type="file" onChange={handleFileChange} />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Profile Picture Preview"
              width={100}
              height={100}
              className="mt-2 rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
        {/* Display status message */}
        {statusMessage && <p className="text-green-500">{statusMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
