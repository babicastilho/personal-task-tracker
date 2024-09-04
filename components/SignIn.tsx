// components/SignIn.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for router

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Use the router from next/navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Set the authToken in cookies
      document.cookie = `authToken=${data.token}; path=/; max-age=3600; SameSite=Lax`;

      // Redirect to /dashboard after successful login
      router.push('/dashboard'); // Ensure redirection to dashboard
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email:</label>
          <input
            id="email"
            type="email"
            className="p-2 border border-gray-300 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password:</label>
          <input
            id="password"
            type="password"
            className="p-2 border border-gray-300 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Don&#39;t have an account?{' '}
        <Link className="text-red-500" href="/register">
          Register here
        </Link>
      </p>
    </div>
  );
}
