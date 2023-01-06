const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption(option =>
      option.setName('args')
      .setDescription('Berikan args untuk memulai lagu')
      .setRequired(true)
    ),
    async execute(interaction) {
        const query = interaction.options.get("args").value;
        const queue = player.createQueue(interaction.guild, {
            autoSelfDeaf: false,
            leaveOnEnd: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 60000,
            ytdlOptions: {
                quality: "highestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25,
                dlChunkSize: 0
            },
            metadata: {
                channel: interaction.channel
            }
        });
        
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: 'undefined', ephemeral: true });
        }
        
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        
        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: 'null' });
        
        queue.play(track);
        
        return await interaction.followUp({ content: `Menambahkan lagu **${track.title}** di **${interaction.member.voice.channel.name}...**` });
    },
};