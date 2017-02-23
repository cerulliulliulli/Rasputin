'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import * as fuzzy from 'fuzzy';
import util from '../../util/util';

export default class SetAdminRole extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'setAdminRole',
            aliases: ['set'],
            description: 'A command to set the Admin Role.',
            usage: '<prefix>set <Role Name>',
            extraHelp: '',
            group: 'admin',
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        if (message.guild.ownerID !== message.author.id)
            return message.channel.sendMessage('Only the server owner can run this command.');
        
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const re: RegExp = new RegExp('(?:.setup\\s)(.+)', 'i');
        let roleArg: string = '';
        let adminRole: any;

        // check if admin role was specified
        if (re.test(original))
            roleArg = re.exec(original)[1];
        
        if (roleArg)
        {
            // search for role
            let options: any = { extract: function(el: any) { return el[1].name; } };
            let results: Array<any> = fuzzy.filter(roleArg, Array.from(message.guild.roles.entries()), options);

            // check if role is valid
            if (results.length === 0)
                return message.channel.sendMessage(`\`${roleArg}\` is not a valid role.`);
            
            // allow role
            if (results.length === 1)
            {
                // role from result
                adminRole = results[0].original[1];
                guildStorage.setItem('Admin Role', adminRole.id);
                return message.channel.sendMessage(`Admin Role successfully set to: \`${adminRole.name}\``);
            }

            // more than one role found
            if (results.length > 1)
            {
                // check if roleArg is specifically typed
                if (util.isSpecificResult(results, roleArg))
                {
                    guildStorage.setItem('Admin Role', util.getSpecificRole(results, roleArg).id);
                    return message.channel.sendMessage(`Admin Role successfully set to: \`${adminRole.name}\``);
                }
                else
                    return message.channel.sendMessage(`More than one role found: \`${results.map((el: any) => {return el.string}).join(', ')}\`,  please be more specific.`);
            }
        }
        else
        {
            if (guildStorage.getItem('Admin Role'))
                adminRole = message.guild.roles.get(guildStorage.getItem('Admin Role').toString());
            else
                adminRole = '*No admin role configured.*';
        }
        
        return message.channel.sendMessage(`Admin Role currently set to: \`${adminRole.name}\``, { disableEveryone: true });
        
    }
}
