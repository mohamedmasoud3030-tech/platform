import { createRouter, publicQuery } from "./middleware";
import { authRouter } from "./routers/auth";
import { inquiriesRouter } from "./routers/inquiries";
import { projectsRouter } from "./routers/projects";
import { contentRouter } from "./routers/content";
import { operationsRouter } from "./routers/operations";
import { analyticsRouter } from "./routers/analytics";
import { assistantRouter } from "./routers/assistant";
import { worldSignalsRouter } from "./routers/world-signals";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  inquiries: inquiriesRouter,
  projects: projectsRouter,
  content: contentRouter,
  operations: operationsRouter,
  analytics: analyticsRouter,
  assistant: assistantRouter,
  worldSignals: worldSignalsRouter,
});

export type AppRouter = typeof appRouter;
