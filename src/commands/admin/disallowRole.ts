'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
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
            group: 'admin',
            roles: ['Rasputin'],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        let availableRoles: Array<any> = guildStorage.getItem('Server Roles');
        const re: RegExp = new RegExp('(?:.disallow\\s)(.+)', 'i');
        let roleArg: string;
        let role: Role;

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to disallow.');
        
        // make sure available roles isn't empty
        if (availableRoles === null)
            return message.channel.sendMessage(`No roles currently allowed.`);
        
        // search for role
        let options: any = { extract: (el: any) => { return el.name } };
        let results: any = fuzzy.filter(roleArg, availableRoles, options);

        // check if role is valid
        if (results.length === 0)
            return message.channel.sendMessage(`\`${roleArg}\` is not a valid role.`);
        
        // disallow role
        if (results.length === 1)
        {
            // role from result
            role = message.guild.roles.get(results[0].original.id);
            
            // remove the role from the allowed list
            availableRoles.splice(util.getRoleToRemove(availableRoles, role.name), 1);
            guildStorage.setItem('Server Roles', availableRoles);

            return message.channel.sendMessage(`\`${role.name}\` successfully disallowed.`);
        }

        // more than one role found
        if (results.length > 1)
        {
            // check if roleArg is specifically typed
            if (util.isSpecificResult(results, roleArg))
            {
                // remove the role from the allowed list
                availableRoles.splice(util.getRoleToRemove(availableRoles, util.getSpecificRoleName(results, roleArg)), 1);
                guildStorage.setItem('Server Roles', availableRoles);

                return message.channel.sendMessage(`\`${util.getSpecificRoleName(results, roleArg)}\` successfully disallowed.`);
            }
            else
                return message.channel.sendMessage(`More than one role found: \`${results.map((elem: any) => {return elem.string}).join(', ')}\`,  please be more specific.`);
        }            
    }
}
