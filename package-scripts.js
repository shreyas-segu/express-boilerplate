const { series, rimraf } = require("nps-utils");

module.exports = {
  scripts: {
    default: "nps start",
    start: {
      script: "NODE_ENV=dev node dist/index.js",
      description: "Starts the dev built node application",
      production: {
        script: "NODE_ENV=prod node dist/index.js",
        description: "Starts the production built node application",
      },
      debug: {
        script: "NODE_ENV=dev node dist/index.js --inspect",
        description: "Starts the debug built node application",
      },
    },
    serve: {
      inspector: {
        script: series(
          "nps banner.serve",
          'nodemon -e ts --watch src --watch .env --exec "nps transpile && nps start.debug"'
        ),
        description:
          "Serves the current app and watches for changes to restart it, you may attach inspector to it.",
      },
      script: series(
        "nps banner.serve",
        'nodemon -e ts --watch src --watch .env --exec "nps transpile && nps start"'
      ),
      description:
        "Serves the current app and watches for changes to restart it",
    },
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: series(
        "nps banner.build",
        "nps lint",
        "nps clean.dist",
        "nps transpile"
      ),
      description: "Builds the app into the dist directory",
    },
    test: {
      script: series("nps banner.test"),
      description: "Runs unit tests",
    },
    lint: {
      script: eslint(`./src/**/*.ts`),
      hiddenFromHelp: true,
    },
    transpile: {
      script: `tsc`,
      hiddenFromHelp: true,
    },
    clean: {
      default: {
        script: series(`nps banner.clean`, `nps clean.dist`),
        description: "Deletes the ./dist folder",
      },
      dist: {
        script: rimraf("./dist"),
        hiddenFromHelp: true,
      },
      tmp: {
        script: rimraf("./.tmp"),
        hiddenFromHelp: true,
      },
    },
    banner: {
      build: banner("build"),
      serve: banner("serve"),
      clean: banner("clean"),
      lint: banner("lint"),
      test: banner("test"),
    },
  },
};

function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: runFast(`./commands/banner.ts ${name}`),
  };
}

function eslint(path) {
  return `eslint ${path} --ext .ts`;
}

function runFast(path) {
  return `ts-node --transpile-only ${path}`;
}
