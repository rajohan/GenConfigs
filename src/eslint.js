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
            "unicorn/filename-case": [
                "error",
                {
                    cases: {
                        camelCase: true,
                        pascalCase: true,
                    },
                },
            ],
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

module.exports = { eslint };
