// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import Tracker from "./tracker";
import Show from "./show";
import Milestone from "./milestone";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Initialize the tracker and show classes
  const tracker = new Tracker(context);
  const show = new Show(context);
  const milestone = new Milestone(context);

  // Register state change listener
  tracker.observe(show.updateStatusBarItem.bind(show));
  tracker.observe(milestone.track.bind(milestone));
}

// This method is called when your extension is deactivated
export function deactivate() {}
