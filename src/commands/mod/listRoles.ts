'use strict';
import { Bot, Command } from 'yamdbf';
import { GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import util from '../../util/util';

export default class ListRoles extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'List Roles',
            aliases: ['list'],
            description: 'List all server roles with their current self-assignable status.',
            usage: '<prefix>list',
            extraHelp: '',
            group: 'mod',
            roles: [],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildStorage: any = this.bot.guildStorages.get(message.guild);
        const availableRoles: any = guildStorage.getItem('Server Roles');
        const serverRoles: any = message.guild.roles;
        let leftCol: string = '';
        let rightCol: string = '';

        if (message.member.roles.find('name', 'Rasputin'))
        {
            // iterate through server roles to build leftCol/rightCol
            serverRoles.forEach(
                function(el: any)
                {
                    leftCol += '\n' + el.name;
                    if (util.existsInArray(availableRoles, el.name))
                        rightCol += '\n**Allowed**';
                    else
                        rightCol += '\nNot Allowed';
                }
            );

            // build the output embed
            const modEmbed: RichEmbed = new RichEmbed()
                .setTitle(message.guild.name + ': List of Roles')
                .addField('Roles', leftCol, true)
                .addField('Status', rightCol, true);
            
            // display the list
            return message.channel.sendEmbed(modEmbed, '', { disableEveryone: true });
        }
        else
        {
            // iterate through server roles to build leftCol/rightCol
            availableRoles.forEach(
                function(el: any) { leftCol += '\n' + el.name; }
            );
            
            // build the output embed
            const userEmbed: RichEmbed = new RichEmbed()
                .setTitle(message.guild.name + ': List of Roles')
                .addField('Roles', leftCol, true);
            
            // display the list
            return message.channel.sendEmbed(userEmbed, '', { disableEveryone: true });
        }
    }
}
