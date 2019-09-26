import git from "simple-git/promise";
import { BaseGeneratorClass } from "@helpers/baseClass";
import { mappedSequentialPromise, appendToObj } from "@app/helpers/util";

enum KEY_MAPS {
  NAME = "name",
  EMAIL = "email",
  REMOTE = "remote"
}

interface Props {
  [KEY_MAPS.NAME]?: string;
  [KEY_MAPS.EMAIL]?: string;
  [KEY_MAPS.REMOTE]?: string;
}
export = class extends BaseGeneratorClass {
  simpleGit = git(this.destinationRoot());

  props: Props = {};
  async initializing() {
    await this.simpleGit.init();
  }

  async __askFor(): Promise<{}> {
    const {
      prompt,
      user: {
        git: { email, name }
      }
    } = this;

    return mappedSequentialPromise({
      promises: [
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: KEY_MAPS.NAME,
            message: "Git Name",
            default: name
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: KEY_MAPS.EMAIL,
            message: "Git Email",
            default: email
          }
        },
        {
          value: prompt,
          thisArg: this,
          args: {
            type: "input",
            name: KEY_MAPS.REMOTE,
            message: "Git Remote Url",
            default: ""
          }
        }
      ]
    });
  }

  async prompting() {
    const promptAnswers = await this.__askFor();
    this.props = appendToObj(this.props, promptAnswers);
  }

  async writing() {
    this.fs.copy(
      this.templatePath("gitignore.tmp"),
      this.destinationPath(".gitignore")
    );
  }

  async end() {
    await Promise.all([
      this.simpleGit.addConfig("user.name", this.props[
        KEY_MAPS.NAME
      ] as string),
      this.simpleGit.addConfig("user.email", this.props[
        KEY_MAPS.EMAIL
      ] as string),
      this.simpleGit.addRemote("origin", this.props[KEY_MAPS.REMOTE] as string)
    ]);
  }
};
