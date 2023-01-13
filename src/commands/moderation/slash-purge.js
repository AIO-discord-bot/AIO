const { Command } = require("@src/structures");
const { CommandInteraction } = require("discord.js");
const { purgeMessages } = require("@utils/modUtils");
const { sendMessage } = require("@utils/botUtils");

// SLASH COMMAND ONLY

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "purge commands",
      category: "MODERATION",
      userPermissions: ["MANAGE_MESSAGES"],
      command: {
        enabled: false,
      },
      slashCommand: {
        enabled: true,
        options: [
          {
            name: "all",
            description: "clear all messages",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
          {
            name: "attachments",
            description: "clear all messages with attachments",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
          {
            name: "bots",
            description: "clear all bot messages",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
          {
            name: "links",
            description: "clear all messages with links",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
          {
            name: "token",
            description: "clear all messages containing the specified message content",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "message-content",
                description: "message content to be looked up in messages",
                type: "STRING",
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
          {
            name: "user",
            description: "clear all messages from the specified user",
            type: "SUB_COMMAND",
            options: [
              {
                name: "channel",
                description: "channel from which messages must be cleaned",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                required: true,
              },
              {
                name: "user",
                description: "user whose messages needs to be cleaned",
                type: "USER",
                required: true,
              },
              {
                name: "amount",
                description: "number of messages to be deleted (Max 99)",
                type: "INTEGER",
                required: false,
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    const { options, member } = interaction;

    const sub = options.getSubcommand();
    const channel = options.getChannel("channel");
    const amount = options.getInteger("amount") || 99;

    let response;
    switch (sub) {
      case "all":
        response = await purgeMessages(member, channel, "ALL", amount);
        break;

      case "attachments":
        response = await purgeMessages(member, channel, "ATTACHMENT", amount);
        break;

      case "bots":
        response = await purgeMessages(member, channel, "BOT", amount);
        break;

      case "links":
        response = await purgeMessages(member, channel, "LINK", amount);
        break;

      case "token": {
        const token = interaction.options.getString("message-content");
        response = await purgeMessages(member, channel, "TOKEN", amount, token);
        break;
      }

      case "user": {
        const user = interaction.options.getUser("user");
        response = await purgeMessages(member, channel, "TOKEN", amount, user);
        break;
      }

      default:
        return interaction.followUp("Oops! Not a valid command selection");
    }

    // Success
    if (typeof response === "number") {
      const message = `Successfully cleaned ${response} messages in ${channel}`;
      if (channel.id !== interaction.channelId) await interaction.followUp(message);
      else await sendMessage(channel, message, 5);
      return;
    }

    // Member missing permissions
    else if (response === "MEMBER_PERM") {
      return interaction.followUp(
        `You do not have permissions to Read Message History & Manage Messages in ${channel}`
      );
    }

    // Bot missing permissions
    else if (response === "BOT_PERM") {
      return interaction.followUp(`I do not have permissions to Read Message History & Manage Messages in ${channel}`);
    }

    // No messages
    else if (response === "NO_MESSAGES") {
      return interaction.followUp("Found no messages that can be cleaned");
    }

    // Remaining
    else {
      return interaction.followUp("Failed to clean messages");
    }
  }
};
