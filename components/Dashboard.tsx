import React, { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import { Spinner } from "@/components/Loading";
import Image from "next/image";
import { fetchProfile } from "@/lib/user"; // Import the fetchProfile function

const Dashboard = () => {
  const [user, setUser] = useState<{
    username: string;
    preferredNameOption?: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    profilePicture?: string;
  } | null>(null); // Include preferredNameOption and profilePicture in user state

  const [loading, setLoading] = useState(true);

  // State to store current date and time
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use the same fetchProfile function used in ProfilePage
        const data = await fetchProfile(); 
        setUser(data.profile); // Set user data from the fetched profile
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Update date and time every second
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("pt-BR"); // Format date as dd/mm/yyyy
      const formattedTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }); // Format time as hh:mm:ss
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Determine preferred name based on user's preferredNameOption
  const getPreferredName = () => {
    if (!user) return "";
    switch (user.preferredNameOption) {
      case "name":
        return user.firstName || user.username;
      case "surname":
        return user.lastName || user.username;
      case "nickname":
        return user.nickname || user.username;
      case "fullName":
        return `${user.firstName} ${user.lastName}`.trim() || user.username;
      default:
        return user.username;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -my-20 p-4">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center space-y-2 mb-4">
        {/* Profile picture, if available */}
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="User Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">?</span>
          </div>
        )}
        <div className="flex-col items-center mx-5">
        {/* Preferred name or username */}
        <h2 className="text-lg font-bold">Welcome, {getPreferredName()}!</h2>

        {/* Display current date and time */}
        <h3 className="text-base font-medium">{currentDateTime}</h3>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Your Calendar</h3>
        <Calendar />
      </div>
    </>
  );
};

export default Dashboard;
