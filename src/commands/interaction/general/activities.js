const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('activities')
    .setDescription('Start activities')
    .addStringOption(option => 
      option.setName('value')
      .setDescription('Activities value')
      .setRequired(true)
      .addChoices(
        {name: 'Youtube Together', value: '880218394199220334'},
        {name: 'Fishington', value: '814288819477020702'},
        {name: 'Chess In The Park', value: '832012774040141894'},
        {name: 'Betrayal', value: '773336526917861400'},
        {name: 'Poker In The Night', value: '755827207812677713'},
        {name: 'Word Snacks', value: '879863976006127627'},
        {name: 'Letter League', value: '879863686565621790'},
      )
    ),
    async execute(interaction) {
        const appid = interaction.options.get("value").value;
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        const channel = interaction.member.voice.channel;
        fetch(`https://discord.com/api/v10/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: appid,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${process.env.CLIENT_TOKEN}`,
                "Content-Type": 'application/json'
            }
        })
        .then(res => res.json())
        .then(invite => {
            if (!invite.code) return interaction.reply(process.env.DEFAULT_ERROR);
            interaction.reply(`> https://discord.com/invite/${invite.code}`);
        });
    },
};