"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../helpers/util");
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const yosay = require("yosay");
const chalk = require("chalk");
const askName = require("inquirer-npm-name");
const path = require("path");
const mkdirp = require("mkdirp");
const _ = require("lodash");
module.exports = class extends yeoman_generator_1.default {
    constructor() {
        super(...arguments);
        this.answers = {};
    }
    initializing() {
        this.log(yosay(chalk.green(`Let's Scaffold Awesome Express App`)));
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.answers = util_1.appendToObj(this.answers, yield askName({
                name: "name",
                message: "App name",
                default: path.basename(process.cwd())
            }, this));
            this.answers = util_1.appendToObj(this.answers, yield this.prompt({
                type: "list",
                name: "packageManager",
                message: "Select a package manager",
                choices: [
                    { name: "npm", value: "npm" },
                    { name: "yarn", value: "yarn", checked: true },
                    { name: "jspm", value: "jspm", disabled: true }
                ]
            }));
        });
    }
    default() {
        const { name: name = "" } = this.answers;
        if (path.basename(this.destinationPath()) !== name) {
            this.log(`Your project must be inside a folder named ${name}\nI'll automatically create this folder.`);
            mkdirp(name);
            this.destinationRoot(this.destinationPath(name));
        }
        this.composeWith(require.resolve("generator-node/generators/app"), {
            boilerplate: false,
            name,
            projectRoot: "generators",
            skipInstall: true,
            travis: true,
            coveralls: true
        });
    }
    __installByPkgManger(pkgKey) {
        const pkgManagerMap = {
            yarn: () => {
                this.yarnInstall && this.yarnInstall();
            },
            npm: () => {
                this.npmInstall && this.npmInstall();
            }
        };
        return pkgManagerMap[pkgKey];
    }
    install() {
        const pkgManager = this.answers.packageManager;
        this.__installByPkgManger[pkgManager];
    }
};
//# sourceMappingURL=index.js.map