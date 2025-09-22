// src/pages/Profile.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    photo: "",
    bio: "",
  });

  const email = user?.email || "";

  const provider = useMemo(() => {
    if (!user?.providerData?.length) return "password";
    // e.g., "google.com", "password"
    return user.providerData[0]?.providerId || "password";
  }, [user]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Load profile from backend
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!email) {
        setDbUser(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(email)}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setDbUser(data);
            setForm({
              name: data?.name || user?.displayName || "",
              photo: data?.photo || user?.photoURL || "",
              bio: data?.bio || "",
            });
          }
        } else {
          // No record yet: seed with Firebase
          if (!cancelled) {
            setDbUser(null);
            setForm({
              name: user?.displayName || "",
              photo: user?.photoURL || "",
              bio: "",
            });
          }
        }
      } catch {
        if (!cancelled) {
          setDbUser(null);
          setForm({
            name: user?.displayName || "",
            photo: user?.photoURL || "",
            bio: "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [email, user?.displayName, user?.photoURL]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please log in to update your profile.");
      return;
    }
    const name = form.name.trim();
    const photo = form.photo.trim();
    const bio = form.bio.trim();

    if (!name) {
      toast.error("Name is required.");
      return;
    }

    try {
      setSaving(true);
      // 1) Update Firebase profile (displayName/photoURL)
      try {
        await updateUser({
          displayName: name,
          photoURL: photo || undefined,
        });
      // eslint-disable-next-line no-unused-vars
      } catch (_) {
        // Non-fatal, we still try to persist in our DB
      }

      // 2) Upsert user in your backend
      const payload = {
        name,
        email,
        photo,
        bio,
        authProvider: provider.includes("google") ? "google" : "password",
        createdAt: dbUser?.createdAt || new Date().toISOString(),
      };
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save profile");
      }
      const data = await res.json();
      setDbUser(data?.user || payload);

      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900">You’re not logged in</h2>
          <p className="text-gray-600 mt-1">
            Please log in to view and edit your profile.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-6 sm:p-8 lg:p-10">
          <header className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-green-600/60 bg-green-100">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-green-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21a8 8 0 10-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Profile
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage how you appear to organizers and volunteers.
              </p>
            </div>
          </header>

          <form onSubmit={onSave} className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Photo URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <input
                type="url"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://example.com/you.jpg"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                rows="4"
                value={form.bio}
                onChange={handleChange}
                placeholder="A few sentences about you…"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (read-only)
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auth Provider (read-only)
              </label>
              <input
                type="text"
                value={provider.includes("google") ? "Google" : "Password"}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Save */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-md shadow-green-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Meta */}
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Status:</span>{" "}
                {user ? "Logged in" : "Guest"}
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Requests:</span>{" "}
                {/* optional place for a count if you add GET /requests?volunteerEmail=... count */}
                — 
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Posts:</span>{" "}
                {/* optional place for a count if you add GET /posts?organizerEmail=... count */}
                — 
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;