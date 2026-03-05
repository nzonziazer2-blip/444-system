import { PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'givecoin',
  description: 'Give coins to a member',
  usage: '²givecoin @user [amount]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed('Error', 'You need Administrator permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const amount = parseInt(args[1]);
    if (!amount || amount < 1) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a valid amount!')] });

    await User.findOneAndUpdate(
      { userId: target.id, guildId: message.guild.id },
      { $inc: { coins: amount } },
      { upsert: true }
    );

    await message.reply({ embeds: [successEmbed('Coins Given', `${target} received **${amount}** coins!`)] });
  }
};
