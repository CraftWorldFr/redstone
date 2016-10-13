var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var fse = require('fs-extra');
var inquirer = require('inquirer');
var Plugin = require('../lib/plugin');
var changeCase = require('change-case');
var CodeGenerator = require('../lib/generator');

module.exports = function makeModel(program) {
    'use strict';

    program
        .command('make:model <name>')
        .description('Create a new model class')
        .action(function(name, command) {
            var currentPlugin = new Plugin(true);

            var generator = new CodeGenerator();

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'table',
                    message: 'What is the table name?',
                    default: changeCase.snakeCase(name)
                }
            ]).then(function(answers) {
                var data = {
                    name: name,
                    table: answers.table,
                    package: currentPlugin.getNamespace('models')
                };

                var outputFile = path.join(currentPlugin.getPath('models'), name + '.java');

                generator.make('model.java', data, outputFile);

                program.log.i('Model [' + chalk.green(name) + '] created in [' + chalk.green(outputFile) + ']');
            });
        });
};
