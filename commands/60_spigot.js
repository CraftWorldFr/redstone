var chalk = require('chalk');
var Spigot = require('../lib/spigot');

module.exports = function spigotCommand(program) {
    'use strict';

    program
        .command('spigot:info')
        .description('Display infos about Spigot versions')
        .action(function(command) {
            Spigot.versions(function(versions, last) {
                program.log.i('===================');
                program.log.i('= Spigot versions =');
                program.log.i('===================');

                for (var i = 0; i < versions.length; i++) {
                    if (versions[i] == last) {
                        program.log.s(versions[i] + '    <-- last stable version');
                    } else {
                        program.log.i(versions[i] + '');
                    }
                }
            });
        });
};
