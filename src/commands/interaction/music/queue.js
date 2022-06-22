const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Queue music'),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!queue.tracks[0]) return interaction.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**`);
        await interaction.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**\n\n` + (queue.tracks.map((track, i) => {
            return `**#${i + 1}** - **${track.title}** | **${track.author}** (direquest oleh : **${track.requestedBy.username}**)`
        }).slice(0, 5).join('\n') + `\n\n${queue.tracks.length > 5 ? `dan **${queue.tracks.length - 5}** lagu lain...` : `Playlist **${queue.tracks.length}**...`}`));
    },
};