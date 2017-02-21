'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
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
        const serverRolesArray: Array<[string, Role]> = Array.from(message.guild.roles.entries());
        const re: RegExp = new RegExp('(?:.allow\\s)(.+)', 'i');
        let roleArg: string;
        let role: Role;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to allow.');
        
        // search for role
        let options: any = { extract: function(el: any) { return el[1].name; } };
        let results: any = fuzzy.filter(roleArg, serverRolesArray, options);

        // check if role is valid
        if (results.length === 0)
            return message.channel.sendMessage(`\`${roleArg}\` is not a valid role.`);
        
        // allow role
        if (results.length === 1)
        {
            // role from result
            role = results[0].original[1];

            // make sure available roles isn't empty
            if (availableRoles === null)
            {
                // setup new allowed list
                let newAvailableRoles = [{ "id": role.id, "name": role.name }];
                guildStorage.setItem('Server Roles', newAvailableRoles);

                return message.channel.sendMessage(`\`${role.name}\` successfully allowed.`);
            }
            else
            {
                // update allowed list
                availableRoles.push({ "id": role.id, "name": role.name });
                guildStorage.setItem('Server Roles', availableRoles);

                return message.channel.sendMessage(`\`${role.name}\` successfully allowed.`);
            }
        }

        // more than one role found
        if (results.length > 1)
            return message.channel.sendMessage(`More than one role found: \`${results.map((elem: any) => {return elem.string}).join(', ')}\`,  please be more specific.`);
    }
}
