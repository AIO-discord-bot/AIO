const { getUser } = require("@schemas/User");
const Discord = require("discord.js");
// const { getSettings } = require("@schemas/Guild");
const { getSettings } = require("@root/src/schemas/Guild");
async function fetchGuild(guildID, client, guilds) {
  const guild = client.guilds.cache.get(guildID);
  const settings = await getSettings(guild);
  return { ...guild, ...settings._doc, ...guilds.find((g) => g.id === guild.id) };
}

async function fetchUser(userData, client, query) {
  if (userData.guilds) {
    userData.guilds.forEach((guild) => {
      if (guild.permissions) {
        const perms = new Discord.Permissions(BigInt(guild.permissions));
        if (perms.has("MANAGE_GUILD")) guild.admin = true;
      }
      guild.settingsUrl = client.guilds.cache.get(guild.id)
        ? `/manage/${guild.id}/`
        : `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8%20applications.commands&guild_id=${guild.id}&disable_guild_select=true`;
      guild.statsUrl = client.guilds.cache.get(guild.id)
        ? `/stats/${guild.id}/`
        : `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${guild.id}`;
      guild.iconURL = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
        : "https://icon-library.com/images/discord-icon-white/discord-icon-white-1.jpg";
      guild.displayed = query ? guild.name.toLowerCase().includes(query.toLowerCase()) : true;
    });
    userData.displayedGuilds = userData.guilds.filter((g) => g.displayed && g.admin)
    if (userData.displayedGuilds.length < 1) {
      delete userData.displayedGuilds;
    }
  }
  const user = await client.users.fetch(userData.id);
  user.displayAvatar = user.displayAvatarURL();
  const userDb = await getUser(user.id);
  const userInfos = { ...user, ...userDb, ...userData, ...user.presence };
  return userInfos;
}

module.exports = { fetchGuild, fetchUser };
