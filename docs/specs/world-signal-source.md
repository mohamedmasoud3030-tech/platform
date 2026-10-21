# LENA World — authorized product signal source

**Status:** implemented, not connected. Until an owner configures an endpoint, World Command stays exactly as it is: an explicit, empty, read-only room.
**Contract version:** `lena.world-signals/1`
**Owners:** `artifacts/api-server/src/lib/world-signals/` (server), `artifacts/lena/src/features/world/` (client)

---

## 1. What this is

World Command (`/world/command`) shows the operating pulse of LENA's products. It is
allowed to be empty. It is never allowed to be wrong. So the room only becomes live
through one path:

```
an owner-authorized product endpoint   (JSON, this contract)
        → server adapter               (validate, cap, cache, classify failures)
        → worldSignals.snapshot        (public, read-only tRPC query)
        → client transport             (re-validate, drop unknown worlds)
        → signal store                 (available + coverage, or unavailable)
        → World Command                (pulse, signals, per-world presence)
```

Every step is fail-closed. A step that cannot answer says `unavailable` with a coarse
reason and shows nothing; it never passes a partial truth forward.

## 2. Configuration

| Variable | Required | Meaning |
|---|---|---|
| `LENA_WORLD_SIGNAL_SOURCE_URL` | yes | HTTPS endpoint returning one payload in this contract. Unset = the room stays closed (`not-configured`). |
| `LENA_WORLD_SIGNAL_TOKEN` | no | Sent as `Authorization: Bearer …`. Server-side only; never exposed to the browser, never logged. |
| `LENA_WORLD_SIGNAL_TIMEOUT_MS` | no | Request timeout, default `4000`, capped at `15000`. |
| `LENA_WORLD_SIGNAL_TTL_MS` | no | Snapshot cache window, default `60000`, capped at `300000`. Failures are retried after 15 s. |

The adapter is read-only by design: LENA reads product operations and has **no write path
back into any product**. That is why the room never offers an acknowledge/resolve action
it cannot persist, and why `writable` is always `false` on the wire.

## 3. The payload

```json
{
  "protocol": "lena.world-signals/1",
  "observedAt": "2026-10-01T08:00:00.000Z",
  "worlds": ["property", "wellness"],
  "signals": [
    {
      "id": "contract-renewal-q4",
      "world": "property",
      "kind": "attention-needed",
      "severity": "attention",
      "timestamp": "2026-10-01T07:40:00.000Z",
      "title": { "ar": "عقود تقترب من موعد التجديد", "en": "Contracts approaching renewal" },
      "description": { "ar": "دفعة تجديدات تحتاج مراجعة.", "en": "A renewal batch needs review." },
      "targetPath": "/world/property",
      "lifecycle": "new"
    }
  ]
}
```

**Field rules**

- `protocol` must be exactly `lena.world-signals/1`. A different version is rejected whole.
- `observedAt` is the source's own observation instant (ISO 8601, not in the future). It is
  displayed as the freshness of the room; the adapter will not invent it if it is missing.
- `worlds` is the source's **coverage**: the worlds it is actually observing. A world LENA
  publishes but this list does not contain is shown as `unavailable` — never as calm.
  A source that observes a world with no current signal lists the world and sends no signal
  for it; that is what a genuinely quiet world looks like.
- `signals` is capped at 64 entries per payload (body cap 256 KB). Beyond that the payload is
  rejected rather than truncated.
- `kind` ∈ `activity | operational-change | attention-needed | milestone | degraded | resolved`
- `severity` ∈ `ambient | information | attention | critical`
- `lifecycle` ∈ `new | active | acknowledged | resolved`
- `title` / `description` require both `ar` and `en`, non-empty, capped at 200 / 600 characters.
- `targetPath`, when present, must be exactly `/world/<world>`. Anything else is dropped and the
  signal is kept without a link, so the room can never render a destination LENA does not own.
- `id` must be stable per signal: a repeat id replaces the earlier one (most recent timestamp wins),
  which is how a product updates a signal in place.

Unknown fields are ignored (additive change stays safe). Unknown enum values, missing locales,
oversized text and malformed timestamps reject the whole payload — a partially understood
snapshot could understate a critical state.

## 4. Failure vocabulary

The room distinguishes these, because "not plugged in" and "plugged in but silent" are
different facts:

| Reason | Where it comes from | What the room says |
|---|---|---|
| `no-authorized-product-source` | production default | live signals are not connected yet |
| `not-configured` | adapter, no `LENA_WORLD_SIGNAL_SOURCE_URL` | same as above |
| `unreachable` | connection refused / DNS / TLS failure, or LENA's own API unreachable | the authorized source did not answer |
| `timeout` | request exceeded the timeout | the authorized source did not answer |
| `rejected` | endpoint answered non-2xx (auth, outage, quota) | the authorized source did not answer |
| `invalid-payload` | body too large, not JSON, or contract violation | the authorized source did not answer |
| `uncovered-worlds` | client: the payload covers no published world | the source covers no published world |

None of these can produce numbers, states or signals: the closed room renders no counts,
no presence and no action.

## 5. Operating it

- Health check (admin only, bypasses the cache):
  `trpc.worldSignals.probe` → `{ configured, status, reason, observedAt, signals, worlds }`.
  Content-free on purpose: it tells an operator whether the pipe is open, not what is in it.
- Rollback: unset `LENA_WORLD_SIGNAL_SOURCE_URL`. The room returns to the explicit closed
  state on the next request; no deployment change and no data to clean up.
- Nothing is persisted. Snapshots live in server memory for one TTL window and in the browser
  store until replaced. There is no history, no database table and no analytics event.

## 6. Local development

```bash
node tools/world-signal-fixture.mjs 8099                     # development fixture, not product truth
LENA_WORLD_SIGNAL_SOURCE_URL=http://127.0.0.1:8099/signals \
  pnpm --filter @workspace/api-server dev                    # API on :8080
pnpm --filter @workspace/lena dev                            # app on :3000, proxies /api to :8080
```

The fixture harness exists to exercise the room end-to-end; it is not imported by the
application and production never points at it.

## 7. Guarantees enforced by machines

`tools/verify-world-signal-source.mjs` (part of `pnpm run verify`) fails the build if:

- the production store stops being seedless/unavailable by default, or fixtures become reachable;
- anything other than the validated transport hydrates the store;
- a writable source could ever be hydrated (mutation authority out of a read-only contract);
- the client stops owning the world registry or canonical chamber paths;
- an unobserved world could be reported as `quiet`;
- a host is compiled into the adapter instead of being configured;
- the public read surface grows a mutation.
