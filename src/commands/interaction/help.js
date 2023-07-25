const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command'),
    async execute(interaction, client) {
        const embed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Help commands')
        .setDescription(`Prefix = **${prefix}**`)
        .addFields(
            { name: 'General command', value: 'ping, userinfo, serverinfo, osu, avatar, stats, afk, mal, genshin' },
            { name: 'DM command', value: 'report' },
            { name: 'Moderator command', value: 'nickname' },
            { name: 'Admin command', value: 'warn, kick, ban, mute, unmute, user, add, reroll, end, eval'}
        )
        .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setTimestamp();

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('ping')
            .setLabel('Ping')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('userinfo')
            .setLabel('User Info')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('avatar')
            .setLabel('Avatar')
            .setStyle('SECONDARY')
        );

        const btnfilter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: btnfilter, time: 60000 });

        collector.on('collect', async i => {

            if (i.customId === 'ping') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                interaction.editReply({components: [button]});
                await i.reply({content: `Pong !! \`${client.ws.ping}ms.\` Latensi \`${Date.now() - i.createdTimestamp}ms.\``});
                collector.stop();
            }

            if (i.customId === 'userinfo') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                interaction.editReply({components: [button]});
                const userinfoembed = new MessageEmbed()

                .setColor('#89e0dc')
                .setTitle(`${interaction.user.username} Info`)
                .setThumbnail(`${interaction.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
                .setDescription(`Username : **${interaction.user.username}**\n\nNickname : **${interaction.member.nickname || interaction.user.username}**\n\nID : **${interaction.user.id}**\n\nTanggal dibuatnya akun : **${interaction.user.createdAt}**\n\nTanggal join server : **${interaction.member.joinedAt}**\n\nRole : **<@&${interaction.member.roles.highest.id}>**`)
                .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
                .setTimestamp();

                await i.reply({embeds: [userinfoembed]});
                collector.stop();
            }

            if (i.customId === 'avatar') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                interaction.editReply({components: [button]});
                const avatarembed = new MessageEmbed()

                .setColor('#89e0dc')
                .setTitle('Avatar')
                .setDescription(`Avatarnya ${interaction.user.username}`)
                .setImage(`${interaction.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
                .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})});

                await i.reply({embeds: [avatarembed]});
                collector.stop();
            }

            collector.on('end', collected => console.log(collected.size));

        });

        interaction.reply({embeds: [embed], components: [button]});
        setTimeout(() => {
            button.components[0].setDisabled(true);
            button.components[1].setDisabled(true);
            button.components[2].setDisabled(true);
            button.components[3].setDisabled(true);
            interaction.editReply({components: [button]});
            collector.stop();
        }, 60000);
    }
};
