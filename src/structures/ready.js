const { client, packageJson } = require('../../client');

client.on('ready', () => {

    console.log(client.user.username + '#' + client.user.discriminator + ': ' + '\x1b[32m' + 'Hello, World!' + '\x1b[0m');

    const presenceList = [
        `Version ${packageJson.version} | /help`,
        `${process.env.DISCORDLINK} | /help`,
        `${client.guilds.cache.size} server | /help`
    ];

    let i = 0;
    setInterval(() => {
        const index = Math.floor(i);
        client.user.setActivity({ name: presenceList[index], type: 'COMPETING', url: 'https://www.twitch.tv/discord' });
        i = i + 1;
        console.log(presenceList[index]);
        if (i === presenceList.length) i = i - presenceList.length;
    }, 5000);

});
