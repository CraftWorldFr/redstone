var path = require('path');
var commander = require('commander-extra');
var pkg = require(path.join(__dirname, 'package.json'));

var program = commander({
    name: 'redstone',
    version: pkg.version,
    commandsDir: path.join(__dirname, 'commands'),
    beforeHelp: function() {
        console.log();
        console.log('  ╦═╗╔═╗╔╦╗'.red + '┌─┐┌┬┐┌─┐┌┐┌┌─┐');
        console.log('  ╠╦╝║╣  ║║'.red + '└─┐ │ │ ││││├┤    v' + pkg.version);
        console.log('  ╩╚═╚═╝═╩╝'.red + '└─┘ ┴ └─┘┘└┘└─┘');
    },
    hasConfig: true
});
