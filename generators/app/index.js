const Generator = require("yeoman-generator");
const yosay = require("yosay");
const chalk = require("chalk");
const askName = require("inquirer-npm-name");
const path = require('path');

const pkgManagerMap = {
  yarn() {
    this.yarnInstall();
  },
  npm() {
    this.npmInstall();
  }
};

module.exports = class extends Generator {
  initializing() {
    this.answers = {
      packageAnswers: {},
      packageManagerPrefs: {}
    };
    this.log(yosay(chalk.green(`Let's Scaffold Awesome Express App`)));
  }

  async prompting() {
    const { name } = this.user.git;
    const { name: appName } = await askName(
      {
        name: "name",
        message: "Your app name",
        default: path.basename(process.cwd()),
        // filter: makeGeneratorName,
        // validate: str => {
        //   return str.length > "generator-".length;
        // }
      },
      this
    );
    this.answers.packageAnswers.app_name = appName;
    this.answers.packageAnswers = {
      ...(await this.prompt([
        {
          type: "input",
          name: "app_version",
          message: "App Version",
          default: "0.0.1"
        },
        {
          type: "input",
          name: "app_description",
          message: "App Description",
          default: "Express Js App"
        },
        {
          type: "input",
          name: "main_file",
          message: "Entry Point for the app",
          default: "index.js"
        },
        {
          type: "input",
          name: "author",
          message: "Author",
          default: `${name()}`
        },
        {
          type: "input",
          name: "license",
          message: "License Type?",
          default: "ISC"
        }
      ])),
      ...this.answers.packageAnswers
    };

    this.answers.packageManagerPrefs = await this.prompt({
      type: "list",
      name: "package_manager",
      message: "Select a package manager",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn", checked: true },
        { name: "jspm", value: "jspm", disabled: true }
      ]
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json.tmpl"),
      this.destinationPath("package.json"),
      { ...this.answers.packageAnswers }
    );
  }

  install() {
    const pkgManager = this.answers.packageManagerPrefs.package_manager;
    pkgManagerMap[pkgManager] && pkgManagerMap[pkgManager].call(this);
  }
};
