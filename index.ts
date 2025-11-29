import chalk from "chalk";
import { getCommanderProgram } from "./src/cli";

async function main() {
  getCommanderProgram();
}

main()
  .then()
  .catch((err) => console.log(chalk.red(err?.toString())));
