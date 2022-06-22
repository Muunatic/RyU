const { client } = require('../../client');

client.on('presenceUpdate', async (updatePresence, oldupdatePresence) => {

    const ApexRole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    const GenshinImpactRole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    const SeaofThievesRole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    const VALORANTRole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    const CSGORole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    const SpotifyRole = oldupdatePresence.guild.roles.cache.get('ROLE_ID');
    if (!ApexRole) return;
    if (!GenshinImpactRole) return;
    if (!SeaofThievesRole) return;
    if (!VALORANTRole) return;
    if (!CSGORole) return;
    if (!SpotifyRole) return;

    console.log(updatePresence.member.presence.activities[0]);

    if (updatePresence.member.presence.activities[0] === undefined) {
        updatePresence.member.roles.remove(ApexRole) && updatePresence.member.roles.remove(GenshinImpactRole) && updatePresence.member.roles.remove(VALORANTRole) && updatePresence.member.roles.remove(CSGORole) && updatePresence.member.roles.remove(SpotifyRole);
    } else if (updatePresence.member.presence.activities[0].name === "Apex Legends") {
        updatePresence.member.roles.add(ApexRole);
    } else if (updatePresence.member.presence.activities[0].name === "Genshin Impact") {
        updatePresence.member.roles.add(GenshinImpactRole);
    } else if (updatePresence.member.presence.activities[0].name === "Sea of Thieves") {
        updatePresence.member.roles.add(SeaofThievesRole);
    } else if (updatePresence.member.presence.activities[0].name === "VALORANT") {
        updatePresence.member.roles.add(VALORANTRole);
    } else if (updatePresence.member.presence.activities[0].name === "Counter-Strike: Global Offensive") {
        updatePresence.member.roles.add(CSGORole);
    } else if (updatePresence.member.presence.activities[0].name === "Spotify") {
        updatePresence.member.roles.add(SpotifyRole);
    }

});