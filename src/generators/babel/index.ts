import { BaseGeneratorClass } from '@helpers/baseClass';
import { appendToObj } from "@app/helpers/util";

export = class extends BaseGeneratorClass {
  constructor(args, opts){
    super(args, opts);
  }

  initializing() {
    this.fs.copy(
      this.templatePath("babel.config.js"),
      this.destinationPath("babel.config.js")
    );
  }
  
  writing() {
    const pkg = this._readPkg();

    pkg.dependencies = appendToObj(pkg.dependencies, {
      "@babel/polyfill": "^7.0.0"
    });

    pkg.devDependencies = appendToObj(pkg.devDependencies, {
      "@babel/core": "^7.0.0",
      "@babel/cli": "^7.0.0",
      "@babel/preset-env": "^7.0.0"
    });

    this.fs.writeJSON(
      this.destinationPath("package.json"),
      pkg
    );
  }
}
