const { client } = require('../../client');
const { MessageEmbed, MessageCollector } = require('discord.js');

const reportCooldown = new Set();

client.on('messageCreate', async message => {

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.channel.type === 'DM') {
        let dmChannel = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
        let messageEmbed = new MessageEmbed()

        .setTitle('DM Channel')
        .setColor('#89e0dc')
        .setAuthor({name: message.author.username, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(message.content)
        .setTimestamp();

        dmChannel.send({embeds: [messageEmbed]});
    }

    if (command === 'report') {
        const reportArgs = args.join(' ');
        if (message.guild) return message.react('❎') && message.channel.send('**Declined**');
        if (!args[0]) return message.channel.send('**Berikan args**');
        if (reportCooldown.has(message.author.id)) {
            return message.channel.send('**Kamu telah mengirimkan laporan hari ini, silahkan kirim laporan lain besok.**') && message.react('❎');
        } else {
            const embedpreview = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Report preview')
            .setDescription(`Nama : **${message.author.username}**\nReport ID : **${message.id}**\n\nBug : **${reportArgs}**`)
            .setFooter({text: `Direquest oleh ${message.author.username}`, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp();
            message.channel.send({embeds: [embedpreview]});
            message.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`');
            const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            collector.on('collect', message => {
                const msgct = message.content.toLowerCase();
                if (msgct === 'yes') {
                    reportCooldown.add(message.author.id);
                    setTimeout(() => {
                        reportCooldown.delete(message.author.id);
                    }, 86400000);
                    const channeltarget = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
                    channeltarget.send(reportArgs);
                    message.react('✅');

                    const channelLog = client.channels.cache.get(process.env.CHANNELLOGID);
                    const channelLogEmbed = new MessageEmbed()

                    .setColor('#ff0000')
                    .setTitle('Report preview')
                    .setDescription(`Nama : **${message.author.username}**\nReport ID : **${message.id}**\n\nBug : **${reportArgs}**`)
                    .setFooter({text: message.author.username, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                    .setTimestamp();

                    channelLog.send({embeds: [channelLogEmbed]});
                    message.channel.send(`**Reported**\n\`\`\`Report ID : ${message.id}\`\`\``);
                    collector.stop();
                } else if (msgct === 'no') {
                    message.channel.send('**Canceled**');
                    collector.stop();
                }
            });
        }
    }

});
