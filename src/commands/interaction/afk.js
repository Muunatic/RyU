const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set AFK'),
    async execute(interaction) {
        const afkJson = require('../../../data/afk.json');
        afkJson.afkvalue.push(interaction.user.id);
        fs.writeFileSync('./src/data/afk.json', JSON.stringify(afkJson));
        interaction.reply(`**\`${interaction.user.username}\` telah AFK!**`);
        interaction.member.setNickname(`[AFK] ${interaction.user.username}`);
    }
};
