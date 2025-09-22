// src/pages/VolunteerNeed.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const VolunteerNeed = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    thumbnail: "",
    title: "",
    description: "",
    category: "",
    location: "",
    needed: "",
  });
  const [deadline, setDeadline] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.title.trim()) return "Post title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.category) return "Please choose a category.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.needed || Number(form.needed) <= 0)
      return "Number of volunteers must be greater than 0.";
    if (!deadline) return "Please choose a deadline.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const payload = {
      thumbnail: form.thumbnail,
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      needed: Number(form.needed),
      deadline: deadline.toISOString(),
      organizerName: user?.displayName || "",
      organizerEmail: user?.email || "",
      createdAt: new Date().toISOString(),
      status: "open",
    };

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add post");
      }

      toast.success("Volunteer post added!");
      // reset form
      setForm({
        thumbnail: "",
        title: "",
        description: "",
        category: "",
        location: "",
        needed: "",
      });
      setDeadline(null);
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-6 sm:p-8 lg:p-10">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add Volunteer Need Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Share your organization’s needs and connect with the right
              volunteers.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            {/* Thumbnail */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail (image URL)
              </label>
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Post Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Community Health Camp Volunteers"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe responsibilities, schedule, and impact."
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              >
                <option value="">Select a category</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="social-service">Social Service</option>
                <option value="animal-welfare">Animal Welfare</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City / Area"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* No. of volunteers */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. of volunteers needed
              </label>
              <input
                type="number"
                min="1"
                name="needed"
                value={form.needed}
                onChange={handleChange}
                placeholder="e.g., 10"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
              />
            </div>

            {/* Deadline (React DatePicker) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                placeholderText="Choose deadline"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none"
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {/* Organizer (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organizer Name
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organizer Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-md shadow-green-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding Post..." : "Add Post"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default VolunteerNeed;