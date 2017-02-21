'use strict';
import { Bot, Command } from 'yamdbf';
import { Collection, GuildMember, Message, Presence, RichEmbed, Role, User } from 'discord.js';
import * as moment from 'moment';
import util from '../../util/util';

export default class ListRoles extends Command<Bot>
{
    public constructor(bot: Bot)
    {
        super(bot, {
            name: 'User Stats',
            aliases: ['stats'],
            description: 'Display your discord stats.',
            usage: '<prefix>stats',
            extraHelp: '',
            group: 'shared',
            roles: [],
            guildOnly: true
        });
    }

    public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
    {
        // variable declaration
        const guildMember: GuildMember = message.member;
        const joinDiscord: string = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
        const joinServer: string = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
        const userRoles: Collection<string, Role> = new Collection(Array.from(message.member.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let roles: Array<Role> = new Array();
        let status: string = guildMember.user.presence.status;

        // iterate through user roles
        userRoles.forEach(function(el: any)
        {
            // exclude @everyone and managed roles
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
            .setTitle(guildMember.user.username + '#' + guildMember.user.discriminator)
            .setDescription(status)
            .setThumbnail(guildMember.user.avatarURL)
            .addField('Joined Server', joinServer, true)
            .addField('Joined Discord', joinDiscord, true)
            .addField('Roles', roles.join(', '), false);

        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
    }
}


