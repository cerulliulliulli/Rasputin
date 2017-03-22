'use strict';
const Bot = require('yamdbf').Bot;
const config = require('./config.json');
const path = require('path');
const bot = new Bot({
    name: config.name,
    token: config.token,
    config: config,
    selfbot: false,
    version: config.version,
    statusText: config.status,
    commandsDir: path.join(__dirname, 'commands'),
    disableBase: [
        'clearlimit',
        'disablegroup',
        'enablegroup',
        'eval',
        'limit',
        'listgroups',
        'ping',
        'reload',
        'version'
    ]
})
.setDefaultSetting('prefix', '.')
.start();

bot.on('ready', () => bot.user.setAvatar('./img/avatar.png'));
bot.on('disconnect', () => process.exit());
