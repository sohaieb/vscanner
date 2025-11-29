import chalk from "chalk";
import constants from "../src/constants";
import { generateZip } from "../src/system";
const config = constants.getZipConfig();
try {
  await generateZip();
  console.log(
    chalk.green(`Zip created: ${chalk.greenBright(config.outputFilePath)}`)
  );
} catch (error) {
  console.error(error);
}
