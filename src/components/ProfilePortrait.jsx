import { useState } from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function ProfilePortrait() {
  const [revealed, setRevealed] = useState(false);

  function revealOnTap() {
    if (window.matchMedia(FINE_POINTER).matches) {
      return;
    }
    setRevealed((open) => !open);
  }

  return (
    <button
      type="button"
      className={revealed ? "portrait is-revealed" : "portrait"}
      aria-label="Portrait of Evan Yibole"
      onClick={revealOnTap}
    >
      <span className="portrait-veil" aria-hidden="true">
        <span className="portrait-initials">EY</span>
        <span className="portrait-hint portrait-hint--hover">Hover to meet me</span>
        <span className="portrait-hint portrait-hint--touch">Tap to meet me</span>
      </span>
      <img
        className="portrait-photo"
        src="/images/evan-yibole.jpg"
        alt="Portrait of Evan Yibole"
        width={800}
        height={800}
        decoding="async"
        fetchPriority="high"
      />
    </button>
  );
}
