const crypto = require('crypto');
const { client } = require('../../../../client');
const { MessageEmbed, MessageCollector } = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    name: 'register',
    execute(message) {
        if (!message.member.roles.cache.get(process.env.UNREGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        if (message.member.roles.cache.get(process.env.REGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        const otpcode = crypto.createHash('sha256').update(message.id).digest('hex');
        message.author.send(`**Masukan kode verifikasi: **\`\`\`${otpcode}\`\`\``);
        message.reply('**Kode verifikasi terkirim**').then(msg => {
            setTimeout(() => msg.delete(), 60000)
        });
        const collector = new MessageCollector(message.channel, {filter: m => m.author.id === message.author.id, time: 60000});
        collector.on('collect', async message => {
            if (message.content === otpcode) {
                collector.stop();
                setTimeout(() => message.delete(), 5000);
                
                message.member.roles.add(process.env.REGISTER_ID);
                let channellog = client.channels.cache.get(process.env.CHANNELLOGID);

                message.reply('**Kode verifikasi diterima**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
                
                message.member.roles.remove(process.env.UNREGISTER_ID);

                let channellogembed = new MessageEmbed()

                .setColor('#00ff00')
                .setAuthor({name: 'Member Joined', iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                .setDescription(`**${client.emojis.cache.get('835987657892298802')} - ${message.author.username} telah join ke server**`)
                .setFooter({text: message.author.username, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                .setTimestamp()
                
                channellog.send({embeds: [channellogembed]});
            } else if (message.content === `${prefix}register`) {
                collector.stop();
                message.channel.send('**Kode verifikasi telah digantikan**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
            } else if (message.content !== otpcode) {
                collector.stop();
                message.channel.send('**Kode verifikasi ditolak**')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
            } 
        })
    },
};