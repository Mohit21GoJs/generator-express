const Generator = require("yeoman-generator");
const yosay = require("yosay");
const chalk = require("chalk");
const askName = require("inquirer-npm-name");
const path = require("path");
const mkdirp = require("mkdirp");
const _ = require("lodash");

const pkgManagerMap = {
  yarn() {
    this.yarnInstall();
  },
  npm() {
    this.npmInstall();
  }
};

const appendToObj = (obj, val) => ({
  ...obj,
  ...val
});
module.exports = class extends Generator {
  initializing() {
    this.answers = {};
    this.log(yosay(chalk.green(`Let's Scaffold Awesome Express App`)));
  }

  async prompting() {
    this.answers = appendToObj(
      this.answers,
      await askName(
        {
          name: "name",
          message: "App name",
          default: path.basename(process.cwd())
        },
        this
      )
    );
    this.answers = appendToObj(
      this.answers,
      await this.prompt({
        type: "list",
        name: "packageManager",
        message: "Select a package manager",
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn", checked: true },
          { name: "jspm", value: "jspm", disabled: true }
        ]
      })
    );
  }

  default() {
    const { name } = this.answers;
    if (path.basename(this.destinationPath()) !== name) {
      this.log(
        `Your project must be inside a folder named ${name}\nI'll automatically create this folder.`
      );
      mkdirp(name);
      this.destinationRoot(this.destinationPath(name));
    }

    this.composeWith(require.resolve("generator-node/generators/app"), {
      boilerplate: false,
      name,
      projectRoot: "generators",
      skipInstall: true,
      travis: true,
      coveralls: true
    });
  }

  install() {
    const pkgManager = this.answers.packageManager;
    pkgManagerMap[pkgManager] && pkgManagerMap[pkgManager].call(this);
  }
};
