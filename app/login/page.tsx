"use client";

import { signIn } from "../lib/auth";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      await signIn("test@gmail.com", "password123");

      alert("Logged in!");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
