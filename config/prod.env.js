var merge = require('webpack-merge')
var apiEnv = require('./api.env')

module.exports = merge(apiEnv, {
    NODE_ENV: '"production"'
})
