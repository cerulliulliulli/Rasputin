'use strict';

import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import util from '../../util/util';

export default class ListRoles extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'list',
            aliases: ['l'],
            description: 'List Roles',
            usage: '<prefix>list, <prefix>l',
            extraHelp: 'List all server roles with their current self-assignable status.',
            group: 'shared',
            guildOnly: true
        });
    }

    public action(message: Message, args: string[]): Promise<Message>
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const availableRoles: Array<any> = guildStorage.getItem('Server Roles');
        const serverRoles: Collection<string, Role> = new Collection(Array.from(message.guild.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let adminCommandRole: Role;
        let leftCol: string = String();
        let rightCol: string = String();
        const noRoles: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setTitle(message.guild.name + ': Role Synchronization')            
            .addField('Current Allowed Roles', '\nNo roles currently allowed.')
            .setTimestamp();
  
        // find admin command role
        if (guildStorage.getItem('Admin Role'))
            adminCommandRole = message.guild.roles.get(guildStorage.getItem('Admin Role').toString());

        if (adminCommandRole !== undefined && message.member.roles.find('name', adminCommandRole.name))
        {
            // make sure admin role isn't the lowest in the list
            if (adminCommandRole.position === 1)
                return message.channel.sendMessage('Please make sure your admin role isn\'t the lowest in the list.');

            // iterate through server roles to build leftCol/rightCol
            serverRoles.forEach((el: Role) => {
                // grab all roles below Admin Role, exclude @everyone and bots
                if (el.position < adminCommandRole.position && el.name !== '@everyone' && el.managed === false)
                {
                    leftCol += '\n' + el.name;
                    if (util.existsInArray(availableRoles, el.name))
                        rightCol += '\n**Allowed**';
                    else
                        rightCol += '\nNot Allowed';
                }
            });

            // build the output embed
            const modEmbed: RichEmbed = new RichEmbed()
                .setColor(0x274E13)
                .setAuthor(message.guild.name + ': List of Roles', message.guild.iconURL)
                .addField('Roles', leftCol, true)
                .addField('Status', rightCol, true)
                .setTimestamp();
            
            // display the list
            return message.channel.sendEmbed(modEmbed, '', { disableEveryone: true });
        }
        else
        {
            if (availableRoles === [] || availableRoles === null)
                return message.channel.sendEmbed(noRoles, '', { disableEveryone: true });

            // iterate through server roles to build leftCol
            availableRoles.forEach((el: any) => leftCol += '\n' + el.name);
            
            // build the output embed
            const userEmbed: RichEmbed = new RichEmbed()
                .setColor(0x274E13)
                .setAuthor(message.guild.name + ': List of Roles', message.guild.iconURL)
                .setDescription('Run `.gr *.` to get all available roles.')
                .addField('Roles', leftCol, true)                
                .setTimestamp();
            
            // display the list
            return message.channel.sendEmbed(userEmbed, '', { disableEveryone: true });
        }
    }
}
