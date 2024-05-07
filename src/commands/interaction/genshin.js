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
            const datastringtify = JSON.stringify(data);
            const dataparse = JSON.parse(datastringtify);
            const current = dataparse;
            const moracosts = current.costs.ascend1[0].count + current.costs.ascend2[0].count + current.costs.ascend3[0].count + current.costs.ascend4[0].count + current.costs.ascend5[0].count + current.costs.ascend6[0].count;

            const embed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle(current.name)
            .setDescription(current.description)
            .setThumbnail(current.images.mihoyo_icon)
            .addFields(
                { name: 'Weapon', value: `${current.weaponText}`, inline: true },
                { name: 'Rarity', value: `${current.rarity}✰`, inline: true },
                { name: 'Substat', value: `${current.mainStatText}`, inline: true },
                { name: 'Refine', value: `${current.r1.description}`, inline: true },
                { name: 'Material', value: `${current.costs.ascend6[0].name + ', ' + current.costs.ascend6[1].name + ', ' + current.costs.ascend6[2].name}`, inline: true },
                { name: 'Costs', value: `${moracosts}`, inline: true }
            )
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp();
            interaction.reply({embeds: [embed]});
        } else if (interaction.options.get('characters')) {
            const data = genshindb.characters(interaction.options.get('characters').value);
            const datastringtify = JSON.stringify(data);
            const dataparse = JSON.parse(datastringtify);
            const current = dataparse;
            const moracosts = current.costs.ascend1[0].count + current.costs.ascend2[0].count + current.costs.ascend3[0].count + current.costs.ascend4[0].count + current.costs.ascend5[0].count + current.costs.ascend6[0].count;

            const embed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle(current.name)
            .setDescription(current.description)
            .setThumbnail(current.images.mihoyo_icon)
            .addFields(
                { name: 'Weapon', value: `${current.weaponText}`, inline: true },
                { name: 'Vision', value: `${current?.elementText || '?'}`, inline: true },
                { name: 'Rarity', value: `${current.rarity}✰`, inline: true },
                { name: 'Substat', value: `${current.substatText}`, inline: true },
                { name: 'Region', value: `${current?.region || '?'}`, inline: true },
                { name: 'Birthday', value: `${current?.birthday || '?'}`, inline: true },
                { name: 'Material', value: `${current.costs.ascend6[0].name + ', ' + current.costs.ascend6[1].name + ', ' + current.costs.ascend6[2].name + ', ' + current.costs.ascend6[3].name + ', ' + (current.costs.ascend6[4]?.name || '-')}`, inline: true },
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
