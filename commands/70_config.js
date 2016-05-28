module.exports = function configure(program) {
    'use strict';

    program
        .command('config [key] [value...]')
        .description('Manage config for this tool')
        .action(function(key, value, cmd) {
            if (!key) {
                program.log.i(program.config.all(true));
                process.exit();
            }

            if (!value.length) {
                program.log.i(program.config.get(key));
                process.exit();
            }

            program.config.set(key, value.join(' '));
        });
};
