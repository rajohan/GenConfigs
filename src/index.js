#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");
const { spawn } = require("cross-spawn");

const { questions } = require("./questions");
const {
    devDependencies,
    tsDevDependencies,
    reactDependencies,
    styleLintDependencies,
} = require("./dependencies");

const eslint = (language, react) => {
    const config = {
        root: true,
        plugins: [
            language === "ts" && "@typescript-eslint",
            "simple-import-sort",
            "import",
            react && "react-redux",
            "unicorn",
        ].filter(Boolean),
        extends: [
            "eslint:recommended",
            language === "ts" && "plugin:@typescript-eslint/recommended",
            "plugin:unicorn/recommended",
            react && "plugin:react/recommended",
            react && "plugin:react-hooks/recommended",
            react && "plugin:react-redux/recommended",
            "prettier",
        ].filter(Boolean),
        parserOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            ecmaFeatures: react
                ? {
                      jsx: true,
                  }
                : {},
        },
        env: {
            node: true,
            browser: true,
            commonjs: true,
            es6: true,
        },
        rules: {
            "arrow-body-style": ["error", "as-needed"],
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "sort-imports": "off",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
            "unicorn/prevent-abbreviations": "off",
        },
        overrides: [
            language === "ts" && {
                files: ["*test.*"],
                rules: {
                    "@typescript-eslint/ban-ts-comment": "off",
                    "@typescript-eslint/no-explicit-any": "off",
                },
            },
        ].filter(Boolean),
        settings: react
            ? {
                  react: {
                      version: "detect",
                  },
              }
            : {},
    };

    if (language === "ts") {
        config.parser = "@typescript-eslint/parser";
    }

    if (react) {
        config.rules = {
            ...config.rules,
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
        };
    }

    return config;
};

const run = (cmd, args, path = process.cwd()) =>
    new Promise((resolve, reject) => {
        const command = spawn(cmd, args, {
            cwd: path,
            env: process.env,
            stdio: "inherit",
        });

        command.on("close", () => {
            resolve();
        });

        command.on("error", (error) => {
            reject(error);
        });
    });

program.action(async () => {
    const fullPath = process.cwd();

    let answers;

    try {
        answers = await questions();
    } catch (error) {
        console.error(error);
    }

    const { language, pkgm, react, stylelint } = answers;

    console.log(language, pkgm, react, stylelint, fullPath);

    console.log(eslint(language, react));

    if (react) {
        devDependencies.push(...reactDependencies);
    }

    if (language === "ts") {
        devDependencies.push(...tsDevDependencies);
    }

    if (stylelint) {
        devDependencies.push("stylelint", ...styleLintDependencies);
    }

    console.log(devDependencies);

    try {
        await fs.outputFile(
            path.join(fullPath, ".eslintrc"),
            JSON.stringify(eslint(language, react), undefined, 4),
            "utf-8"
        );

        await fs.copy(path.join(__dirname, "ignoreFiles"), fullPath);
        await fs.copy(path.join(__dirname, "configFiles"), fullPath);
        await fs.copy(path.join(__dirname, "otherFiles"), fullPath);

        await (pkgm === "npm"
            ? run("npm", ["install", "--save-dev", ...devDependencies], fullPath)
            : run("yarn", ["add", "--dev", ...devDependencies], fullPath));
    } catch (error) {
        console.error(error);
    }

    console.log(chalk.green(`\n🔥 All done! Your config files are ready. 🔥\n`));
});

program.parse(process.argv);
