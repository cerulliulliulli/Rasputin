'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, Role, User } from 'discord.js';
import util from '../../util/util';

export default class AllowRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'Allow Role',
            aliases: ['allow'],
            description: 'Allow specified role to be self-assigned.',
            usage: '<prefix>allow [Role Name]',
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
        const serverRoles: Collection<string, Role> = message.guild.roles;
        const re: RegExp = new RegExp('(?:.allow\\s)(.+)', 'i');
        let roleArg: string;
        let role: Role;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to allow.');
        
        // find id of role
        role = message.guild.roles.find('name', roleArg);
        if (role === null)
            return message.channel.sendMessage(`The **${roleArg}** role is currently not a server role.`);
        
        // make sure available roles isn't empty
        if (availableRoles === null)
        {
            // setup new allowed list
            let newAvailableRoles = [{ "id": role.id, "name": roleArg }];
            guildStorage.setItem('Server Roles', newAvailableRoles);

            return message.channel.sendMessage(`The **${roleArg}** role successfully allowed.`);
        }
        else
        {
            // update allowed list
            availableRoles.push({ "id": role.id, "name": roleArg });
            guildStorage.setItem('Server Roles', availableRoles);

            return message.channel.sendMessage(`The **${roleArg}** role successfully allowed.`);
        }
    }
}
