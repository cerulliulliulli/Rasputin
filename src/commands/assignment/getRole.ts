'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, Role, User } from 'discord.js';
import util from '../../util/util';

export default class GetRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'Get Role',
            aliases: ['gr'],
            description: 'Get one of the specified self-assignable roles.',
            usage: '<prefix>gr [Role Name]',
            extraHelp: 'Role Name is case-sensitive.',
            group: 'assignment',
            roles: [],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        let availableRoles: any = guildStorage.getItem('Server Roles');
        const re: RegExp = new RegExp('(?:.gr\\s)(.+)', 'i');
        let role: Role;
        let roleArg: any;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to self-assign.');
        
        // get id of role
        let x: number = 0;
        while (x < availableRoles.length)
        {
            if (availableRoles[x].name === roleArg)
                role = message.guild.roles.get(availableRoles[x].id);
            x++;
        }
        
        // check if role is valid
        if (role === undefined)
            return message.channel.sendMessage(`**${roleArg}** is not a valid role.`);
        
        // assign role
        message.member.addRole(role);
        return message.channel.sendMessage(`**${roleArg}** successfully assigned.`);
    }
}