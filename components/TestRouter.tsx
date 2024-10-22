"use client";

import { useRouter } from 'next/router';

const TestRouter = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/profile')}>Go to Profile</button>
  );
};

export default TestRouter;
