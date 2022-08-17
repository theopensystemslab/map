// https://pitsby.com/documentation#config
module.exports = {
  projects: [
    {
      engine: "vanilla",
      collectDocsFrom: "./src/components/",
    },
  ],
  styles: ["./dist/style.css"],
  scripts: ["./dist/place-components.es.js", "./dist/place-components.umd.js"],
  custom: {
    windowTitle: 'Docs - Place Components',
  },
};
