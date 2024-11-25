"use client";
import React, { useState, useEffect } from "react";
import Calendar from "@/components/dashboard/Calendar";
import { Spinner } from "@/components/Loading";
import Image from "next/image";
import { apiFetch } from "@/lib/apiFetch";
import { useUserProfile } from "@/context/UserProfileProvider";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation(); // Hook for translations
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
        const data = await apiFetch("/api/dashboard", { method: "GET" });
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
        <p>{t("dashboard.error_no_data")}</p>
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
          <h2 className="text-lg font-bold" data-cy="welcome-message" data-testid="welcome-message">
            {t("dashboard.welcome", { name: getPreferredName() })}
          </h2>
          <h3 className="text-base font-medium" data-cy="current-datetime">
            {t("dashboard.current_datetime", { datetime: currentDateTime })}
          </h3>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2" data-cy="dashboard-status">
          {t("dashboard.stats_title")}
        </h3>
        <ul>
          <li>{t("dashboard.tasks_completed", { count: dashboardData.tasksCompleted })}</li>
          <li>{t("dashboard.tasks_pending", { count: dashboardData.tasksPending })}</li>
          <li>{t("dashboard.tasks_due_today", { count: dashboardData.dueToday })}</li>
          <li>{t("dashboard.unread_messages", { count: dashboardData.unreadMessages })}</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">
          {t("dashboard.calendar_title")}
        </h3>
        <Calendar />
      </div>
    </>
  );
};

export default Dashboard;
