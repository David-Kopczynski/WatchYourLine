import * as vscode from "vscode";

export default class Tracker {
  protected readonly count = "count";
  protected readonly lastUpdated = "lastUpdated";

  protected observer: ((count: number) => void)[] = [];
  protected readonly observerUpdate = this.count;

  private _today: Date | undefined;
  private _currentCount: number | undefined;

  constructor(private context: vscode.ExtensionContext) {
    (async () => {
      await this.syncTime();
      await this.initObserver();

      this.track();
    })();
  }

  /**
   * Track the number of lines written today
   */
  public track() {
    this.context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        // Only track files by the user
        if (event.document.uri.scheme !== "file") return;

        // And if not an undo or redo operation
        if (event.reason) return;

        const newLines = event.contentChanges.reduce(
          (sum, change) => sum + (change.text.match(/\n/g) || []).length,
          0
        );

        if (newLines) this.updateState(newLines);
      })
    );
  }

  /**
   * Observe the number of lines written today
   * @param callback Callback function to be called when the number of lines written today changes
   */
  public observe(callback: (count: number) => void) {
    this.observer.push(callback);
    if (this._currentCount !== undefined) callback(this._currentCount);
  }

  /**
   * Observe the number of lines written today and update the state
   */
  protected async initObserver() {
    // Load initial state
    this._currentCount = this.context.globalState.get(this.count);
    this.observer.forEach((callback) => callback(this._currentCount as number));

    // Observer to update the state
    this.context.subscriptions.push(
      this.context.secrets.onDidChange(async (event) => {
        if (event.key === this.observerUpdate) {
          this._currentCount = parseInt(
            (await this.context.secrets.get(this.observerUpdate)) || "0"
          );

          this.observer.forEach((callback) =>
            callback(this._currentCount as number)
          );
        }
      })
    );
  }

  /**
   * Trigger global state observer
   */
  protected async triggerObserver() {
    this.context.secrets.store(this.observerUpdate, `${this._currentCount}`);
  }

  /**
   * Update the state of the extension
   * @param count Number of lines written today
   */
  protected async updateState(count: number) {
    // Prevent count loss on extension load
    if (this._currentCount !== undefined) {
      // Check if new day and reset count
      await this.syncTime();

      // Update the state
      const newCount = this._currentCount + count;
      await this.context.globalState.update(this.count, newCount);
      this._currentCount = newCount;

      // Trigger observer
      await this.triggerObserver();
    }
  }

  /**
   * Check if state is from another day and reset
   */
  protected async syncTime() {
    if (this._today?.getDate() !== new Date().getDate()) {
      // Check if state is from another day and reset
      this._today = new Date();
      const lastUpdated = this.context.globalState.get(this.lastUpdated) as
        | string
        | undefined;

      if (
        !lastUpdated ||
        this._today.getDate() !== new Date(lastUpdated)?.getDate()
      ) {
        await this.context.globalState.update(this.count, 0);
        await this.context.globalState.update(
          this.lastUpdated,
          this._today.toISOString()
        );
        this._currentCount = 0;
      }
    }
  }
}
