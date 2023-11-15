const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Server info'),
    async execute(interaction) {
        const msgEmbed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Info Server')
        .setThumbnail(`${interaction.guild.iconURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`Nama server : **${interaction.guild.name}**\n\nID server : **${interaction.guild.id}**\n\nJumlah member : **${interaction.guild.memberCount}**\n\nServer dibuat pada tanggal : **${interaction.guild.createdAt}**`)
        .setFooter({text: `Info server ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({format : 'png', dynamic : true, size : 1024})})
        .setTimestamp();

        interaction.reply({embeds: [msgEmbed]});
    }
};
