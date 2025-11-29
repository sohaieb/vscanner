import { Command } from "commander";
import constants from "./constants";
import {
  startScan as startScanNpm,
  transformCsvToJson,
} from "./tools/npm-scan-helpers";
import { startScan as startScanCode } from "./tools/vs-scan-helpers";
import { displayLoadingSpinner } from "./utils";

const program = new Command();

export function getCommanderProgram() {
  /**
   * Initialization of the command program
   */
  program
    .name("VNscanner")
    .description(
      `A CLI application to scan your local from unwanted "vscode","vscodium" extensions OR "NPM" installed packages infected by supply chain attack Sha1-Hulud.`
    )
    .version(
      `${constants.PROJECT_NAME} v${constants.PROJECT_VERSION}`,
      "--version",
      "Display the version of the program."
    );

  /**
   * VisualStudio and VsCodium scanner
   */
  program
    .command("vs-scan")
    .option(
      "-i, --impacted-file <FILE>",
      "impacted json file containing array of known impacted extensions with their versions. DEFAULT: ./input/impacted.json",
      "./input/impacted.json"
    )
    .option(
      "-v, --variant <VARIANT>",
      "variant of the VS IDE, 'code' or 'codium'. DEFAULTS: 'code'",
      "code"
    )
    .action(async (options) => {
      const spinner = displayLoadingSpinner();
      await startScanCode(program, options);
      spinner.clear();
      spinner.stop();
    });

  /**
   * NPM packages scanner
   */
  program
    .command("npm-scan")
    .description(
      "Scan your local from infected NPM packages by Supply Attack Chain payloads"
    )
    .argument("<input>", "Path of the input file to base on when scanning")
    .option("-p,--project <path>", "Path of the repository project to scan")
    .option(
      "-g,--global",
      'If this flag is set, a global scan will be performed. "-p" will be skipped.',
      false
    )
    .action(async (inputFile, options) => {
      const spinner = displayLoadingSpinner();
      const projectPath = options.project;
      const isGlobal = options.global;
      await startScanNpm(inputFile, isGlobal, projectPath);
      spinner.clear();
      spinner.stop();
    });

  program
    .command("transform")
    .description("Transform a CSV file into JSON")
    .argument("<input-file>", "Path of the input csv file.")
    .argument(
      "[output-file]",
      "Path of the output json file. Utility for 'npm-scan' command"
    )
    .action((inputFile, outputFile) => {
      const spinner = displayLoadingSpinner();
      const fd = Bun.file(inputFile);
      transformCsvToJson(fd, outputFile);
      spinner.clear();
      spinner.stop();
    });

  program.parse();
}
