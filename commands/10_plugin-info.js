var Plugin = require('../lib/plugin');

module.exports = function makeEvent(program) {
    'use strict';

    program
        .command('plugin:info')
        .description('Display informations about a plugin')
        .action(function(command) {
            var currentPlugin = new Plugin(true);

            currentPlugin.displayInfo();
        });
};
