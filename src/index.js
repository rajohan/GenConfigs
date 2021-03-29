#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");
const { spawn } = require("cross-spawn");

const { eslint } = require("./eslint");
const { tsconfig } = require("./tsconfig");
const { questions } = require("./questions");
const {
    devDependencies,
    tsDevDependencies,
    reactDependencies,
    styleLintDependencies,
} = require("./dependencies");

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

    const { language, pkgm, react, nextjs = false, stylelint } = answers;

    if (react) {
        devDependencies.push(...reactDependencies);
    }

    if (language === "ts") {
        devDependencies.push(...tsDevDependencies);
    }

    if (stylelint) {
        devDependencies.push("stylelint", ...styleLintDependencies);
    }

    try {
        await fs.outputFile(
            path.join(fullPath, ".eslintrc"),
            JSON.stringify(eslint(language, react), undefined, 4),
            "utf-8"
        );

        if (language === "ts") {
            await fs.outputFile(
                path.join(fullPath, "tsconfig.json"),
                JSON.stringify(tsconfig(react, nextjs), undefined, 4),
                "utf-8"
            );
        }

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
