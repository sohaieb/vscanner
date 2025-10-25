import path from "path";
import { getCommanderProgram } from "./src/cli";
import {
  getExtensionsList as getAvailableSystemExtensions,
  loadImpactedExtensionsFileList,
} from "./src/system";
import type { VSCodeVariant } from "./src/types";
import {
  displayDivider,
  displayFormattedResults,
  getAnalyzeResults,
  normalizeVersions,
} from "./src/utils";
import chalk from "chalk";
import { $ } from "bun";

async function main() {
  const program = getCommanderProgram();

  const options = program.opts();

  // Init
  const impactedPath = path.join(
    options.impactedFile ?? "./input/impacted.json"
  );
  const vscodeVariant: VSCodeVariant =
    (options.variant as VSCodeVariant) ?? "code";

  // Read Impacted extensions file
  const impactedExtensions = await loadImpactedExtensionsFileList(impactedPath);
  const normalizedImpactedExtensions = normalizeVersions(impactedExtensions);

  try {
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

main().then();
