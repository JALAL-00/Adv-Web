// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle login logic with API
    console.log({ email, password });
    alert('Login Submitted (check console)');
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Login</h2>
          
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
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="label mt-2">
            <Link href="/forgot-password" className="label-text-alt link link-hover">
                Forgot password?
            </Link>
            </label>


          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full text-base py-3">Login</button>
          </div>

          <div className="divider">OR</div>
          
          <button type="button" className="btn btn-outline flex items-center gap-2">
            <FcGoogle size={24} />
            Sign in with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="link link-primary">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}