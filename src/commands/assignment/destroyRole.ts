'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
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
        let availableRoles: Array<any> = guildStorage.getItem('Server Roles');
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
        
        // make sure user is logged in
        if (message.member === null)
            return message.channel.sendMessage('Please login in order to remove roles.');
        
        // search for role
        let options: any = { extract: (el: any) => { return el.name } };
        let results: any = fuzzy.filter(roleArg, availableRoles, options);

        // check if role is valid
        if (results.length === 0)
            return message.channel.sendMessage(`\`${roleArg}\` is not a valid role.`);
        
        // assign role
        if (results.length === 1)
        {
            message.member.removeRole(results[0].original.id);
            return message.channel.sendMessage(`\`${results[0].original.name}\` successfully removed.`);            
        }

        // more than one role found
        if (results.length > 1)
        {
            // check if roleArg is specifically typed
            if (util.isSpecificResult(results, roleArg))
            {
                role = message.guild.roles.find('name', util.getSpecificRoleName(results, roleArg));
                message.member.removeRole(role);
                return message.channel.sendMessage(`\`${role.name}\` successfully removed.`);                
            }
            else
                return message.channel.sendMessage(`More than one role found: \`${results.map((elem: any) => {return elem.string}).join(', ')}\`,  please be more specific.`);
        }
    }
}
