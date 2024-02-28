const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get Avatar')
    .addUserOption(option =>
        option.setName('user')
        .setDescription('Mention user')
    ),
    /**
     * @param {import("../../../client").interaction} interaction
     */
    async execute(interaction) {
        const userValue = interaction.options.getUser('user') || interaction.user;
        const usernameValue = interaction.options.getUser('user') || interaction.member.user;
        const msgEmbed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Avatar')
        .setDescription(`Avatarnya ${usernameValue.username}`)
        .setImage(`${userValue.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})});

        interaction.reply({embeds: [msgEmbed]});
    }
};
