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
            name: 'us',
            aliases: ['stats'],
            description: 'User Stats',
            usage: '<prefix>us, <prefix>stats',
            extraHelp: 'Display your Discord stats.',
            group: 'shared',
            guildOnly: true
        });
    }

    public action(message: Message, args: string[]): Promise<Message>
    {
        // make sure user is logged in
        if (message.member === null)
            return message.channel.sendMessage('Please login in order to check your Discord stats.');
        
        // variable declaration
        const guildMember: GuildMember = message.member;
        const joinDiscord: string = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
        const joinServer: string = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
        const userRoles: Collection<string, Role> = new Collection(Array.from(message.member.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
        let roles: Array<Role> = new Array();
        let rolesString: string = '*none*';
        let status: string = guildMember.user.presence.status;

        // iterate through user roles
        userRoles.forEach((el: any) => {
            if (el.name !== '@everyone' && el.managed === false)
                roles.push(el);
        });

        // make sure roles isn't empty
        if (roles.length > 0)
            rolesString = roles.join(', ');

        // update status string, based on original status
        if (status === 'online')
            status = 'Status: *Online*';
        if (status === 'offline')
            status = 'Status: *Offline*';
        if (status === 'idle')
            status = 'Status: *Idle*';
        if (status === 'dnd')
            status = 'Status: *Do Not Disturb*';

        // build the embed
        const embed: RichEmbed = new RichEmbed()
            .setColor(0x274E13)
            .setAuthor(guildMember.user.username + '#' + guildMember.user.discriminator, guildMember.user.avatarURL)
            .setDescription(status)
            .addField('Joined Server', joinServer, true)
            .addField('Joined Discord', joinDiscord, true)
            .addField('Roles', rolesString, false)
            .setTimestamp();
        
        // display stats
        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
    }
}


