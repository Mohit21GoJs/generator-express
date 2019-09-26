import { BaseGeneratorClass } from "@helpers/baseClass";
import get from "lodash/get";
import { appendToObj, mappedSequentialPromise } from "@app/helpers/util";

interface Author {
  email?: string;
  username?: string;
  name?: string;
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

  async __askFor(): Promise<{}> {
    const {
      prompt,
      user: {
        git: { email, name }
      }
    } = this;

    return mappedSequentialPromise({
      reducer: (acc, val) => ({ ...acc, ...val.value }),
      promises: [
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: "version",
            message: "Package Version",
            default: "0.0.1"
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: "name",
            message: "Author Name",
            default: name
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: "email",
            message: "Author Email",
            default: email
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: "description",
            message: "Module Description",
            default: "Some description"
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: "indexFile",
            message: "Index File path",
            default: "index.js"
          }
        }
      ]
    });
  }
  async prompting() {
    const promptAnswers = await this.__askFor();
    const mappedAnswers = {
      version: get(promptAnswers, "version"),
      author: {
        email: get(promptAnswers, "email"),
        name: get(promptAnswers, "author")
      },
      license: get(promptAnswers, "license"),
      keywords: [],
      indexFile: get(promptAnswers, "indexFile"),
      description: get(promptAnswers, "description")
    };
    this.answers = appendToObj(this.answers, mappedAnswers);
    console.log("answers is", this.answers);
  }

  writing() {
    const pkg = this._readPkg();
    // update package json and write it
    this._writePkg(pkg);
  }
};
