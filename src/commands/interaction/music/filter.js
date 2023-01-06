const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Audio filter')
    .addStringOption(option => 
      option.setName('filter')
      .setDescription('Choose audio filter')
      .setRequired(true)
      .addChoices(
        {name: 'Bassboost', value: 'bassboost'},
        {name: 'Karaoke', value: 'karaoke'},
        {name: 'Nightcore', value: 'nightcore'},
        {name: '8D', value: '8D'},
        {name: 'Earrape', value: 'earrape'},
      )
    ),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        const filters = [];
        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));
        const filtervalue = interaction.options.get("filter").value;
        const filtersupdated = {};
        filtersupdated[filtervalue] = queue.getFiltersEnabled().includes(filtervalue) ? false : true;
        await queue.setFilters(filtersupdated);
        interaction.reply(`**Filter ${queue.getFiltersEnabled().includes(filtervalue) ? 'Dinyalakan' : 'Dimatikan'}**`);
    },
};