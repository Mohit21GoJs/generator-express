const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: true
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
