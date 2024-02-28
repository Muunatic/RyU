const { client } = require('../../../../client');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'warn',
    /**
     * @param {import("../../../../client").message} message
     * @param {Array<string>} args
     */
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const mentionUser = message.mentions.users.first();
        if (!message.mentions.users.first()) return message.channel.send('**Mention user sebelum memberikan alasan\n\n\`\`\`/warn <mention> <reason>\`\`\`**');
        const msgEmbed = new MessageEmbed()

        .setColor('#f82c2c')
        .setTitle(`**${mentionUser.username} Warning**`)
        .setThumbnail(`${mentionUser.avatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setDescription(`${mentionUser.username} **berhasil diwarn dengan alasan:**\`\`\`diff\n- ${args.slice(1).join(' ')}\`\`\``)
        .setFooter({text: `Diwarn oleh ${message.author.username}`, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setTimestamp();

        message.channel.send({embeds: [msgEmbed]});

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#ff0000')
        .setAuthor({name: `${mentionUser.username} Warning`, iconURL: mentionUser.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(`**⚠️ - ${mentionUser.username} telah diwarn oleh ${message.author.username}**`)
        .setTimestamp();

        channellog.send({embeds: [channellogembed]});
    }
};
