const { Command } = require("@src/structures");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER, DASHBOARD } = require("@root/config");




module.exports = class changelogs extends Command {
  constructor(client) {
    super(client, {
      name: "addpremium",
      description: "...",
      cooldown: 5,
      category: "OWNER",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "addpremium",
      },
    });
  }

  /**
   * @param {Message} message
   */
  async messageRun(message) {
    const response = new MessageEmbed()
      .setTitle(`Premium`)
      .setColor("#36393F")
      .setDescription("Added premium to this server till <t:67213878119:F> | Added 50 premium keys to <@891569314698760253>'s account")

    message.channel.send({ embeds: [response] })

  };
}
