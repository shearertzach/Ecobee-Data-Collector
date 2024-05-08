import { generateAccessToken, generatePin } from "../../routes/auth";
import { consoleLogger, databaseLogger } from "../logger";
import { Args } from "../types/global";

export function waitKeyPressed() {
  return new Promise((resolve) => {
    const wasRaw = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      process.stdin.setRawMode(wasRaw);
      resolve(data.toString());
    });
  });
}

export async function setup() {
  consoleLogger("Generating new Pin...");
  const pinResponse = await generatePin();
  if (pinResponse.Status === "Error") throw new Error(pinResponse.Error);
  consoleLogger("New Pin Generated: " + pinResponse.ecobeePin);

  // Break and wait for user to enter Pin in Ecobee dashboard
  consoleLogger(
    "Visit the Ecobee dashboard and please enter the above Pin that was generated. Press Enter to Continue"
  );
  await waitKeyPressed();

  while (true) {
    // Access Token Generation
    const accessTokenResponse = await generateAccessToken(pinResponse.code);
    if (accessTokenResponse.Status === "Error") {
      consoleLogger(accessTokenResponse.Error);
      await waitKeyPressed();
      continue;
    }

    databaseLogger("Stored new Access Token in Database");
    consoleLogger("New Access Token Generated and Stored in Database");
    break;
  }

  consoleLogger(
    "Setup Complete! When you are ready to start loggin data, press Enter."
  );
  await waitKeyPressed();
}

export function parseArgs(args: Array<any>): Array<Args> {
  const newArgs:Array<Args> = []

  args.map((arg: string) => {
    const [key, value] = arg.split("=")
    newArgs.push({ name: key.replace("--", ""), value: value})
  });


  return newArgs
}
