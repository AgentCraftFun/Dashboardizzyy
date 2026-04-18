"use client";

import { useState } from "react";

export function Logo({
  size = 40,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-ember-500 to-ember-700 shadow-ember ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        aria-hidden
      >
        🪐
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="$ASTSTR"
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover shadow-ember ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
