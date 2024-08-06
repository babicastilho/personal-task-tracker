// components/register/RegisterForm.tsx
'use client'
import { useState } from 'react';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !email || !password) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      localStorage.setItem('token', data.token);
      setSuccess('User registered successfully');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error registering user');
      } else {
        setError('Error registering user');
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-2">Username:</label>
          <input
            id="username"
            type="text"
            className="p-2 border border-gray-300 rounded w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
