'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, Role, User } from 'discord.js';
import util from '../../util/util';

export default class DisallowRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'Disallow Role',
            aliases: ['disallow'],
            description: 'Disallow specified role to be self-assigned.',
            usage: '<prefix>disallow [Role Name]',
            extraHelp: 'Role Name is case-sensitive.',
            group: 'mod',
            roles: ['Rasputin'],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        let availableRoles: any = guildStorage.getItem('Server Roles');
        const re: RegExp = new RegExp('(?:.disallow\\s)(.+)', 'i');
        let roleArg: any;
        let role: Role;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to disallow.');
        
        // find id of role
        role = message.guild.roles.find('name', roleArg);
        if (role === null)
            return message.channel.sendMessage(`The **${roleArg}** role is currently not a server role.`);
        
        // make sure available roles isn't empty
        if (availableRoles === null)
            return message.channel.sendMessage(`No roles currently allowed.`);
        
        else
        {
            // find the index of the role to be disallowed
            let index: number = 0;
            let x: number = 0;
            while (x < availableRoles.length)
            {
                if (availableRoles[x].name === role.name)
                    index = x;
                x++;
            }

            // remove the role from the allowed list
            availableRoles.splice(index, 1);
            guildStorage.setItem('Server Roles', availableRoles);

            return message.channel.sendMessage(`The **${roleArg}** role successfully disallowed.`);
        }
    }
}
