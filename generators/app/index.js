const Generator = require("yeoman-generator");
const yosay = require("yosay");
const chalk = require("chalk");

const pkgManagerMap = {
  yarn: function() {
    this.yarnInstall();
  },
  npm: function() {
    this.npmInstall();
  }
};

module.exports = class extends Generator {
  initializing() {
    this.log(yosay(chalk.green(`Let's Scaffold This App`)));
  }

  async prompting() {
    const { name } = this.user.git;
    this.answers = await this.prompt([
      {
        type: "input",
        name: "app_name",
        message: "Your App Name",
        default: "sample-app"
      },
      {
        type: "input",
        name: "app_version",
        message: "Your App Version",
        default: "0.0.1"
      },
      {
        type: "input",
        name: "app_description",
        message: "Your App Description",
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
        message: "App Author",
        default: `${name()}`
      },
      {
        type: "input",
        name: "license",
        message: "License Type?",
        default: "ISC"
      },
      {
        type: "list",
        name: "package_manager",
        message: "Select a package manager",
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn", checked: true },
          { name: "jspm", value: "jspm", disabled: true }
        ]
      }
    ]);
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json.tmpl"),
      this.destinationPath("package.json"),
      { ...this.answers }
    );
  }

  install() {
    const pkgManager = this.answers.package_manager;
    pkgManagerMap[pkgManager] && pkgManagerMap[pkgManager].call(this);
  }
};
