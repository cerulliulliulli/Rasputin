'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, Role, User } from 'discord.js';
import util from '../../util/util';

export default class DestroyRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'Destroy Role',
            aliases: ['dr'],
            description: 'Remove one of the specified self-assignable roles.',
            usage: '<prefix>dr [Role Name]',
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
        const re: RegExp = new RegExp('(?:.dr\\s)(.+)', 'i');
        let roleArg: string;
        let role: Role;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to remove.');
        
        // make sure there are allowed roles
        if (availableRoles === null)
            return message.channel.sendMessage('There are currently no self-assignable roles.');
        
        // get id of role
        availableRoles.forEach((el: any) => (el.name === roleArg) ? role = message.guild.roles.get(el.id): Role);
        
        // check if role is valid
        if (role === undefined)
            return message.channel.sendMessage(`The **${roleArg}** role is not a valid role.`);
        
        // remove role
        message.member.removeRole(role);
        return message.channel.sendMessage(`The **${roleArg}** role successfully removed.`);
    }
}
