import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import { logout } from '@/lib/auth';

const Dashboard = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
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
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2 className="text-lg font-bold mb-4">Welcome, {user.username}</h2>
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Your To-Do List</h3>
        <TodoList />
      </div>
    </>
  );
};

export default Dashboard;
