const { client } = require('../../client');
const { MessageEmbed, MessageCollector } = require('discord.js');

const reportCooldown = new Set();

client.on('messageCreate', async (msg) => {

    const args = msg.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (msg.channel.type === 'DM') {
        let dmChannel = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
        let msgEmbed = new MessageEmbed()

        .setTitle('DM Channel')
        .setColor('#89e0dc')
        .setAuthor({name: msg.author.username, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(msg.content)
        .setTimestamp();

        dmChannel.send({embeds: [msgEmbed]});
    }

    if (command === 'report') {
        const reportArgs = args.join(' ');
        if (msg.guild) return msg.react('❎') && msg.channel.send('**Declined**');
        if (!args[0]) return msg.channel.send('**Berikan args**');
        if (reportCooldown.has(msg.author.id)) {
            return msg.channel.send('**Kamu telah mengirimkan laporan hari ini, silahkan kirim laporan lain besok.**') && msg.react('❎');
        } else {
            const embedpreview = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Report preview')
            .setDescription(`Nama : **${msg.author.username}**\nReport ID : **${msg.id}**\n\nBug : **${reportArgs}**`)
            .setFooter({text: `Direquest oleh ${msg.author.username}`, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp();
            msg.channel.send({embeds: [embedpreview]});
            msg.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`');
            const collector = new MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
            collector.on('collect', (msg) => {
                const msgct = msg.content.toLowerCase();
                if (msgct === 'yes') {
                    reportCooldown.add(msg.author.id);
                    setTimeout(() => {
                        reportCooldown.delete(msg.author.id);
                    }, 86400000);
                    const channeltarget = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
                    channeltarget.send(reportArgs);
                    msg.react('✅');

                    const channelLog = client.channels.cache.get(process.env.CHANNELLOGID);
                    const channelLogEmbed = new MessageEmbed()

                    .setColor('#ff0000')
                    .setTitle('Report preview')
                    .setDescription(`Nama : **${msg.author.username}**\nReport ID : **${msg.id}**\n\nBug : **${reportArgs}**`)
                    .setFooter({text: msg.author.username, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                    .setTimestamp();

                    channelLog.send({embeds: [channelLogEmbed]});
                    msg.channel.send(`**Reported**\n\`\`\`Report ID : ${msg.id}\`\`\``);
                    collector.stop();
                } else if (msgct === 'no') {
                    msg.channel.send('**Canceled**');
                    collector.stop();
                }
            });
        }
    }

});
