const { MessageCollector } = require('discord.js')

module.exports = {
    name: 'nickname',
    execute(message, args) {
        if (!message.member.roles.cache.get(process.env.MOD_ROLE)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('Mention user untuk menggunakan command');
        const membername = message.mentions.members.first();
        message.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`');
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', (message) => {
            const msgct = message.content.toLowerCase();
            if (msgct === 'yes') {
                membername.setNickname(args.slice(1).join(' '));
                message.channel.send(`Nickname <@${membername.id}> telah diubah menjadi **${args.slice(1).join(' ')}**`);
                collector.stop();
            } else if (msgct === 'no') {
                message.channel.send('**Canceled**');
                collector.stop();
            }
        })
    },
};