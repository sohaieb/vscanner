# VScan

VSCan is a script to make an easy fast scan of your local system to catch the **Unwanted** VSCode/VSCodium installed extensions. The scan bases on the provided `./input/impacted.json` list of the vulnerable extensions, as well as it can be extended manually by your own or set a custom json file in the options (below).

### To install dependencies:

```bash
bun install
```

### To run in DEV mode:

```bash
bun run index.ts -h
```

### To compile to an executable file (All-in-One):

```bash
bun compile
# you will find the output in:
(Mac | Linux) > ./output/vscan
(win)         > ./output/vscan.exe
```

### To execute:

#### Display command help

```bash
(Mac | Linux) > ./output/vscan -h
(win)         > ./output/vscan.exe -h
```

#### Execute with variant option:

```bash
# codium for system-installed VSCodium IDE,
# for VisualStudio use "code" (default) instead
(Mac | Linux) > ./output/vscan -v codium
(win)         > ./output/vscan.exe -v codium
```

#### Execute with custom impacted file option:

```bash
# codium for system-installed VSCodium IDE,
# for VisualStudio use "code" (default) instead
(Mac | Linux) > ./output/vscan -i ./input/mycustom.json
(win)         > ./output/vscan.exe -i ./input/mycustom.json
```

# License

This script is under the [MIT License](./LICENSE)
