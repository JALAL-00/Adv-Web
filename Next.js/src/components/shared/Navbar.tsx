// src/components/shared/Navbar.tsx
import Link from 'next/link';
import { Briefcase, Bell, MessageSquare, User } from 'lucide-react'; // Great icon library

// You'll need to install lucide-react: npm install lucide-react
const Navbar = () => {
  return (
    <div className="bg-base-100 border-b shadow-sm sticky top-0 z-50">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
            NexHire
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <div className="form-control">
            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          </div>
        </div>
        <div className="navbar-end gap-4">
           <Link href="/jobs" className="btn btn-ghost btn-circle">
            <Briefcase />
          </Link>
          <Link href="/messages" className="btn btn-ghost btn-circle">
            <MessageSquare />
          </Link>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          
          <div className="dropdown dropdown-end">

            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-24 rounded-full overflow-hidden">
                <img src="/images/Jalal.jpg" alt="Profile" className="w-full h-auto" />
              </div>
            </label>
            
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
          <div className="hidden md:flex gap-2">
              <Link href="/login" className="btn btn-outline btn-primary">Login</Link> 
              <Link href="/register" className="btn btn-primary">Register</Link> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;