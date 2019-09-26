import { BaseGeneratorClass } from '@helpers/baseClass';
import yosay from "yosay";
import chalk from "chalk";
import askName from "inquirer-npm-name";
import inquirer from "inquirer";
import path from "path";
import mkdirp from "mkdirp";
import { appendToObj } from "@helpers/util";

type pkgManagerKey = "yarn" | "npm";

export default class extends BaseGeneratorClass {
  answers: { name?: string; packageManager?: pkgManagerKey } = {
    name: ""
  };

  initializing() {
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
        inquirer
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
    const { name: name = "" } = this.answers;
    if (path.basename(this.destinationPath()) !== name) {
      this.log(
        `Your project must be inside a folder named ${name}\nI'll automatically create this folder.`
      );
      mkdirp(name, () => {});
      this.destinationRoot(this.destinationPath(name));
    }
    this.composeWith(require.resolve("../package"), {
      name
    });
    this.composeWith(require.resolve("../babel"), {});
    this.composeWith(require.resolve("../git"), {});
  }

  __installByPkgManger(pkgKey: pkgManagerKey) {
    const pkgManagerMap: { [key in pkgManagerKey]: () => void } = {
      yarn: () => {
        this.yarnInstall && this.yarnInstall();
      },
      npm: () => {
        this.npmInstall && this.npmInstall();
      }
    };
    return pkgManagerMap[pkgKey]();
  }

  install() {
    const pkgManager = this.answers.packageManager as pkgManagerKey;
    this.__installByPkgManger(pkgManager);
  }
}
