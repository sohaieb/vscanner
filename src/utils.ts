import chalk from "chalk";
import ora from "ora";
import type { SpinnerName, Spinner } from "cli-spinners";

/**
 *  Remove double "@@" of versions
 *  @example
 *  const original = "@@1.2.3"
 *  const formatted = formatExtension(original)
 *  output: "@1.2.3"
 */
export function formatExtension(extension: string) {
  return extension.replace(/@+/g, "@");
}

/**
 * Normalize Impacted extensions
 */
export function normalizeVersions(extensions: string[]) {
  return extensions.map(formatExtension);
}

/**
 * Check and verify installed extensions and get formatted results
 */
export async function getAnalyzeResults(
  systemExtensions: AsyncIterable<string>,
  impactedExtensions: string[]
) {
  const resultedLines = [];
  for await (const line of systemExtensions) {
    const formattedLine = formatExtension(line);
    const isImpacted = impactedExtensions.includes(formattedLine);
    const resultedLine = formattedLine.replace(
      /(@\d+\.\d+\.\d+)/g,
      `@${isImpacted ? chalk.bold(chalk.red("$1")) + " ❌ (Must be Removed)" : chalk.green("$1") + " ✅"}`
    );
    resultedLines.push(resultedLine);
  }

  return resultedLines;
}

/**
 * Display scan results in formatted colored way
 */
export function displayFormattedResults(extensions: string[]) {
  console.log(chalk.blue(`Scan results:\n`));
  extensions.forEach((extension) => {
    console.log(extension);
  });
}

/**
 * Display Terminal divider
 */
export function displayDivider() {
  console.log(`--------------------`);
}

/**
 * Display terminal spinner
 */
export function displayLoadingSpinner(
  label?: string,
  spinnerType?: SpinnerName | Spinner
) {
  const spinner = ora({
    spinner: spinnerType ?? "circle",
    text: label,
  }).start();

  return spinner;
}
