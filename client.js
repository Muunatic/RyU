const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed,  MessageCollector, Permissions } = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');
require('dotenv').config();
const prefix = process.env.PREFIX;

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
        "MESSAGE",
        "REACTION",
        "USER"
    ]

});

const moment = require('moment-timezone');
const SnakeGame = require('snakecord');
const weather = require('weather-js');

const packagejson = require('./package.json');
const botversion = packagejson.version;
const botauthor = packagejson.author;

const osu = require('node-osu');
const osuApi = new osu.Api(process.env.OSU_API);

const { NovelCovid } = require('novelcovid');
const track = new NovelCovid();
const reportcooldown = new Set();

const ms = require('ms')
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './database.json',
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

const { Player, QueueRepeatMode } = require('discord-player');
const player = new Player(client);
client.player = player;

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('ready', () => {

    console.log('Hello, World!');

    const presencelist = [
        `Version ${botversion} | ${prefix}help `, 
        `${process.env.DISCORDLINK} | ${prefix}help`,
        `Running on ${client.guilds.cache.size} server | ${prefix}help`,
    ];
    
    let i = 0;
    setInterval(() => {
        const index = Math.floor(i);
        client.user.setActivity(presencelist[index], { type: 'COMPETING', url: 'https://www.twitch.tv/discord', });
        i = i + 1;
        console.log(presencelist[index]);
        if (i === presencelist.length) i = i - presencelist.length;
    }, 5000);
    client.user.setPresence({ status: 'online' })
    
});

player.on("error", (error) => {
    console.log(error.message);
});

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`Memutar lagu **${track.title}**`))
player.on("queueEnd", (queue) => queue.metadata.channel.send('**Tidak ada music yang tersisa**'))
player.on("botDisconnect", (queue) => queue.metadata.channel.send('**Disconnect**'))

client.on('shardError', error => {
    console.error('Error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('uncaughtException:', error)
})

process.on('uncaughtExceptionMonitor', error => {
    console.error('uncaughtExceptionMonitor:', error)
})

client.on('interactionCreate', async interaction => {
    
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    let indonesiaTime = moment().tz('Asia/Jakarta').format();
    setInterval(() => { 
        indonesiaTime -= 2000;
    });

    const jammenitdetikindonesia = indonesiaTime.slice(11, -6)
    const tanggalindonesia = indonesiaTime.slice(0, -15)

    if (commandName === 'time') {
        interaction.reply(`**${jammenitdetikindonesia} ${tanggalindonesia}**`);
    }

    if (commandName === 'ping') {
        await interaction.reply(`Pong !! \`${client.ws.ping}ms.\` Latensi \`${Date.now() - interaction.createdTimestamp}ms.\``)
    }

    if (commandName === 'stats') {
        cpuStat.usagePercent(function(err, percent) {
            if (err) {
              return console.log(err);
            }

            let statsembed = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle('BOT Stats')
            .setThumbnail(`${interaction.client.user.displayAvatarURL({format : 'png', dynamic : true, size : 4096})}`)
            .setFooter(`Direquest oleh ${interaction.user.username}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
            .setTimestamp()

            .addField(`CPU`, `${os.cpus().map((i) => `${i.model}`)[0]}`, true)
            .addField(`CPU Usage`, `${percent.toFixed(2)}%`, true)
            .addField(`Memory`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`, true)
            .addField(`Architecture`, `${os.arch()}-based processor`, true)
            .addField(`Platform`, `${os.platform()}`, true)
            .addField(`Engine`, `${process.version}`, true)
            
            interaction.reply({embeds: [statsembed]})
        });
    }

    if (commandName === 'uptime') {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const uptimeembed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Uptime')
        .setThumbnail(`${interaction.client.user.displayAvatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`bot ini telah aktif selama **${days} hari, ${hours} jam, ${minutes} menit, dan ${seconds} detik**.`)
        .setFooter(`Direquest oleh ${interaction.user.username}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()

        await interaction.reply({embeds: [uptimeembed]});
    }
    
    if (commandName === 'serverinfo') {
        const serverembed = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle('Info server')
        .setThumbnail(`${interaction.guild.iconURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`Nama server : **${interaction.guild.name}**\n\nID server : **${interaction.guild.id}**\n\nJumlah member : **${interaction.guild.memberCount}**\n\nServer dibuat pada tanggal : **${interaction.guild.createdAt}**`)
        .setFooter(`Info server ${interaction.guild.name}`, `${interaction.guild.iconURL({format : 'png', dynamic : true, size : 4096})}`)
        .setTimestamp()
        
        await interaction.reply({embeds: [serverembed]});
    } 
    
    if (commandName === 'userinfo') {
        const userinfoembed = new MessageEmbed()
        
        .setColor('#89e0dc')
        .setTitle(`${interaction.user.username} Info`)
        .setThumbnail(`${interaction.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`Username : **${interaction.user.username}**\n\nNickname : **${interaction.member.nickname}**\n\nID : **${interaction.user.id}**\n\nTanggal dibuatnya akun : **${interaction.user.createdAt}**\n\nTanggal join server : **${interaction.member.joinedAt}**\n\nRole : **<@&${interaction.member.roles.highest.id}>**\n\nStatus : **${interaction.member.presence.status}**`)
        .setFooter(`Direquest oleh ${interaction.user.username}`, `${interaction.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setTimestamp()
        
        await interaction.reply({embeds: [userinfoembed]});
    }

    if (commandName === 'avatar') {
        const uservalue = interaction.options.getUser("user") || interaction.member;
        const usernamevalue = interaction.options.getUser("user") || interaction.member.user; 
        const avatarembed = new MessageEmbed()
    
        .setColor('#89e0dc')
        .setTitle('Avatar')
        .setDescription(`Avatarnya ${usernamevalue.username}`)
        .setImage(`${uservalue.displayAvatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setFooter(`Direquest oleh ${interaction.member.displayName}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
    
        interaction.reply({embeds: [avatarembed]});
    }

    if (commandName === 'osu') {
        const args1 = interaction.options.get("username").value;
        const args2 = interaction.options.get("mode").value;
        const user = args1
        const mode = args2
        if (!user) return interaction.reply(`**Username tidak ditemukan**`)
        if (!mode) return interaction.reply('**Mode tidak ditemukan**')
        const data = await osuApi.getUser({
            u: user, m: mode
        })
        if (!data) return interaction.reply('**Data tidak ditemukan**')
        if (!data.pp.rank || !data.accuracy === null) return interaction.reply('**Data tidak ditemukan**')
        const osuembed = new MessageEmbed()

        .setColor('#CE0F3D')
        .setTitle(`OSU ${data.name} Profile`)
        .setThumbnail(`https://s.ppy.sh/a/${data.id}`)
        .setDescription(`:flag_${data.country.toLowerCase()}: **${data.name}**`)
        .setFooter(`https://osu.ppy.sh/users/${data.id}`, `https://s.ppy.sh/a/${data.id}`)
        .setTimestamp()

        osuembed.addField(`Nama`, data.name, true)
        .addField(`Rank`, data.pp.rank, true)
        .addField(`Level`, data.level, true)
        .addField(`Accuracy`, data.accuracy, true)
        .addField(`Joined`, data.raw_joinDate, true)
        .addField(`Performance Point`, data.pp.raw, true)

        interaction.reply({embeds: [osuembed]});
    }

    if (commandName === 'weather') {
        let kota = interaction.options.get("kota").value;
        let degreeType = 'C';

        await weather.find({search: kota, degreeType: degreeType}, function(err, result) {
            if(err) console.log(err);
            console.log(JSON.stringify(result, null, 2));
            if (!kota) return interaction.reply('**[2] - ERR_TIDAK_ADA_ARGS**')
            if (err || result === undefined || result.length === 0) return interaction.reply('**Data tidak ditemukan**')
            
            let current = result[0].current;
            let location = result[0].location;

            const cuaca = new MessageEmbed()

            .setColor('#89e0dc')
            .setTitle('Cuaca')
            .setThumbnail(current.imageUrl)
            .setDescription('Powered by weather-js')
            .setFooter(`Direquest oleh ${interaction.member.displayName}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
            .setTimestamp()

            cuaca.addField('Nama', location.name, true)
            .addField('Cuaca', current.skytext, true)
            .addField('Suhu', current.temperature, true)
            .addField('Kelembapan', current.humidity, true)
            .addField('Tanggal', current.date, true)
            .addField('Kecepatan angin', current.windspeed, true)

            interaction.reply({embeds: [cuaca]});
        });
    }

    if (commandName === 'corona') {
        const negara = interaction.options.get("negara").value;
        const coronacountries = await track.countries(negara)
        const countriesembed = new MessageEmbed()

        .setColor('#ff0000')
        .setTitle(`Corona Stats ${coronacountries.country}`)
        .setDescription(`**Total kasus corona di ${coronacountries.country}**\n\n Kasus : **${coronacountries.cases}**\n Meninggal : **${coronacountries.deaths}**\n Sembuh : **${coronacountries.recovered}**\n\n**Total penambahan kasus hari ini**\n\n Kasus : **${coronacountries.todayCases}**\n Meninggal : **${coronacountries.todayDeaths}**`)
        .setFooter(`Direquest oleh ${interaction.member.displayName}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()

        await interaction.reply({embeds: [countriesembed]});
    }

    if (commandName === 'totalcorona') {
        const data = await track.all()
        const coronaembed = new MessageEmbed()

        .setColor('#ff0000')
        .setTitle('Corona Stats')
        .setDescription(`**Total kasus corona\n\n Kasus** : **${data.cases}**\n Meninggal : **${data.deaths}**\n Sembuh : **${data.recovered}**\n\n**Total penambahan kasus hari ini**\n\n Kasus : **${data.todayCases}**\n Meninggal : **${data.todayDeaths}**`)
        .setFooter(`Direquest oleh ${interaction.member.displayName}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()
    
        await interaction.reply({embeds: [coronaembed]});
    }

    if (commandName === 'link') {
        const serverid = client.guilds.cache.get(process.env.SERVERID);
        const ownerid = serverid.ownerId;
        const ownercache = client.users.cache.get(ownerid)
        const embedmessage = new MessageEmbed()

        .setColor('#89e0dc')
        .setTitle(`${serverid.name} Server`)
        .setThumbnail(interaction.guild.iconURL({format : 'png', dynamic : true, size : 4096}))
        .setDescription(`**${process.env.DISCORDLINK}\n\nName : ${serverid.name}\n\nOwner : ${ownercache.username}#${ownercache.discriminator}\n\nMember : ${serverid.memberCount}**`)
        .setFooter(`Direquest oleh ${interaction.user.username}`, `${interaction.member.displayAvatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()

        interaction.reply({embeds: [embedmessage]});
    }

    if (commandName === 'play') {
        const query = interaction.options.get("args").value;
        const queue = await player.createQueue(interaction.guild, {
            autoSelfDeaf: false,
            leaveOnEnd: false,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: 60000,
            ytdlOptions: {
                quality: "highestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
            },
            metadata: {
                channel: interaction.channel
            }
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "undefined", ephemeral: true });
        }

        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: 'null' });

        queue.play(track);

        return await interaction.followUp({ content: `Menambahkan lagu **${track.title}** di **${interaction.member.voice.channel.name}...**` });
    }

    if (commandName === 'stop') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        queue.destroy();
        await interaction.reply('**Lagu telah distop**');
    }

    if (commandName === 'skip') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        queue.skip()
        await interaction.reply('**Lagu telah diskip**')
    }

    if (commandName === 'queue') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (!queue.tracks[0]) return interaction.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**`);
        await interaction.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**\n\n` + (queue.tracks.map((track, i) => {
            return `**#${i + 1}** - **${track.title}** | **${track.author}** (direquest oleh : **${track.requestedBy.username}**)`
        }).slice(0, 5).join('\n') + `\n\n${queue.tracks.length > 5 ? `dan **${queue.tracks.length - 5}** lagu lain...` : `Playlist **${queue.tracks.length}**...`}`));
    }

    if (commandName === 'volume') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        const numbervalue = interaction.options.get("number").value;
        if (Math.round(parseInt(numbervalue)) < 1 || Math.round(parseInt(numbervalue)) > 100) return interaction.reply(`berikan nomor 1 - 100 !`);
        queue.setVolume(numbervalue);
        interaction.reply(`Volume telah diubah ke ${numbervalue}%`)
    }

    if (commandName === 'pause') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        if (queue.setPaused(true)) return interaction.reply('**Lagu sedang dipause**')
        queue.setPaused(true)
        interaction.reply(`**Lagu telah dipause**`)
    }

    if (commandName === 'resume') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        if (queue.setPaused(false)) return interaction.reply('**Lagu sedang berlangsung**')
        queue.setPaused(false)
        interaction.reply(`**Lagu dilanjutkan**`)
    }

    if (commandName === 'repeat') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply(`Kamu tidak divoice channel yang sama !`);
        const repeatmode = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
        return interaction.reply(repeatmode ? `Loop **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**` : `Repeat mode **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**`);
    }

    if (commandName === 'nowplaying') {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('Tidak ada music yang berjalan');
        const nowplayingembed = new MessageEmbed()
        .setColor('#89e0dc')
        .setTitle(queue.current.title)
        .setThumbnail(queue.current.thumbnail)
        .setFooter(`Direquest oleh ${interaction.user.username}`, `${interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .addField(`Channel`, `${queue.current.author}`, true)
        .addField(`Requested by`, `${queue.current.requestedBy.username}`, true)
        .addField(`Duration`, `${queue.current.duration}`, true)
        .setTimestamp()

        await interaction.reply({embeds: [nowplayingembed]})
    }

    if (commandName === 'lock') {
        let everyone = interaction.member.guild.roles.cache.get(process.env.EVERYONE_ID)
        interaction.member.voice.channel.permissionOverwrites.edit(everyone, {
            CONNECT: false
        })
        await interaction.reply('**Locked !!**');
    }

    if (commandName === 'unlock') {
        let everyone = interaction.member.guild.roles.cache.get(process.env.EVERYONE_ID)
        interaction.member.voice.channel.permissionOverwrites.edit(everyone, {
            CONNECT: true
        })
        await interaction.reply('**Unlocked !!**');
    }

    if (commandName === 'bitrate') {
        const numbervalue = interaction.options.get("number").value;
        if (!numbervalue || isNaN(numbervalue) || numbervalue === 'string') return interaction.reply(`**[2] - ERR_TIDAK_ADA_ARGS**`);
        if (Math.round(parseInt(numbervalue)) < 8000 || Math.round(parseInt(numbervalue)) > 96000) return interaction.reply(`**berikan nomor 8000 - 96000!**`);
        interaction.member.voice.channel.setBitrate(numbervalue)
        await interaction.reply(`Bitrate telah diubah ke **${numbervalue}** !`);
    }

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '**[0] - Error**', ephemeral: true });
	}

});

client.on('messageCreate', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.channel.type === 'DM') {
        let dmchannel = client.channels.cache.get(process.env.CHANNELLOGPRIVATE)
        let dmembed = new MessageEmbed()

        .setTitle('DM Channel')
        .setColor('#89e0dc')
        .setAuthor(message.author.username, message.author.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(message.content)
        .setTimestamp()

        dmchannel.send({embeds: [dmembed]});
    }

    if (command === 'report') {
        if (message.guild) return message.react('❎') && message.channel.send('**Declined**')
        if (!args[0]) return message.channel.send(`**[2] - ERR_TIDAK_ADA_ARGS**`)
        if (reportcooldown.has(message.author.id)) {
            return message.channel.send('**Kamu telah mengirimkan laporan hari ini, silahkan kirim laporan lain besok.**') && message.react('❎')
        } else {
            reportcooldown.add(message.author.id);
            setTimeout(() => {
                reportcooldown.delete(message.author.id);
            }, 86400000);
        }

        const reportargs = args.join(" ");
        const channeltarget = client.channels.cache.get(process.env.CHANNELLOGPRIVATE);
        channeltarget.send(reportargs)
        message.react('✅');

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let emoji = client.emojis.cache.get('835987657892298802');
        let channellogembed = new MessageEmbed()

        .setColor('#ff0000')
        .setAuthor(`Bug Report`, message.author.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(`**${emoji} - Laporan Bug**\n\nNama : **${message.author.username}**\nReport ID : **${message.id}**\nBug : **${reportargs}**`)
        .setTimestamp()

        channellog.send({embeds: [channellogembed]})
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;

    if (command === 'help') {
        const embed = {
            color: '#89e0dc',
            author: { name: 'Help commands' },
            footer: { text: `${prefix}help` },
            fields: [
                { name: 'General command', value: 'ping, uptime, time, userinfo, serverinfo, osu, avatar, stats, weather, aboutbot, corona, totalcorona, tictactoe, snake' },
                { name: 'DM command', value: 'report' },
                { name: 'Music command', value: 'play, skip, stop, pause, resume, volume, queue, nowplaying, repeat, bitrate, lock, unlock' },
                { name: 'Moderator command', value: 'nickname' },
                { name: 'Admin command', value: 'warn, kick, ban, mute, unmute' },
            ],
            timestamp: new Date(),
            description: `Prefix = **${prefix}**`,
        }
        message.channel.send({embeds: [embed]});
    }

    if (command === 'register') {
        setTimeout(() => message.delete(), 5000)

        if (!message.member.roles.cache.get(process.env.UNREGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        
        if (message.member.roles.cache.get(process.env.REGISTER_ID)) return message.channel.send('**Kamu sudah teregistrasi**')
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });

        const channel = client.channels.cache.get(process.env.GENERALCHAT);
        const user = message.author.id
        const emoji = client.emojis.cache.get('835987657892298802');
        
        message.member.roles.add(process.env.REGISTER_ID);
        let channellog = client.channels.cache.get(process.env.CHANNELLOGID)

        message.channel.send(`**Selesai, anda sudah teregistrasi...\nSelamat datang <@${user}> kamu sudah bisa chat di ${channel} setelah membaca pesan ini**`)
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        
        message.member.roles.remove(process.env.UNREGISTER_ID);

        let channellogembed = new MessageEmbed()

        .setColor('#00ff00')
        .setAuthor(`Member Joined`, message.author.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(`**${emoji} - ${message.author.username} telah join ke server**`)
        .setFooter(message.author.username , message.client.user.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setTimestamp()

        channellog.send({embeds: [channellogembed]})
    }

    if (command === 'aboutbot') { 
        const aboutbotembed = new MessageEmbed()
        
        .setColor('#89e0dc')
        .setTitle('About BOT')
        .setThumbnail(`${message.client.user.avatarURL({format : 'png', dynamic : true, size : 4096})}`)
        .setDescription(`Nama : **${message.client.user.username}**\n\nVersi : **${botversion}**\n\nKeyword : **${prefix}**\n\nDev : **${botauthor}**\n\nSource Code : **https://github.com/Muunatic/RyU**`)
        .setFooter(`Direquest oleh ${message.author.username}`, `${message.author.avatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()

        message.channel.send({embeds: [aboutbotembed]});
    }

    if (command === 'tictactoe') {
        if (!message.mentions.members.first()) return message.channel.send('**[MultiplayerRequire]** Tag user lain untuk bermain tictactoe')
        const { tictactoe } = require("reconlx");
        new tictactoe({
         message: message,
            player_two: message.mentions.members.first(),
        });
    }

    if (command === 'snake') {
        const snakeGame = new SnakeGame({
            title: 'Maen uler',
            color: "GREEN",
            timestamp: true,
            gameOverTitle: "Kalah"
        });
        snakeGame.newGame(message)
    }

    if (command === 'user') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini')
        client.users.cache.get(args[0]).send(args.slice(1).join(" "));
    }

    if (command === 'giveaway') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini')
        if (!args[0]) return message.channel.send(`${prefix}giveaway **<mentionschannel>** <time> <winner> <args>`);
        if (!args.join(' ')) return message.channel.send(`**${prefix}giveaway <mentionschannel> <time> <winner> <args>**`);
        const channelsend = message.mentions.channels.first()
        client.giveawaysManager.start(channelsend, {
            duration: ms(args[1]),
            winnerCount: parseInt(args[2]),
            prize: args.slice(3).join(' '),
            messages: {
                giveaway: `\`\`\`${args.slice(3).join(' ')} !!\`\`\``,
                giveawayEnded: '\`\`\`Ended !!\`\`\`',
                inviteToParticipate: 'React emoji 🎉 untuk berpartisipasi!',
                timeRemaining: 'Waktu tersisa: **{duration}**',
                winMessage: 'Selamat, {winners}! Kamu memenangkan **{prize}** !!',
                embedFooter: args.slice(3).join(' '),
                noWinner: 'Tidak Valid',
                winners: 'winner(s) ',
                endedAt: 'Ended at',
                drawing: `{timestamp}`
            },
        }).then((gData) => {
            console.log(gData);
        });
    }

    if (command === 'reroll') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${prefix}reroll <msgid>`);
        const messageID = args[0];
        client.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send('Rerolled');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    }

    if (command === 'end') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${prefix}end <msgid>`);
        const messageID = args[0];
        client.giveawaysManager.end(messageID).then(() => {
            message.channel.send('**Success !!**');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    }

    if (command === 'nickname') {
        if (!message.member.roles.cache.get(process.env.MOD_ROLE)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('Mention user untuk menggunakan command')
        const membername = message.mentions.members.first();
        message.channel.send('**Please confirm your choice**\n\`\`\`[Yes] or [No]\`\`\`')
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', message => {
            const msgct = message.content.toLowerCase();
            if (msgct === 'yes') {
                membername.setNickname(args.slice(1).join(" "));
                message.channel.send(`Nickname <@${membername.id}> telah diubah menjadi **${args.slice(1).join(" ")}**`);
            } else if (msgct === 'no') {
                message.channel.send('**Canceled**');
            }
        })
    }

    if (command === 'mute') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('**Mention user untuk melakukan mute**');
        const muterole = message.guild.roles.cache.get(process.env.MUTE_ROLE);
        const mentionsusername = message.mentions.users.first()
        const mentionsmember = message.mentions.members.first()
        if (mentionsmember.roles.cache.get(process.env.MUTE_ROLE)) return message.channel.send('**User masih dimute**');
        mentionsmember.roles.add(muterole);
        message.channel.send(`**<@${mentionsmember.id}>** telah dimute oleh **<@${message.author.id}>**`);
        
        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#ff0000')
        .setAuthor(`Member Muted`, message.client.user.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(`**⚠️ - ${mentionsusername.username} dimuted oleh ${message.author.username}**`)
        .setTimestamp()

        channellog.send({embeds: [channellogembed]})
    }

    if (command === 'unmute') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!message.mentions.users.first()) return message.channel.send('**Mention user untuk melakukan unmute**');
        const muterole = message.guild.roles.cache.get(process.env.MUTE_ROLE);
        const mentionsusername = message.mentions.users.first()
        const mentionsmember = message.mentions.members.first()
        if (!mentionsmember.roles.cache.get(process.env.MUTE_ROLE)) return message.channel.send('**User tidak dimute**');
        mentionsmember.roles.remove(muterole);
        message.channel.send(`**<@${mentionsmember.id}>** telah diunmute oleh **<@${message.author.id}>**`);

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#00ff00')
        .setAuthor(`Member Unmuted`, message.client.user.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(`**⚠️ - ${mentionsusername.username} diunmuted oleh ${message.author.username}**`)
        .setTimestamp()

        channellog.send({embeds: [channellogembed]});
    }

    if (command === 'warn') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const mentionsuser = message.mentions.users.first();
        if (!message.mentions.users.first()) return message.channel.send(`**Mention user sebelum memberikan alasan\n\n\`\`\`/warn <mention> <reason>\`\`\`**`)
        const warnembed = new MessageEmbed()

        .setColor('#f82c2c')
        .setTitle(`**${mentionsuser.username} Warning**`)
        .setThumbnail(`${mentionsuser.avatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setDescription(`${mentionsuser.username} **berhasil diwarn dengan alasan:**\`\`\`diff\n- ${args.slice(1).join(" ")}\`\`\``)
        .setFooter(`Diwarn oleh ${message.author.username}`, `${message.author.avatarURL({format : 'png', dynamic : true, size : 1024})}`)
        .setTimestamp()

        message.channel.send({embeds: [warnembed]});

        let channellog = client.channels.cache.get(process.env.CHANNELLOGID);
        let channellogembed = new MessageEmbed()

        .setColor('#ff0000')
        .setAuthor(`${mentionsuser.username} Warning`, mentionsuser.avatarURL({format : 'png', dynamic : true, size : 1024}))
        .setDescription(`**⚠️ - ${mentionsuser.username} telah diwarn oleh ${message.author.username}**`)
        .setTimestamp()

        channellog.send({embeds: [channellogembed]})
    }

    if (command === 'kick') {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.members.resolve(user);
          if (member) {
            member.kick(`Telah dikick dari server oleh ${message.author.username}`)
              .then(() => {
                  if (args[1]) return message.channel.send(`**${user.tag} Telah dikick dikarenakan ${args.slice(1).join(" ")}**`)
                  if (!args[1]) return message.channel.send(`**${user.tag} Telah dikick**`);
              })
          } else {
            message.channel.send('**User tidak ditemukan**');
          }
        } else {
          message.channel.send('**Mention user untuk melakukan kick**');
        }
    }

    if (command === 'ban') {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.members.resolve(user);
          if (member) {
            member.ban({
                days: 0
              })
              .then(() => {
                if (args[1]) return message.channel.send(`**${user.tag} Telah diban permanen dikarenakan ${args.slice(1).join(" ")}**`)
                if (!args[1]) return message.channel.send(`**${user.tag} Telah diban permanen**`);
              });
          } else {
            message.channel.send('**User tidak ditemukan**');
          }
        } else {
          message.channel.send('**Mention user untuk melakukan ban**');
        }
    }

    if (command === 'say') {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const channel = client.channels.cache.get(args[0])
        if (!client.channels.cache.get(args[0])) return message.channel.send('Error');
        if (!args[1]) return message.channel.send('**Berikan args**');
        channel.send(args.slice(1).join(" "));
        message.react('✅');
    }

});

client.login(process.env.CLIENT_TOKEN);
