// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import Lottie from "lottie-react";
import registerLottie from "../assets/lottie/Register.json";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { createUser, updateUser, googleSignin } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email.";
    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    } else {
      if (!/[A-Z]/.test(form.password))
        next.password = "Include at least one uppercase letter.";
      if (!/[a-z]/.test(form.password))
        next.password =
          (next.password ? next.password + " " : "") +
          "Include at least one lowercase letter.";
    }
    return next;
  };

  const saveUserToBackend = async (payload) => {
    const res = await fetch("https://volunteer-back-nine.vercel.app/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save user");
    }
    return res.json();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setSubmitting(true);
      await createUser(form.email, form.password);

      // update Firebase profile
      await updateUser({
        displayName: form.name,
        photoURL: form.photoURL || undefined,
      });

      await saveUserToBackend({
        name: form.name,
        email: form.email,
        photo: form.photoURL,
        bio: form.bio,
        authProvider: "password",
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!", {
        autoClose: 1200,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      toast.error(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setSubmitting(true);
      const { user } = await googleSignin();

      await saveUserToBackend({
        name: user?.displayName || "",
        email: user?.email || "",
        photo: user?.photoURL || "",
        bio: "",
        authProvider: "google",
        createdAt: new Date().toISOString(),
      });

      toast.success("Signed in with Google!", {
        autoClose: 1200,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      toast.error(err?.message || "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="relative rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="absolute inset-y-0 left-1/2 w-px bg-gray-100 hidden lg:block" />
          <div className="grid md:grid-cols-2">
            {/* Lottie side */}
            <div className="hidden md:flex items-center p-10">
              <div className="w-full">
                <div className="mt-6 rounded-2xl ring-1 ring-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm p-2">
                  <Lottie
                    animationData={registerLottie}
                    loop
                    className="w-full max-h-[520px]"
                  />
                </div>
              </div>
            </div>

            {/* Form side */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="max-w-md">
                <h1 className="text-2xl font-bold text-gray-900">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Use your email to sign up or continue with Google.
                </p>

                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label
                      htmlFor="photoURL"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Photo URL
                    </label>
                    <input
                      id="photoURL"
                      name="photoURL"
                      type="url"
                      value={form.photoURL}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="A sentence about you..."
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg text-gray-600 hover:bg-gray-100"
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-gray-500">
                      Must include at least 6 characters, one uppercase (A-Z),
                      and one lowercase (a-z).
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 shadow-md shadow-green-500/20 transition"
                  >
                    {submitting ? "Creating account..." : "Create account"}
                  </button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs text-gray-500">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google login */}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 bg-white hover:bg-green-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-800 font-semibold py-2.5 shadow-sm inline-flex items-center justify-center gap-2 transition"
                  >
                    <svg
                      viewBox="0 0 533.5 544.3"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285F4"
                        d="M533.5 278.4c0-18.6-1.7-37-5.2-54.8H272.1v103.7h147c-6.3 34-25 62.7-53.5 81.9v67h86.5c50.6-46.6 81.4-115.3 81.4-197.8z"
                      />
                      <path
                        fill="#34A853"
                        d="M272.1 544.3c72.3 0 133.1-23.9 177.5-65.1l-86.5-67c-24 16.1-54.7 25.6-91 25.6-69.9 0-129.3-47.2-150.5-110.6H32.7v69.6c44.6 88.4 136.5 147.5 239.4 147.5z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M121.6 327.2c-10.1-29.9-10.1-62.1 0-92l.1-69.6H32.7c-42.9 85-42.9 186.2 0 271.2l88.9-69.6z"
                      />
                      <path
                        fill="#EA4335"
                        d="M272.1 107.7c39.3-.6 77.4 13.6 106.9 39.9l79.6-79.6C410.8 24.2 343.6-0.3 272.1 0 169.2 0 77.3 59.1 32.7 147.5l88.9 69.6C143 153.7 202.3 107.7 272.1 107.7z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Login link */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login">
                      <span className="font-semibold text-green-600 hover:text-green-700 underline underline-offset-2">
                        Log in
                      </span>
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
