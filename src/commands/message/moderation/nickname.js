const { MessageCollector, Permissions } = require('discord.js');

module.exports = {
    name: 'nickname',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send(`Mention user untuk menggunakan command\n\n ${process.env.PREFIX}nickname <user> <nickname>`);
        const memberName = message.mentions.members.first();
        message.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`');
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', (message) => {
            const msgCt = message.content.toLowerCase();
            if (msgCt === 'yes') {
                memberName.setNickname(args.slice(1).join(' '));
                message.channel.send(`Nickname <@${memberName.id}> telah diubah menjadi **${args.slice(1).join(' ')}**`);
                collector.stop();
            } else if (msgCt === 'no') {
                message.channel.send('**Canceled**');
                collector.stop();
            }
        });
    }
};
