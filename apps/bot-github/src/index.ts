import { Probot } from "probot";
import { PRHandler } from "./handler.js";

export default function kodeamanBot(app: Probot): void {
  const handler = new PRHandler();

  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async (context) => {
      await handler.handlePullRequest(context);
    },
  );

  app.log.info("KodeAman GitHub bot loaded");
}
