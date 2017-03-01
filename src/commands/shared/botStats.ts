'use strict';

import { Bot, Command, version, Message } from 'yamdbf';
import { User, RichEmbed, Guild } from 'discord.js';
import * as Discord from 'discord.js';
import * as moment from 'moment';

export default class BotStats extends Command<Bot>
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'botStats',
			aliases: ['bstats', 'BSTATS', 'BStats', 'bStats', 'bs'],
			description: 'Bot information',
			usage: '<prefix>bstats',
			extraHelp: '',
			group: 'shared'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<Message>
	{
		// build embed
		const embed: RichEmbed = new RichEmbed()
			.setColor(0x274E13)
			.setAuthor(this.bot.user.username + ' Stats', this.bot.user.avatarURL)
			.addField('Servers', this.bot.guilds.size.toString(), true)
			.addField('Channels', this.bot.channels.size.toString(), true)
			.addField('Users', this.bot.guilds.map((g: Guild) => g.memberCount).reduce((a: number, b: number) => a + b), true)
			.addField('YAMDBF', `v${version}`, true)
			.addField('Discord.js', `v${Discord.version}`, true)
			.addField('Bot Invite', `[Click here](https://discordapp.com/oauth2/authorize`
				+ `?permissions=268438528&scope=bot&client_id=${this.bot.user.id})`, true)
			.addField('\u200b', `For setup instructions, visit the [Rasputin Wiki](https://github.com/`
				+ `katagatame/Rasputin/wiki).`)
			.setTimestamp();

		// display stats
        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
	}
}
