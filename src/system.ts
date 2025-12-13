import { $ } from "bun";
import chalk from "chalk";
import type { VSCodeVariant } from "./types";
import { displayDivider } from "./utils";
import { Glob } from "bun";
import fs from "fs/promises";
import path from "path";
import constants from "./constants";
import { spawn } from "child_process";

const config = constants.getZipConfig();

/** Load impacted extensions list */
export async function loadImpactedExtensionsFileList(filePath: string) {
  const ftr = Bun.file(filePath);
  const impactedExts = (await ftr.json()) as string[];
  console.log(
    `Loaded impacted extensions file reference: ${chalk.bold(chalk.blue(filePath))}`
  );
  displayDivider();

  return impactedExts;
}

/** Get extensions list available in the system */
export function getExtensionsList(vscodeVariant: VSCodeVariant) {
  return $`${vscodeVariant} --list-extensions --show-versions`.quiet().lines();
}

/** Create zip file for compiled files */
export function compress(outputFileName: string, inputFolderPath: string) {
  return $`tar -a -c -f "${outputFileName}" -C ${inputFolderPath} .`;
}

/** Generate Zip for builds */
export async function generateZip() {
  console.log(chalk.blue(`Compression started..`));
  await compress(config.outputFilePath, config.zipInputFolderPath);
}

/** Clean output builds  */
export async function cleanBuilds() {
  const glob = new Glob("**/*");
  let isError: boolean = false;

  console.log(chalk.blue('Start cleaning "output" folder..'));

  try {
    // Scans output directory and delete the found files
    for await (const foundPath of glob.scan("./output")) {
      await fs.rm(path.join(".", "output", foundPath));
    }

    // Check if output/{project_name} exists and remove it
    const vnScannerFolder = path.join(
      ".",
      "output",
      constants.PROJECT_NAME.toLocaleLowerCase()
    );
    if (await fs.exists(vnScannerFolder)) {
      await fs.rmdir(vnScannerFolder);
    }

    isError = false;
  } catch (error) {
    isError = true;
    console.log(chalk.red(error?.toString()));
  } finally {
    if (isError) {
      console.log(chalk.blue(`Cleaning ended with ${chalk.bold("errors")}..`));
    } else {
      console.log(chalk.green(`Cleaning ended successfully!`));
    }
  }
}

type InteractiveProcessArgs = {
  command: string;
  args: string[];
  cwd: string;
};
/** Run process in interactive mode */
export function runInteractiveProcess({
  command,
  args,
  cwd,
}: InteractiveProcessArgs) {
  return new Promise((res, rej) => {
    const subprocess = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    subprocess.on("exit", (code) => {
      if (code === 0) {
        res(undefined);
      } else {
        rej(new Error(`Process ended with code ${0}`));
      }
    });
  });
}
