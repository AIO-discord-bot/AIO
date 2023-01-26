const mongoose = require("mongoose");
const { CACHE_SIZE, PREFIX } = require("@root/config.js");
const FixedSizeMap = require("fixedsize-map");

const cache = new FixedSizeMap(CACHE_SIZE.GUILDS);

const Schema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    data: {
        name: String,
        region: String,
        owner: {
            id: String,
            tag: String,
        },
        joinedAt: Date,
        leftAt: Date,
        bots: {
            type: Number,
            default: 0,
        },
    },
    muteRole: {
        enabled: {
            type: Boolean,
            default: false,
        },
    },
    premium: {
        enabled: {
            type: Boolean,
            default: false,
        },
        details: {
            userpaid: {
                type: String,
                default: "None",
            },
            transactionAmount: {
                type: String,
                default: "None",
            },
            expiresAtTimestamp: {
                type: String,
                default: "None",
            }
        },
    },
    antinuke: {
        enabled: {
            type: Boolean,
            default: false,
        },
        roledelete: {
            type: Number,
            default: 5,
        },
        botadd: {
            type: Number,
            default: 5,
        },
        everyoneping: {
            type: Number,
            default: 5,
        },
        antiban: {
            type: Number,
            default: 5,
        },
        actionwhitelist: {
            type: Array,
            default: [],
        },
        actiontaken: {
            type: Boolean,
            default: false,
        },
    },
    prefix: {
        type: String,
        default: PREFIX,
    },
    ranking: {
        enabled: Boolean,
    },
    ticket: {
        log_channel: String,
        limit: {
            type: Number,
            default: 10,
        },
    },
    automod: {
        debug: Boolean,
        strikes: {
            type: Number,
            default: 5,
        },
        action: {
            type: String,
            default: "MUTE",
        },
        anti_links: Boolean,
        anti_invites: Boolean,
        anti_scam: Boolean,
        anti_ghostping: Boolean,
        max_mentions: Number,
        max_role_mentions: Number,
        max_lines: Number,
    },
    invite: {
        tracking: Boolean,
        ranks: [
            {
                invites: {
                    type: String,
                    required: true,
                },
                _id: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    flag_translation: {
        enabled: Boolean,
    },
    modlog_channel: String,
    max_warn: {
        action: {
            type: String,
            default: "BAN",
        },
        limit: {
            type: Number,
            default: 5,
        },
    },
    counters: [
        {
            _id: false,
            counter_type: String,
            name: String,
            channel_id: String,
        },
    ],
    welcome: {
        enabled: Boolean,
        channel: String,
        content: String,
        embed: {
            description: String,
            color: String,
            thumbnail: Boolean,
            footer: String,
        },
    },
    farewell: {
        enabled: Boolean,
        channel: String,
        content: String,
        embed: {
            description: String,
            color: String,
            thumbnail: Boolean,
            footer: String,
        },
    },
    disabledCommands: {
        type: Array,
        default: [],
    },
    ticketPanels: [
        {
            name: String,
            channel: String,
            role: [String],
        },
    ],
});

const Model = mongoose.model("guild", Schema);

module.exports = {
    getSettings: async (guild) => {
        if (cache.contains(guild.id)) return cache.get(guild.id);

        let guildData = await Model.findOne({ _id: guild.id });
        if (!guildData) {
            guildData = new Model({
                _id: guild.id,
                data: {
                    name: guild.name,
                    region: guild.preferredLocale,
                    owner: {
                        id: guild.ownerId,
                        tag: (await guild.members.fetch(guild.ownerId)).user.tag,
                    },
                    joinedAt: guild.joinedAt,
                },
            });

            await guildData.save();
        }
        cache.add(guild.id, guildData);
        return guildData;
    },
};