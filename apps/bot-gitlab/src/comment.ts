const COMMENT_MARKER = "<!-- aspidasec-security-report -->";

export class GitLabCommentManager {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl?: string, token?: string) {
    this.apiUrl = apiUrl || process.env.GITLAB_API_URL || "https://gitlab.com/api/v4";
    this.token = token || process.env.GITLAB_TOKEN || "";
  }

  async findExistingNote(
    projectId: number,
    mrIid: number,
  ): Promise<number | null> {
    const url = `${this.apiUrl}/projects/${projectId}/merge_requests/${mrIid}/notes?per_page=100`;
    const res = await fetch(url, {
      headers: { "PRIVATE-TOKEN": this.token },
    });

    if (!res.ok) return null;

    const notes = (await res.json()) as Array<{ id: number; body: string }>;
    const existing = notes.find((n) => n.body.includes(COMMENT_MARKER));

    return existing?.id ?? null;
  }

  async createOrUpdateNote(
    projectId: number,
    mrIid: number,
    body: string,
  ): Promise<void> {
    const markedBody = `${COMMENT_MARKER}\n${body}`;
    const existingId = await this.findExistingNote(projectId, mrIid);

    if (existingId) {
      const url = `${this.apiUrl}/projects/${projectId}/merge_requests/${mrIid}/notes/${existingId}`;
      await fetch(url, {
        method: "PUT",
        headers: {
          "PRIVATE-TOKEN": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: markedBody }),
      });
    } else {
      const url = `${this.apiUrl}/projects/${projectId}/merge_requests/${mrIid}/notes`;
      await fetch(url, {
        method: "POST",
        headers: {
          "PRIVATE-TOKEN": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: markedBody }),
      });
    }
  }
}
