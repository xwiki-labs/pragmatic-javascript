// This file is filtered through maven properties
({
    baseUrl: "${project.basedir}/src/main/js",
    paths: {
        jquery: "empty:"
    },
    name: "main",
    out: "${project.build.finalName}.js"
})
