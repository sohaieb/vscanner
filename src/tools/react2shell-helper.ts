import chalk from "chalk";
import { glob } from "node:fs/promises";
import { dirname } from "node:path";
import { join } from "path";
import { runInteractiveProcess } from "../system";

/**
 * Perform scan
 */
export async function startScan(
  inputFolderPath: string,
  includeNodeModules?: boolean
) {
  const repositories: string[] = [];
  const globInst = await glob("**/package.json", {
    cwd: join(inputFolderPath),
    exclude: includeNodeModules ? undefined : ["**/node_modules/**"],
  });
  for await (const foundPath of globInst) {
    repositories.push(join(inputFolderPath, dirname(foundPath)));
  }

  const commandArgs = "--yes --silent fix-react2shell-next --fix";
  console.log(repositories);
  for (let repoPath of repositories) {
    console.log(chalk.blueBright(`Start scanning: ${repoPath}`));
    await runInteractiveProcess({
      command: "npx",
      args: commandArgs.split(" "),
      cwd: repoPath,
    });
  }

  console.log(chalk.greenBright("✅ Scan done!"));
  console.log(chalk.greenBright("✅ All of your Repositorie(s) are safe 🎉🎉🎉!"));
}
