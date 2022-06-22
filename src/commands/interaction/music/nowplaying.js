const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('What\'s music playing now?'),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        const nowplayingembed = new MessageEmbed()
        .setColor('#89e0dc')
        .setTitle(queue.current.title)
        .setThumbnail(queue.current.thumbnail)
        .setFooter({text: queue.current.url, iconURL: interaction.client.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .addField('Channel', `${queue.current.author}`, true)
        .addField('Requested by', `${queue.current.requestedBy.username}`, true)
        .addField('Duration', `${queue.current.duration}`, true)
        .addField('Source', `${queue.current.source}`, true)
        .addField('Views', `${queue.current.views}`, true)
        .addField('ID', `${queue.current.id}`, true)

        .addField('Progress Bar', `${queue.createProgressBar()}`, true)
        .setTimestamp()

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('resume')
            .setLabel('▶️')
            .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('pause')
            .setLabel('⏸️')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('skip')
            .setLabel('⏭️')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('stop')
            .setLabel('⏹️')
            .setStyle('DANGER')
        )

        const btnfilter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: btnfilter, time: 60000 });

        collector.on('collect', async i => {

            if (i.customId === 'resume') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                button.components[3].setDisabled(true);
                interaction.editReply({components: [button]});
                const queue = player.getQueue(interaction.guild.id);
                if (queue.setPaused(false)) return i.reply({content: '**Lagu berlangsung**'});
                queue.setPaused(false);
                await i.reply({content: '**Lagu telah diresume**'});
                collector.stop();
            }

            if (i.customId === 'pause') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                button.components[3].setDisabled(true);
                interaction.editReply({components: [button]});
                const queue = player.getQueue(interaction.guild.id);
                if (queue.setPaused(true)) return i.reply({content: '**Lagu dipause**'});
                queue.setPaused(true);
                await i.reply({content: '**Lagu telah dipause**'});
                collector.stop();
            }

            if (i.customId === 'skip') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                button.components[3].setDisabled(true);
                interaction.editReply({components: [button]});
                const queue = player.getQueue(interaction.guild.id);
                queue.skip();
                await i.reply({content: '**Lagu diskip**'});
                collector.stop();
            }

            if (i.customId === 'stop') {
                button.components[0].setDisabled(true);
                button.components[1].setDisabled(true);
                button.components[2].setDisabled(true);
                button.components[3].setDisabled(true);
                interaction.editReply({components: [button]});
                const queue = player.getQueue(interaction.guild.id);
                queue.destroy();
                await i.reply({content: '**Lagu distop**'});
                collector.stop();
            }
    
            collector.on('end', collected => console.log(collected.size));

        });

        interaction.reply({embeds: [nowplayingembed], components: [button]});
        setTimeout(() => {
            button.components[0].setDisabled(true);
            button.components[1].setDisabled(true);
            button.components[2].setDisabled(true);
            button.components[3].setDisabled(true);
            interaction.editReply({components: [button]});
            collector.stop();
        }, 60000);
    },
};