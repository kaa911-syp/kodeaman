import type { Context } from "probot";

const COMMENT_MARKER = "<!-- aspidasec-security-report -->";

export class GitHubCommentManager {
  async findExistingComment(
    context: Context<"pull_request">,
    prNumber: number,
  ): Promise<number | null> {
    const { data: comments } = await context.octokit.issues.listComments({
      ...context.repo(),
      issue_number: prNumber,
      per_page: 100,
    });

    const existing = comments.find((c) =>
      c.body?.includes(COMMENT_MARKER),
    );

    return existing?.id ?? null;
  }

  async createOrUpdateComment(
    context: Context<"pull_request">,
    prNumber: number,
    body: string,
  ): Promise<void> {
    const markedBody = `${COMMENT_MARKER}\n${body}`;
    const existingId = await this.findExistingComment(context, prNumber);

    if (existingId) {
      await context.octokit.issues.updateComment({
        ...context.repo(),
        comment_id: existingId,
        body: markedBody,
      });
    } else {
      await context.octokit.issues.createComment({
        ...context.repo(),
        issue_number: prNumber,
        body: markedBody,
      });
    }
  }
}
