// src/components/ImpactStats.jsx
import React, { useEffect, useRef, useState } from "react";

function useCountUpOnce(targetNumber, { duration = 1200 } = {}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef(0);
  const startTsRef = useRef(0);
  const targetRef = useRef(
    Number.isFinite(targetNumber) ? targetNumber : Number(targetNumber) || 0
  );

  // run the animation loop
  const tick = (ts) => {
    if (!startTsRef.current) startTsRef.current = ts;
    const t = ts - startTsRef.current;
    const p = Math.min(t / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    setValue(targetRef.current * eased);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (startedRef.current) return; // guard against restarts
    startedRef.current = true;

    // reduced motion? jump to end
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(targetRef.current);
      return;
    }

    cancelAnimationFrame(rafRef.current || 0);
    startTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  };

  // cleanup once on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { value, start, startedRef };
}

const Stat = ({ label, target, suffix = "" }) => {
  const containerRef = useRef(null);
  const { value, start, startedRef } = useCountUpOnce(target);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // fallback: start immediately
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            start();
            // stop observing after first start to prevent retriggers
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start, startedRef]);

  const display = Math.round(value).toLocaleString();

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-white border border-green-100 shadow-sm p-6 text-center hover:shadow-md transition"
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-green-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 20l9-5-9-5-9 5 9 5z" />
          <path d="M12 12l9-5-9-5-9 5 9 5z" />
        </svg>
      </div>
      <div className="mt-4 text-3xl font-extrabold text-green-700">
        {display}
        {suffix}
      </div>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Impact So Far
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real people. Real change. Numbers that keep growing.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Volunteers Joined" target={3200} />
          <Stat label="Active Posts" target={86} />
          <Stat label="Cities Covered" target={24} />
          <Stat label="Hours Contributed" target={12800} suffix="+" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            "Trusted Organizers",
            "Verified Requests",
            "Fast Matching",
            "Community First",
          ].map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;