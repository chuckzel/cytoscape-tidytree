/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        //'plugin:@typescript-eslint/strict-type-checked',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: [
        '@typescript-eslint'
    ],
    overrides: [
        {
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
            files: ['.eslintrc.cjs'],
        },
    ],
    "rules": {
        "semi": "off",
        "@typescript-eslint/semi": "error"
    },
    root: true,
};