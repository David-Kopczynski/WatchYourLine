import * as vscode from "vscode";

export default class Milestone {
  protected readonly magicNumbers = [
    69, 100, 420, 1000, 1337, 2000, 3000, 4000, 5000,
  ];
  private _lastMilestone: number = 0;

  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Track the number of lines written today and show a message when the user reaches a milestone
   * @param count Number of lines written today
   */
  public track(count: number) {
    // Check if the user has reached a milestone
    if (count != this._lastMilestone && this.magicNumbers.includes(count)) {
      switch (count) {
        case 69:
          this.show("Nice. 😏");
          break;

        case 420:
          this.show("Smoke Weed Everyday 😮‍💨🌿");
          break;

        case 1337:
          this.show("1337 == leet 🤓");
          break;

        case 5000:
          this.show(
            "You should be proud of yourself! 🥳 Now go outside and touch some grass! 🌱"
          );

        default:
          this.show(`You have written ${count} lines today! 🥳 Keep it up!`);
      }

      // Keep track of the last milestone reached
      this._lastMilestone = count;
    }
  }

  /**
   * Show a message when the user reaches a milestone
   * @param text Number of lines written today
   */
  private show(text: string) {
    vscode.window.showInformationMessage(text, "🫠");
  }
}
