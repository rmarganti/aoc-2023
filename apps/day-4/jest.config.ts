/* eslint-disable */
export default {
    displayName: "day-2",
    globals: {},
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
    moduleFileExtensions: ["ts", "js", "html"],
    moduleNameMapper: {
        // Jest module loader does not support loading ES modules with the
        // `.js` extension (even though that is the spec).
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },
    testTimeout: 20000,
    testEnvironment: "node",
};
