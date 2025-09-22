// src/components/VolunteerNeedHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

const VolunteerNeedHome = () => {
  const [posts, setPosts] = useState([]);
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

  const daysLeft = (iso) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const ms = d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
      return Math.ceil(ms / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://volunteer-back-nine.vercel.app/posts?upcoming=1&limit=6",
          { credentials: "include" }
        );

        let data = [];
        if (res.ok) {
          data = await res.json();
        } else {
          const allRes = await fetch(
            "https://volunteer-back-nine.vercel.app/posts",
            {
              credentials: "include",
            }
          );
          data = allRes.ok ? await allRes.json() : [];
        }

        const now = new Date();
        const upcoming = (data || [])
          .filter((p) => p?.deadline && new Date(p.deadline) >= now)
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )
          .slice(0, 6);

        if (!cancelled) setPosts(upcoming);
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const Empty = useMemo(
    () => (
      <div className="col-span-full text-center py-10">
        <p className="text-gray-600">
          No upcoming volunteer needs right now. Check back soon!
        </p>
      </div>
    ),
    []
  );

  return (
    <section className="mt-10 mx-[18%]">
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Volunteer Needs Now
        </h2>
        <p className="text-sm text-gray-600">
          Upcoming opportunities with the nearest deadlines.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm animate-pulse"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/5" />
                <div className="h-3 bg-gray-200 rounded w-2/5" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}

        {!loading && posts.length === 0 && Empty}

        {!loading &&
          posts.map((p, idx) => {
            const left = daysLeft(p.deadline);
            const badge =
              left != null
                ? left > 1
                  ? `${left} days left`
                  : left === 1
                  ? "1 day left"
                  : "Due today"
                : "";

            const id =
              p.id ||
              p._id?.toString?.() ||
              p.slug ||
              encodeURIComponent(p.title || `post-${idx}`);

            return (
              <div
                key={`${p.title}-${idx}`}
                className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gray-100">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title || "Thumbnail"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {badge && (
                    <span className="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100 shadow-sm">
                      {badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-md bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 text-xs font-medium">
                      {p.category?.replaceAll?.("-", " ") || "General"}
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
                      {fmtDate(p.deadline)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/posts/${id}`}
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
          })}
      </div>

      {/* See All button (single button under the grid) */}
      <div className="mt-8 text-center">
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 rounded-xl border border-green-600 text-green-700 px-5 py-2.5 font-semibold hover:bg-green-50 transition"
        >
          See All
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
    </section>
  );
};

export default VolunteerNeedHome;
