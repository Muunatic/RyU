const { client, packagejson } = require('../../client');

client.on('shardReady', () => {

    console.log(client.user.username + '#' + client.user.discriminator + ': ' + '\x1b[32m' + 'Hello, World!' + '\x1b[0m');

    const presencelist = [
        `Version ${packagejson.version} | /help`, 
        `${process.env.DISCORDLINK} | /help`,
        `${client.guilds.cache.size} server | /help`,
    ];
    
    let i = 0;
    setInterval(() => {
        const index = Math.floor(i);
        client.user.setActivity({ name: presencelist[index], type: 'COMPETING', url: 'https://www.twitch.tv/discord' });
        i = i + 1;
        console.log(presencelist[index]);
        if (i === presencelist.length) i = i - presencelist.length;
    }, 5000);

});