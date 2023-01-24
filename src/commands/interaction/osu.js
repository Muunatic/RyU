const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const osu = require('node-osu');
const osuApi = new osu.Api(process.env.OSU_API);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('osu')
    .setDescription('Osu profile')
    .addStringOption(option =>
      option.setName('username')
      .setDescription('osu! username')
      .setRequired(true)
    )
    .addNumberOption(option2 =>
        option2.setName('mode')
        .setDescription('osu! mode')
        .setRequired(true)
        .addChoices(
            {name: 'osu', value: 1},
            {name: 'taiko', value: 2},
            {name: 'osumania', value: 3},
        )
    ),
    async execute(interaction) {
        const args1 = interaction.options.get("username").value;
        const args2 = interaction.options.get("mode").value;
        const user = args1;
        const mode = args2;
        if (!user) return interaction.reply('**Username tidak ditemukan**');
        if (!mode) return interaction.reply('**Mode tidak ditemukan**');
        const data = await osuApi.getUser({
            u: user, m: mode
        });
        if (!data) return interaction.reply('**Data tidak ditemukan**');
        if (!data.pp.rank || !data.accuracy === null) return interaction.reply('**Data tidak ditemukan**');
        const osuembed = new MessageEmbed()
        
        .setColor('#CE0F3D')
        .setTitle(`OSU ${data.name} Profile`)
        .setThumbnail(`https://s.ppy.sh/a/${data.id}`)
        .setDescription(`:flag_${data.country.toLowerCase()}: **${data.name}**`)
        .addFields(
            { name: 'Name', value: `${data.name}`, inline: true },
            { name: 'Rank', value: `${data.pp.rank}`, inline: true },
            { name: 'Level', value: `${data.level}`, inline: true },
            { name: 'Accuracy', value: `${data.accuracy}`, inline: true },
            { name: 'Joined', value: `${data.raw_joinDate}`, inline: true },
            { name: 'Performance Point', value: `${data.pp.raw}`, inline: true },
        )
        .setFooter({text: `https://osu.ppy.sh/users/${data.id}`, iconURL:`https://s.ppy.sh/a/${data.id}`})
        .setTimestamp();
        
        interaction.reply({embeds: [osuembed]});
    },
};
