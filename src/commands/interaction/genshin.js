const genshindb = require('genshin-db');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
genshindb.setOptions({v4Prop: true});

module.exports = {
    data: new SlashCommandBuilder()
    .setName('genshin')
    .setDescription('Genshin impact')
    .addStringOption(characters =>
        characters.setName('characters')
        .setDescription('Characters name')
    )
    .addStringOption(weapon =>
        weapon.setName('weapon')
        .setDescription('Weapon name')
    ),
    /**
     * @param {import("../../../client").interaction} interaction
     * @param {import("../../../client").client} client
     */
    async execute(interaction) {
        if (interaction.options.get('weapon')) {
            const data = genshindb.weapons(interaction.options.get('weapon').value);
            const moracosts = data.costs.ascend1[0].count + data.costs.ascend2[0].count + data.costs.ascend3[0].count + data.costs.ascend4[0].count + data.costs.ascend5[0].count + data.costs.ascend6[0].count;

            const embed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle(data.name)
            .setDescription(data.description)
            .setThumbnail(data.images.mihoyo_icon)
            .addFields(
                { name: 'Weapon', value: `${data.weaponText}`, inline: true },
                { name: 'Rarity', value: `${data.rarity}✰`, inline: true },
                { name: 'Substat', value: `${data.mainStatText}`, inline: true },
                { name: 'Refine', value: `${data.r1.description}`, inline: true },
                { name: 'Material', value: `${data.costs.ascend6[0].name + ', ' + data.costs.ascend6[1].name + ', ' + data.costs.ascend6[2].name}`, inline: true },
                { name: 'Costs', value: `${moracosts}`, inline: true }
            )
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp();
            interaction.reply({embeds: [embed]});
        } else if (interaction.options.get('characters')) {
            const data = genshindb.characters(interaction.options.get('characters').value);
            const moracosts = data.costs.ascend1[0].count + data.costs.ascend2[0].count + data.costs.ascend3[0].count + data.costs.ascend4[0].count + data.costs.ascend5[0].count + data.costs.ascend6[0].count;

            const embed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle(data.name)
            .setDescription(data.description)
            .setThumbnail(data.images.mihoyo_icon)
            .addFields(
                { name: 'Weapon', value: `${data.weaponText}`, inline: true },
                { name: 'Vision', value: `${data?.elementText || '?'}`, inline: true },
                { name: 'Rarity', value: `${data.rarity}✰`, inline: true },
                { name: 'Substat', value: `${data.substatText}`, inline: true },
                { name: 'Region', value: `${data?.region || '?'}`, inline: true },
                { name: 'Birthday', value: `${data?.birthday || '?'}`, inline: true },
                { name: 'Material', value: `${data.costs.ascend6[0].name + ', ' + data.costs.ascend6[1].name + ', ' + data.costs.ascend6[2].name + ', ' + data.costs.ascend6[3].name + ', ' + (data.costs.ascend6[4]?.name || '-')}`, inline: true },
                { name: 'Costs', value: `${moracosts}`, inline: true }
            )
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp();

            interaction.reply({embeds: [embed]});
        } else {
            interaction.reply('**Pilih salah satu option yang disediakan**');
        }
    }
};
