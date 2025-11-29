import chalk from "chalk";
import {
  displayDivider,
  displayFormattedResults,
  getAnalyzeResults,
  normalizeVersions,
} from "../utils";
import {
  getExtensionsList as getAvailableSystemExtensions,
  loadImpactedExtensionsFileList,
} from "../system";
import type { VSCodeVariant } from "../types";
import fs from "fs/promises";
import path from "path";
import { $ } from "bun";
import type { Command } from "commander";

export async function startScan(program: Command, options: any) {
  const vscodeVariant: VSCodeVariant =
    (options.variant as VSCodeVariant) ?? "code";
  try {
    const isImpactedExistsInRoot = await fs.exists("./impacted.json");

    const defaultImpactedFile = isImpactedExistsInRoot
      ? "./impacted.json"
      : "./input/impacted.json";

    // Init
    const impactedPath = path.join(options.impactedFile ?? defaultImpactedFile);

    // Read Impacted extensions file
    const impactedExtensions =
      await loadImpactedExtensionsFileList(impactedPath);
    const normalizedImpactedExtensions = normalizeVersions(impactedExtensions);

    const systemExtensionsList =
      await getAvailableSystemExtensions(vscodeVariant);

    const scanResults = await getAnalyzeResults(
      systemExtensionsList,
      normalizedImpactedExtensions
    );

    displayFormattedResults(scanResults);
  } catch (error) {
    if (error instanceof $.ShellError) {
      console.log(
        chalk.red(
          `Failed: Error while executing "${chalk.bold(vscodeVariant)}" system command.`
        ),
        chalk.red(
          "\nProbably needs to specify variant (-v, --variant). Please check the help below."
        )
      );
    } else {
      console.log(chalk.red(`Failed: ${error}`));
    }
    displayDivider();
    program.help();
  }
}
