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
            name: 'allowRole',
            aliases: ['allow'],
            description: 'Allow specified role to be self-assigned.',
            usage: '<prefix>allow [Role Name]',
            extraHelp: '',
            group: 'admin',
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        let availableRoles: any = guildStorage.getItem('Server Roles');
        const serverRolesArray: Array<[string, Role]> = Array.from(message.guild.roles.entries());
        const limitedCommands: any = this.bot.guildStorages.get(message.guild).getSetting('limitedCommands');
        const re: RegExp = new RegExp('(?:.allow\\s)(.+)', 'i');
        let roleArg: string;
        let role: Role;
        let adminCommandRole: Role;

        // find admin command role
        for (let commandName in limitedCommands) {
            if (this.name === commandName)
                adminCommandRole = message.guild.roles.get(limitedCommands[commandName].toString());
        }

        // make sure user has the admin command role
        if (!message.member.roles.find('name', adminCommandRole.name))
            return message.channel.sendMessage('You do not permissions to run this command.');

        // make sure a role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        else
            return message.channel.sendMessage('Please specify a role to allow.');
        
        // map roles
        let roleMap: any = serverRolesArray.filter(function(el: any)
        {
            if (el[1].position < adminCommandRole.position && el[1].name !== '@everyone' && el[1].managed === false)
                return el[1];
        });

        // search for role
        let options: any = { extract: function(el: any) { return el[1].name; } };
        let results: Array<any> = fuzzy.filter(roleArg, roleMap, options);

         // check if role is valid
        if (results.length === 0)
            return message.channel.sendMessage(`\`${roleArg}\` is not a valid role.`);
        
        // allow role
        if (results.length === 1)
        {
            // role from result
            role = results[0].original[1];

            // check if role already is allowed
            if (util.doesRoleExist(availableRoles, role))
                return message.channel.sendMessage(`\`${role.name}\` is already an allowed role.`);

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
        {
            // check if roleArg is specifically typed
            if (util.isSpecificResult(results, roleArg))
            {
                role = util.getSpecificRole(results, roleArg);

                // check if role already is allowed
                if (util.doesRoleExist(availableRoles, role))
                    return message.channel.sendMessage(`\`${role.name}\` is already an allowed role.`);
                
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
            else
                return message.channel.sendMessage(`More than one role found: \`${results.map((elem: any) => {return elem.string}).join(', ')}\`,  please be more specific.`);
        }

        

        
    }
}
