import * as vscode from "vscode";

export default class Milestone {
  protected readonly magicNumbers = [
    69, 100, 187, 420, 1000, 1337, 2000,
  ] as const;
  private _lastMilestone: typeof this.magicNumbers[number] | 0 | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Track the number of lines written today and show a message when the user reaches a milestone
   * @param count Number of lines written today
   */
  public track(count: number) {
    // Load initial state
    if (this._lastMilestone === undefined)
      this._lastMilestone = this.milestoneByCount(count);

    // Check if the user has reached a milestone
    const newMilestone = this.milestoneByCount(count);

    if (newMilestone !== this._lastMilestone) {
      switch (newMilestone) {
        case 69:
          this.show("Nice. 😏");
          break;

        case 187:
          this.show("187!!!!! 🤯");
          break;

        case 420:
          this.show("Smoke Weed Everyday 😮‍💨🌿");
          break;

        case 1337:
          this.show("1337 == leet 🤓");
          break;

        case 2000:
          this.show(
            "You should be proud of yourself! 🥳 Now go outside and touch some grass! 🌱"
          );
          break;

        default:
          this.show(`You have written ${count} lines today! 🥳 Keep it up!`);
      }

      // Keep track of the last milestone reached
      this._lastMilestone = newMilestone;
    }
  }

  /**
   * Get the milestone number that the user has reached
   * @param count Number of lines written today
   * @returns Milestone number
   */
  private milestoneByCount(count: number): typeof this.magicNumbers[number] {
    return Math.max(
      ...this.magicNumbers.filter((number) => number <= count),
      0
    ) as typeof this.magicNumbers[number];
  }

  /**
   * Show a message when the user reaches a milestone
   * @param text Number of lines written today
   */
  private show(text: string) {
    if (
      vscode.workspace.getConfiguration().get("watch-your-line.milestones.show")
    )
      vscode.window.showInformationMessage(text, "🫠");
  }
}
