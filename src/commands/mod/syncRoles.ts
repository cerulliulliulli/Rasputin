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
            group: 'mod',
            roles: ['Rasputin'],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const availableRoles: any = guildStorage.getItem('Server Roles');
        const rasputinRole: Role = message.guild.roles.find('name', 'Rasputin');
        const serverRoles: Collection<string, Role> = new Collection(Array.from(message.guild.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        const embed: RichEmbed = new RichEmbed();
        let updatedRoles: any = [];
        let currentRoles: string = '';
        let removedRoles: string = '';

        const noRoles: RichEmbed = new RichEmbed()
            .setTitle(message.guild.name + ': Role Synchronization')
            .setColor(0x274E13)
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

        // build the output embed
        if (removedRoles === '')
        {
            if (currentRoles === '')
                return message.channel.sendEmbed(noRoles, '', { disableEveryone: true });

            embed
                .setTitle(message.guild.name + ': Role Synchronization')
                .setColor(0x274E13)
                .addField('Current Allowed Roles', currentRoles);
        }
        else
        {
            embed
                .setTitle(message.guild.name + ': Role Synchronization')
                .setColor(0x274E13)
                .addField('Current Allowed Roles', currentRoles)
                .addField('Roles Removed', removedRoles);
        }
 
        // display the list
        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
    }
}
