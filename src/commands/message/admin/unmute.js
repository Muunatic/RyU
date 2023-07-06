const { client } = require('../../../../client');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'unmute',
    execute(message) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('**Mention user untuk melakukan unmute**');
        const muterole = message.guild.roles.cache.get(process.env.MUTE_ROLE);
        const mentionsusername = message.mentions.users.first();
        const mentionsmember = message.mentions.members.first();
        if (!mentionsmember.roles.cache.get(process.env.MUTE_ROLE)) return message.channel.send('**User tidak dimute**');
        mentionsmember.roles.remove(muterole);
        message.channel.send(`**<@${mentionsmember.id}>** telah diunmute oleh **<@${message.author.id}>**`);

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#00ff00')
        .setAuthor({name: 'Member Unmuted', iconURL:message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(`**⚠️ - ${mentionsusername.username} diunmuted oleh ${message.author.username}**`)
        .setTimestamp();

        channellog.send({embeds: [channellogembed]});
    }
};
