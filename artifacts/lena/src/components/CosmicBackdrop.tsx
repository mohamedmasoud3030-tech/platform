import { cosmicStars } from "./cosmic-stars";

/** The sky is dealt once per page load — every render shares it. */
const STARS = cosmicStars();

/**
 * The cosmic backdrop: the rose's starfield, spread over the whole page.
 * A fixed layer pinned behind everything (negative z-index inside the
 * shell's stacking context), pointer-transparent, purely decorative:
 * twinkling starlight in three tints, two breath-soft nebula washes, and
 * one rare meteor crossing the upper sky. Components above are untouched.
 */
export default function CosmicBackdrop() {
  return (
    <div className="cosmic" aria-hidden="true">
      <span className="cosmic-nebula a" />
      <span className="cosmic-nebula b" />
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`cosmic-star t${star.tint}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      <span className="cosmic-meteor" />
    </div>
  );
}
