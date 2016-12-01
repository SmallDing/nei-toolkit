#!/usr/bin/env node

'use strict';
var util = require('../lib/util/util');
util.checkNodeVersion();
var main = require('../main');
var Args = require('../lib/util/args');

var options = {
    package: require('../package.json'),
    message: require('./config.js'),
    exit: function (code) {
        if (typeof(code) === 'undefined') {
            code = 0;
        }
        process.exit(code);
    },
    log: function (msg) {
        console.log(msg);
    },
    build: function (event) {
        var action = 'build';
        var config = event.options || {};
        config = this.format(action, config);
        if (!config.key && !config.specKey) {
            this.log(`错误: 缺少项目的唯一标识 key, 请到 NEI 网站上的相应项目的"工具设置"中查看该 key 值`);
            this.show(action);
        } else {
            main.build(this, action, config);
        }
    },
    update: function (event) {
        var action = 'update';
        var config = event.options || {};
        config = this.format(action, config);
        main.update(this, action, config);
    },
    server: function (event) {
        var action = 'server';
        var config = event.options || {};
        config = this.format(action, config);
        config.action = action;
        main.server(config);
    },
    template: function (event) {
        var action = 'template';
        var config = event.options || {};
        var data = Object.assign({}, config);
        config = this.format(action, config);
        ["p", "o", "d","b", "w"].forEach((item)=>{
            delete data[item];
        });
        main.template(config, data);
    }
};

var args = new Args(options);
// do command
args.exec(process.argv.slice(2));