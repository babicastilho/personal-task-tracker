'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import next/router for navigation
import Dashboard from '@/components/Dashboard'; // Import your existing Dashboard component
import { checkAuth } from '@/lib/auth'; // Import authentication check function

/**
 * Dashboard Page that reuses the Dashboard component.
 * Protects the route to make sure only authenticated users can access it.
 */
const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth(); // Check if user is authenticated
      if (!isAuthenticated) {
        // Redirect to login page if token expired or invalid
        router.push('/login?session=expired'); // Show message about session expiration
      }
    };

    verifyAuth(); // Call authentication check on component mount
  }, [router]);

  return (
    <div className="p-4">
      <Dashboard /> {/* Render the existing Dashboard component */}
    </div>
  );
};

export default DashboardPage;
