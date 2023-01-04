const os = require('os');
const cpuStat = require('cpu-stat');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Client stats'),
    async execute(interaction, client) {
        cpuStat.usagePercent((err, percent) => {
            if (err) {
              return console.log(err);
            }

            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let statsembed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle('Client Stats')
            .setThumbnail(`${interaction.client.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
            .setDescription(`bot ini telah aktif selama **${days} hari, ${hours} jam, ${minutes} menit, dan ${seconds} detik**.`)
            .addFields(
                { name: 'CPU', value: `${os.cpus().map((i) => `${i.model}`)[0]}`, inline: true },
                { name: 'CPU Usage', value: `${percent.toFixed(2)}%`, inline: true },
                { name: 'Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`, inline: true },
                { name: 'Architecture', value: `${os.arch()}-based processor`, inline: true },
                { name: 'Platform', value: `${os.platform()}`, inline: true },
                { name: 'Engine', value: `${process.version}`, inline: true },
            )
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp()
            
            interaction.reply({embeds: [statsembed]})
        });
    },
};