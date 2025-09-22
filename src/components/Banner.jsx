// src/components/Banner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

const Banner = () => {
  const slides = useMemo(
    () => [
      {
        id: 1,
        eyebrow: "Volunteer Needed",
        title: "Bring hope to your community",
        desc: "Discover local causes that need your time and skills. Join hands to support education, health, and relief efforts.",
        cta: { label: "Browse Volunteer Posts", to: "/posts" },
        img:
          "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1600&auto=format&fit=crop", // teaching/mentoring
      },
      {
        id: 2,
        eyebrow: "Post a Need",
        title: "Get helping hands—fast",
        desc: "Organizers can publish clear volunteer needs with dates, locations, and required skills. Let the right people find you.",
        cta: { label: "Add Volunteer Need Post", to: "/add-post" },
        img:
          "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1600&auto=format&fit=crop", // donation/food drive
      },
      {
        id: 3,
        eyebrow: "Real Impact",
        title: "Track your impact & stay inspired",
        desc: "Manage your posts, update status, and celebrate milestones. Small steps create big change.",
        cta: { label: "Manage My Posts", to: "/manage-posts" },
        img:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop", // cleanup/environment
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const len = slides.length;
  const timerRef = useRef(null);
  const hoverRef = useRef(false);

  const next = () => setIndex((i) => (i + 1) % len);
  const prev = () => setIndex((i) => (i - 1 + len) % len);
  const goTo = (i) => setIndex(i);

  // autoplay every 5s, pause on hover
  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!hoverRef.current) next();
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [len]);

  return (
    <section
      className="relative overflow-hidden shadow-lg"
      aria-roledescription="carousel"
      aria-label="Volunteer highlights"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* Slides */}
      <div className="relative h-[380px] sm:h-[440px] md:h-[520px]">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${len}`}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                active
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 -translate-x-4 scale-[0.98] pointer-events-none"
              }`}
            >
              {/* Background image (no green tint) */}
              <img
                src={s.img}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Neutral dark scrim for readability (no color tone) */}
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
              />

              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/25 to-transparent"
                aria-hidden="true"
              />

              {/* Centered content */}
              <div className="relative h-full px-6 sm:px-10 md:px-16 flex items-center justify-center text-center">
                <div className="max-w-3xl text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
                  <p className="uppercase tracking-wider text-white/90 text-xs sm:text-sm mb-2">
                    {s.eyebrow}
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-3 sm:mt-4 text-white/95 text-sm sm:text-base md:text-lg">
                    {s.desc}
                  </p>
                  <div className="mt-6">
                    <Link
                      to={s.cta.to}
                      className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 px-5 py-3 font-semibold hover:bg-green-50 transition shadow-sm"
                    >
                      {s.cta.label}
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-4">
        <button
          onClick={prev}
          className="pointer-events-auto inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 text-gray-800 hover:bg-white shadow"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="pointer-events-auto inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 text-gray-800 hover:bg-white shadow"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition ${
              i === index ? "w-7 bg-white" : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
