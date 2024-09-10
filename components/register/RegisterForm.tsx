'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // First name (optional)
  const [lastName, setLastName] = useState('');  // Last name (optional)
  const [nickname, setNickname] = useState('');  // Nickname (optional)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter(); // useRouter hook for navigation

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (!username || !email || !password) {
      setError('Please fill out the required fields (username, email, and password)');
      return;
    }
  
    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstName, lastName, nickname }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
  
      // Show success message
      setSuccess('User registered successfully');
  
      // Automatically log the user in after registration
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Use email and password for login
      });
  
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Failed to login automatically');
      }
  
      // Save the token in the cookie
      document.cookie = `authToken=${loginData.token}; path=/; max-age=3600; SameSite=Lax`; // Store token in cookie

      // Save the token in localStorage as well
      localStorage.setItem('token', loginData.token); // Store token in localStorage
  
      // Force reload the page to ensure authentication state is updated
      window.location.reload(); // Reload the page to refresh authentication state
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error registering user');
      } else {
        setError('Error registering user');
      }
    }
  };

  // Handle reset button to clear form fields
  const handleReset = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setNickname('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name (optional)"
            className="p-2 border border-gray-300 rounded w-1/2"
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name (optional)"
            className="p-2 border border-gray-300 rounded w-1/2"
          />
        </div>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname (optional)"
          className="p-2 border border-gray-300 rounded w-full"
        />
        
        {/* Error and Success Messages below buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
          <button
            type="button"
            className="w-1/2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
