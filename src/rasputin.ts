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
        'version',
        'reload',
        'eval',
        'ping'
    ]
})
.setDefaultSetting('prefix', '.')
.start();

bot.on('ready', () => bot.user.setAvatar('./img/avatar.png'));
bot.on('disconnect', () => process.exit());
