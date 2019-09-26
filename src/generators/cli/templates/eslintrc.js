module.exports = {
  parser: "babel-eslint",
  extends: [
    "plugin:flowtype/recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "eslint-config-airbnb",
    "prettier",
    "prettier/flowtype"
  ],
  plugins: ["jest", "flowtype", "prettier", "compat", "import"],
  env: {
    es6: true,
    node: true,
    "jest/globals": true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  rules: {},
  settings: {
    polyfills: ["promises"],
    flowtype: {
      onlyFilesWithFlowAnnotation: false
    }
  }
};
