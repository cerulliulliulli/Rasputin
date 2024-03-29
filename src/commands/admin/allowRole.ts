'use strict';

import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
import util from '../../util/util';

export default class AllowRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'allow',
            aliases: ['a'],
            description: 'Allow Role',
            usage: '<prefix>allow <Role Name>, <prefix>a <Role Name>',
            extraHelp: 'Use this command to allow roles to be self-assignable.',
            group: 'admin',
            guildOnly: true
        });
    }

    public action(message: Message, args: string[]): Promise<any>
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const serverRolesArray: Array<[string, Role]> = Array.from(message.guild.roles.entries());
        let availableRoles: Array<any> = guildStorage.getItem('Server Roles');
        let roleArgs: Array<any> = new Array();
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
        
        // create array from user input
        roleArgs = args.map((el: any) => { return el.replace(',', ''); });
        
        // map roles
        let roleMap: any = serverRolesArray.filter((el: any) => {
            if (el[1].position < adminCommandRole.position && el[1].name !== '@everyone' && el[1].managed === false)
                return el[1];
        });

        // if one role specified
        if (roleArgs.length === 1)
        {
            // search for role
            let options: any = { extract: (el: any) => { return el[1].name; } };
            let results: Array<any> = fuzzy.filter(roleArgs[0], roleMap, options);

            // check if role is valid
            if (results.length === 0)
                return message.channel.sendMessage(`\`${roleArgs[0]}\` is not a valid role.`);

            // allow role
            if (results.length === 1)
            {
                // role from result
                role = results[0].original[1];

                // check if role already is allowed
                if (util.doesRoleExist(availableRoles, role))
                    return message.channel.sendMessage(`\`${role.name}\` is already an allowed role.`);

                // update roles
                util.updateRoles(availableRoles, guildStorage, role);
                return message.channel.sendMessage(`\`${role.name}\` successfully allowed.`);
            }

            // more than one role found
            if (results.length > 1)
            {
                // check if roleArg is specifically typed
                if (util.isSpecificResult(results, roleArgs[0]))
                {
                    // role from roleArg
                    role = util.getSpecificRole(results, roleArgs[0]);

                    // check if role already is allowed
                    if (util.doesRoleExist(availableRoles, role))
                        return message.channel.sendMessage(`\`${role.name}\` is already an allowed role.`);
                    
                    // update roles
                    util.updateRoles(availableRoles, guildStorage, role);
                    return message.channel.sendMessage(`\`${role.name}\` successfully allowed.`);
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

            roleArgs.forEach((el: any) => {
                // search for role
                let options: any = { extract: (el: any) => { return el[1].name; } };
                let results: Array<any> = fuzzy.filter(el, roleMap, options);

                // check if role is valid
                if (results.length === 0)
                    invalidRoles.push(el);

                // if one role found
                if (results.length === 1)
                {
                    // role from result
                    role = results[0].original[1];

                    // check if role already is allowed
                    if (util.doesRoleExist(availableRoles, role))
                        // add role to invalid array
                        invalidRoles.push(el);
                    else
                        // add role to valid array
                        validRoles.push(role);
                }

                // if more than one role found
                if (results.length > 1)
                {
                    // check if roleArg is specifically typed
                    if (util.isSpecificResult(results, el))
                    {
                        // role from roleArg
                        role = util.getSpecificRole(results, el);

                        // check if role already is allowed
                        if (util.doesRoleExist(availableRoles, role))
                            invalidRoles.push(role.name);

                        // add role to valid array
                        validRoles.push(role);
                    }
                    else
                        // add inspecific results to invalid array
                        results.forEach((el: any) => { invalidRoles.push(el.string); });
                }
            });

            // update roles
            validRoles.forEach((el: Role) => { util.updateRoles(availableRoles, guildStorage, el); });

            // build output embed
            embed
                .setColor(0x206694)
                .setTitle(message.guild.name + ': Roles Update')            
                .addField('Allowed Roles', validRoles.join('\n') ? validRoles.join('\n') : '\u200b', true)
                .addField('Invalid Roles', invalidRoles.join('\n') ? invalidRoles.join('\n') : '\u200b', true)
                .setDescription('Invalid Roles are either already allowed, incorrectly typed, or not a current server role.')
                .setTimestamp();
            
            // display output embed
            return message.channel.sendEmbed(embed, '', { disableEveryone: true });
        }
    }
};
