'use strict';

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');

function templatePath(name) {
    return path.join(__dirname, '..', 'templates', name);
}

class Generator {
    compile(template, data) {
        var templateContent = fs.readFileSync(templatePath(template), 'utf8');
        var regex;

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                regex = new RegExp('%' + key + '%', 'g');

                templateContent = templateContent.replace(regex, data[key]);
            }
        }

        return templateContent;
    }

    make(template, data, outputPath) {
        var fileContent = this.compile(template, data);

        fse.ensureFileSync(outputPath);

        fs.writeFileSync(outputPath, fileContent);
    }
}

module.exports = Generator;
