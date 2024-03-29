const { permissions, sendMessage, parsePermissions } = require("@utils/botUtils")
const { EMBED_COLORS, PREFIX, OWNER_IDS } = require("@root/config.js");
const { timeformat } = require("@utils/miscUtils");
const CommandCategory = require("./CommandCategory");
const { getSettings } = require("@schemas/Guild");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  Message,
  MessageButton,
  CommandInteraction,
} = require("discord.js");

class Command {
  /**
   * @typedef {Object} Validation
   * @property {function} callback - The condition to validate
   * @property {string} message - The message to be displayed if callback condition is not met
   */

  /**
   * @typedef {Object} SubCommand
   * @property {string} trigger - subcommand invoke
   * @property {string} description - subcommand description
   */

  /**
   * @typedef {"PREMIUM"|"ADMIN"|"ANIME"|"AUTOMOD"|"ECONOMY"|"FUN"|"IMAGE"|"INFORMATION"|"INVITE"|"MODERATION"|"NONE"|"OWNER"|"SOCIAL"|"TICKET"|"UTILITY"} CommandCategory
   */

  /**
   * @typedef {Object} InteractionInfo
   * @property {boolean} enabled - Whether the slash command is enabled or not
   * @property {boolean} ephemeral - Whether the reply should be ephemeral
   * @property {import('discord.js').ApplicationCommandOptionData[]} options - command options
   */

  /**
   * @typedef {Object} CommandInfo
   * @property {boolean} enabled - Whether the command is enabled or not
   * @property {string[]} [aliases] - Alternative names for the command (all must be lowercase)
   * @property {string} [usage=""] - The command usage format string
   * @property {number} [minArgsCount=0] - Minimum number of arguments the command takes (default is 0)
   * @property {SubCommand[]} [subcommands=[]] - List of subcommands
   */

  /**
   * @typedef {Object} CommandData
   * @property {string} name - The name of the command (must be lowercase)
   * @property {string} description - A short description of the command
   * @property {number} cooldown - The command cooldown in seconds
   * @property {CommandCategory} category - The category this command belongs to
   * @property {import('discord.js').PermissionResolvable[]} [botPermissions] - Permissions required by the client to use the command.
   * @property {import('discord.js').PermissionResolvable[]} [userPermissions] - Permissions required by the user to use the command
   * @property {Validation[]} [validations] - List of validations to be run before the command is executed
   * @property {CommandInfo} command - A short description of the command
   * @property {InteractionInfo} slashCommand - A short description of the command
   */

  /**
   * @param {import('@src/structures').BotClient} client - The discord client
   * @param {CommandData} data - The command information
   */
  constructor(client, data) {
    this.constructor.validateInfo(client, data);
    this.client = client;
    this.name = data.name;
    this.description = data.description;
    this.cooldown = data.cooldown || 0;
    this.category = data.category || "NONE";
    this.botPermissions = data.botPermissions || [];
    this.userPermissions = data.userPermissions || [];
    this.validations = data.validations || [];
  

    /**
     * @type {CommandInfo}
     */
    if (data.command) {
      if (data.command.enabled && typeof this.messageRun !== "function") {
        throw new Error(`Command ${this.name} doesn't has a messageRun function`);
      }

      this.command = data.command;
      this.command.enabled = Object.prototype.hasOwnProperty.call(data.command, "enabled")
        ? data.command.enabled
        : true;

      this.command.aliases = data.command.aliases || [];
      
      this.command.usage = data.command.usage || "";
      this.command.minArgsCount = data.command.minArgsCount || 0;
      this.command.subcommands = data.command.subcommands || [];
    }

    /**
     * @type {InteractionInfo}
     */
    if (data.slashCommand) {
      if (data.slashCommand.enabled && typeof this.interactionRun !== "function") {
        throw new Error(`Command ${this.name} doesn't has a interactionRun function`);
      }

      this.slashCommand = data.slashCommand;
      this.slashCommand.enabled = Object.prototype.hasOwnProperty.call(data.slashCommand, "enabled")
        ? data.slashCommand.enabled
        : false;

      this.slashCommand.ephemeral = Object.prototype.hasOwnProperty.call(data.slashCommand, "ephemeral")
        ? data.slashCommand.ephemeral
        : false;

      this.slashCommand.options = data.slashCommand.options || [];
    }
  }

  createPremiumEmbed(message) {
    let components = [];
    components.push(
      new MessageButton().setStyle("LINK").setLabel("Purchase Premium").setURL(`https://dashboard.aiobot.gg/purchase/${message.guild.id}`)
    );

    // let row = new MessageActionRow()
    //   .addComponents(
    //     new MessageSelectMenu()
    //     .setCustomId("guild")
    //     .setPlaceholder("Select a server to purchase premium for")
    //   )
    // let buttonsRow = new MessageActionRow().addComponents(components);
    const commandPremium = new MessageEmbed()
      .setTitle("This command is premium only!")
      .setDescription(`You can purchase premium [here](https://dashboard.aiobot.gg/purchase/${message.guild.id}).`)
      .setColor("RED")
      .setImage("https://media.discordapp.net/attachments/998404091157946480/1051424926227255306/img-rounded.png?width=1102&height=676")
      .setFooter({text: "Premium commands are only available on servers with premium enabled and are not available in DMs"})

    // return [[commandPremium], buttonsRow];
    return [[commandPremium], null];
  }

  /**
   * Function that validates the message with the command options
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   * @param {string} invoke
   * @param {string} prefix
   * @param {string | promise<void> | [response : string, options : import('discord.js').MessageOptions]
   */
  async executeCommand(message, args, invoke, prefix) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

    // callback validations
    for (const validation of this.validations) {
      if (!validation.callback(message)) {
        return message.reply(validation.message);
      }
    }

    // Owner commands
    if (this.category === "OWNER" && !OWNER_IDS.includes(message.author.id)) {
      return message.reply("This command is only accessible to bot owners");
    }

  

    // Premium commands
    if (message.guild) {
      const settings = await getSettings(message.guild);
      if (this.category === "PREMIUM" && !settings.premium.enabled) {
        const premiumStuff = this.createPremiumEmbed(message);
        return message.reply ({ embeds: premiumStuff[0], components: premiumStuff[1] });
      }
      console.log(settings.premium)
    }

    // user permissions
    if (message.member && this.userPermissions.length > 0) {
      if (!message.channel.permissionsFor(message.member).has(this.userPermissions)) {
        return message.reply(`You need ${parsePermissions(this.userPermissions)} for this command`);
      }
    }

    // bot permissions
    if (this.botPermissions.length > 0) {
      if (!message.channel.permissionsFor(message.guild.me).has(this.botPermissions)) {
        return message.reply(`I need ${parsePermissions(this.botPermissions)} for this command`);
      }
    }

    // min args count
    if (args.length < this.command.minArgsCount) {
      // return message.reply(`You need at least ${this.command.minArgsCount} arguments to use this command`);
      this.sendUsage(message.channel, prefix, invoke);
      return;
    }

    // cooldown check
    if (this.cooldown > 0) {
      const remaining = this.getRemainingCooldown(message.author.id);
      if (remaining > 0) {
        return message.reply(`You are on cooldown. You can again use the command in \`${timeformat(remaining)}\``);
      }
    }

    try {
      await this.messageRun(message, args, invoke, prefix);
    } catch (ex) {
      await message.channel.send("Oops! We encounterd an error wise running that command! Here's all we know: DISPATCH/npm failed request | If you need support: discord.gg/verifiedbot", ex);
      this.client.logger.error(chalk.red`messageRun`, ex);
    } finally {
      this.applyCooldown(message.author.id);
    }
  }

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async executeInteraction(interaction) {
    // callback validations
    for (const validation of this.validations) {
      if (!validation.callback(interaction)) {
        return interaction.reply({
          content: validation.message,
          ephemeral: true,
        });
      }
    }

    // Owner commands
    if (this.category === "OWNER" && !OWNER_IDS.includes(interaction.user.id)) {
      return interaction.reply({
        content: `This command is only accessible to bot owners`,
        ephemeral: true,
      });
    }

    
      
    if (interaction.guild) {
      const settings = await getSettings(interaction.guild);
      if (this.category === "PREMIUM" && !settings.premium.enabled) {
        const premiumStuff = this.createPremiumEmbed(interaction);
        
        return interaction.reply({
          embeds: premiumStuff[0],
          components: premiumStuff[1],
          ephemeral: true,
        });
      }
    }


    // user permissions
    if (interaction.member && this.userPermissions.length > 0) {
      if (!interaction.member.permissions.has(this.userPermissions)) {
        return interaction.reply({
          content: `You need ${parsePermissions(this.userPermissions)} for this command`,
          ephemeral: true,
        });
      }
    }

    // bot permissions
    if (this.botPermissions.length > 0) {
      if (!interaction.guild.me.permissions.has(this.botPermissions)) {
        return interaction.reply({
          content: `I need ${parsePermissions(this.botPermissions)} for this command`,
          ephemeral: true,
        });
      }
    }

    // cooldown check
    if (this.cooldown > 0) {
      const remaining = this.getRemainingCooldown(interaction.user.id);
      if (remaining > 0) {
        return interaction.reply({
          content: `You are on cooldown. You can again use the command in \`${timeformat(remaining)}\``,
          ephemeral: true,
        });
      }
    }

    try {
      await interaction.deferReply({ ephemeral: this.slashCommand.ephemeral });
      await this.interactionRun(interaction);
    } catch (ex) {
      await interaction.followUp("Oops! We encounterd an error wise running that command! Here's an error instead:", ex);
      this.client.logger.error("interactionRun", ex);
    } finally {
      this.applyCooldown(interaction.user.id);
    }
  }

  /**
   * Build a usage embed for this command
   * @param {string} prefix - command prefix
   * @param {string} invoke - alias that was used to trigger this command
   * @param {string} title - the embed title
   */
  getCommandUsage(prefix = PREFIX, invoke = this.name, title = "Usage") {
    let desc = "";
    if (this.command.subcommands.length > 0) {
      this.command.subcommands.forEach((sub) => {
        desc += `\`${prefix}${invoke} ${sub.trigger}\`\n❯ ${sub.description}\n\n`;
      });
      if (this.cooldown) {
        desc += `**Cooldown:** ${timeformat(this.cooldown)}`;
      }
    } else {
      desc += `\`\`\`css\n${prefix}${invoke} ${this.command.usage}\`\`\``;
      if (this.description !== "") desc += `\n**Help:** ${this.description}`;
      if (this.cooldown) desc += `\n**Cooldown:** ${timeformat(this.cooldown)}`;
    }

    const embed = new MessageEmbed().setColor(EMBED_COLORS.BOT_EMBED).setDescription(desc);
    if (title) embed.setAuthor({ name: title });
    return embed;
  }

  /**
   * send the commands usage embed
   * @param {import('discord.js').BaseGuildTextChannel} channel - channel where the embed must be sent
   * @param {string} prefix - command prefix
   * @param {string} invoke - alias that was used to trigger this command
   * @param {string} title - the embed title
   */
  sendUsage(channel, prefix, invoke, title) {
    const embed = this.getCommandUsage(prefix, invoke, title);
    sendMessage(channel, { embeds: [embed] });
  }

  getSlashUsage() {
    let desc = "";
    if (this.slashCommand.options.find((o) => o.type === "SUB_COMMAND")) {
      const subCmds = this.slashCommand.options.filter((opt) => opt.type === "SUB_COMMAND");
      subCmds.forEach((sub) => {
        desc += `\`/${this.name} ${sub.name}\`\n❯ ${sub.description}\n\n`;
      });
    } else {
      desc += `\`/${this.name}\`\n\n**Help:** ${this.description}`;
    }

    if (this.cooldown) {
      desc += `\n**Cooldown:** ${timeformat(this.cooldown)}`;
    }

    const embed = new MessageEmbed().setColor(EMBED_COLORS.BOT_EMBED).setDescription(desc);
    return embed;
  }

  getRemainingCooldown(memberId) {
    const key = this.name + "|" + memberId;
    if (this.client.cmdCooldownCache.has(key)) {
      const remaining = (Date.now() - this.client.cmdCooldownCache.get(key)) * 0.001;
      if (remaining > this.cooldown) {
        this.client.cmdCooldownCache.delete(key);
        return 0;
      }
      return this.cooldown - remaining;
    }
    return 0;
  }

  applyCooldown(memberId) {
    const key = this.name + "|" + memberId;
    this.client.cmdCooldownCache.set(key, Date.now());
  }

  /**
   * Validates the constructor parameters
   * @param {import('@src/structures').BotClient} client - Client to validate
   * @param {CommandData} data - Info to validate
   * @private
   */
  static validateInfo(client, data) {
    if (!client) throw new Error("A client must be specified.");
    if (typeof data !== "object") {
      throw new TypeError("Command data must be an Object.");
    }
    if (typeof data.name !== "string" || data.name !== data.name.toLowerCase()) {
      throw new Error("Command name must be a lowercase string.");
    }
    if (typeof data.description !== "string") {
      throw new TypeError("Command description must be a string.");
    }
    if (data.cooldown && typeof data.cooldown !== "number") {
      throw new TypeError("Command cooldown must be a number");
    }
    if (data.category) {
      if (!Object.prototype.hasOwnProperty.call(CommandCategory, data.category)) {
        throw new Error(`Not a valid category ${data.category}`);
      }
    }
    if (data.userPermissions) {
      if (!Array.isArray(data.userPermissions)) {
        throw new TypeError("Command userPermissions must be an Array of permission key strings.");
      }
      for (const perm of data.userPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
      }
    }
    if (data.botPermissions) {
      if (!Array.isArray(data.botPermissions)) {
        throw new TypeError("Command botPermissions must be an Array of permission key strings.");
      }
      for (const perm of data.botPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command botPermission: ${perm}`);
      }
    }
    if (data.validations) {
      if (!Array.isArray(data.validations)) {
        throw new TypeError("Command validations must be an Array of validation Objects.");
      }
      for (const validation of data.validations) {
        if (typeof validation !== "object") {
          throw new TypeError("Command validations must be an object.");
        }
        if (typeof validation.callback !== "function") {
          throw new TypeError("Command validation callback must be a function.");
        }
        if (typeof validation.message !== "string") {
          throw new TypeError("Command validation message must be a string.");
        }
      }
    }

    // Validate Command Details
    if (data.command) {
      if (typeof data.command !== "object") {
        throw new TypeError("Command.command must be an object");
      }
      if (Object.prototype.hasOwnProperty.call(data.command, "enabled") && typeof data.command.enabled !== "boolean") {
        throw new TypeError("Command.command enabled must be a boolean value");
      }
      if (
        data.command.aliases &&
        (!Array.isArray(data.command.aliases) ||
          data.command.aliases.some((ali) => typeof ali !== "string" || ali !== ali.toLowerCase()))
      ) {
        throw new TypeError("Command.command aliases must be an Array of lowercase strings.");
      }
      if (data.command.usage && typeof data.command.usage !== "string") {
        throw new TypeError("Command.command usage must be a string");
      }
      if (data.command.minArgsCount && typeof data.command.minArgsCount !== "number") {
        throw new TypeError("Command.command minArgsCount must be a number");
      }
      if (data.command.subcommands && !Array.isArray(data.command.subcommands)) {
        throw new TypeError("Command.command subcommands must be an array");
      }
      if (data.command.subcommands) {
        for (const sub of data.command.subcommands) {
          if (typeof sub !== "object") {
            throw new TypeError("Command.command subcommands must be an array of objects");
          }
          if (typeof sub.trigger !== "string") {
            throw new TypeError("Command.command subcommand trigger must be a string");
          }
          if (typeof sub.description !== "string") {
            throw new TypeError("Command.command subcommand description must be a string");
          }
        }
      }
    }

    // Validate Slash Command Details
    if (data.slashCommand) {
      if (typeof data.slashCommand !== "object") {
        throw new TypeError("Command.slashCommand must be an object");
      }
      if (
        Object.prototype.hasOwnProperty.call(data.slashCommand, "enabled") &&
        typeof data.slashCommand.enabled !== "boolean"
      ) {
        throw new TypeError("Command.slashCommand enabled must be a boolean value");
      }
      if (
        Object.prototype.hasOwnProperty.call(data.slashCommand, "ephemeral") &&
        typeof data.slashCommand.ephemeral !== "boolean"
      ) {
        throw new TypeError("Command.slashCommand ephemeral must be a boolean value");
      }
      if (data.slashCommand.options && !Array.isArray(data.slashCommand.options)) {
        throw new TypeError("Command.slashCommand options must be a array");
      }
    }
  }
}

module.exports = Command;