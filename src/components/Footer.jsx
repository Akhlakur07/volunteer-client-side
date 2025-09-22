// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router";

const Footer = () => {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No backend assumed — just clear the field for now
    setEmail("");
    // If you use toastify globally, you can toast.success here.
    // toast.success("Subscribed! Thanks for joining our newsletter.");
  };

  return (
    <footer className="mt-16 border-t border-green-100 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + mission */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20l9-5-9-5-9 5 9 5z" />
                  <path d="M12 12l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-green-800">VolunteerHub</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-6">
              Connecting people who care with causes that matter. Join thousands
              of volunteers making real change in their communities.
            </p>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Verified Orgs", "Safe Requests", "Community First"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wide">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-700 hover:text-green-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-700 hover:text-green-700">
                  All Volunteer Need Posts
                </Link>
              </li>
              <li>
                <Link to="/add-post" className="text-gray-700 hover:text-green-700">
                  Add Volunteer Need Post
                </Link>
              </li>
              <li>
                <Link to="/manage-posts" className="text-gray-700 hover:text-green-700">
                  My Posts
                </Link>
              </li>
              <li>
                <Link to="/my-requests" className="text-gray-700 hover:text-green-700">
                  My Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wide">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/posts?category=healthcare" className="text-gray-700 hover:text-green-700">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link to="/posts?category=education" className="text-gray-700 hover:text-green-700">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/posts?category=social-service" className="text-gray-700 hover:text-green-700">
                  Social Service
                </Link>
              </li>
              <li>
                <Link to="/posts?category=animal-welfare" className="text-gray-700 hover:text-green-700">
                  Animal Welfare
                </Link>
              </li>
              <li>
                <Link to="/posts?category=environment" className="text-gray-700 hover:text-green-700">
                  Environment
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wide">
              Stay in the Loop
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Get updates on new opportunities and success stories.
            </p>
            <form onSubmit={onSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                aria-label="Email address"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-green-600 text-white font-semibold px-4 py-2.5 hover:bg-green-700 shadow-md shadow-green-500/20 transition"
              >
                Subscribe
              </button>
            </form>

            {/* Contact + social */}
            <div className="mt-5 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Contact:</span>{" "}
                support@volunteerhub.local
              </p>
              <p className="mt-1">Dhaka, Bangladesh</p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {/* Social icons (placeholder links) */}
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3h4a1 1 0 011 1v4h-3a1 1 0 00-1 1v3h4l-1 4h-3v7h-4v-7H7v-4h3V9a5 5 0 015-5z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="p-2 rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 3.01l-6.5 7.32L21 21h-4.5L12 14.82 6.5 21H2l7.5-8.67L3 3h4.5L12 9.18 17.5 3H20z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.75a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.8v2.2h.1c.5-.9 1.7-2.2 3.5-2.2C19.8 8 22 10 22 14.1V24h-4v-8.7c0-2.1-.8-3.5-2.6-3.5-1.4 0-2.2.9-2.6 1.8-.1.3-.1.8-.1 1.2V24h-4V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-10 border-t border-green-100" />

        {/* Bottom bar */}
        <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © {year} <span className="font-semibold text-gray-900">VolunteerHub</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/privacy" className="text-gray-600 hover:text-green-700">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-green-700">
              Terms
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-green-700">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;