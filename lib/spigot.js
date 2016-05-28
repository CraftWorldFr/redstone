'use strict';

var request = require('then-request');
var xml2json = require('xml2js').parseString;

class Spigot {
    constructor() {
        this.mavenUrl = 'https://hub.spigotmc.org/nexus/service/local/repositories/snapshots/content/org/spigotmc/spigot-api/maven-metadata.xml';
    }

    versions(cb) {
        request('GET', this.mavenUrl).done(function (res) {
            xml2json(res.getBody(), function (err, result) {
                if (err) {
                    return cb();
                }

                cb(result.metadata.versioning[0].versions[0].version, result.metadata.versioning[0].latest[0]);
            });
        });
    }
}

module.exports = new Spigot();
