const { Command } = require("@src/structures");
const { Message, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "shows the current ping from the bot to the discord servers",
      category: "INFORMATION",
      command: {
        enabled: true,
      },
      slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [],
      },
    });
  }

  /**
   * @param {Message} message
   */
  async messageRun(message, args) {
    let emoji
    let text
    const ping = Math.floor(message.client.ws.ping)
    if (ping > 0) {
      emoji = "<:connectionGreen:943634046200717392>"
      text = "The connection to the DiscordAPI is Good.\nThere should be no issues with the bot!"
    }
    if (ping > 125) {
      emoji = "<:connectionAmber:943634056078307338>"
      text = "The connection to the DiscordAPI is moderate.\nthere might be little delays in bot responses!"
    }
    if (ping > 250) {
      emoji = "<:connectionRed:943634032128819200>"
      text = "The connection to the discordAPI is weak.\nbot commands might take prolonged times to respond!"
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: 'AIO' })
      .addField("Strength", `${emoji}`, true)
      .addField("Response Time", `${ping}ms`, true)
      .addField("Comments", `${text}`, false)

    await message.reply({ embeds: [embed] })
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    let emoji
    let text
    const ping = Math.floor(interaction.client.ws.ping)
    if (ping > 0) {
      emoji = "<:icons_goodping:950210495934238730>"
      text = "The connection to the DiscordAPI is Good, There should be no issues with the bot!"
    }
    if (ping > 125) {
      emoji = "<:icons_idelping:950210481350643773>"
      text = "The connection to the DiscordAPI is moderate, there might be little delays in bot responses!"
    }
    if (ping > 250) {
      emoji = "<:icons_badping:950210564083310603>"
      text = "The connection to the discordAPI is weak, bot commands might take prolonged times to respond!"
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })
      .addField("Strength", `${emoji}`, true)
      .addField("Response Time", `${ping}ms`, true)
      .addField("Comments", `${text}`, false)
    await interaction.followUp({ embeds: [embed] });
  }
};
