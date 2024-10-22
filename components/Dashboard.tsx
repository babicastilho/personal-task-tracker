"use client"
import React, { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import { Spinner } from "@/components/Loading";
import Image from "next/image";
import { apiFetch } from "@/lib/apiFetch";
import { useUserProfile } from "@/context/UserProfileProvider";

const Dashboard = () => {
  const { user, loadingProfile, getPreferredName } = useUserProfile();
  const [dashboardData, setDashboardData] = useState<{
    tasksCompleted: number;
    tasksPending: number;
    dueToday: number;
    unreadMessages: number;
  } | null>(null);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
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

    fetchDashboardData();

    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("pt-BR");
      const formattedTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!user || loadingDashboard) {
    return (
      <div className="">
        <Spinner />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>User or dashboard data not found.</p>
      </div>
    );
  }


  return (
    <>
      <div className="flex flex-row items-center space-y-2 mb-4">
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
          <h2 className="text-lg font-bold" data-cy="welcome-message">
            Welcome, <span data-cy="preferred-name">{getPreferredName()}</span>!
          </h2>
          <h3 className="text-base font-medium" data-cy="current-datetime">
            {currentDateTime}
          </h3>
        </div>
      </div>

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
