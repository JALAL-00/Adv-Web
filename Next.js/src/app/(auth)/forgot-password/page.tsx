// src/app/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Step 1 - Call your backend API POST /auth/forgot-password with the email.
    // The backend should then send the OTP.
    console.log('Sending reset request for email:', email);

    // For now, we'll simulate a successful API call and redirect the user.
    // In a real app, you would only redirect on a successful response from the server.
    alert('A verification code has been sent to your email (simulation).');
    
    // Step 2 - Redirect to the reset-password page.
    // It's good practice to pass the email as a query parameter so the next page knows about it.
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Forgot Password</h2>
          <p className="text-center text-sm text-gray-500">
            Enter your email and we'll send you a code to reset your password.
          </p>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary btn-lg w-full">Send Verification Code</button>
          </div>

          <p className="text-center mt-4 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
