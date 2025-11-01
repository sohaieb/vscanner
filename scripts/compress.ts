import chalk from "chalk";
import { CONSTANTS } from "../src/constants";
import { generateZip } from "../src/system";

try {
  await generateZip();
  console.log(
    chalk.green(
      `Zip created: ${chalk.greenBright(CONSTANTS.getZipOutputFilePath())}`
    )
  );
} catch (error) {
  console.error(error);
}
