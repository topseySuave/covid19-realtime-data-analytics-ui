const path = require('path');

module.exports = {
    env: {
        MAP_BOX_TOKEN: process.env.MAP_BOX_TOKEN,
    },
    webpack: (config, { dev }) => {
        config.resolve.alias.assets = path.resolve('./assets');
        config.resolve.alias.components = path.resolve('./components');
        return config;
    },
}
