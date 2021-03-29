const inquirer = require("inquirer");

const questions = () =>
    inquirer
        .prompt([
            {
                type: "list",
                name: "language",
                message: "Programming language",
                choices: [
                    { name: "JavaScript", value: "js" },
                    { name: "TypeScript", value: "ts" },
                ],
                default: 0,
            },
            {
                type: "list",
                name: "pkgm",
                message: "Package Manager",
                choices: [
                    { name: "NPM", value: "npm" },
                    { name: "Yarn", value: "yarn" },
                ],
                default: 0,
            },
            {
                type: "confirm",
                name: "react",
                message: "Using react?",
                default: false,
            },
            {
                type: "confirm",
                name: "nextjs",
                message: "Using next.js?",
                default: false,
                when: (answers) => answers.react,
            },
            {
                type: "confirm",
                name: "stylelint",
                message: "Want to use stylelint?",
                default: false,
            },
        ])
        .catch((error) => console.log(error));

module.exports = { questions };
