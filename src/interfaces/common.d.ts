export interface Author {
    email?: string;
    username?: string;
    name?: string;
}

export interface Package {
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