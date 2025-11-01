export const CONSTANTS = {
  VERSION: "0.0.4",
  ZIP_INPUT_FOLDER_PATH: "./output/vscan",
  getZipOutputFilePath: function () {
    return `./output/vscan-${this.VERSION}.zip`;
  },
};
