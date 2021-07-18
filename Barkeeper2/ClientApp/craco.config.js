const path = require('path');

module.exports = {
    webpack: {
        alias: {
            "@components": path.resolve(__dirname, "src/components/"),
            "@data": path.resolve(__dirname, "src/data/"),
            "@hooks": path.resolve(__dirname, "src/hooks/"),
            "@modules": path.resolve(__dirname, "src/modules/"),
            "@routes": path.resolve(__dirname, "src/routes/"),
            "@views": path.resolve(__dirname, "src/views/")
        }
    }
}