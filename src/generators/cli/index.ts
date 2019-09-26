import { BaseGeneratorClass } from "@helpers/baseClass";
import { appendToObj } from "@app/helpers/util";

enum KEY_MAPS {
  EDITORS = "editors"
}

interface Props {
  editors: Array<string>;
}
export = class extends BaseGeneratorClass {
  props: Props = {
    [KEY_MAPS.EDITORS]: []
  };

  initializing() {
    this.fs.copy(
      this.templatePath("eslintignore.tmp"),
      this.destinationPath(".eslintignore")
    );

    this.fs.copy(
      this.templatePath("eslintrc.js"),
      this.destinationPath(".eslintrc.js")
    );

    this.fs.copy(
      this.templatePath("prettierrc.js"),
      this.destinationPath(".prettierrc.js")
    );

    this.fs.copy(
      this.templatePath("prettierignore.tmp"),
      this.destinationPath(".prettierignore.js")
    );

    this.fs.copy(
      this.templatePath("lintstagedrc.js"),
      this.destinationPath(".lintstagedrc.js")
    );
  }

  async prompting() {
    this.props = await this.prompt({
      type: "checkbox",
      name: KEY_MAPS.EDITORS,
      message: "Which Editor do you use?",
      choices: [
        { name: "Visual Studio Code", value: "vscode" },
        { name: "Atom", value: "atom" },
        { name: "Webstorm", value: "webstorm" }
      ]
    });
  }

  writing() {
    const pkg = this._readPkg();

    pkg.devDependencies = appendToObj(pkg.devDependencies, {
      eslint: "latest",
      prettier: "latest",
      "eslint-config-prettier": "latest",
      "eslint-plugin-prettier": "latest",
      husky: "latest",
      "lint-staged": "latest"
    });

    pkg.scripts = appendToObj(pkg.scripts, {
      lint: "eslint .",
      "lint:fix": "npm run lint",
      format: 'prettier --write "**/*.+(js|jsx|json|css|md)"'
    });

    pkg.husky = appendToObj(pkg.husky, {
      hooks: {
        "pre-commit": "npm run lint && npm run format"
      }
    });

    this._writePkg(pkg);
  }
};
