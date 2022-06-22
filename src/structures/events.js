const { player } = require('../../client');

player.on('channelEmpty', async (queue) => {
    queue.metadata.channel.send('**Tidak ada member di voice**');
});
player.on('trackStart', (queue, track) => queue.metadata.channel.send(`Memutar lagu **${track.title}**`));
player.on('queueEnd', (queue) => queue.metadata.channel.send('**Tidak ada music yang tersisa**'));
player.on('connectionError', (error) => {
    console.log(`Connection Error: ${error.message}`);
});
player.on('error', (error) => {
    console.log(error.message);
});