// src/pages/Request.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import { toast } from "react-toastify";

const Request = () => {
  const { user } = useContext(AuthContext);
  const volunteerEmail = user?.email || "";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const idOf = (r) =>
    r.id ||
    (typeof r._id === "string" ? r._id : r._id?.toString?.()) ||
    r._id?.$oid;

  const load = async () => {
    if (!volunteerEmail) {
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/requests?volunteerEmail=${encodeURIComponent(
          volunteerEmail
        )}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to load requests");
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.message || "Could not load your requests.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volunteerEmail]);

  const onCancel = async (reqRow) => {
    const id = idOf(reqRow);
    if (!id) return toast.error("Invalid request id.");
    const ok = window.confirm(
      `Cancel your request for "${reqRow.title || "this post"}"?`
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:3000/requests/${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Cancel failed");
      }
      setRows((r) => r.filter((x) => idOf(x) !== id));
      toast.success("Request canceled.");
    } catch (err) {
      toast.error(err?.message || "Could not cancel request.");
    }
  };

  const columns = useMemo(
    () => [
      { key: "title", label: "Post Title", render: (r) => r.title || "—" },
      {
        key: "category",
        label: "Category",
        render: (r) =>
          (r.category && String(r.category).replaceAll?.("-", " ")) || "—",
      },
      { key: "deadline", label: "Deadline", render: (r) => fmtDate(r.deadline) },
      {
        key: "status",
        label: "Status",
        render: (r) => (r.status || "requested").toUpperCase(),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Volunteer Requests
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            These are the requests you’ve submitted to be a volunteer.
          </p>
        </header>

        {/* Not logged in */}
        {!volunteerEmail && (
          <div className="rounded-2xl bg-white p-6 border border-gray-200 text-center">
            <p className="text-gray-700">Please log in to see your requests.</p>
          </div>
        )}

        {volunteerEmail && (
          <section className="rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-10 grid place-items-center">
                <div className="animate-spin h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent" />
              </div>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  No volunteer requests yet
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse open posts and send your first volunteering request.
                </p>
                <div className="mt-4">
                  <Link
                    to="/posts"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition"
                  >
                    Browse Posts
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
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">
                        Post Title
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Deadline
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const id = idOf(r);
                      return (
                        <tr
                          key={id || i}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          {columns.map((c) => (
                            <td key={c.key} className="px-4 py-3">
                              {c.render(r)}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <Link
                                to={`/posts/${encodeURIComponent(r.postId || "")}`}
                                className="px-3 py-1.5 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition"
                              >
                                View Post
                              </Link>
                              <button
                                onClick={() => onCancel(r)}
                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                              >
                                Cancel
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

export default Request;