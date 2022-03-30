module.exports = {
  projects: [
    {
      engine: "vanilla",
      collectDocsFrom: "./src/components/",
    },
  ],
  styles: ["./dist/style.css"],
  scripts: ["./dist/component-lib.es.js", "./dist/component-lib.umd.js"],
};
