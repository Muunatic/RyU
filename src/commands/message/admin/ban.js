const { Permissions } = require('discord.js');

module.exports = {
    name: 'ban',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.members.resolve(user);
          if (member) {
            member.ban({
                days: 0
              })
              .then(() => {
                if (args[1]) return message.channel.send(`**${user.tag} Telah diban permanen dikarenakan ${args.slice(1).join(' ')}**`);
                if (!args[1]) return message.channel.send(`**${user.tag} Telah diban permanen**`);
              });
          } else {
            message.channel.send('**User tidak ditemukan**');
          }
        } else {
          message.channel.send('**Mention user untuk melakukan ban**');
        }
    },
};
