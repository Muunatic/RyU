const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set AFK'),
    async execute(interaction) {
        const afkjson = require('../../../data/afk.json');
        afkjson.afkvalue.push(interaction.user.id);
        fs.writeFileSync('./src/data/afk.json', JSON.stringify(afkjson));
        interaction.reply(`**\`${interaction.user.username}\` telah AFK!**`);
        interaction.member.setNickname(`[AFK] ${interaction.user.username}`);
    },
};