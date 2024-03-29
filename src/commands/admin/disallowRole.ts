'use strict';

import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
import util from '../../util/util';

export default class DisallowRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'disallow',
            aliases: ['d'],
            description: 'Disallow Role',
            usage: '<prefix>disallow <Role Name>, <prefix>d <Role Name>',
            extraHelp: 'Use this command to disallow roles to be self-assignable.',
            group: 'admin',
            guildOnly: true
        });
    }

    public action(message: Message, args: string[]): Promise<any>
    {
        // variable declaration
        const reS: RegExp = new RegExp('(?:-s)', 'ig');
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        let availableRoles: Array<any> = guildStorage.getItem('Server Roles');        
        let scrub: Boolean = false;
        let roleArgs: Array<string> = new Array();
        let adminCommandRole: Role;
        let role: Role;

        // make sure server owner has set an Admin Role
        if (!guildStorage.getItem('Admin Role'))
            return message.channel.sendMessage('Please assign an Admin Role with `.set <Role Name>`.');

        // find admin command role
        adminCommandRole = message.guild.roles.get(guildStorage.getItem('Admin Role').toString());

        // make sure user has the admin command role
        if (!message.member.roles.find('name', adminCommandRole.name))
            return message.channel.sendMessage('You do not permissions to run this command.');

        // make sure a role was specified
        if (args.length === 0)
            return message.channel.sendMessage('Please specify a role to allow.');
        
        if (reS.test(message.content))
            scrub = true;
        
        // make sure available roles isn't empty
        if (availableRoles === null)
            return message.channel.sendMessage(`No roles currently allowed.`);

        // create array from user input
        roleArgs = args.filter((el: string) => { return (!reS.test(el)) ? true : false; }).map((el: string) => { return el.replace('\,', '') });

        // if one role specified
        if (roleArgs.length === 1)
        {
            // search for role
            let options: any = { extract: (el: any) => { return el.name } };
            let results: any = fuzzy.filter(roleArgs[0], availableRoles, options);

            // check if role is valid
            if (results.length === 0)
                return message.channel.sendMessage(`\`${roleArgs[0]}\` is not a valid role.`);
            
            // disallow role
            if (results.length === 1)
            {
                // role from result
                role = message.guild.roles.get(results[0].original.id);
                
                // remove the role from the allowed list
                availableRoles.splice(util.getRoleToRemove(availableRoles, role.name), 1);
                guildStorage.setItem('Server Roles', availableRoles);

                // check if scrub option was used
                if (scrub)
                    util.removeRoleFromUserBase(message, role);
                else
                    // display success message
                    return message.channel.sendMessage(`\`${role.name}\` successfully disallowed.`);
            }

            // more than one role found
            if (results.length > 1)
            {
                // check if roleArg is specifically typed
                if (util.isSpecificResult(results, roleArgs[0]))
                {
                    // remove the role from the allowed list
                    availableRoles.splice(util.getRoleToRemove(availableRoles, util.getSpecificRoleName(results, roleArgs[0])), 1);
                    guildStorage.setItem('Server Roles', availableRoles);

                    // check if scrub option was used
                    if (scrub)
                        util.removeRoleFromUserBase(message, role);
                    else
                        // display success message
                        return message.channel.sendMessage(`\`${role.name}\` successfully disallowed.`);
                }
                else
                    // be more specific
                    return message.channel.sendMessage(`More than one role found: \`${results.map((el: any) => { return el.string; }).join(', ')}\`,  please be more specific.`);
            }
        }

        // if more than one role specified
        if (roleArgs.length > 1)
        {
            // variable declaration
            let invalidRoles: Array<string> = new Array();
            let validRoles: Array<Role> = new Array();
            const embed: RichEmbed = new RichEmbed();

            roleArgs.forEach((el: string) => {
                // search for role
                let options: any = { extract: (el: any) => { return el.name } };
                let results: any = fuzzy.filter(el, availableRoles, options);

                 // check if role is valid
                if (results.length === 0)
                    invalidRoles.push(el);
                
                // if one role found
                if (results.length === 1)
                {
                    // role from result
                    role = message.guild.roles.get(results[0].original.id);

                    // remove the role from the allowed list
                    availableRoles.splice(util.getRoleToRemove(availableRoles, role.name), 1);

                    // add role to valid array
                    validRoles.push(role);
                }

                // more than one role found
                if (results.length > 1)
                {
                    // check if roleArg is specifically typed
                    if (util.isSpecificResult(results, el))
                    {
                        // role from roleArg
                        role = util.getSpecificRole(results, el);

                        // remove the role from the allowed list
                        availableRoles.splice(util.getRoleToRemove(availableRoles, util.getSpecificRoleName(results, el)), 1);

                        // add role to valid array
                        validRoles.push(role);
                    }
                    else
                        // add inspecific results to invalid array
                        results.forEach((el: any) => { invalidRoles.push(el.string); });
                }
            });

            // update roles
            guildStorage.setItem('Server Roles', availableRoles);

            // build output embed
            embed
                .setColor(0x206694)
                .setTitle(message.guild.name + ': Roles Update')            
                .addField('Disllowed Roles', validRoles.join('\n') ? validRoles.join('\n') : '\u200b', true)
                .addField('Invalid Roles', invalidRoles.join('\n') ? invalidRoles.join('\n') : '\u200b', true)
                .setDescription('Invalid Roles are either already disallowed, incorrectly typed, or not a current server role.')
                .setTimestamp();
            
            // display output embed
            return message.channel.sendEmbed(embed, '', { disableEveryone: true });            
        }
    }
};
