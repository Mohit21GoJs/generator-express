import { BaseGeneratorClass } from "@helpers/baseClass";
import { appendToObj } from "@app/helpers/util";

interface Author {
  email?: string;
  username?: string;
  name?: string
}
interface PackageAnswers {
  version?: string;
  author?: Author;
  license?: string;
  keywords?: Array<string>;
  indexFile?: string;
  description?: string;
}
export = class extends BaseGeneratorClass {
  answers: PackageAnswers = {};

  __askFor(): Promise<PackageAnswers> {
    return Promise.resolve({});
  }
  async prompting() {
    this.answers = appendToObj(this.answers, await this.__askFor());
  }

  writing() {
    const pkg = this._readPkg();
    // update package json and write it
    this._writePkg(pkg);
  }
};
