const { MessageEmbed, MessageAttachment} = require("discord.js");
const { getSettings } = require("@schemas/Guild");
const { sendMessage } = require("@utils/botUtils");
const { getBuffer } = require("@utils/httpUtils");
const { IMAGE } = require("@root/config");

/**
 * @param {string} content
 * @param {import('discord.js').GuildMember} member
 * @param {Object} inviterData
 */
const parse = async (content, member, inviterData = {}) => {
  const inviteData = {};



  const getEffectiveInvites = (inviteData = {}) =>
    inviteData.tracked + inviteData.added - inviteData.fake - inviteData.left || 0;

  if (content.includes("{inviter:")) {
    const inviterId = inviterData.member_id || "NA";
    if (inviterId !== "VANITY" && inviterId !== "NA") {
      const inviter = await member.guild.members.fetch(inviterId);
      inviteData.name = inviter.displayName;
      inviteData.tag = inviter.user.tag;
    } else {
      inviteData.name = inviterId;
      inviteData.tag = inviterId;
    }
  }
  return content
    .replaceAll(/\\n/g, "\n")
    .replaceAll(/{server}/g, member.guild.name)
    .replaceAll(/{member.id}/g, member.user.id)
    .replaceAll(/{count}/g, member.guild.memberCount)
    .replaceAll(/{member.name}/g, member.displayName)
    .replaceAll(/{member.tag}/g, member.user.tag)
    .replaceAll(/{inviter.name}/g, inviteData.name)
    .replaceAll(/{inviter.tag}/g, inviteData.tag)
    .replaceAll(/{invites}/g, getEffectiveInvites(inviterData.invite_data))
    .replaceAll(/{time}/g, new Date().toLocaleString())
    .replaceAll(/{newline}/g, "\n");
};


/**
 * @param {import('discord.js').GuildMember} member
 * @param {"WELCOME"|"FAREWELL"} type
 * @param {Object} config
 * @param {Object} inviterData
 */
const buildGreeting = async (member, type, config, inviterData) => {

const url = new URL(`${IMAGE.BASE_API}/utils/welcome-card`);
 url.searchParams.append("image", member.displayAvatarURL({ format: "png", size: 128 }));
 url.searchParams.append("name", member.displayName);
 url.searchParams.append("discriminator", member.user.discriminator);
 url.searchParams.append("count", member.guild.memberCount);
 url.searchParams.append("guild", member.guild.name);

   const response = await getBuffer(url.href);
   if (!response.success) return "Failed to generate welcomecard image. Please try again later.";
  const attachment = new MessageAttachment(response.buffer, "welcome.png");

  
  if (!config) return;
  let content;

  

   // build content
  if (config.content) content = await parse(config.content, member, inviterData);

  // build embed
  const embed = new MessageEmbed();
  if (config.embed.description) embed.setDescription(await parse(config.embed.description, member, inviterData));
  if (config.embed.color) embed.setColor(config.embed.color);
  if (config.embed.thumbnail) embed.setThumbnail(member.user.displayAvatarURL());
  if (config.embed.footer) {
    embed.setFooter(await parse(config.embed.footer, member, inviterData));
  }

  // set default message
  if (!config.content && !config.embed.description && !config.embed.footer) {
    content =
      type === "WELCOME"
        ? `Welcome to the server, ${member.displayName} 🎉`
        : `${member.user.tag} has left the server 👋`;
    return { content };
  }

  return { content, embeds: [embed], files: [attachment] };
};

/**
 * Send welcome message
 * @param {import('discord.js').GuildMember} member
 * @param {Object} inviterData
 */
async function sendWelcome(member, inviterData = {}) {
  const config = (await getSettings(member.guild))?.welcome;
  if (!config || !config.enabled) return;

  // check if channel exists
  const channel = member.guild.channels.cache.get(config.channel);
  if (!channel) return;

  // build welcome message
  const response = await buildGreeting(member, "WELCOME", config, inviterData);

  sendMessage(channel, response);
}


/**
 * @param {import('discord.js').GuildMember} member
 * @param {"WELCOME"|"FAREWELL"} type
 * @param {Object} config
 * @param {Object} inviterData
 */

const buildFarewell = async (member, type, config, inviterData) => {

  const url = new URL(`${IMAGE.BASE_API}/utils/farewell-card`);
  url.searchParams.append("image", member.displayAvatarURL({ format: "png", size: 128 }));
  url.searchParams.append("name", member.displayName);
  url.searchParams.append("discriminator", member.user.discriminator);
  url.searchParams.append("count", member.guild.memberCount);
  url.searchParams.append("guild", member.guild.name);

   const response = await getBuffer(url.href);
   if (!response.success) return "Failed to generate farewell image. Please try again later.";
  const attachment = new MessageAttachment(response.buffer, "farewell.png");

  
  if (!config) return;
  let content;

  

   // build content
  if (config.content) content = await parse(config.content, member, inviterData);

  // build embed
  const embed = new MessageEmbed();
  if (config.embed.description) embed.setDescription(await parse(config.embed.description, member, inviterData));
  if (config.embed.color) embed.setColor(config.embed.color);
  if (config.embed.thumbnail) embed.setThumbnail(member.user.displayAvatarURL());
  if (config.embed.footer) {
    embed.setFooter(await parse(config.embed.footer, member, inviterData));
  }

  // set default message
  if (!config.content && !config.embed.description && !config.embed.footer) {
    content =
      type === "FAREWELL"
        ? `Goodbye, ${member.displayName} 👋`
        : `${member.user.tag} has left the server 👋`;
    return { content };
  }

  return { content, embeds: [embed], files: [attachment] };
};

/**
 * Send farewell message
 * @param {import('discord.js').GuildMember} member
 * @param {Object} inviterData
 */
async function sendFarewell(member, inviterData = {}) {
  const config = (await getSettings(member.guild))?.farewell;
  if (!config || !config.enabled) return;

  // check if channel exists
  const channel = member.guild.channels.cache.get(config.channel);
  if (!channel) return;

  // build welcome message
  const response = await buildFarewell(member, "FAREWELL", config, inviterData);

  sendMessage(channel, response);
}

module.exports = {
  buildGreeting,
  sendWelcome,
  sendFarewell,
};
