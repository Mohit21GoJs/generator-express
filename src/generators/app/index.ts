import { BaseGeneratorClass } from '@app/helpers/BaseGeneratorClass';
import yosay from 'yosay';
import * as shelljs from 'shelljs';
import chalk from 'chalk';
import askName from 'inquirer-npm-name';
import inquirer from 'inquirer';
import path from 'path';
import mkdirp from 'mkdirp';
import { appendToObj } from '@helpers/util';

type pkgManagerKey = 'yarn' | 'npm';
export default class extends BaseGeneratorClass {
    answers: { name?: string; packageManager?: pkgManagerKey } = {
        name: '',
    };

    initializing(): void {
        this.log(yosay(chalk.green(`Let's Scaffold Awesome Express App`)));
    }

    async prompting(): Promise<void> {
        this.answers = appendToObj(
            this.answers,
            await askName(
                {
                    name: 'name',
                    message: 'App name',
                    default: path.basename(process.cwd()),
                },
                inquirer,
            ),
        );
        this.answers = appendToObj(
            this.answers,
            await this.prompt({
                type: 'list',
                name: 'packageManager',
                message: 'Select a package manager',
                choices: [
                    { name: 'npm', value: 'npm' },
                    { name: 'yarn', value: 'yarn', checked: true },
                    { name: 'jspm', value: 'jspm', disabled: true },
                ],
            }),
        );
    }

    default(): void {
        const { name: name = '' } = this.answers;
        if (path.basename(this.destinationPath()) !== name) {
            this.log(`Your project must be inside a folder named ${name}\nI'll automatically create this folder.`);
            mkdirp(name, () => {});
            this.destinationRoot(this.destinationPath(name));
        }
        this.composeWith(require.resolve('../package'), {
            name,
        });
        this.composeWith(require.resolve('../babel'), {});
        this.composeWith(require.resolve('../git'), {});
        this.composeWith(require.resolve('../cli'), {});
    }

    __installByPkgManger(pkgKey: pkgManagerKey): void {
        const pkgManagerMap: { [key in pkgManagerKey]: () => void } = {
            yarn: () => {
                this.yarnInstall && this.yarnInstall();
                shelljs.exec(`export PKG=eslint-config-airbnb &&
          npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add -D "$PKG@latest"
    `);
            },
            npm: () => {
                this.npmInstall && this.npmInstall();
                shelljs.exec(`export PKG=eslint-config-airbnb &&
          npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
    `);
            },
        };
        return pkgManagerMap[pkgKey]();
    }

    install(): void {
        const pkgManager = this.answers.packageManager as pkgManagerKey;
        this.__installByPkgManger(pkgManager);
    }
}
