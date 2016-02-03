#!/usr/bin/env node

'use strict';

let main = require('../main');
let Args = require('../lib/util/args');
let splitChars = /[,;，；]/;

// run command for single id
let run = function (name, event) {
    let opt = event.options || {};
    let id = (event.args || [])[0];
    if (!id) {
        this.show(name);
        process.exit(0);
    } else {
        opt.id = id;
        this.format(name, opt);
        main[name](opt);
    }
};

// run command for batch ids
let batch = function (name, event) {
    let opt = event.options || {};
    let id = (event.args || [])[0] || '';
    if (!id) {
        this.show(name);
        process.exit(0);
    } else {
        this.format(name, opt);
        id.split(splitChars).forEach(function (it) {
            opt.id = it;
            main[name](opt);
        });
    }
};

let options = {
    message: require('./config.js'),
    package: require('../package.json'),
    exit: function () {
        process.exit(0);
    },
    build: function (event) {
        const action = 'build';
        let config = event.options || {};
        let id = (event.args || [])[0];
        if (!id) {
            this.show(action);
            process.exit(0);
        } else {
            config = this.format(action, config);
            config.action = action;
            id.split(splitChars).forEach((it) => {
                config.id = it;
                main.build(config);
            });
        }
    },
    update: function (event) {
        let config = event.options || {};
        let id = (event.args || [])[0] || '';
        let action = 'update';
        config = this.format(action, config);
        config.action = action;
        if (id) {
            id.split(splitChars).forEach(function (it) {
                config.id = it;
                main.build(config);
            });
        } else {
            // update all project
            main.update(config);
        }
    },
    export: function (event) {
        batch.call(this, 'export', event);
    },
    mock: function (event) {
        run.call(this, 'mock', event);
    },
    mobile: function (event) {
        let opt = event.options || {};
        opt.action = 'mobile';
        this.format(opt.action, opt);
        run.call(this, opt.action, event);
    }
};

let args = new Args(options);
// do command
args.exec(process.argv.slice(2));