'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import util from '../../util/util';

export default class ListRoles extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'Sync Roles',
            aliases: ['sync'],
            description: 'Synchronize the allowed roles with the current server roles.',
            usage: '<prefix>sync',
            extraHelp: 'This command will remove any non-existent server roles from the list of allowed roles.',
            group: 'admin',
            roles: ['Rasputin'],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const availableRoles: Array<any> = guildStorage.getItem('Server Roles');
        const rasputinRole: Role = message.guild.roles.find('name', 'Rasputin');
        const serverRoles: Collection<string, Role> = new Collection(Array.from(message.guild.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let updatedRoles: any = [];
        let currentRoles: string = '';
        let removedRoles: string = '';

        const noRoles: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setTitle(message.guild.name + ': Role Synchronization')            
            .addField('Current Allowed Roles', '\nNo roles currently allowed.');

        // make sure there are allowed roles
        if (availableRoles === null)
            return message.channel.sendEmbed(noRoles, '', { disableEveryone: true });

        // iterate through availableRoles, create updated list
        availableRoles.forEach(function(el: any)
        {
            if (serverRoles.find('name', el.name))
            {
                updatedRoles.push(el);
                currentRoles += '\n' + el.name;
            }
            else
                removedRoles += '\n' + el.name;
        });

        // update availableRoles
        guildStorage.setItem('Server Roles', updatedRoles);

        // make sure there are current roles
        if (currentRoles === '')
            return message.channel.sendEmbed(noRoles, '', { disableEveryone: true });

        // check if there are roles to remove
        if (removedRoles === '')
            removedRoles = '*No roles removed*';
        
        // build the output embed
        const embed: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setTitle(message.guild.name + ': Role Synchronization')
            .addField('Current Allowed Roles', currentRoles)
            .addField('Roles Cleaned from Allowed List', removedRoles);        
 
        // display the list
        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
    }
}