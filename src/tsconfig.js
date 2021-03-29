const tsconfig = (react, nextjs) => {
    const config = {
        compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,
            module: react ? "esnext" : "commonjs",
            moduleResolution: "node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "build", "dist", "coverage"],
    };

    if (react) {
        config.compilerOptions = {
            ...config.compilerOptions,
            jsx: "react-jsx",
        };

        if (nextjs) {
            config.include = ["next-env.d.ts", "**/*.ts", "**/*.tsx"];
        }
    }

    if (!react) {
        config.compilerOptions = {
            ...config.compilerOptions,
            declaration: true,
            removeComments: true,
            sourceMap: true,
            outDir: "./dist",
            incremental: true,
        };
    }

    return config;
};

module.exports = { tsconfig };
