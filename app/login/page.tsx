'use client'

import React from 'react';
import SignIn from '@/components/SignIn'; // Reusing the existing SignIn component

/**
 * Login page that renders the SignIn component.
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignIn />
    </div>
  );
}
