const { packagejson } = require("../../client");
const { client } = require("../../client");

client.on('shardReady', () => {

    console.log(client.user.username + '#' + client.user.discriminator + ': Reconnecting. Hello, World!');

    const presencelist = [
        `Version ${packagejson.version}-rc.1 | /help`, 
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