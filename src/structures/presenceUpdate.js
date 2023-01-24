const { client } = require('../../client');

client.on('presenceUpdate', async (updatePresence, oldupdatePresence) => {

    const getEnv = process.env;
    const cacheId = oldupdatePresence.guild.roles.cache;
    
    if (!cacheId.get(getEnv.activityRole1 || getEnv.activityRole2 || getEnv.activityRole3 || getEnv.activityRole4 || getEnv.activityRole5 || getEnv.activityRole6)) return;
    const presence0 = updatePresence?.member.presence.activities[0];
    const presence1 = updatePresence?.member.presence.activities[1];

    const removerole = updatePresence.member.roles.remove(getEnv.activityRole1) && updatePresence.member.roles.remove(getEnv.activityRole2) && updatePresence.member.roles.remove(getEnv.activityRole3) && updatePresence.member.roles.remove(getEnv.activityRole4) && updatePresence.member.roles.remove(getEnv.activityRole5) && updatePresence.member.roles.remove(getEnv.activityRole6);
    
    if (presence0.name === undefined) {
        return removerole;
    } else if (presence0.name === "Custom Status") {
        if (presence1.name === undefined) {
            return removerole;
        }
    }

    if (presence0.name === "Apex Legends") {
        if (updatePresence.member.roles.cache.get(getEnv.activityRole1)) return;
        removerole.then(() => {
            return updatePresence.member.roles.add(getEnv.activityRole1);
        });
    } else if (presence0.name === "Custom Status") {
        if (presence1.name === "Apex Legends") {
            if (updatePresence.member.roles.cache.get(getEnv.activityRole1)) return;
            removerole.then(() => {
                return updatePresence.member.roles.add(getEnv.activityRole1);
            });
        } else if (presence1.name === "Genshin Impact") {
            if (updatePresence.member.roles.cache.get(getEnv.activityRole2)) return;
            removerole.then(() => {
                return updatePresence.member.roles.add(getEnv.activityRole2);
            });
        } else if (presence1.name === "osu!") {
            if (updatePresence.member.roles.cache.get(getEnv.activityRole3)) return;
            removerole.then(() => {
                return updatePresence.member.roles.add(getEnv.activityRole3);
            });
        } else if (presence1.name === "VALORANT") {
            if (updatePresence.member.roles.cache.get(getEnv.activityRole4)) return;
            removerole.then(() => {
                return updatePresence.member.roles.add(getEnv.activityRole4);
            });
        } else if (presence1.name === "Counter-Strike: Global Offensive") {
            if (updatePresence.member.roles.cache.get(getEnv.activityRole5)) return;
            removerole.then(() => {
                return updatePresence.member.roles.add(getEnv.activityRole5);
            });
        } else if (presence1.name === "Spotify") {
            setTimeout(() => {
                removerole.then(() => {
                    if (presence1.name === "Spotify") {
                        return updatePresence.member.roles.add(getEnv.activityRole6);
                    } else {
                        return;
                    }
                });
            }, 10000);
        }
    } else if (presence0.name === "Genshin Impact") {
        if (updatePresence.member.roles.cache.get(getEnv.activityRole2)) return;
        removerole.then(() => {
            return updatePresence.member.roles.add(getEnv.activityRole2);
        });
    } else if (presence0.name === "osu!") {
        if (updatePresence.member.roles.cache.get(getEnv.activityRole3)) return;
        removerole.then(() => {
            return updatePresence.member.roles.add(getEnv.activityRole3);
        });
    } else if (presence0.name === "VALORANT") {
        if (updatePresence.member.roles.cache.get(getEnv.activityRole4)) return;
        removerole.then(() => {
            return updatePresence.member.roles.add(getEnv.activityRole4);
        });
    } else if (presence0.name === "Counter-Strike: Global Offensive") {
        if (updatePresence.member.roles.cache.get(getEnv.activityRole5)) return;
        removerole.then(() => {
            return updatePresence.member.roles.add(getEnv.activityRole5);
        });
    } else if (presence0.name === "Spotify") {
        removerole.then(() => {
            setTimeout(() => {
                if (presence0.name === "Spotify") {
                    if (updatePresence.member.roles.cache.get(getEnv.activityRole6)) return;
                    return updatePresence.member.roles.add(getEnv.activityRole6);
                } else {
                    return;
                }
            }, 10000);
        });
    }

});
