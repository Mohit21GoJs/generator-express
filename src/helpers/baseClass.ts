import Generator from 'yeoman-generator';

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
    main?: string;
    description?: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
    husky?: {
        hooks?: {
            [key: string]: string;
        };
    };
    scripts?: {
        [key: string]: string;
    };
}
export class BaseGeneratorClass extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    _readPkg(): PackageAnswers {
        return this.fs.readJSON(this.destinationPath('package.json'), {});
    }

    _writePkg(pkg): void {
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
}
