import { $ } from "bun";
import chalk from "chalk";
import { generateZip } from "../src/system";

/**
 * This addresses a specific bug relevant to BunJS:
 * compile.windows {@link https://github.com/oven-sh/bun/issues/24079 Windows compilation Meta Data are not working}
 */
const windowsBuild = Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./output/vscan",
  bytecode: true,
  minify: true,
  compile: {
    target: "bun-windows-x64",
    outfile: "vscan-win",
    windows: {
      //   copyright: "TODO",
      //   description: "Vscan is an unwanted VScode and VScodium extensions canner",
      //   publisher: "TODO",
      //   version: CONSTANTS.VERSION,
      //   icon: "./misc/scan.ico",
    },
  },
});

const linuxBuild = Bun.build({
  entrypoints: ["./index.ts"],

  outdir: "./output/vscan",
  // bytecode: true,
  // minify: true,
  compile: {
    outfile: "vscan-linux",
    target: "bun-linux-x64",
  },
});

const macBuild = Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./output/vscan",
  // bytecode: true,
  // minify: true,
  compile: {
    outfile: "vscan-mac",
    target: "bun-darwin-x64",
  },
});

async function main() {
  try {
    console.log(chalk.blue(`Compiling started..`));
    const results = await Promise.allSettled([
      windowsBuild,
      linuxBuild,
      macBuild,
    ]);

    if (results[0].status === "rejected") {
      displayError("windows", results[0].reason);
    } else if (results[1].status === "rejected") {
      displayError("linux", results[1].reason);
    } else if (results[2].status === "rejected") {
      displayError("mac", results[2].reason);
    } else {
      await generateZip();
      await $`cp ./input/impacted.json ./output/vscan`;
      console.log(chalk.green("Build finished successfully!"));
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}

function displayError(level: "windows" | "linux" | "mac", reason: any) {
  console.log(chalk.red(`Error in '${chalk.bold(level)}' build level`));
  console.error(reason);
}

// Main program
main().then().catch(console.error);
