'use strict';

var fs = require('fs');
var path = require('path');
var YAML = require('yamljs');
var xmldoc = require('xmldoc');
var log = require('commander-extra/log');
var utils = require('commander-extra/utils');

class Plugin {
    constructor(autoKill) {
        if (autoKill === true && !this.isPlugin()) {
            log.e('The current directory is not a Spigot plugin.');
            process.exit();
        }

        var document = new xmldoc.XmlDocument(fs.readFileSync('pom.xml', 'utf8'));

        this.name = document.valueWithPath('name');
        this.description = document.valueWithPath('description');
        this.version = document.valueWithPath('version');
        this.groupId = document.valueWithPath('groupId');
        this.artifactId = document.valueWithPath('artifactId');
        this.mainClass = document.valueWithPath('properties.mainClass');

        this.displayInfo(true);
    }

    isPlugin() {
        return utils.fileExists('pom.xml') && utils.fileExists('src/main/resources/plugin.yml');
    }

    getPath(dir) {
        var reg = /\./g

        return path.join('src/main/java', this.groupId.replace(reg, '/'), dir);
    }

    getNamespace(subnamespace) {
        var namespace = this.groupId;

        if (subnamespace) {
            namespace += '.' + subnamespace;
        }

        return namespace;
    }

    getMainClass() {
        return this.artifactId;
    }

    getYml() {
        return YAML.load('src/main/resources/plugin.yml');
    }

    setYml(data) {
        fs.writeFileSync('src/main/resources/plugin.yml', YAML.stringify(data, 4, 2));
    }

    displayInfo(debug) {
        var l = debug ? log.d : log.i;

        l('================');
        l('= Plugin infos =');
        l('================');
        l('Name: ' + this.name);
        l('Description: ' + this.description);
        l('Version: ' + this.version);
        l('GroupId: ' + this.groupId);
        l('ArtifactId: ' + this.artifactId);
        l('Main Class: ' + this.mainClass);
    }
}

module.exports = Plugin;
