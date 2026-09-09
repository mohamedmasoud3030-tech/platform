import { cosmicStars } from "./cosmic-stars";

/** The sky is dealt once per page load — every render shares it. */
const STARS = cosmicStars();

/**
 * The cosmic backdrop: the rose's starfield, spread over the whole page.
 * A fixed layer pinned behind everything (negative z-index inside the
 * shell's stacking context), pointer-transparent, purely decorative:
 * twinkling starlight in three tints, two breath-soft nebula washes, and
 * three rare meteors crossing on slow staggered loops. Rendered by the
 * public + admin shells and the login screen, so the whole platform shares
 * one sky. The card surfaces above turn to frosted glass so the starlight
 * glows through (scoped to roots rendering this backdrop; headers and
 * controls stay solid).
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
      <span className="cosmic-meteor m1" />
      <span className="cosmic-meteor m2" />
      <span className="cosmic-meteor m3" />
    </div>
  );
}
