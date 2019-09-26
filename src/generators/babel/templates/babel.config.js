const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      },
      useBuiltIns: "usage"
    }
  ]
];

const plugins = [
  [
    "module-resolver",
    {
      root: ["."],
      alias: {
        "*": "./src",
        "@test": "./test",
        "@babel": "./babel"
      }
    }
  ]
];

module.exports = { presets, plugins };
