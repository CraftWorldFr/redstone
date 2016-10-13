var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var fse = require('fs-extra');
var inquirer = require('inquirer');
var Plugin = require('../lib/plugin');
var changeCase = require('change-case');
var CodeGenerator = require('../lib/generator');

module.exports = function makeCommand(program) {
    'use strict';

    program
        .command('make:command <command>')
        .description('Create a new in-game command')
        .action(function(cmd, command) {
            var currentPlugin = new Plugin(true);

            var pluginYml = currentPlugin.getYml();

            if (!pluginYml.commands) {
                pluginYml.commands = {};
            }

            // We first check if the command already exists
            if (pluginYml.commands[cmd]) {
                program.log.e('This command already exists in this plugin!');
                return;
            }

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'description',
                    message: 'Enter the description for this command:'
                }
            ]).then(function(answers) {
                if (cmd.startsWith('/')) {
                    cmd = cmd.slice(1);
                }

                var generator = new CodeGenerator();

                var cmdClass = changeCase.pascalCase(cmd) + 'Command';

                var data = {
                    package: currentPlugin.getNamespace('commands'),
                    clazz: cmdClass
                };

                var outputFile = path.join(currentPlugin.getPath('commands'), cmdClass + '.java');

                generator.make('command.java', data, outputFile);

                program.log.d('Updating src/main/resources/plugin.yml');

                pluginYml.commands[cmd] = {
                    'description': answers.description,
                    'usage': '/' + cmd
                };

                currentPlugin.setYml(pluginYml);

                program.log.i('Command [' + chalk.green('/' + cmd) + '] created in [' + chalk.green(outputFile) + ']');
                program.log.i();
                program.log.i('You just have to add this line in the onEnable method in ' + chalk.green(currentPlugin.getMainClass() + '.java') + ':');
                program.log.i();
                program.log.i(`  getCommand("${cmd}").setExecutor(new ${cmdClass}());`);
            });
        });
};
