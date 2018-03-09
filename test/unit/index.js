import Vue from 'vue';

Vue.config.productionTip = false;

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all .js and .vue files under src folder
// except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context(
    // target folder
    '../../src',
    // whether to search for subdirectories
    true,
    // exclude main.js and include .js and .vue files only
    /^\.\/(?!main\.js$).+\.(js|vue)$/i
);

srcContext.keys().forEach(srcContext);
