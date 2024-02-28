const crypto = require('crypto');
const { client } = require('../../../../client');
const { MessageEmbed, MessageCollector } = require('discord.js');

module.exports = {
    name: 'register',
    /**
     * @param {import("../../../../client").message} message
     */
    execute(message) {
        let channelLog = client.channels.cache.get(process.env.CHANNELLOGID);
        if (!message.member.roles.cache.get(process.env.UNREGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
        if (message.member.roles.cache.get(process.env.REGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
        const otpCode = crypto.createHash('sha256').update(message.id).digest('hex');
        message.author.send(`**Masukan kode verifikasi: **\`\`\`${otpCode}\`\`\``);
        message.reply('**Kode verifikasi terkirim**').then(msg => {
            setTimeout(() => msg.delete(), 60000);
        });
        const collector = new MessageCollector(message.channel, {filter: m => m.author.id === message.author.id, time: 60000});
        collector.on('collect', async (message) => {
            if (message.content === otpCode) {
                collector.stop();
                setTimeout(() => message.delete(), 5000);

                message.member.roles.add(process.env.REGISTER_ID);

                message.reply('**Kode verifikasi diterima**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });

                message.member.roles.remove(process.env.UNREGISTER_ID);

                let channelLogEmbed = new MessageEmbed()

                .setColor('#00ff00')
                .setAuthor({name: 'Member Joined', iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                .setDescription(`**${client.emojis.cache.get('835987657892298802')} - ${message.author.username} telah join ke server**`)
                .setFooter({text: message.author.username, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                .setTimestamp();

                channelLog.send({embeds: [channelLogEmbed]});
            } else if (message.content === `${process.env.PREFIX}register`) {
                collector.stop();
                message.channel.send('**Kode verifikasi telah digantikan**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
            } else if (message.content !== otpCode) {
                collector.stop();
                message.channel.send('**Kode verifikasi ditolak**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
            }
        });
    }
};
