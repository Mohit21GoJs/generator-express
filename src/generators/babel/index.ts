import { BaseGeneratorClass } from "@helpers/baseClass";
import { appendToObj } from "@app/helpers/util";

enum KEY_MAPS {
  EDITORS = "editors",
};

interface Props{
  editors: Array<string>
}
export = class extends BaseGeneratorClass {
  props: Props = {
    [KEY_MAPS.EDITORS]: []
  };
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.fs.copy(
      this.templatePath("babel.config.js"),
      this.destinationPath("babel.config.js")
    );

    this.fs.copy(this.templatePath("babel"), this.destinationPath("babel"));
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
    if (this.props.editors.includes("vscode")) {
      this.fs.copy(
        this.templatePath("jsconfig.json"),
        this.destinationPath("jsconfig.json")
      );
    }
    const pkg = this._readPkg();

    pkg.dependencies = appendToObj(pkg.dependencies, {
      "@babel/polyfill": "^7.0.0"
    });

    pkg.devDependencies = appendToObj(pkg.devDependencies, {
      "@babel/core": "^7.0.0",
      "@babel/cli": "^7.0.0",
      "@babel/preset-env": "^7.0.0",
      "@babel/node": "^7.0.0",
      "babel-plugin-module-resolver": "^3.2.0"
    });

    pkg.scripts = appendToObj(pkg.scripts, {
      "babel:start": `babel-node ${pkg.main}`,
      "babel:test": "babel-node babel/index.js"
    });

    this._writePkg(pkg);
  }
};
