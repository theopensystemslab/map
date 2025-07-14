// https://pitsby.com/documentation#config
module.exports = {
  projects: [
    {
      engine: "vanilla",
      collectDocsFrom: "./src/components/",
    },
  ],
  styles: ["./dist/map.css"],
  scripts: ["./dist/component-lib.es.js", "./dist/component-lib.umd.js"],
  custom: {
    windowTitle: "Docs - Place Components",
  },
};
