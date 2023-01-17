const { client } = require('../../client');
const prefix = process.env.PREFIX;
const { MessageEmbed, MessageCollector } = require('discord.js');

const reportcooldown = new Set();

client.on('messageCreate', async (msg) => {

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (msg.channel.type === 'DM') {
        let dmchannel = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
        let dmembed = new MessageEmbed()

        .setTitle('DM Channel')
        .setColor('#89e0dc')
        .setAuthor({name: msg.author.username, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription(msg.content)
        .setTimestamp()

        dmchannel.send({embeds: [dmembed]});
    }

    if (command === 'report') {
        const reportargs = args.join(' ');
        if (msg.guild) return msg.react('❎') && msg.channel.send('**Declined**');
        if (!args[0]) return msg.channel.send('**Berikan args**');
        if (reportcooldown.has(msg.author.id)) {
            return msg.channel.send('**Kamu telah mengirimkan laporan hari ini, silahkan kirim laporan lain besok.**') && msg.react('❎');
        } else {
            const embedpreview = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Report preview')
            .setDescription(`Nama : **${msg.author.username}**\nReport ID : **${msg.id}**\n\nBug : **${reportargs}**`)
            .setFooter({text: `Direquest oleh ${msg.author.username}`, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp()
            msg.channel.send({embeds: [embedpreview]})
            msg.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`')
            const collector = new MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
            collector.on('collect', (msg) => {
                const msgct = msg.content.toLowerCase();
                if (msgct === 'yes') {
                    reportcooldown.add(msg.author.id);
                    setTimeout(() => {
                        reportcooldown.delete(msg.author.id);
                    }, 86400000);
                    const channeltarget = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
                    channeltarget.send(reportargs);
                    msg.react('✅');
            
                    const channellog = client.channels.cache.get(process.env.CHANNELLOGID);
                    const channellogembed = new MessageEmbed()
            
                    .setColor('#ff0000')
                    .setTitle('Report preview')
                    .setDescription(`Nama : **${msg.author.username}**\nReport ID : **${msg.id}**\n\nBug : **${reportargs}**`)
                    .setFooter({text: msg.author.username, iconURL: msg.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
                    .setTimestamp()
            
                    channellog.send({embeds: [channellogembed]});
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
