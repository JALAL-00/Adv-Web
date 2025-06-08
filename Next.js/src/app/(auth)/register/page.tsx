// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

// Define the role type for better type safety
type Role = 'CANDIDATE' | 'RECRUITER';

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '', // Added to state
  });

  // This effect runs whenever the 'role' changes.
  // If the user switches to Candidate, we clear the companyName to prevent stale data.
  useEffect(() => {
    if (role === 'CANDIDATE') {
      setFormData(prev => ({ ...prev, companyName: '' }));
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the payload based on the role, matching your Postman examples
    const { firstName, lastName, email, password, companyName } = formData;
    let payload: any = {
      firstName,
      lastName,
      email,
      password,
    };

    if (role === 'RECRUITER') {
      payload.companyName = companyName;
    }

    // TODO: Replace console.log with your actual API call
    console.log(`Registering as: ${role}`);
    console.log('Submitting Payload:', payload);
    alert('Registration Submitted! Check the browser console for the payload.');
  };

return (
  <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div className="card w-full max-w-md shadow-2xl bg-base-100">
      <form className="card-body flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        {/* Role Selector */}
        <div className="form-control">
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className={`btn w-40 ${role === 'CANDIDATE' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRole('CANDIDATE')}
            >
              I'm a Candidate
            </button>
            <button
              type="button"
              className={`btn w-40 ${role === 'RECRUITER' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRole('RECRUITER')}
            >
              I'm a Recruiter
            </button>
          </div>
        </div>


        {/* First Name */}
        <div className="form-control">
          <label className="label"><span className="label-text">First Name</span></label>
          <input
            name="firstName"
            type="text"
            placeholder="Jalal"
            className="input input-bordered w-full"
            required
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        {/* Last Name */}
        <div className="form-control">
          <label className="label"><span className="label-text">Last Name</span></label>
          <input
            name="lastName"
            type="text"
            placeholder="Uddin"
            className="input input-bordered w-full"
            required
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        {/* Company Name (conditionally visible) */}
        {role === 'RECRUITER' && (
          <div className="form-control transition-all duration-300 ease-in-out">
            <label className="label"><span className="label-text">Company Name</span></label>
            <input
              name="companyName"
              type="text"
              placeholder="Tech LTD"
              className="input input-bordered w-full"
              required
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Email */}
        <div className="form-control">
          <label className="label"><span className="label-text">Email</span></label>
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
            className="input input-bordered w-full"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label"><span className="label-text">Password</span></label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Register Button */}
        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full py-3 text-base">
            Register
          </button>
        </div>

        <div className="divider">OR</div>

        {/* Google Auth */}
        <button type="button" className="btn btn-outline flex items-center gap-2 w-full">
          <FcGoogle size={24} />
          Continue with Google
        </button>

        <p className="text-center mt-2 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="link link-primary">Login</Link>
        </p>
      </form>
    </div>
  </div>
);

}