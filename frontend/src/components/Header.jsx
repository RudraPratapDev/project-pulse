import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <FaTasks className="text-blue-600 text-3xl group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Pulse
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-600 hidden sm:inline">
                  {user.email}
                </span>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <FaCog />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
