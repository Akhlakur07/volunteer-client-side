// src/pages/PostDetails.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // modal/request form
  const [showModal, setShowModal] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso || "";
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/posts/${encodeURIComponent(id)}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPost(normalize(data));
          return;
        }
        // fallback list
        const listRes = await fetch("http://localhost:3000/posts", {
          credentials: "include",
        });
        if (listRes.ok) {
          const list = await listRes.json();
          const found =
            list.find(
              (p) => p.id === id || p._id === id || p._id?.$oid === id
            ) || list.find((p) => String(p._id) === id);
          if (!cancelled) setPost(found ? normalize(found) : null);
        } else {
          if (!cancelled) setPost(null);
        }
      } catch {
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isClosed = useMemo(() => {
    if (!post) return true;
    const d = new Date(post.deadline);
    const today = new Date();
    d.setHours(23, 59, 59, 999); // same-day allowed
    return (
      (post.needed ?? 0) <= 0 ||
      d < today ||
      (post.status || "").toLowerCase() === "closed"
    );
  }, [post]);

  const info = useMemo(() => {
    if (!post) return [];
    return [
      { label: "Category", value: pretty(post.category) },
      { label: "Location", value: post.location },
      { label: "Volunteers Needed", value: post.needed },
      { label: "Deadline", value: fmtDate(post.deadline) },
      { label: "Status", value: (post.status || "open").toUpperCase() },
      { label: "Organizer", value: post.organizerName || "—" },
      { label: "Organizer Email", value: post.organizerEmail || "—" },
      { label: "Created", value: fmtDate(post.createdAt) },
    ].filter(
      (row) => row.value !== undefined && row.value !== null && row.value !== ""
    );
  }, [post]);

  const openModal = () => {
    if (isClosed) {
      const reason =
        (post?.needed ?? 0) <= 0
          ? "All volunteer slots are filled."
          : (post?.status || "").toLowerCase() === "closed"
          ? "This post is closed."
          : "Deadline has passed.";
      toast.error(reason);
      return;
    }
    setSuggestion("");
    setShowModal(true);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Please log in to request.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:3000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          postId: post.id,
          volunteerName: user.displayName || user.name || "",
          volunteerEmail: user.email,
          suggestion,
          status: "requested",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit request");
      }

      const data = await res.json();
      // Optimistically reflect the new needed count from server response if present
      if (typeof data?.request?.neededAfterRequest === "number") {
        setPost((p) =>
          p ? { ...p, needed: data.request.neededAfterRequest } : p
        );
      } else {
        // fallback: decrement locally
        setPost((p) =>
          p ? { ...p, needed: Math.max(0, (p.needed ?? 1) - 1) } : p
        );
      }

      setShowModal(false);
      toast.success("Request submitted!");
    } catch (err) {
      toast.error(err?.message || "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Post not found
          </h2>
          <p className="text-gray-600 mt-1">
            The volunteer need you’re looking for doesn’t exist or may have been
            removed.
          </p>
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 mt-4 rounded-xl border border-green-600 text-green-700 px-4 py-2 font-semibold hover:bg-green-50 transition"
          >
            Back to all posts
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 rounded-xl border border-green-600 text-green-700 px-4 py-2 font-semibold hover:bg-green-50 transition"
          >
            Back to all posts
            <svg
              className="w-4 h-4 rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <section className="rounded-3xl bg-white shadow-lg overflow-hidden">
          {/* Thumbnail */}
          <div className="relative h-60 sm:h-72 md:h-80 bg-gray-100">
            {post.thumbnail ? (
              <img
                src={post.thumbnail}
                alt={post.title || "Thumbnail"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-gray-400">
                No Image
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {post.title}
            </h1>

            {/* Meta grid */}
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {info.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-between"
                >
                  <span className="text-gray-600 text-sm">{row.label}</span>
                  <span className="text-gray-900 font-medium text-sm">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            {post.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={openModal}
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition shadow-md
                  ${
                    isClosed
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-green-500/20"
                  }`}
                aria-disabled={isClosed}
              >
                Be a Volunteer
                <svg
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
              {isClosed && (
                <p className="mt-2 text-sm text-red-600">
                  {post.needed <= 0
                    ? "No volunteer slots available."
                    : (post.status || "").toLowerCase() === "closed"
                    ? "This post is closed."
                    : "Deadline has passed."}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !submitting && setShowModal(false)}
          />
          {/* Panel */}
          <div className="absolute inset-0 grid place-items-center p-3">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-semibold">Volunteer Request</h3>
                <button
                  className="rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => !submitting && setShowModal(false)}
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={submitRequest}
                className="px-4 py-4 space-y-3 max-h-[75vh] overflow-y-auto"
              >
                {/* Read-only post info */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <ReadOnly compact label="Thumbnail">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt="thumb"
                        className="h-14 w-20 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </ReadOnly>
                  <ReadOnly compact label="Post Title" value={post.title} />
                  <ReadOnly compact label="Description">
                    <div className="text-gray-700 whitespace-pre-line max-h-20 overflow-auto text-sm">
                      {post.description}
                    </div>
                  </ReadOnly>
                  <ReadOnly
                    compact
                    label="Category"
                    value={pretty(post.category)}
                  />
                  <ReadOnly compact label="Location" value={post.location} />
                  <ReadOnly
                    compact
                    label="No. needed"
                    value={String(post.needed)}
                  />
                  <ReadOnly
                    compact
                    label="Deadline"
                    value={fmtDate(post.deadline)}
                  />
                  <ReadOnly
                    compact
                    label="Organizer"
                    value={post.organizerName || "—"}
                  />
                  <ReadOnly
                    compact
                    label="Organizer Email"
                    value={post.organizerEmail || "—"}
                  />
                </div>

                {/* Volunteer (read-only from auth) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <ReadOnly
                    compact
                    label="Volunteer Name"
                    value={user?.displayName || user?.name || ""}
                  />
                  <ReadOnly
                    compact
                    label="Volunteer Email"
                    value={user?.email || ""}
                  />
                </div>

                {/* Suggestion (editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Suggestion (optional)
                  </label>
                  <textarea
                    rows="2"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Any message for the organizer…"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none text-sm"
                  />
                </div>

                {/* Status (read-only default) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <ReadOnly compact label="Status" value="requested" />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 shadow-md shadow-green-500/20 transition text-sm"
                >
                  {submitting ? "Requesting..." : "Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// small helpers/components
function ReadOnly({ label, value, children, compact = false }) {
  const pad = compact ? "px-3 py-2" : "px-4 py-2.5";
  const textSize = compact ? "text-sm" : "text-base";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`mt-1 w-full rounded-lg border border-gray-200 ${pad} bg-gray-50 text-gray-700 ${textSize}`}
      >
        {children ?? value ?? ""}
      </div>
    </div>
  );
}

function pretty(v) {
  if (!v) return v;
  return String(v).replaceAll("-", " ");
}
function normalize(d) {
  return {
    id: d.id || d._id || d._id?.$oid || undefined,
    thumbnail: d.thumbnail || "",
    title: d.title || "",
    description: d.description || "",
    category: d.category || "",
    location: d.location || "",
    needed: Number(d.needed ?? 0),
    deadline: d.deadline || "",
    organizerName: d.organizerName || "",
    organizerEmail: d.organizerEmail || "",
    createdAt: d.createdAt || "",
    status: d.status || "open",
  };
}

export default PostDetails;
