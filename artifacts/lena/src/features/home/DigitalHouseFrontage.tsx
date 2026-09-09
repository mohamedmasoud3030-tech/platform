import { frontageRooms } from "./frontage-rooms";
import { usePreferences } from "@/providers/preferences";

/**
 * LENA Digital House frontage — the House Ledger hero scene (HOME-R1).
 *
 * Replaces the orbital system on Home. A flat, editorial house frontage at
 * dusk: one parapet, four first-floor windows, a round porch lamp (the
 * canonical Sacred Core sigil, `.lena-house`), and a ground floor with two
 * windows flanking the entrance door.
 *
 * The six windows map one-to-one to the six public systems in owner order
 * (Lara Beauty … Kayyal). A window is LIT only when the evidence registry
 * documents that system (`frontageRooms`); unlit windows carry the honest
 * documentation-status sign in the key line below — never a lifecycle word,
 * never a fabricated state. The scene is decorative and non-interactive
 * (aria-hidden); product navigation lives in the cards beneath it.
 *
 * Motion: a single restrained entrance on the composition. Under
 * `prefers-reduced-motion` everything renders placed once and static. The
 * sigil keeps its approved living-lamp pulse (sacred-core.css) and its
 * gateway awakening choreography; there is no continuous animation of the
 * building itself.
 */
export default function DigitalHouseFrontage() {
  const { locale } = usePreferences();
  const rooms = frontageRooms();
  const top = rooms.slice(0, 4);
  const ground = rooms.slice(4);

  const renderWindow = (room: (typeof rooms)[number], index: number) => (
    <figure
      key={room.system.id}
      className={`lena-front-window ${room.documented ? "is-lit" : "is-unlit"}`}
      data-system={room.system.id}
      data-documented={room.documented}
    >
      <div className="lena-front-pane">
        <i aria-hidden="true" />
      </div>
      <figcaption className="lena-front-name">
        <span className="lena-front-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        {room.system.name[locale]}
      </figcaption>
    </figure>
  );

  return (
    <div className="lena-frontage" aria-hidden="true">
      <div className="lena-frontage-building">
        <div className="lena-frontage-parapet" />
        <div className="lena-frontage-first-floor">{top.map(renderWindow)}</div>
        <div className="lena-frontage-frieze">
          <div className="lena-house">
            <small>LENA</small>
            <strong>
              DIGITAL
              <br />
              HOUSE
            </strong>
            <span>{locale === "ar" ? "أنظمة تشغيل" : "Operating systems"}</span>
          </div>
        </div>
        <div className="lena-frontage-ground">
          {ground[0] ? renderWindow(ground[0], 4) : null}
          <div className="lena-front-door" aria-hidden="true" />
          {ground[1] ? renderWindow(ground[1], 5) : null}
        </div>
      </div>
      <p className="lena-frontage-key">
        <span className="lena-frontage-key-item">
          <i className="lena-key-swatch is-lit" aria-hidden="true" />
          {locale === "ar" ? "موثّق بواجهات حقيقية" : "Documented with real captures"}
        </span>
        <span className="lena-frontage-key-item">
          <i className="lena-key-swatch is-unlit" aria-hidden="true" />
          {locale === "ar" ? "لم يُوثَّق بعد" : "Not yet documented"}
        </span>
      </p>
    </div>
  );
}
