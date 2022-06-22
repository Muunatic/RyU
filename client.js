const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({
    
    intents:
    [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_BANS, 
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
        Intents.FLAGS.GUILD_INTEGRATIONS, 
        Intents.FLAGS.GUILD_INVITES, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
    ],

    partials:
    [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER",   
    ]

});

const packagejson = require('./package.json');

const { Player, QueueRepeatMode } = require('discord-player');
const player = new Player(client);
client.player = player;

const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './src/data/ga.json',
    updateCountdownEvery: 5000,
    hasGuildMembersIntent: true,
    default: {
        botsCanWin: false,
        embedColor: '#89E0DC',
        embedColorEnd: '#FF0000',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager;

module.exports = {
    client: client,
    packagejson: packagejson,
    player: player,
    QueueRepeatMode: QueueRepeatMode,
    manager: manager
}

require('./src/structures/error');
require('./src/structures/handler');
require('./src/structures/ready');
require('./src/structures/events');
require('./src/structures/presenceUpdate');
require('./src/structures/InteractionCreate');
require('./src/structures/messageCreate');
require('./src/structures/dmMessage');

client.login(process.env.CLIENT_TOKEN);