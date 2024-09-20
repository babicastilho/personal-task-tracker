import React, { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import { Spinner } from "@/components/Loading";
import Image from "next/image";
import { fetchProfile } from "@/lib/user"; // Import the fetchProfile function
import { apiFetch } from "@/lib/apiFetch"; // Import apiFetch to fetch dashboard data

const Dashboard = () => {
  const [user, setUser] = useState<{
    username: string;
    preferredNameOption?: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    profilePicture?: string;
  } | null>(null); // Include preferredNameOption and profilePicture in user state

  const [dashboardData, setDashboardData] = useState<{
    tasksCompleted: number;
    tasksPending: number;
    dueToday: number;
    unreadMessages: number;
  } | null>(null); // State to store dashboard data

  const [loading, setLoading] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

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

    const fetchDashboardData = async () => {
      try {
        const data = await apiFetch("/api/dashboard", {
          method: "GET",
        });
        if (data && data.success) {
          setDashboardData(data.dashboard);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchUser();
    fetchDashboardData();

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

  if (loading || loadingDashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -my-24">
        <Spinner />
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <p>User or dashboard data not found.</p>
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
            <span className="font-bold text-gray-500">?</span>
          </div>
        )}
        <div className="flex-col items-center mx-5">
          {/* Preferred name or username */}
          <h2 className="text-lg font-bold" data-cy="welcome-message">
            Welcome, <span data-cy="preferred-name">{getPreferredName()}</span>!
          </h2>

          {/* Display current date and time */}
          <h3 className="text-base font-medium" data-cy="current-datetime">
            {currentDateTime}
          </h3>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2" data-cy="dashboard-status">Your Stats</h3>
        <ul>
          <li>Tasks Completed: {dashboardData.tasksCompleted}</li>
          <li>Tasks Pending: {dashboardData.tasksPending}</li>
          <li>Tasks Due Today: {dashboardData.dueToday}</li>
          <li>Unread Messages: {dashboardData.unreadMessages}</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Your Calendar</h3>
        <Calendar />
      </div>
    </>
  );
};

export default Dashboard;
