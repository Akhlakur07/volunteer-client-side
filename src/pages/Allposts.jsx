// src/pages/AllPosts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getId = (p) =>
    p.id ||
    (typeof p._id === "string" ? p._id : p._id?.toString?.()) ||
    p._id?.$oid ||
    "";

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

  // Initial load (fetch all once)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);

        // Try backend search support first (keeps it efficient if available)
        const url = "https://volunteer-back-nine.vercel.app/posts";
        const res = await fetch(url, { credentials: "include" });

        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        if (!cancelled) setAllPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err?.message || "Error fetching posts");
        if (!cancelled) setAllPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Client-side filter (works even if backend doesn't support ?title=)
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allPosts;
    return allPosts.filter((p) =>
      String(p.title || "")
        .toLowerCase()
        .includes(q)
    );
  }, [allPosts, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Needs</h1>
          <p className="text-sm text-gray-600 mt-1">
            Search and explore all volunteer opportunities.
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by Post Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="animate-spin h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent mx-auto" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">
                  {searchQuery
                    ? `No posts found for “${searchQuery}”.`
                    : "No posts found."}
                </p>
              </div>
            ) : (
              filtered.map((post, i) => {
                const id = getId(post) || String(i);
                return (
                  <div
                    key={id}
                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-gray-100">
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
                    </div>

                    {/* Post Info */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-md bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 text-xs font-medium">
                          {post.category || "General"}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z" />
                          </svg>
                          {fmtDate(post.deadline)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/posts/${encodeURIComponent(id)}`}
                          className="inline-flex items-center justify-center w-full rounded-xl bg-green-600 text-white font-semibold px-4 py-2.5 hover:bg-green-700 transition"
                        >
                          View Details
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
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
