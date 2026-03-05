import { AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import User from '../../models/User.js';
import { xpForLevel } from '../../utils/helpers.js';

export default {
  name: 'rank',
  description: 'Check your rank card',
  usage: '²rank @user',

  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const userData = await User.findOne({ userId: target.id, guildId: message.guild.id });

    const level = userData?.level || 0;
    const xp = userData?.xp || 0;
    const xpNeeded = xpForLevel(level);
    const progress = Math.min(xp / xpNeeded, 1);

    const canvas = createCanvas(800, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2c2f33';
    ctx.roundRect(0, 0, 800, 200, 20);
    ctx.fill();

    ctx.fillStyle = '#23272a';
    ctx.roundRect(180, 130, 560, 25, 12);
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    ctx.roundRect(180, 130, 560 * progress, 25, 12);
    ctx.fill();

    try {
      const avatarURL = target.displayAvatarURL({ extension: 'jpg', size: 128 });
      const avatar = await loadImage(avatarURL);
      ctx.save();
      ctx.beginPath();
      ctx.arc(100, 100, 70, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 30, 30, 140, 140);
      ctx.restore();
    } catch {}

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Sans';
    ctx.fillText(target.username, 180, 60);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 22px Sans';
    ctx.fillText(`Level ${level}`, 180, 95);

    ctx.fillStyle = '#99aab5';
    ctx.font = '18px Sans';
    ctx.fillText(`${xp} / ${xpNeeded} XP`, 180, 125);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'rank.png' });
    await message.reply({ files: [attachment] });
  }
};
