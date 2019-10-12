import { BaseGeneratorClass } from '@app/helpers/BaseGeneratorClass';
import get from 'lodash/get';
import { appendToObj, mappedSequentialPromise } from '@app/helpers/util';
import { Package } from '@app/interfaces/common';

export = class extends BaseGeneratorClass {
    answers: Package = {};

    constructor(args, options) {
        super(args, options);

        this.option('name', {
            type: String,
            default: '',
            description: 'Some desc',
        });
    }

    async __askFor<T>(): Promise<T> {
        const {
            prompt,
            user: {
                git: { email, name },
            },
        } = this;
        return mappedSequentialPromise<ReturnType<typeof prompt>>({
            reducer: (acc, val) => ({ ...acc, ...val.value }),
            promises: [
                {
                    value: prompt,
                    thisArg: this,
                    args: {
                        type: 'input',
                        name: 'version',
                        message: 'Package Version',
                        default: '0.0.1',
                    },
                },
                {
                    value: prompt,
                    thisArg: this,
                    args: {
                        type: 'input',
                        name: 'name',
                        message: 'Author Name',
                        default: name,
                    },
                },
                {
                    value: prompt,
                    thisArg: this,
                    args: {
                        type: 'input',
                        name: 'email',
                        message: 'Author Email',
                        default: email,
                    },
                },
                {
                    value: prompt,
                    thisArg: this,
                    args: {
                        type: 'input',
                        name: 'description',
                        message: 'Module Description',
                        default: 'Some description',
                    },
                },
                {
                    value: prompt,
                    thisArg: this,
                    args: {
                        type: 'input',
                        name: 'indexFile',
                        message: 'Index File path',
                        default: 'index.js',
                    },
                },
            ],
        });
    }
    async prompting(): Promise<void> {
        const promptAnswers = await this.__askFor<Package>();
        const mappedAnswers = {
            name: this.options.name,
            version: get(promptAnswers, 'version'),
            author: {
                email: get(promptAnswers, 'email'),
                name: get(promptAnswers, 'name'),
            },
            license: get(promptAnswers, 'license'),
            keywords: [],
            main: get(promptAnswers, 'indexFile'),
            description: get(promptAnswers, 'description'),
        };
        this.answers = appendToObj(this.answers, mappedAnswers);
    }

    writing(): void {
        let pkg = this._readPkg();
        pkg = appendToObj(pkg, this.answers);
        this._writePkg(pkg);
    }
};
