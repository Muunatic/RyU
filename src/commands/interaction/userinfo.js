const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('User info'),
    /**
     * @param {import("../../../client").interaction} interaction
     * @param {import("../../../client").client} client
     */
    async execute(interaction) {
        const msgEmbed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle(`${interaction.user.username} Info`)
        .setThumbnail(`${interaction.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`Username : **${interaction.user.username}**\n\nNickname : **${interaction.member.nickname || interaction.user.username}**\n\nID : **${interaction.user.id}**\n\nTanggal dibuatnya akun : **${interaction.user.createdAt}**\n\nTanggal join server : **${interaction.member.joinedAt}**\n\nRole : **<@&${interaction.member.roles.highest.id}>**`)
        .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setTimestamp();

        interaction.reply({embeds: [msgEmbed]});
    }
};
