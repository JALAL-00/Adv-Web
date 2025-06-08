// src/app/reset-password/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read URL query parameters
  
  // Get the email from the URL, so we can display it to the user
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- Validation ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // --- Construct the payload to match your Postman test case ---
    const payload = {
      OTP: otp,
      password: password,
      // The backend might also need the email to identify the user.
      // If so, you would add it here:
      // email: email 
    };

    // TODO: Call your backend API POST /auth/reset-password with the payload
    console.log('Submitting payload to reset password:', payload);
    
    // Simulate a successful API call
    alert('Password has been reset successfully!');
    router.push('/login'); // Redirect to login page on success
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Reset Your Password</h2>
          
          <p className="text-center text-sm text-gray-500">
            A verification code has been sent to <span className="font-medium">{email || 'your email'}</span>.
          </p>

          {/* OTP Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Verification Code (OTP)</span>
            </label>
            <input
              type="text"
              placeholder="Enter the 6-digit code"
              className="input input-bordered"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
          
          {/* New Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm New Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Display Error Messages */}
          {error && (
            <div className="alert alert-error text-sm p-2">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control mt-2">
            <button type="submit" className="btn btn-primary btn-lg w-full">Reset Password</button>
          </div>

          <p className="text-center mt-2 text-sm">
            Didn't get a code?{' '}
            <Link href="/forgot-password" className="link link-primary">Resend</Link>
          </p>
        </form>
      </div>
    </div>
  );
}