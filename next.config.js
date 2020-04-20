const path = require('path');
const withImages = require('next-images');

module.exports = withImages({
    env: {
        MAP_BOX_TOKEN: process.env.MAP_BOX_TOKEN,
        GET_ALL_COUNTRIES: process.env.GET_ALL_COUNTRIES,
        GET_COUNTRIES_DATA: process.env.GET_COUNTRIES_DATA
    },
    webpack: (config, { dev }) => {
        config.resolve.alias.assets = path.resolve('./assets');
        config.resolve.alias.components = path.resolve('./components');
        return config;
    },
})
