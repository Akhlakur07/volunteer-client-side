// src/components/Navbar.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      setDbUser(null);
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setDbUser(data);
      } catch {
        if (!cancelled) setDbUser(null);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const Avatar = () => {
    const src = dbUser?.photo || user?.photoURL || "";
    return src ? (
      <img
        src={src}
        alt="Profile"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-green-600/60"
      />
    ) : (
      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-green-600/60">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-green-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-bold">
            VolunteerHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="hover:text-green-100 transition">
              Home
            </Link>
            <Link to="/posts" className="hover:text-green-100 transition">
              All Volunteer Need Posts
            </Link>
            {user && (
              <div className="relative">
                <details className="group">
                  <summary className="list-none cursor-pointer hover:text-green-100 transition inline-flex items-center gap-1">
                    My Profile
                    <svg
                      className="w-4 h-4 transition-transform group-open:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 011.08 1.04l-4.24 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-white text-gray-800 shadow-lg p-2 z-50">
                    <Link
                      to="/add-post"
                      className="block rounded px-3 py-2 text-sm hover:bg-green-50"
                    >
                      Add Volunteer Need Post
                    </Link>
                    <Link
                      to="/manage-posts"
                      className="block rounded px-3 py-2 text-sm hover:bg-green-50"
                    >
                      Manage My Posts
                    </Link>
                    {/* NEW: My Requests */}
                    <Link
                      to="/my-requests"
                      className="block rounded px-3 py-2 text-sm hover:bg-green-50"
                    >
                      My Requests
                    </Link>
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:opacity-90 transition">
                  <Avatar />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-500 px-4 pb-3 space-y-2">
          <Link to="/" className="block hover:text-green-100 transition">
            Home
          </Link>
          <Link to="/posts" className="block hover:text-green-100 transition">
            All Volunteer Need Posts
          </Link>
          {user && (
            <>
              <Link
                to="/add-post"
                className="block hover:text-green-100 transition"
              >
                Add Volunteer Need Post
              </Link>
              <Link
                to="/manage-posts"
                className="block hover:text-green-100 transition"
              >
                Manage My Posts
              </Link>
              {/* NEW in mobile: My Requests */}
              <Link
                to="/my-requests"
                className="block hover:text-green-100 transition"
              >
                My Requests
              </Link>
            </>
          )}
          {user ? (
            <div className="flex items-center justify-between pt-2">
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar />
                <span className="text-sm">
                  {dbUser?.name || user?.displayName || "Profile"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block hover:text-green-100 transition">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;