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
    async execute(interaction) {
        const uservalue = interaction.options.getUser('user') || interaction.user;
        const usernamevalue = interaction.options.getUser('user') || interaction.member.user;
        const avatarembed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Avatar')
        .setDescription(`Avatarnya ${usernamevalue.username}`)
        .setImage(`${uservalue.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})});

        interaction.reply({embeds: [avatarembed]});
    }
};
