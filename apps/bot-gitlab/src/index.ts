import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MRHandler } from "./handler.js";

const app = new Hono();
const handler = new MRHandler();

const WEBHOOK_SECRET = process.env.GITLAB_WEBHOOK_SECRET || "";

app.post("/webhook", async (c) => {
  // Validate webhook secret
  if (WEBHOOK_SECRET) {
    const token = c.req.header("X-Gitlab-Token");
    if (token !== WEBHOOK_SECRET) {
      return c.json({ error: "Invalid webhook token" }, 401);
    }
  }

  const event = c.req.header("X-Gitlab-Event");
  if (event !== "Merge Request Hook") {
    return c.json({ message: "Event ignored" }, 200);
  }

  const body = await c.req.json();

  if (
    body.object_kind !== "merge_request" ||
    !["open", "update"].includes(body.object_attributes?.action)
  ) {
    return c.json({ message: "Action ignored" }, 200);
  }

  // Process asynchronously so we respond quickly
  handler.handleMergeRequest(body).catch((err) => {
    console.error("Failed to handle merge request:", err);
  });

  return c.json({ message: "Processing" }, 202);
});

app.get("/health", (c) => {
  return c.json({ status: "ok", service: "aspidasec-bot-gitlab" });
});

const port = Number(process.env.PORT) || 3000;
console.log(`AspidaSec GitLab bot listening on port ${port}`);
serve({ fetch: app.fetch, port });
