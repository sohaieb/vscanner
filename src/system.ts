import { $ } from "bun";
import chalk from "chalk";
import type { VSCodeVariant } from "./types";
import { displayDivider } from "./utils";
import { Glob } from "bun";
import fs from "fs/promises";
import path from "path";
import { CONSTANTS } from "./constants";

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
export function compress(fileName: string, folderPath: string) {
  return $`tar -a -c -f "${fileName}" -C ${folderPath} .`;
}

/** Generate Zip for builds */
export async function generateZip() {
  console.log(chalk.blue(`Compression started..`));
  await compress(
    CONSTANTS.getZipOutputFilePath(),
    CONSTANTS.ZIP_INPUT_FOLDER_PATH
  );
}

// Clean output builds
export async function cleanBuilds() {
  const glob = new Glob("**/*");
  let isError: boolean = false;

  console.log(chalk.blue('Start cleaning "output" folder..'));

  try {
    // Scans output directory and delete the found files
    for await (const foundPath of glob.scan("./output")) {
      await fs.rm(path.join(".", "output", foundPath));
    }

    // Check if output/vscan exists and remove it
    const vscanFolder = path.join(".", "output", "vscan");
    if (await fs.exists(vscanFolder)) {
      await fs.rmdir(vscanFolder);
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
