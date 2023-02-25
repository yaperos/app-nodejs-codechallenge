const { series, rimraf } = require('nps-utils'); // not required, but handy!

module.exports = {
  scripts: {
    default: 'nps start',
    start: {
      script: 'cross-env NODE_ENV=pro node ./dist/index.js',
      description: '',
    },
    dev: {
      script: 'cross-env NODE_ENV=dev nodemon -L --exec ts-node -- ./src/index.ts',
      description: '',
    },
    pro: {
      script: 'cross-env NODE_ENV=pro nodemon -L --exec ts-node -- ./src/index.ts',
      description: '',
    },
    lint: {
      script: 'tslint -t stylish --project "tsconfig.json" --fix',
      hiddenFromHelp: true,
    },
    build: {
      script: series('nps lint', 'nps clean.dist', 'nps transpile'),
      description: 'Builds the app into the dist directory',
    },
    transpile: {
      script: `tsc`,
      hiddenFromHelp: true,
    },
    clean: {
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true,
      },
    },
  },
};
