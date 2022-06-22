const moment = require('moment-timezone');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Server time'),
    async execute(interaction) {
        let indonesiaTime = moment().tz('Asia/Jakarta').format();
        setInterval(() => { 
            indonesiaTime -= 2000;
        });
    
        const jammenitdetikindonesia = indonesiaTime.slice(11, -6);
        const tanggalindonesia = indonesiaTime.slice(0, -15);
    
        interaction.reply(`**${jammenitdetikindonesia} ${tanggalindonesia}**`);
    },
};