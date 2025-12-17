# ✨ VNScanner

VNScanner is a script to make an easy fast scan of your local system to catch the **Unwanted** VSCode/VSCodium installed extensions or NPM packages infected by supply chain attack called "Shai-Hulud 2.0".

VScode or VCodium scan bases on the provided `./input/impacted.json` list of the vulnerable extensions, as well as it can be extended manually by your own or set a custom json file in the options (below).

- Npm-scan bases on an input file of the packages infected (collected via trusted cybersecurity websites). You can transform CSV file using the command `vnscanner transform <input-file>  [output-file]`.

  Check [To execute NPM supply chain attack scan](#-to-execute-npm-supply-chain-attack-scan) section below.

- VNScanner now supports scanning your repositories from **React2Shell vulnerabilities** [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478).

  Check [To execute React2Shell scan](#-to-execute-react2shell-scan) section below.

## 🚀 To install dependencies:

```bash
bun install
```

## 📦 To run in DEV mode:

```bash
bun run index.ts -h
```

## ❓ Display command help

```bash
(Mac | Linux) > ./output/vncanner -h
(win)         > ./output/vncanner.exe -h
```

## 💻 To execute VsStudio/VsCodium Scan:

- Execute with variant option:

```bash
# "codium" for system-installed VSCodium IDE,
# for VisualStudio use "code" (default) instead
(Mac | Linux) > ./output/vncanner vs-scan -v codium
(win)         > ./output/vncanner.exe vs-scan -v codium
```

- Execute with custom impacted file option:

```bash
(Mac | Linux) > ./output/vncanner vs-scan -i ./input/mycustom.json
(win)         > ./output/vncanner.exe vs-scan -i ./input/mycustom.json
```

## 🔍 To execute Npm Supply Chain attack scan:

- Execute project/repo scan:

```bash
(Mac | Linux) > ./output/vncanner npm-scan -p . ./input/output.json
(win)         > ./output/vncanner.exe npm-scan -p . ./input/output.json
```

- Execute global scan:

```bash
(Mac | Linux) > ./output/vncanner npm-scan -g ./input/output.json
(win)         > ./output/vncanner.exe npm-scan -g ./input/output.json
```

## 👓 To execute React2Shell scan:

Uses the official [fix-react2shell-next](https://www.npmjs.com/package/fix-react2shell-next) in background.

For more details, check: [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)

```bash
(Mac | Linux) > ./output/vncanner r2s ./your/repository/path
(win)         > ./output/vncanner.exe r2s ./your/repository/path
```

## 🌌 Execute transform CSV to JSON:

Map NPM packages **(Package Name, Version)** to JSON file:

```bash
(Mac | Linux) > ./output/vncanner transform ./input.csv ./output.json
(win)         > ./output/vncanner.exe transform ./input.csv ./output.json
```

## ⚙ For Developers

To compile the cli intto a portable executable file (All-in-One):

```bash
bun compile
# you will find the output in:
(Mac | Linux) > ./output/vncanner
(win)         > ./output/vncanner.exe
```

# 👤 Author

[Sohaieb Azaiez](https://www.linkedin.com/in/azsoh/)

# 📄 License

This script is under the [MIT License](./LICENSE)
