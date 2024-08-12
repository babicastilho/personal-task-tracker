import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import { logout } from '@/lib/auth';

const Dashboard = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
        if (token) {
          const response = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <p>Loading...</p>
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
      <h2 className="text-lg font-bold mb-4">Welcome, {user.username}</h2>
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Your Calendar</h3>
        <Calendar />
      </div>
    </>
  );
};

export default Dashboard;
