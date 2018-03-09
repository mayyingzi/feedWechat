var argv = require('minimist')(process.argv.slice(2));
var apiEnv = argv.api || 'alpha';

module.exports = {
    API_ENV: JSON.stringify(apiEnv)
}
