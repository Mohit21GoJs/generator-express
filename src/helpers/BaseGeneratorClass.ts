import Generator from 'yeoman-generator';
import { Package } from '@app/interfaces/common';


export class BaseGeneratorClass extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    _readPkg(): Package {
        return this.fs.readJSON(this.destinationPath('package.json'), {});
    }

    _writePkg(pkg: Package): void {
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
}
