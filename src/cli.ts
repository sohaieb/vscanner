import { Command } from "commander";
import { CONSTANTS } from "./constants";

const program = new Command();

export function getCommanderProgram() {
  program
    .name("vscanner")
    .description(
      'A CLI application to scan your local from unwanted "vscode" or "vscodium" extensions'
    )
    .version(`Vscanner v${CONSTANTS}`, "--version", "Display the version of vscanner")
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
