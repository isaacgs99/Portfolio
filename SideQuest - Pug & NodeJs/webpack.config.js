'use strict';

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
    entry: './public/javascripts/ckeditor/ckeditor.js',

    module: {
        rules: [
            { test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/, use: ['raw-loader'] },
            { test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/, use: [
                {
                    loader: 'style-loader',
                    options: {
                        injectType: 'singletonStyleTag',
                        attributes: { 'data-cke': true },
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: styles.getPostCssConfig({
                        themeImporter: { themePath: require.resolve('@ckeditor/ckeditor5-theme-lark') },
                        minify: true
                    })
                }
            ] },
            { test: /public[\//]stylesheets[\//].+\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'public/javascripts/ckeditor/dist'),
        filename: 'ckeditor_bundle.js'
    },

    // Useful for debugging.
    devtool: 'source-map',
    
    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false },

    // mode: 'development'
    mode: 'production'
};