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
			aliases: ['bstats'],
			description: 'Bot information',
			usage: '<prefix>bstats',
			extraHelp: '',
			group: 'shared'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
	{
		const embed: RichEmbed = new RichEmbed()
			.setColor(0x274E13)
			.setAuthor(this.bot.user.username + ' Stats', this.bot.user.avatarURL)
			.addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
			.addField('Uptime', moment(this.bot.uptime * 2).diff(this.bot.uptime), true)
			.addField('\u200b', '\u200b', true)
			.addField('Servers', this.bot.guilds.size.toString(), true)
			.addField('Channels', this.bot.channels.size.toString(), true)
			.addField('Users', this.bot.guilds.map((g: Guild) => g.memberCount).reduce((a: number, b: number) => a + b), true)
			.addField('YAMDBF', `v${version}`, true)
			.addField('Discord.js', `v${Discord.version}`, true)
			.addField('\u200b', '\u200b', true)
			.addField('Bot Invite', `[Click here](https://discordapp.com/oauth2/authorize`
				+ `?permissions=297888791&scope=bot&client_id=${this.bot.user.id})`, true)
			.setTimestamp();

        return message.channel.sendEmbed(embed, '', { disableEveryone: true });
	}
}
