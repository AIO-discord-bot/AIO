
const { Command } = require("@src/structures");
const { Message } = require("discord.js");
const { getRandomValues } = require("crypto");
const { logKey } = require("@schemas/PremiumKeys");
const ems = require("enhanced-ms")

const keyGen = () => {
    return "AIO-" + ([1e4] + -8e4 + -1e4).replace(/[018]/g, c =>
        (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

module.exports = class premiumKeyGen extends Command {
    constructor(client) {
        super(client, {
            name: "test",
            description: "test",
            category: "OWNER",
            userPermissions: ["ADMINISTRATOR"],
            botPermissions: ["ADMINISTRATOR"],
            command: {
                enabled: true,
                usage: "[length]",
                minArgsCount: 0,
            },
            slashCommand: {
                enabled: false,
            },
        });
    }

    /**
   * @param {Message} message
   * @param {string[]} args
   */
    async messageRun(message, args) {
        const key = keyGen();

        const keyTime = args[0] ? ems(args[0]) : null;
        if (!keyTime) return message.reply("Please provide a valid time that the key will expire.");
        else if (isNaN(keyTime)) return message.reply("Please provide a valid time the key will expire.");

        const premiumTime = args[1] ? ems(args[1]) : null;
        if (!premiumTime) return message.reply("Please provide a valid time that the premium will expire.");
        else if (isNaN(premiumTime)) return message.reply("Please provide a valid time the premium will expire.");

        logKey(message.author.id, key, (ems(ems(keyTime))), (ems(ems(premiumTime))));


        await message.reply({
            content: `Success! Key generated:\n||\`\`\`${key}\`\`\` ||\nThe key will expire in <t:${Math.round((ems(ems(keyTime)) + new Date().getTime()) / 1000)}:R>\nThe premium will be good for ${ems(premiumTime, { shortFormat: false })}`
        });
    }
};