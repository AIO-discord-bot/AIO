const { Client, Collection, Intents, WebhookClient } = require("discord.js");
const path = require("path");
const fs = require("fs");
const { table } = require("table");
const mongoose = require("mongoose");
mongoose.plugin(require("mongoose-lean-defaults").default);
const logger = require("../helpers/logger");
const MusicManager = require("./MusicManager");
const Command = require("./Command");
const BaseContext = require("./BaseContext");
const GiveawayManager = require("./GiveawayManager");

module.exports = class BotClient extends Client {
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      partials: ["USER", "MESSAGE", "REACTION"],
      allowedMentions: {
        repliedUser: true,
        parse: ['users', 'roles']
      },
      restRequestTimeout: 20000,
    });

    this.config = require("@root/config"); 
    /**
     * @type {Command[]}
     */
    this.commands = []; 
    this.commandIndex = new Collection(); 

    /**
     * @type {Collection<string, Command>}
     */
    this.slashCommands = new Collection(); 

    /**
     * @type {Collection<string, BaseContext>}
     */
    this.contextMenus = new Collection(); 
    this.counterUpdateQueue = []; 

    // initialize cache
    this.cmdCooldownCache = new Collection(); 
    this.ctxCooldownCache = new Collection(); 
    this.xpCooldownCache = new Collection();
    this.inviteCache = new Collection(); 
    this.antiScamCache = new Collection(); 
    this.flagTranslateCache = new Collection(); 

    
    this.joinLeaveWebhook = process.env.JOIN_LEAVE_LOGS
      ? new WebhookClient({ url: process.env.JOIN_LEAVE_LOGS })
      : online;

   
    this.musicManager = new MusicManager(this);

    this.giveawaysManager = new GiveawayManager(this);

    
    this.logger = logger;
  }

  
  async initializeMongoose() {
    this.logger.log(`Connecting to MongoDb...`);

    await mongoose.connect(process.env.MONGO_CONNECTION, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    this.logger.success("Mongoose: Database connection established");
  }

  /**
   * @param {string} directory
   * @private
   */
  getAbsoluteFilePaths(directory) {
    const filePaths = [];
    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__appRoot, dir));
      files.forEach((file) => {
        const stat = fs.lstatSync(path.join(__appRoot, dir, file));
        if (stat.isDirectory()) {
          readCommands(path.join(dir, file));
        } else {
          const extension = file.split(".").at(-1);
          if (extension !== "js") return;
          const filePath = path.join(__appRoot, dir, file);
          filePaths.push(filePath);
        }
      });
    };
    readCommands(directory);
    return filePaths;
  }

  /**
   * @param {string} directory 
   */
  loadEvents(directory) {
    this.logger.log(`Loading events...`);
    let success = 0;
    let failed = 0;
    const clientEvents = [];
    const musicEvents = [];

    this.getAbsoluteFilePaths(directory).forEach((filePath) => {
      const file = filePath.replace(/^.*[\\/]/, "");
      const dirName = path.basename(path.dirname(filePath));
      try {
        const eventName = file.split(".")[0];
        const event = require(filePath);

        if (dirName === "music") {
          this.musicManager.on(eventName, event.bind(null, this));
          musicEvents.push([file, "???"]);
        }

        else {
          this.on(eventName, event.bind(null, this));
          clientEvents.push([file, "???"]);
        }

        delete require.cache[require.resolve(filePath)];
        success += 1;
      } catch (ex) {
        failed += 1;
        this.logger.error(`loadEvent - ${file}`, ex);
      }
    });

    console.log(
      table(clientEvents, {
        header: {
          alignment: "center",
          content: "Client Events",
        },
        singleLine: true,
        columns: [{ width: 25 }, { width: 5, alignment: "center" }],
      })
    );

    console.log(
      table(musicEvents, {
        header: {
          alignment: "center",
          content: "Music Events",
        },
        singleLine: true,
        columns: [{ width: 25 }, { width: 5, alignment: "center" }],
      })
    );

    this.logger.log(`Loaded ${success + failed} events. Success (${success}) Failed (${failed})`);
  }

  /**
   * @param {string} invoke
   * @returns {Command|undefined}
   */
  getCommand(invoke) {
    const index = this.commandIndex.get(invoke.toLowerCase());
    return index !== undefined ? this.commands[index] : undefined;
  }

  /**
   * @param {Command} cmd
   */
  loadCommand(cmd) {
    if (cmd.command?.enabled) {
      const index = this.commands.length;
      if (this.commandIndex.has(cmd.name)) {
        throw new Error(`Command ${cmd.name} already registered`);
      }
      cmd.command.aliases.forEach((alias) => {
        if (this.commandIndex.has(alias)) throw new Error(`Alias ${alias} already registered`);
        this.commandIndex.set(alias.toLowerCase(), index);
      });
      this.commandIndex.set(cmd.name.toLowerCase(), index);
      this.commands.push(cmd);
    } else {
      this.logger.debug(`Skipping command ${cmd.name}. Disabled!`);
    }

    if (cmd.slashCommand?.enabled) {
      if (this.slashCommands.has(cmd.name)) throw new Error(`Slash Command ${cmd.name} already registered`);
      this.slashCommands.set(cmd.name, cmd);
    } else {
      this.logger.debug(`Skipping slash command ${cmd.name}. Disabled!`);
    }
  }

  /**
   * @param {string} directory
   */
  loadCommands(directory) {
    this.logger.log(`Loading commands...`);
    this.getAbsoluteFilePaths(directory).forEach((filePath) => {
      const file = filePath.replace(/^.*[\\/]/, "");
      try {
        const cmdClass = require(filePath);
        if (!(cmdClass.prototype instanceof Command)) return;
        const cmd = new cmdClass(this);
        this.loadCommand(cmd);
      } catch (ex) {
        this.logger.error(`Failed to load ${file} Reason: ${ex.message}`);
      }
    });
    this.logger.success(`Loaded ${this.commands.length} commands`);
    this.logger.success(`Loaded ${this.slashCommands.size} slash commands`);
    if (this.slashCommands.size > 1000) throw new Error("A maximum of 1000 slash commands can be enabled");
  }

  /**
   * Load all contexts from the specified directory
   * @param {string} directory
   */
  loadContexts(directory) {
    this.logger.log(`Loading contexts...`);
    this.getAbsoluteFilePaths(directory).forEach((filePath) => {
      const file = filePath.replace(/^.*[\\/]/, "");
      try {
        const ctxClass = require(filePath);
        if (!(ctxClass.prototype instanceof BaseContext)) return;
        const ctx = new ctxClass(this);
        if (!ctx.enabled) return this.logger.debug(`Skipping context ${ctx.name}. Disabled!`);
        if (this.contextMenus.has(ctx.name)) throw new Error(`Context already exists with that name`);
        this.contextMenus.set(ctx.name, ctx);
      } catch (ex) {
        this.logger.error(`Context: Failed to load ${file} Reason: ${ex.message}`);
      }
    });
    const userContexts = this.contextMenus.filter((ctx) => ctx.type === "USER").size;
    const messageContexts = this.contextMenus.filter((ctx) => ctx.type === "MESSAGE").size;

    if (userContexts > 3) throw new Error("A maximum of 3 USER contexts can be enabled");
    if (messageContexts > 3) throw new Error("A maximum of 3 MESSAGE contexts can be enabled");

    this.logger.success(`Loaded ${userContexts} USER contexts`);
    this.logger.success(`Loaded ${messageContexts} MESSAGE contexts`);
  }

  /**
   * Register slash command on startup
   * @param {string} [guildId]
   */
  async registerInteractions(guildId) {
    const toRegister = [];

    // filter slash commands
    if (this.config.INTERACTIONS.SLASH) {
      this.slashCommands
        .map((cmd) => ({
          name: cmd.name,
          description: cmd.description,
          type: "CHAT_INPUT",
          options: cmd.slashCommand.options,
        }))
        .forEach((s) => toRegister.push(s));
    }

    // filter contexts
    if (this.config.INTERACTIONS.CONTEXT) {
      this.contextMenus
        .map((ctx) => ({
          name: ctx.name,
          type: ctx.type,
        }))
        .forEach((c) => toRegister.push(c));
    }

    // Register GLobally
    if (!guildId) {
      await this.application.commands.set(toRegister);
    }

    // Register for a specific guild
    else if (guildId && typeof guildId === "string") {
      const guild = this.guilds.cache.get(guildId);
      if (!guild) throw new Error(`No guilds found matching ${guildId}`);
      await guild.commands.set(toRegister);
    }

    // Throw an error
    else {
      throw new Error(`Did you provide a valid guildId to register slash commands`);
    }

    this.logger.success("Successfully registered slash commands");
  }

  /**
   * Get bot's invite
   */
  getInvite() {
    return this.generateInvite({
      scopes: ["bot", "applications.commands"],
      permissions: [
        "ADD_REACTIONS",
        "ATTACH_FILES",
        "BAN_MEMBERS",
        "CHANGE_NICKNAME",
        "CONNECT",
        "DEAFEN_MEMBERS",
        "EMBED_LINKS",
        "KICK_MEMBERS",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "MANAGE_MESSAGES",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MOVE_MEMBERS",
        "MUTE_MEMBERS",
        "PRIORITY_SPEAKER",
        "READ_MESSAGE_HISTORY",
        "SEND_MESSAGES",
        "SEND_MESSAGES_IN_THREADS",
        "SPEAK",
        "VIEW_CHANNEL",
      ],
    });
  }
};
