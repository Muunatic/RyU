const { client } = require('./client');

require('./client');
require('./src/structures/handler');
require('./src/structures/ready');
require('./src/structures/events');
require('./src/structures/presenceUpdate');
require('./src/structures/interactionCreate');
require('./src/structures/messageCreate');
require('./src/structures/dmMessage');

client.login(process.env.CLIENT_TOKEN);
console.log('Starting client');
