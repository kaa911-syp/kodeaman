import * as vscode from "vscode";
import { findingsToDiagnostics } from "./diagnostics";
import { runAspidaSecScan } from "./scan-runner";

let diagnostics: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext): void {
  diagnostics = vscode.languages.createDiagnosticCollection("aspidasec");
  context.subscriptions.push(diagnostics);

  context.subscriptions.push(
    vscode.commands.registerCommand("aspidasec.scanWorkspace", async () => {
      await scanWorkspace();
    }),
    vscode.commands.registerCommand("aspidasec.clearDiagnostics", () => {
      diagnostics.clear();
      void vscode.window.showInformationMessage("AspidaSec diagnostics cleared.");
    }),
  );
}

export function deactivate(): void {
  diagnostics?.dispose();
}

async function scanWorkspace(): Promise<void> {
  const workspaceFolder = await selectWorkspaceFolder();
  if (!workspaceFolder) {
    return;
  }

  const config = vscode.workspace.getConfiguration("aspidasec");
  const cliPath = config.get<string>("cliPath", "aspidasec");
  const maxBuffer = config.get<number>("maxBuffer", 10 * 1024 * 1024);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Running AspidaSec security scan",
      cancellable: false,
    },
    async () => {
      try {
        const result = await runAspidaSecScan({
          cliPath,
          workspaceRoot: workspaceFolder.uri.fsPath,
          maxBuffer,
        });

        diagnostics.clear();
        const entries = findingsToDiagnostics(result.findings, workspaceFolder.uri.fsPath);
        const byUri = new Map<string, { uri: vscode.Uri; diagnostics: vscode.Diagnostic[] }>();

        for (const entry of entries) {
          const key = entry.uri.toString();
          const existing = byUri.get(key);
          if (existing) {
            existing.diagnostics.push(entry.diagnostic);
          } else {
            byUri.set(key, { uri: entry.uri, diagnostics: [entry.diagnostic] });
          }
        }

        for (const entry of byUri.values()) {
          diagnostics.set(entry.uri, entry.diagnostics);
        }

        void vscode.window.showInformationMessage(
          `AspidaSec scan completed with ${result.totalFindings} finding${result.totalFindings === 1 ? "" : "s"}.`,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`AspidaSec scan failed: ${message}`);
      }
    },
  );
}

async function selectWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
  const folders = vscode.workspace.workspaceFolders;

  if (!folders || folders.length === 0) {
    void vscode.window.showWarningMessage("Open a workspace folder before running AspidaSec.");
    return undefined;
  }

  if (folders.length === 1) {
    return folders[0];
  }

  const selected = await vscode.window.showWorkspaceFolderPick({
    placeHolder: "Select the workspace folder to scan with AspidaSec",
  });

  return selected;
}
