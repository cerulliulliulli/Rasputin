'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';

export default class SetupLimits extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'setupLimits',
            aliases: ['setup'],
            description: 'A command to display current status of admin commands.',
            usage: '<prefix>setup',
            extraHelp: '',
            group: 'admin',
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        if (message.guild.ownerID !== message.author.id)
            return message.channel.sendMessage('Only the server owner can run this command.');
        
        // variable declaration
        const adminCommands: Array<string> = Array.from(this.bot.commands.entries()).filter((el: any) => {
            if (el[1].group === 'admin' && el[1].name !== 'setupLimits')
                return el[1];
        }).map((el: any) => { return el[1].name; });
        const limitedCommands: any = this.bot.guildStorages.get(message.guild).getSetting('limitedCommands');
        let limitedCommandsArray: Array<string> = [];

        for (let commandName in limitedCommands) {
            limitedCommandsArray.push(commandName);
        }

        let configuredCommands: string = '';
        let commandsToConfigure: string = '';

        // find commands that have been limited
        adminCommands.forEach((adminCommand: string) => {
            if (Boolean(limitedCommandsArray.find((limitedCommand: string) => limitedCommand === adminCommand)))
                configuredCommands += '\n' + adminCommand;
            else
                commandsToConfigure += '\n' + adminCommand;
        });

        if (configuredCommands === '')
            configuredCommands = '*No admin commands have been configured.*';
        
        if (commandsToConfigure === '')
            commandsToConfigure = '*All admin commands have been configured.*';
        
        // build the output embed
        const embed: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setAuthor(message.guild.name + ': ' + this.bot.user.username + ' Admin Command Status', this.bot.user.avatarURL)
            .setDescription('\u200b')
            .addField('Configured Commands', configuredCommands, true)
            .addField('Commands to Configure', commandsToConfigure, true)
            .addField('\u200b', 'Please remember to set a limit for **ALL** commands before usage.  If you do not complete this action, *every user* will have access to the admin commands.', false)
            .setTimestamp();
        
        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
        
    }
}
