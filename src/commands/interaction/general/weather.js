const weather = require('weather-js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Info cuaca')
    .addStringOption(option =>
      option.setName('kota')
      .setDescription('Berikan nama kota')
      .setRequired(true)
    ),
    async execute(interaction) {
        let kota = interaction.options.get("kota").value;
        let degreeType = 'C';

        await weather.find({search: kota, degreeType: degreeType}, function(err, result) {
            if(err) console.log(err);
            console.log(JSON.stringify(result, null, 2));
            if (!kota) return interaction.reply('**Berikan args**');
            if (err || result === undefined || result.length === 0) return interaction.reply(process.env.DEFAULT_ERROR);
            
            let current = result[0].current;
            let location = result[0].location;

            const cuaca = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle('Cuaca')
            .setThumbnail(current.imageUrl)
            .setDescription('Powered by weather-js')
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp()

            cuaca.addField('Nama', location.name, true)
            .addField('Cuaca', current.skytext, true)
            .addField('Suhu', current.temperature, true)
            .addField('Kelembapan', current.humidity, true)
            .addField('Tanggal', current.date, true)
            .addField('Kecepatan angin', current.windspeed, true)

            interaction.reply({embeds: [cuaca]});
        });
    },
};