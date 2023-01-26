
const { Command } = require("@src/structures");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER, DASHBOARD } = require("@root/config");
const BotClient = require("@src/structures/BotClient");




module.exports = class reload extends Command {
  constructor(client) {
    super(client, {
      name: "reload",
      description: "...",
      cooldown: 5,
      category: "OWNER",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "reload <command:id>",
      },
    });
  }

  async messageRun(message, args) {
    const client = new BotClient();

    try {
      switch (args[0]?.toLowerCase()) {
        case "commands":
          {
            client.loadCommands("src/commands");
          }
          break;
        case "events":
          {
            client.loadEvents("src/events");
          }
          break;
        case "contexts":
          {
            client.loadContexts("src/contexts");
          }
          break;
        case "id-tw-all":
          {
            client.loadCommands("src/commands");
            client.loadContexts("src/contexts");
            client.loadEvents("src/events");
          }
          break;
        default:
          const embed = new MessageEmbed();
          embed.setTitle("error");
          embed.setDescription(`command not selected`);
          embed.setColor("#FFFF");
          message.reply({ embeds: [embed] });
          return;
      }
    } catch (e) {
      console.log(e);
    }
    const embed = new MessageEmbed();
    embed.setTitle("Reloaded");
    embed.setDescription(`Reloaded ${args[0]}`);
    embed.setColor("#FFFF");
    message.reply({ embeds: [embed] });
    }
    };
