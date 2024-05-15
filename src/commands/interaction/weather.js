const MsnWeather = require('msn-weather-api');
const weather = new MsnWeather('en', 'C');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Weather forecast')
    .addStringOption(option =>
        option.setName('location')
        .setDescription('location')
        .setRequired(true)
    ),
    /**
     * @param {import("../../../client").interaction} interaction
     */
    async execute(interaction) {
        let location = interaction.options.get('location').value;

        if (!location) return interaction.reply('**Berikan args**');

        const current = await weather.getCurrentData(location);

        const weatherEmbed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Weather')
        .setThumbnail(current.icon)
        .setDescription('Powered by msn-weather-api')
        .addFields(
            { name: 'Location', value: `${current.location}`, inline: true },
            { name: 'Weather', value: `${current.weather}`, inline: true },
            { name: 'Temperature', value: `${current.temperature}`, inline: true },
            { name: 'Humidity', value: `${current.humidity}`, inline: true },
            { name: 'Date', value: `${current.date}`, inline: true },
            { name: 'Windspeed', value: `${current.windspeed}`, inline: true }
        )
        .setFooter({ text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
        .setTimestamp();

        interaction.reply({ embeds: [weatherEmbed] });
    }
};
