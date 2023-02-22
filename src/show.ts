import * as vscode from "vscode";

export default class Show {
  item!: vscode.StatusBarItem;

  constructor(private context: vscode.ExtensionContext) {
    this.createStatusBarItem();
  }

  /**
   * Register a status bar item
   */
  public createStatusBarItem() {
    // Create a status bar item
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      Infinity
    );

    // Apply text and tooltip
    this.item.text = `Lc 0`;
    this.item.tooltip = `Today's Written Lines`;

    this.item.show();

    this.context.subscriptions.push(this.item);
  }

  /**
   * Update the status bar item
   */
  public updateStatusBarItem(count: number) {
    this.item.text = `Lc ${count}`;
  }
}
