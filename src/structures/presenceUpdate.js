const { client } = require('../../client');

const getEnv = process.env;

const removerole = (member) => {
    return member.roles.remove([getEnv.activityRole1, getEnv.activityRole2, getEnv.activityRole3, getEnv.activityRole4, getEnv.activityRole5, getEnv.activityRole6]);
};

client.on('presenceUpdate', async (updatePresence, newPresence) => {

    const cacheId = updatePresence.guild.roles.cache;

    if (!cacheId.get(getEnv.activityRole1 || getEnv.activityRole2 || getEnv.activityRole3 || getEnv.activityRole4 || getEnv.activityRole5 || getEnv.activityRole6)) return;

    setTimeout(() => {
        const presence0 = newPresence?.member?.presence?.activities[0];
        const presence1 = newPresence?.member?.presence?.activities[1];

        if (newPresence?.user.bot == false) {
            switch (presence0?.name) {
                case "Custom Status":
                    switch (presence1?.name) {
                        case "Honkai: Star Rail":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole1)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole1);
                            });
                            break;
                        case "Genshin Impact":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole2)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole2);
                            });
                            break;
                        case "osu!":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole3)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole3);
                            });
                            break;
                        case "VALORANT":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole4)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole4);
                            });
                            break;
                        case "Counter-Strike 2":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole5)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole5);
                            });
                            break;
                        case "Spotify":
                            if (newPresence.member.roles.cache.get(getEnv.activityRole6)) return;
                            removerole(newPresence.member).then(() => {
                                newPresence.member.roles.add(getEnv.activityRole6);
                            });
                            break;
                        default:
                            removerole(newPresence.member);
                            break;
                    }
                    break;
                case "Honkai: Star Rail":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole1)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole1);
                    });
                    break;
                case "Genshin Impact":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole2)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole2);
                    });
                    break;
                case "osu!":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole3)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole3);
                    });
                    break;
                case "VALORANT":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole4)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole4);
                    });
                    break;
                case "Counter-Strike 2":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole5)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole5);
                    });
                    break;
                case "Spotify":
                    if (newPresence.member.roles.cache.get(getEnv.activityRole6)) return;
                    removerole(newPresence.member).then(() => {
                        newPresence.member.roles.add(getEnv.activityRole6);
                    });
                    break;
                default:
                    removerole(newPresence.member);
                    break;
            }
        } else {
            return;
        }
    }, 1000);

});
