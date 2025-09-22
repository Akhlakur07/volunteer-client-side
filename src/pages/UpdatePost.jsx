// src/pages/UpdatePost.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const initialPost = location?.state?.post || null;

  const [loading, setLoading] = useState(!initialPost);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    thumbnail: "",
    title: "",
    description: "",
    category: "",
    location: "",
    needed: "",
  });
  const [deadline, setDeadline] = useState(null);

  // Normalize any incoming post shape
  const normalize = (d) => ({
    id:
      d?.id ||
      (typeof d?._id === "string" ? d._id : d?._id?.toString?.()) ||
      d?._id?.$oid ||
      "",
    thumbnail: d?.thumbnail || "",
    title: d?.title || "",
    description: d?.description || "",
    category: d?.category || "",
    location: d?.location || "",
    needed: Number(d?.needed ?? 0),
    deadline: d?.deadline || "",
    organizerName: d?.organizerName || "",
    organizerEmail: d?.organizerEmail || "",
  });

  // Load initial data (from state or fetch)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (initialPost) {
        const p = normalize(initialPost);
        if (!cancelled) {
          setForm({
            thumbnail: p.thumbnail,
            title: p.title,
            description: p.description,
            category: p.category,
            location: p.location,
            needed: String(p.needed || ""),
          });
          setDeadline(p.deadline ? new Date(p.deadline) : null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/posts/${encodeURIComponent(id)}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        const p = normalize(data);
        if (!cancelled) {
          setForm({
            thumbnail: p.thumbnail,
            title: p.title,
            description: p.description,
            category: p.category,
            location: p.location,
            needed: String(p.needed || ""),
          });
          setDeadline(p.deadline ? new Date(p.deadline) : null);
        }
      } catch (e) {
        if (!cancelled) toast.error(e?.message || "Could not load the post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        thumbnail: form.thumbnail,
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        needed: Number(form.needed),
        deadline: deadline.toISOString(),
      };

      const res = await fetch(`http://localhost:3000/posts/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      toast.success("Post updated successfully!", {
        autoClose: 1200,
        onClose: () => navigate(`/posts/${encodeURIComponent(id)}`),
      });
    } catch (error) {
      toast.error(error?.message || "Could not update post.");
    } finally {
      setSaving(false);
    }
  };

  const organizerName = user?.displayName || "";
  const organizerEmail = user?.email || "";

  const categories = useMemo(
    () => [
      { value: "", label: "Select a category" },
      { value: "healthcare", label: "Healthcare" },
      { value: "education", label: "Education" },
      { value: "social-service", label: "Social Service" },
      { value: "animal-welfare", label: "Animal Welfare" },
    ],
    []
  );

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
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Update Volunteer Need Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Edit the information below and save your changes.
            </p>
          </header>

          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5">
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

            {/* Title */}
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
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
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

            {/* Needed */}
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

            {/* Deadline */}
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
                value={organizerName}
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
                value={organizerEmail}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-md shadow-green-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Updating..." : "Update Post"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default UpdatePost;