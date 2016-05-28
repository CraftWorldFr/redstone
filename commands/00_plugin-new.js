var fs = require('fs');
var path = require('path');
var Git = require('nodegit');
var dir = require('node-dir');
var fse = require('fs-extra');
var inquirer = require('inquirer');
var Spigot = require('../lib/spigot');
var utils = require('commander-extra/utils');
var CodeGenerator = require('../lib/generator');

var templateUrl = 'https://github.com/Mopolo/SpigotTemplatePlugin';

module.exports = function pluginNew(program) {
    'use strict';

    program
        .command('plugin:new <name>')
        .description('Create a new plugin')
        .action(function(name, command) {
            // The name parameter is used as a directory for the plugin
            if (utils.directoryExists(name)) {
                program.log.e('A directory named [' + name + '] already exists');
                process.exit();
            }

            var data = {};

            program.log.d('Getting Spigot version infos...');

            // We download maven data about Spigot
            Spigot.versions(function(possibleSpigotVersions, lastSpigotStableVersion) {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'namespace',
                        message: 'What is the namespace of your plugin? (ex: com.example.superplugin)',
                        validate: function(input) {
                            if (input.length > 0) {
                                return true;
                            }

                            return 'The namespace is mandatory!';
                        }
                    },
                    {
                        type: 'list',
                        name: 'spigot_version',
                        message: 'Select the oldest Spigot version you want to support',
                        choices: possibleSpigotVersions,
                        default: lastSpigotStableVersion
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: 'What is your name?',
                        default: program.config.get('author.name')
                    },
                    {
                        type: 'input',
                        name: 'website',
                        message: 'What is your website?',
                        default: program.config.get('author.website')
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: 'Enter a description for this plugin:'
                    }
                ]).then(function (answers) {
                    data = answers;

                    if (data.description.length == 0) {
                        data.description = 'Example of a Spigot plugin using Maven';
                    }

                    // We save those for later use
                    program.config.set('author.name', data.author);
                    program.config.set('author.website', data.website);

                    program.log.i();
                    program.log.i('Downloading plugin template...');

                    program.log.d('Downloading from ' + templateUrl);

                    return Git.Clone(templateUrl, name);
                }).then(function(repository) {
                    var toDelete = ['LICENCE', 'README.md', '.git'];

                    toDelete.forEach(function(file) {
                        file = path.join(name, file);
                        fse.removeSync(file);
                        program.log.d('  removed ' + file);
                    });

                    // This is a list of strings to replace across all files in the template
                    var replaceMap = {
                        'TemplatePlugin': name,
                        'com.example.template': data.namespace,
                        '1.9.4-R0.1-SNAPSHOT': data.spigot_version,
                        '<author>Example</author>': '<author>' + data.author + '</author>',
                        '<name>Example</name>': '<name>' + data.author + '</name>',
                        '<description>Example of a Spigot plugin using Maven</description>': '<description>' + data.description + '</description>',
                        'http://example.com': data.website
                    };

                    dir.files(name, function(err, files) {
                        if (err) {
                            return program.handleError(err);
                        }

                        var fileContent = null;

                        program.log.i('Creating files...');

                        for (var i = 0; i < files.length; i++) {
                            fileContent = fs.readFileSync(files[i], 'utf8');

                            for (var key in replaceMap) {
                                if (replaceMap.hasOwnProperty(key)) {
                                    fileContent = fileContent.replace(new RegExp(key, 'g'), replaceMap[key]);
                                }
                            }

                            fs.writeFileSync(files[i], fileContent);
                        }

                        var mainClassPath = path.join(name, 'src/main/java', data.namespace.split('.').join('/'));

                        program.log.d('Main class path: ' + mainClassPath);

                        // We create the directory based on the namespace
                        try {
                            fse.mkdirsSync(mainClassPath);
                        } catch(e) {
                            if ( e.code != 'EEXIST' ) {
                                return program.handleError(e);
                            };
                        }

                        // We move the main plugin class to the new directory
                        fse.copySync(
                            path.join(name, 'src/main/java/com/example/template/TemplatePlugin.java'),
                            path.join(mainClassPath, name + '.java')
                        );

                        var directoryToDelete = path.join(name, 'src/main/java/com');

                        if (data.namespace.startsWith('com.')) {
                            directoryToDelete = path.join(directoryToDelete, 'example');
                        }

                        program.log.d('Deleting directory: ' + directoryToDelete);

                        // We remove the old directory
                        fse.removeSync(directoryToDelete);

                        var generator = new CodeGenerator();

                        data.name = name;

                        generator.make('new-plugin-readme.md', data, path.join(name, 'README.md'));

                        program.log.i();
                        program.log.i('All done!'.green);
                        program.log.i();

                        program.log.i('Open the README.md file for help on importing and creating a jar.');
                        program.log.i();
                    });
                }); // prompt

            }); // Spigot.versions

        }) // action

        .on('--help', function() {
            console.log('  To avoid having to specify your name and website every');
            console.log('  time you create a new plugin, you can save them with:');
            console.log();
            console.log('    config author.name "Your Name"');
            console.log('    config author.website "http://example.com"');
            console.log();
        });

};
