var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var fse = require('fs-extra');
var inquirer = require('inquirer');
var Plugin = require('../lib/plugin');
var eventsList = require('../lib/lists/events');
var CodeGenerator = require('../lib/generator');

module.exports = function makeListener(program) {
    'use strict';

    program
        .command('make:listener <name>')
        .description('Create a new events listener class')
        .action(function(name, command) {
            var currentPlugin = new Plugin(true);

            var generator = new CodeGenerator();

            var possibleEvents = [];

            for (var key in eventsList) {
                if (eventsList.hasOwnProperty(key)) {
                    possibleEvents.push(key);
                }
            }

            if (!name.endsWith('Listener')) {
                name += 'Listener';
            }

            inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'events',
                    message: 'Select events you want to listen',
                    choices: possibleEvents
                }
            ]).then(function(answers) {
                var events = answers.events;

                var imports = [];
                var methods = [];

                for (var i = 0; i < events.length; i++) {
                    imports.push('\nimport ' + eventsList[events[i]] + ';');

                    methods.push(generator.compile('listener-method.java', { event: events[i] }));
                }

                var data = {
                    name: name,
                    package: currentPlugin.getNamespace('listeners'),
                    imports: imports.join(''),
                    methods: methods.join('\n\n')
                };

                var outputFile = path.join(currentPlugin.getPath('listeners'), name + '.java');

                generator.make('listener.java', data, outputFile);

                program.log.i('Listener [' + chalk.green(name) + '] created in [' + chalk.green(outputFile) + ']');
                program.log.i();
                program.log.i('You just have to register it in the onEnable method in ' + chalk.green(currentPlugin.getMainClass() + '.java') + ':');
                program.log.i();
                program.log.i(`  getServer().getPluginManager().registerEvents(new ${name}(), this);`);
            }); // prompt
        }); // action
};
