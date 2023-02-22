import * as vscode from "vscode";

export default class Tracker {
  protected observer: ((count: number) => void)[] = [];
  protected today: Date | undefined;

  private _currentCount: number | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.syncTime();
    this.track();
  }

  /**
   * Track the number of lines written today
   */
  public track() {
    const tracker = vscode.workspace.onDidChangeTextDocument((event) => {
      const newLines = event.contentChanges.filter((change) =>
        change.text.includes("\n")
      ).length;
      this.updateState(newLines);
    });

    this.context.subscriptions.push(tracker);
  }

  /**
   * Observe the number of lines written today
   * @param callback Callback function to be called when the number of lines written today changes
   */
  public observe(callback: (count: number) => void) {
    this.observer.push(callback);
    this.observer.forEach((callback) => callback(this.getState()));
  }

  /**
   * Update the state of the extension
   * @param count Number of lines written today
   */
  private updateState(count: number) {
    // Check if new day and reset count
    this.syncTime();

    // Update the state
    const newCount = this.getState() + count;
    this.context.globalState.update("count", newCount);
    this._currentCount = newCount;

    this.observer.forEach((callback) => callback(newCount));
  }

  /**
   * Get the number of lines written today
   * @returns Number of lines written today
   */
  private getState(): number {
    // Cache the current count to avoid unnecessary calls to the global state
    if (this._currentCount === undefined) {
      this._currentCount =
        (this.context.globalState.get("count") as number | undefined) || 0;
    }

    return this._currentCount;
  }

  /**
   * Check if state is from another day and reset
   */
  private syncTime() {
    if (this.today?.getDate() !== new Date().getDate()) {
      // Check if state is from another day and reset
      this.today = new Date();
      const lastUpdated = this.context.globalState.get("lastUpdated") as
        | string
        | undefined;

      if (
        !lastUpdated ||
        this.today.getDate() !== new Date(lastUpdated)?.getDate()
      ) {
        this.context.globalState.update("count", 0);
        this.context.globalState.update(
          "lastUpdated",
          this.today.toISOString()
        );

        this._currentCount = 0;
      }
    }
  }
}
