"use client";

import { signUp } from "../lib/auth";

export default function SignUpPage() {
  const handleSignUp = async () => {
    try {
      await signUp("test@gmail.com", "password123");

      alert("Account created!");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleSignUp}>Sign Up</button>;
}
