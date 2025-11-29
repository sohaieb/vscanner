import { spawn, type BunFile } from "bun";
import chalk from "chalk";
import * as csv from "fast-csv";
import { format } from "prettier";
import { promises } from "fs";
import { join } from "path";

export type Package = {
  name: string;
  version: string;
};

/**
 * Transform CSV file to JSON file
 */
export function transformCsvToJson(
  fileDescriptor: BunFile,
  outputFilePath?: string
) {
  return new Promise(async (res, rej) => {
    const packages: Package[] = [];
    const streamedFile = fileDescriptor.stream();
    const text = await streamedFile.text();

    // Parse
    csv
      .parseString(text, {
        headers: true,
      })
      .on("error", (error) => {
        console.error(error);
        rej(error);
      })
      .on("data", (row) => {
        packages.push({
          name: row["Package Name"],
          version: row["Version"],
        });
      })
      .on("end", async (rowCount: number) => {
        const fd = Bun.file(outputFilePath ?? "./input/output.json", {
          type: "application/json",
        });
        const formattedContent = await format(JSON.stringify(packages), {
          parser: "json",
        });
        fd.write(formattedContent);
        res(rowCount);
      });
  });
}

/**
 * Perform scan
 */
export async function startScan(
  inputPath: string,
  isGlobal: boolean,
  projectPathInput?: string
) {
  const baseNpmCommand = "npm ls -a --silent";
  const command = isGlobal ? `${baseNpmCommand} -g` : baseNpmCommand;
  const subprocess = spawn({
    cmd: [...command.split(" ")],
    cwd: isGlobal ? undefined : projectPathInput,
    stdout: "pipe",
  });

  const commandOuput = await subprocess.stdout.text();
  const matches = commandOuput.matchAll(/(?<=\s)([\w\-._#]+@\d*\.\d*\.\d*)/g);

  const installedPackages: Package[] = [];
  for (let matched of matches) {
    const fullPackage = matched[0].split("@");
    installedPackages.push({
      name: fullPackage[0]!,
      version: fullPackage[1]!,
    });
  }

  const fd = Bun.file(inputPath);
  const impactedJson = (await fd.json()) as Package[];
  console.log(chalk.blueBright("Check installed packages.."));
  const findings = installedPackages
    .map((installedPackage) => {
      if (checkIfInfected(installedPackage, impactedJson)) {
        return {
          ...installedPackage,
          status: "impacted",
        };
      }
      return {
        ...installedPackage,
        status: "safe",
      };
    })
    .filter(
      (obj, index, self) =>
        index ===
        self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))
    );
  console.log(chalk.blueBright("Check installed packages end."));

  console.log(chalk.blueBright("Check node_modules and sub-folders:"));
  const filesFound = await checkBunPayloads(isGlobal, projectPathInput);
  console.log(chalk.blueBright("Check node_modules and sub-folders ended."));

  const formattedFindings = findings.map((installedPackage) => {
    if (installedPackage.status === "impacted") {
      return `❗ ${chalk.red(installedPackage.name + "@" + installedPackage.version)}`;
    }
    return `✔ ${chalk.greenBright(installedPackage.name + "@" + installedPackage.version)}`;
  });

  const foundOutPut = formattedFindings.join("\n").trim();

  console.log();

  console.log(foundOutPut);
  console.log("-------------------------------------");
  if (filesFound.length > 0) {
    console.log(`Potential unwanted files/directories found:`);
    filesFound.forEach((filePath) => {
      console.log(chalk.red(filePath));
    });
    console.log("-------------------------------------");
  }

  if (
    // findings.some((finding) => finding.status === "impacted") ||
    filesFound.length > 0
  ) {
    console.log(
      chalk.red(
        "❌ Your PC is NOT safe!\nplease consider fixing the impacted packages above."
      )
    );
  } else {
    console.log(chalk.greenBright("✅ Your PC is safe 🎉🎉🎉!"));
  }
}

/**
 * Check if installed package is in the list of infected packages
 */
function checkIfInfected(
  installedPackage: Package,
  impactedPackages: Package[]
) {
  return impactedPackages.some(
    (impactedPackage) =>
      impactedPackage.name.includes(installedPackage.name) &&
      impactedPackage.version === installedPackage.version
  );
}

/**
 * Check Bun Malware Payloads files
 */
async function checkBunPayloads(isGlobal: boolean, projectPathInput?: string) {
  const baseNpmCommand = "npm root --silent";
  const command = isGlobal ? `${baseNpmCommand} -g` : baseNpmCommand;
  const subprocess = spawn({
    cmd: [...command.split(" ")],
    cwd: isGlobal ? undefined : projectPathInput,
    stdout: "pipe",
  });

  const commandOuput = await subprocess.stdout.text();
  const startingPath = commandOuput.trim();
  const unwanted = ["bun_environment.js", "setup_bun.js", ".truffler-cache/"];
  console.log(chalk.blueBright(`Start checking: ${unwanted.join(', ')}`))
  const pathsToScanFor = new Set(
    unwanted.flatMap((entry) => [entry, `**/*/${entry}`])
  );

  const files = promises.glob(Array.from(pathsToScanFor), {
    cwd: join(startingPath, ".."),
  });

  const findings = [];
  for await (const filePath of files) {
    findings.push(filePath);
  }

  return findings;
}
