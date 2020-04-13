const config = require('config');
var bugsnag = require('@bugsnag/js')
var bugsnagExpress = require('@bugsnag/plugin-express')

const bugsnagAPIKey = config.get("bugsnag_API_KEY");
var bugsnagClient = bugsnag(bugsnagAPIKey)

bugsnagClient.use(bugsnagExpress)
const bugsnagmiddleware = bugsnagClient.getPlugin('express');

module.exports = {
    bugsnagClient,
    bugsnagmiddleware
};