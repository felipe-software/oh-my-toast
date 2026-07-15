const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const librarySourceRoot = path.resolve(projectRoot, "../src");
const libraryEntry = path.join(librarySourceRoot, "index.ts");

/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [...new Set([...config.watchFolders, librarySourceRoot])];
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === "oh-my-toast") {
        return {
            filePath: libraryEntry,
            type: "sourceFile",
        };
    }

    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
