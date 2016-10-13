var path = require('path');
var chalk = require('chalk');
var commander = require('commander-extra');
var pkg = require(path.join(__dirname, 'package.json'));

var program = commander({
    name: 'redstone',
    version: pkg.version,
    commandsDir: path.join(__dirname, 'commands'),
    beforeHelp: function() {
        console.log();
        console.log(chalk.red('  ╦═╗╔═╗╔╦╗') + '┌─┐┌┬┐┌─┐┌┐┌┌─┐');
        console.log(chalk.red('  ╠╦╝║╣  ║║') + '└─┐ │ │ ││││├┤    v' + pkg.version);
        console.log(chalk.red('  ╩╚═╚═╝═╩╝') + '└─┘ ┴ └─┘┘└┘└─┘');
    },
    hasConfig: true
});
