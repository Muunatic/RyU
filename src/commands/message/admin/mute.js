const { client } = require('../../../../client');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'mute',
    execute(message) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('**Mention user untuk melakukan mute**');
        const muteRole = message.guild.roles.cache.get(process.env.MUTE_ROLE);
        const mentionUsername = message.mentions.users.first();
        const mentionMember = message.mentions.members.first();
        if (mentionMember.roles.cache.get(process.env.MUTE_ROLE)) return message.channel.send('**User masih dimute**');
        mentionMember.roles.add(muteRole);
        message.channel.send(`**<@${mentionMember.id}>** telah dimute oleh **<@${message.author.id}>**`);

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#ff0000')
        .setAuthor({name: 'Member Muted', iconURL:message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(`**⚠️ - ${mentionUsername.username} dimuted oleh ${message.author.username}**`)
        .setTimestamp();

        channellog.send({embeds: [channellogembed]});
    }
};
