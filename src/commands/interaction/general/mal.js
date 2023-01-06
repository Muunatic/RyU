const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../../../../client');
const { MessageEmbed } = require('discord.js');
const malScraper = require('mal-scraper');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mal')
    .setDescription('MAL scraper')
    .addStringOption(option =>
      option.setName('anime')
      .setDescription('Anime name')
      .setRequired(true)
    ),
    async execute(interaction) {
        const animevalue = interaction.options.get("anime").value;
        const animescraper = await malScraper.getInfoFromName(animevalue);
        if (!animescraper) return interaction.reply(process.env.DEFAULT_ERROR);
        const animeembed = new MessageEmbed()

        .setColor('#CE0F3D')
        .setAuthor({name: animescraper.title, iconURL: client.user.displayAvatarURL(), url: animescraper.url})
        .setImage(animescraper.picture)
        .setDescription(animescraper.synopsis)
        .addField('Type', animescraper.type, true)
        .addField('Episode', animescraper.episodes, true)
        .addField('Duration', animescraper.duration, true)
        .addField('Genres', animescraper.genres.join(', '), true)
        .addField('Status', animescraper.status, true)
        .addField('Score', animescraper.score, true)
        .setFooter({text: animescraper.url, iconURL: 'https://pbs.twimg.com/profile_images/1190380284295950339/Py6XnxvH_400x400.jpg'})
        .setTimestamp()

        interaction.reply({embeds: [animeembed]});
    },
};
