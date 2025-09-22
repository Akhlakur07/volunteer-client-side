// src/pages/MyPosts.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const organizerEmail = user?.email || "";

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

  const getId = (p) =>
    p.id ||
    (typeof p._id === "string" ? p._id : p._id?.toString?.()) ||
    p._id?.$oid;

  const load = async () => {
    if (!organizerEmail) {
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Backend supports ?organizerEmail= filter (from earlier snippet)
      const res = await fetch(
        `https://volunteer-back-nine.vercel.app/posts?organizerEmail=${encodeURIComponent(
          organizerEmail
        )}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.message || "Could not load your posts.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerEmail]);

  const onDelete = async (post) => {
    const id = getId(post);
    if (!id) return toast.error("Invalid post id.");
    const ok = window.confirm(`Delete "${post.title}"? This cannot be undone.`);
    if (!ok) return;

    try {
      const res = await fetch(
        `https://volunteer-back-nine.vercel.app/posts/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Delete failed");
      }
      setRows((r) => r.filter((x) => getId(x) !== id));
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err?.message || "Could not delete post.");
    }
  };

  const columns = useMemo(
    () => [
      { key: "title", label: "Title", render: (p) => p.title || "—" },
      {
        key: "category",
        label: "Category",
        render: (p) =>
          (p.category && String(p.category).replaceAll?.("-", " ")) || "—",
      },
      {
        key: "deadline",
        label: "Deadline",
        render: (p) => fmtDate(p.deadline),
      },
      { key: "needed", label: "Needed", render: (p) => Number(p.needed ?? 0) },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Volunteer Need Posts
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage the posts you’ve added.
          </p>
        </header>

        {/* Empty state if not logged in */}
        {!organizerEmail && (
          <div className="rounded-2xl bg-white p-6 border border-gray-200 text-center">
            <p className="text-gray-700">Please log in to see your posts.</p>
          </div>
        )}

        {organizerEmail && (
          <section className="rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            {/* Loading */}
            {loading ? (
              <div className="p-10 grid place-items-center">
                <div className="animate-spin h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent" />
              </div>
            ) : rows.length === 0 ? (
              // Empty state
              <div className="p-10 text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  No posts yet
                </h2>
                <p className="text-gray-600 mt-1">
                  You haven’t added any volunteer need posts. Create your first
                  one now.
                </p>
                <div className="mt-4">
                  <Link
                    to="/add-post"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition"
                  >
                    Add Volunteer Need Post
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              // Table
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Deadline
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Needed
                      </th>
                      <th className="text-right px-4 py-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p, i) => {
                      const id = getId(p);
                      return (
                        <tr
                          key={id || i}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          {columns.map((c) => (
                            <td key={c.key} className="px-4 py-3">
                              {c.render(p)}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/posts/${encodeURIComponent(id)}/edit`,
                                    { state: { post: p } }
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => onDelete(p)}
                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
