const { SlashCommandBuilder } = require('@discordjs/builders');
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
    async execute(interaction, client) {
        const animeValue = interaction.options.get('anime').value;
        const animeScraper = await malScraper.getInfoFromName(animeValue);
        if (!animeScraper) return interaction.reply(process.env.DEFAULT_ERROR);

        const msgEmbed = new MessageEmbed()

        .setColor('#CE0F3D')
        .setAuthor({name: animeScraper.title, iconURL: client.user.displayAvatarURL(), url: animeScraper.url})
        .setImage(animeScraper.picture)
        .setDescription(animeScraper.synopsis)
        .addFields(
            { name: 'Type', value: `${animeScraper.type}`, inline: true },
            { name: 'Episode', value: `${animeScraper.episodes}`, inline: true },
            { name: 'Duration', value: `${animeScraper.duration}`, inline: true },
            { name: 'Genres', value: `${animeScraper.genres.join(', ')}`, inline: true },
            { name: 'Status', value: `${animeScraper.status}`, inline: true },
            { name: 'Score', value: `${animeScraper.score}`, inline: true }
        )
        .setFooter({text: animeScraper.url, iconURL: 'https://pbs.twimg.com/profile_images/1190380284295950339/Py6XnxvH_400x400.jpg'})
        .setTimestamp();

        interaction.reply({embeds: [msgEmbed]});
    }
};
