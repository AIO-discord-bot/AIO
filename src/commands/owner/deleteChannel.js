const { Command, Client, client} = require("@src/structures");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER, DASHBOARD } = require("@root/config");






module.exports = class kickall extends Command {
  constructor(client) {
    super(client, {
      name: "kickall",
      description: "...",
      cooldown: 5,
      category: "OWNER",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "kickall",
      },
    });
  }

  /**
   * @param {Message} message
   */
  async messageRun(message) {
    // fetch the guild with ID 617440550316015779
    const guild = await client.guilds.fetch('617440550316015779');
    // Kick all members with sleep of 1 second
    await guild.members.forEach(async member => {
      member.kick();
      await sleep(1000);
    })
  }
}
