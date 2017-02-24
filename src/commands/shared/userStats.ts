'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, Presence, RichEmbed, Role, User } from 'discord.js';
import * as moment from 'moment';
import util from '../../util/util';

export default class UserStats extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'userStats',
            aliases: ['stats', 'STATS', 'Stats', 'us'],
            description: 'Display your discord stats.',
            usage: '<prefix>stats',
            extraHelp: '',
            group: 'shared',
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // make sure user is logged in
        if (message.member === null)
            return message.channel.sendMessage('Please login in order to check your Discord stats.');
        
        // variable declaration
        const guildMember: GuildMember = message.member;
        const joinDiscord: string = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
        const joinServer: string = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
        const userRoles: Collection<string, Role> = new Collection(Array.from(message.member.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let roles: Array<Role> = [];
        let status: string = guildMember.user.presence.status;

        // iterate through user roles
        userRoles.forEach((el: any) => {
            if (el.name !== '@everyone' && el.managed === false)
                roles.push(el);
        });

        if (status === 'online')
            status = 'Status: *Online*';
        if (status === 'offline')
            status = 'Status: *Offline*';
        if (status === 'idle')
            status = 'Status: *Idle*';
        if (status === 'dnd')
            status = 'Status: *Do Not Disturb*';

        const embed: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setAuthor(guildMember.user.username + '#' + guildMember.user.discriminator, guildMember.user.avatarURL)
            .setDescription(status)
            .addField('Joined Server', joinServer, true)
            .addField('Joined Discord', joinDiscord, true)
            .addField('Roles', roles.join(', '), false)
            .setTimestamp();

        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
    }
}


