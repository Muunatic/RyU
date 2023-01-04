const ms = require('ms');
const { Permissions } = require('discord.js');
const { manager } = require('../../../../client');
const prefix = process.env.PREFIX;

module.exports = {
    name: 'add',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args[0]) return message.channel.send(`${prefix}giveaway **<mentionschannel>** <time> <winner> <args>`);
        if (!args.join(' ')) return message.channel.send(`**${prefix}giveaway <mentionschannel> <time> <winner> <args>**`);
        const channelsend = message.mentions.channels.first();
        const prize = args.slice(3).join(' ');
        manager.start(channelsend, {
            duration: ms(args[1]),
            winnerCount: parseInt(args[2]),
            prize: prize,
            messages: {
                giveaway: `\`\`\`${args.slice(3).join(' ')} !!\`\`\``,
                giveawayEnded: '\`\`\`Ended !!\`\`\`',
                inviteToParticipate: 'React emoji 🎉 untuk berpartisipasi!',
                timeRemaining: 'Waktu tersisa: **{duration}**',
                winMessage: `Selamat, {winners}! Kamu memenangkan **${prize}**!!`,
                embedFooter: args.slice(3).join(' '),
                noWinner: 'Tidak Valid',
                winners: 'winner(s) ',
                endedAt: 'Ended at',
                drawing: `{timestamp}`
            },
        }).then((gData) => {
            console.log(gData);
        });
    },
};