module.exports = {
    '*.+(js|jsx)': ['yarn run lint:fix', 'git add'],
    '*.+(json|css|md)': ['yarn run format', 'git add'],
};
