const genshindb = require('genshin-db');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('genshin')
    .setDescription('Genshin impact')
    .addStringOption(characters =>
      characters.setName('characters')
      .setDescription('Characters')
    )
    .addStringOption(weapon =>
      weapon.setName('weapon')
      .setDescription('Weapon')
    ),
    async execute(interaction) {
        if (interaction.options.get("weapon")) {
            const data = genshindb.weapons(interaction.options.get("weapon").value);
            let datastringtify = JSON.stringify(data);
            let dataparse = JSON.parse(datastringtify)
            let current = dataparse;
            let material1 = current.costs.ascend6[0].name;
            let material2 = current.costs.ascend6[1].name;
            let material3 = current.costs.ascend6[2].name;
            let moracosts = current.costs.ascend1[0].count + current.costs.ascend2[0].count + current.costs.ascend3[0].count + current.costs.ascend4[0].count + current.costs.ascend5[0].count + current.costs.ascend6[0].count;
            const embed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle(current.name)
            .setDescription(current.description)
            .setThumbnail(current.images.icon)
            .addField('Weapon', `${current.weapontype}`, true)
            .addField('Rarity', `${current.rarity}✰`, true)
            .addField('Substat', `${current.substat}`, true)
            .addField('Refine', `${current.effect}`,)
            .addField('Material', material1 + ', ' + material2 + ', ' + material3)
            .addField('Costs', `${moracosts}`)
    
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp()
            interaction.reply({embeds: [embed]});
        } else if (interaction.options.get("characters")) {
            const data = genshindb.characters(interaction.options.get("characters").value);
            let datastringtify = JSON.stringify(data);
            let dataparse = JSON.parse(datastringtify)
            let current = dataparse;
            let material1 = current.costs.ascend6[0].name;
            let material2 = current.costs.ascend6[1].name;
            let material3 = current.costs.ascend6[2].name;
            let material4 = current.costs.ascend6[3].name;
            let material5 = current.costs.ascend6[4].name;
            let moracosts = current.costs.ascend1[0].count + current.costs.ascend2[0].count + current.costs.ascend3[0].count + current.costs.ascend4[0].count + current.costs.ascend5[0].count + current.costs.ascend6[0].count;
            const embed = new MessageEmbed()
    
            .setColor('#89e0dc')
            .setTitle(current.name)
            .setDescription(current.description)
            .setThumbnail(current.images.icon)
            .addField('Weapon', `${current.weapontype}`, true)
            .addField('Vision', `${current.element}`, true)
            .addField('Rarity', `${current.rarity}✰`, true)
            .addField('Substat', `${current.substat}`, true)
            .addField('Region', `${current.region}`, true)
            .addField('Birthday', `${current.birthday}`, true)
            .addField('Material', material1 + ', ' + material2 + ', ' + material3 + ', ' + material4 + ', ' + material5)
            .addField('Costs', `${moracosts}`)
    
            .setFooter({text: `Direquest oleh ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
            .setTimestamp()
    
            interaction.reply({embeds: [embed]});
        } else {
            interaction.reply('**Pilih salah satu option yang disediakan**');
        }
    },
};