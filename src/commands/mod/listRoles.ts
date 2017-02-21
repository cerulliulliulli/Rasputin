'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
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
        const rasputinRole: Role = message.guild.roles.find('name', 'Rasputin');
        const serverRoles: Collection<string, Role> = new Collection(Array.from(message.guild.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let leftCol: string = '';
        let rightCol: string = '';

        const noRoles: RichEmbed = new RichEmbed()
            .setTitle(message.guild.name + ': Role Synchronization')
            .setColor(0x274E13)
            .addField('Current Allowed Roles', '\nNo roles currently allowed.');

        if (message.member.roles.find('name', 'Rasputin'))
        {
            // iterate through server roles to build leftCol/rightCol
            serverRoles.forEach(function(el: any)
            {
                // grab all roles below rasputin, exclude @everyone and bots
                if (el.position < rasputinRole.position && el.name !== '@everyone' && el.managed === false)
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
                .setTitle(message.guild.name + ': List of Roles')
                .setColor(0x274E13)
                .addField('Roles', leftCol, true)
                .addField('Status', rightCol, true);
            
            // display the list
            return message.channel.sendEmbed(modEmbed, '', { disableEveryone: true });
        }
        else
        {
            if (availableRoles === [])
                return message.channel.sendEmbed(noRoles, '', { disableEveryone: true });

            // iterate through server roles to build leftCol
            availableRoles.forEach((el: any) => leftCol += '\n' + el.name);
            
            // build the output embed
            const userEmbed: RichEmbed = new RichEmbed()
                .setTitle(message.guild.name + ': List of Roles')
                .setColor(0x274E13)
                .addField('Roles', leftCol, true);
            
            // display the list
            return message.channel.sendEmbed(userEmbed, '', { disableEveryone: true });
        }
    }
}
