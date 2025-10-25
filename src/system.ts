import { $ } from "bun";
import chalk from "chalk";
import type { VSCodeVariant } from "./types";
import { displayDivider } from "./utils";

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
