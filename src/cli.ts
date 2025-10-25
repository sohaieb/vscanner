import { Command } from "commander";
import { CONSTANTS } from "./constants";

const program = new Command();

export function getCommanderProgram() {
  program
    .name("vscan")
    .description(
      'A CLI application to scan your local from unwanted "vscode" or "vscodium" extensions'
    )
    .version(`Vscan v${CONSTANTS}`, "--version", "Display the version of vscan")
    .option(
      "-i, --impacted-file <FILE>",
      "impacted json file containing array of known impacted extensions with their versions. DEFAULT: ./input/impacted.json",
      "./input/impacted.json"
    )
    .option(
      "-v, --variant <VARIANT>",
      "variant of the VS IDE, 'code' or 'codium'. DEFAULTS: 'code'",
      "code"
    );

  program.parse();

  return program;
}
