var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var fse = require('fs-extra');
var Plugin = require('../lib/plugin');
var CodeGenerator = require('../lib/generator');

module.exports = function makeEvent(program) {
    'use strict';

    program
        .command('make:event <name>')
        .description('Create a new custom event class')
        .action(function(name, command) {
            var currentPlugin = new Plugin(true);

            var generator = new CodeGenerator();

            if (!name.endsWith('Event')) {
                name += 'Event';
            }

            var data = {
                name: name,
                package: currentPlugin.getNamespace('events')
            };

            var outputFile = path.join(currentPlugin.getPath('events'), name + '.java');

            generator.make('event.java', data, outputFile);

            program.log.i('Event [' + chalk.green(name) + '] created in [' + chalk.green(outputFile) + ']');
            program.log.i();
            program.log.i('To trigger your custom event, you have to do:');
            program.log.i();
            program.log.i('  Bukkit.getServer().getPluginManager().callEvent(new ' + name + '(/* args */));');
            program.log.i();
        });
};
