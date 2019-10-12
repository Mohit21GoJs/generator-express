import { BaseGeneratorClass } from '@app/helpers/BaseGeneratorClass';
import { appendToObj } from '@app/helpers/util';

enum KEY_MAPS {
    EDITORS = 'editors',
}

interface Props {
    editors: Array<string>;
}
export = class extends BaseGeneratorClass {
    props: Props = {
        [KEY_MAPS.EDITORS]: [],
    };

    initializing(): void {
        this.fs.copy(this.templatePath('eslintignore.tmp'), this.destinationPath('.eslintignore'));

        this.fs.copy(this.templatePath('eslintrc.js'), this.destinationPath('.eslintrc.js'));

        this.fs.copy(this.templatePath('prettierrc.js'), this.destinationPath('.prettierrc.js'));

        this.fs.copy(this.templatePath('prettierignore.tmp'), this.destinationPath('.prettierignore.js'));

        this.fs.copy(this.templatePath('lintstagedrc.js'), this.destinationPath('.lintstagedrc.js'));
    }

    writing(): void {
        const pkg = this._readPkg();
        pkg.devDependencies = appendToObj(pkg.devDependencies, {
            eslint: 'latest',
            prettier: 'latest',
            'eslint-config-airbnb': 'latest',
            'babel-eslint': 'latest',
            'eslint-config-prettier': 'latest',
            'eslint-plugin-prettier': 'latest',
            'eslint-plugin-flowtype': 'latest',
            'eslint-plugin-jest': 'latest',
            'eslint-plugin-import': 'latest',
            'eslint-import-resolver-babel-module': 'latest',
            husky: 'latest',
            'lint-staged': 'latest',
        });

        pkg.scripts = appendToObj(pkg.scripts, {
            lint: 'eslint .',
            'lint:fix': 'npm run lint',
            format: 'prettier --write "**/*.+(js|jsx|json|css|md)"',
        });

        pkg.husky = appendToObj(pkg.husky, {
            hooks: {
                'pre-commit': 'npm run lint && npm run format',
            },
        });

        this._writePkg(pkg);
    }
};
