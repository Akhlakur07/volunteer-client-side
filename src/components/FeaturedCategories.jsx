// src/components/FeaturedCategories.jsx
import React from "react";
import { Link } from "react-router";

const Card = ({ title, desc, to, img }) => {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl overflow-hidden border border-green-100 bg-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-0.5"
    >
      <div className="h-36 sm:h-40 relative">
        <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{desc}</p>
        <div className="mt-3 inline-flex items-center gap-2 text-green-700 font-semibold">
          Explore
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCategories = () => {
  // Added "Environment" as the new feature
  const items = [
    {
      title: "Healthcare",
      desc: "Support clinics, blood drives, and well-being campaigns.",
      to: "/posts?category=healthcare",
      img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Education",
      desc: "Tutor students, run workshops, and mentor future leaders.",
      to: "/posts?category=education",
      img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Social Service",
      desc: "Community cleanups, food drives, and outreach programs.",
      to: "/posts?category=social-service",
      img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Animal Welfare",
      desc: "Shelter support, rescue, and awareness initiatives.",
      to: "/posts?category=animal-welfare",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",
    },
    // NEW FEATURE
    {
      title: "Environment",
      desc: "Tree planting, river cleanups, and climate action events.",
      to: "/posts?category=environment",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Categories
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Jump straight into causes that need your skills.
            </p>
          </div>
          <Link
            to="/posts"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-green-600 text-green-700 px-4 py-2 font-semibold hover:bg-green-50 transition"
          >
            Browse All
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

        {/* Updated layout to 5-up on large screens */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((it) => (
            <Card key={it.title} {...it} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 rounded-xl border border-green-600 text-green-700 px-4 py-2 font-semibold hover:bg-green-50 transition"
          >
            Browse All
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
    </section>
  );
};

export default FeaturedCategories;