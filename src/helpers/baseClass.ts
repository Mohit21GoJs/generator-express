import Generator from "yeoman-generator";

export class BaseGeneratorClass extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  _readPkg() {
    return this.fs.readJSON(this.destinationPath("package.json"), {});
  }

  _writePkg(pkg) {
    this.fs.writeJSON(this.destinationPath("package.json"), pkg);
  }
}
