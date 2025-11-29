export default {
  PROJECT_NAME: "VNscanner",
  PROJECT_VERSION: "0.0.5",
  getZipConfig: function () {
    return {
      outputFilePath: `./output/${this.PROJECT_NAME.toLocaleLowerCase()}-${this.PROJECT_VERSION.toLocaleLowerCase()}.zip`,
      zipInputFolderPath: `./output/${this.PROJECT_NAME}`,
    };
  },
};
