module.exports = {
  OWNER_IDS: ["658441101861978151", "222073294419918848"], // Bot owner ID's
  PREFIX: "!", // Default prefix for the bot

  SUPPORT_SERVER: "https://discord.gg/us46reuQR3", // Your bot support server
  PRESENCE: {
    ENABLED: true, // Whether or not the bot should update its status
    STATUS: "online", // The bot's status [online, idle, dnd, invisible]
    TYPE: "PLAYING", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
    MESSAGE: `Hello!`, // Your bot status message
  },
  DASHBOARD: {
    enabled: true, // enable or disable dashboard
    baseURL: "https://dashboard.aiobot.gg/", // base url
    failureURL: "https://aiobot.gg/servers", // failure redirect url
    port: "8080"
  },
  INTERACTIONS: {
    SLASH: true, // Should the interactions be enabled
    CONTEXT: true, // Should contexts be enabled
    GLOBAL: false, // Should the interactions be registered globally
    TEST_GUILD_ID: "", // Guild ID where the interactions should be registered. [** Test you commands here first **]
  },
  XP_SYSTEM: {
    COOLDOWN: 30, // Cooldown in seconds between messages
    DEFAULT_LVL_UP_MSG: "GG {m}!, You just advanced to **Level {l}**",
  },
  MISCELLANEOUS: {
    DAILY_COINS: 100, // coins to be received by daily command
  },
  ECONOMY: {
    CURRENCY: "<:icons_bank:950210456570695730>",
    DAILY_COINS: 500, // coins to be received by daily command
  },

  SUGGESTIONS: {
    ENABLED: true, // Should the suggestion system be enabled
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#0099ff",
    APPROVED_EMBED: "#00ff00",
    DENIED_EMBED: "#ff0000",
  },
  IMAGE: {
    BASE_API: "https://api.aiobot.gg",
  },


  /* Bot Embed Colors */
  EMBED_COLORS: {
    BOT_EMBED: "#068ADD",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
    AUTOMOD: "#36393F",
    TICKET_CREATE: "#068ADD",
    TICKET_CLOSE: "#068ADD",
    MUTE_LOG: "#102027",
    UNMUTE_LOG: "#4B636E",
    KICK_LOG: "#FF7961",
    SOFTBAN_LOG: "#AF4448",
    BAN_LOG: "#D32F2F",
    VMUTE_LOG: "#102027",
    VUNMUTE_LOG: "#4B636E",
    DEAFEN_LOG: "#102027",
    UNDEAFEN_LOG: "#4B636E",
    DISCONNECT_LOG: "RANDOM",
    MOVE_LOG: "RANDOM",
  },
  /* Maximum number of keys that can be stored */
  CACHE_SIZE: {
    GUILDS: 800,
    USERS: 500000,
    MEMBERS: 500000,
  },
  MESSAGES: {
    API_ERROR: "Unexpected Backend Error! Try again later or contact support server - Error code - x015234 ",
  },
};
