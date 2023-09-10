const yaml = require("js-yaml");

module.exports = eleventyConfig => {
    eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
    return {
        dir: {
            input: ".",
            output: "_rendered",
            data: '_data'
        },
        templateFormats: [
            "liquid"
        ],
    }
};