/**
 * RegisterForm.tsx
 *
 * Form component for user registration, allowing users to create an account by providing
 * required information (username, email, and password) and optional fields (first name,
 * last name, and nickname). Handles automatic login after successful registration.
 *
 * @component
 * @returns A form for user registration with validation, error handling, and auto-login features.
 */

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const router = useRouter();

  // States for user input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");

  // States for feedback messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !email || !password) {
      setError(
        "Please fill out the required fields (username, email, and password)"
      );
      return;
    }

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          firstName,
          lastName,
          nickname,
        }),
      });
      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Failed to register");
      }

      setSuccess("User registered successfully");
      await handleAutoLogin();
    } catch (err) {
      setError((err as Error).message || "Error registering user");
    }
  };

  // Automatically log in the user after successful registration
  const handleAutoLogin = async () => {
    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Failed to login automatically");
      }

      document.cookie = `authToken=${loginData.token}; path=/; max-age=3600; SameSite=Lax`;
      localStorage.setItem("token", loginData.token);

      if (isMounted) {
        window.location.reload();
      }
    } catch (err) {
      setError((err as Error).message || "Failed to login automatically");
    }
  };

  // Reset form fields
  const handleReset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setNickname("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="m-4 p-4 bg-white text-black shadow-lg rounded-lg text-sm lg:text-base">
        <h2 className="text-lg font-bold mb-4">Register Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-2 lg:space-x-4">
            <div className="relative flex flex-col w-1/2 space-y-2">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
                required
              />
              <label
                htmlFor="email"
                className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
              >
                Email
              </label>
            </div>
            <div className="relative flex flex-col w-1/2 space-y-2">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
                required
              />
              <label
                htmlFor="password"
                className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
              >
                Password
              </label>
            </div>
          </div>

          <div className="relative flex flex-col w-full space-y-2">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
              required
            />
            <label
              htmlFor="userName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              Username
            </label>
          </div>

          <div className="flex space-x-2 lg:space-x-4">
            <div className="relative flex flex-col w-1/2 space-y-2">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder=" "
                className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
              />
              <label
                htmlFor="firstName"
                className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
              >
                First Name (optional)
              </label>
            </div>
            <div className="relative flex flex-col w-1/2 space-y-2">
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=" "
                className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
              />
              <label
                htmlFor="lastName"
                className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
              >
                Last Name (optional)
              </label>
            </div>
          </div>
          <div className="relative flex flex-col w-full space-y-2">
            <input
              type="text"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder=" "
              className="z-5 p-3 border border-gray-300 rounded w-full peer bg-transparent focus:outline-none"
            />
            <label
              htmlFor="userName"
              className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 origin-[0] left-2 z-10 bg-gray-50  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
            >
              Nickname (optional)
            </label>
          </div>

          {/* Error and Success Messages below buttons */}
          <div className="flex space-x-2 lg:space-x-4">
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
    </div>
  );
};

export default RegisterForm;
