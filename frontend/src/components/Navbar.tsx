// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">CodeGuardian</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                Dashboard
              </Link>
              <Link to="/review" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                Code Review
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/review" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
            Code Review
          </Link>
        </div>
      </div>
    </nav>
  );
}