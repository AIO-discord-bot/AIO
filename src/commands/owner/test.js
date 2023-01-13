const { Command } = require("@src/structures");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER, DASHBOARD } = require("@root/config");




module.exports = class welcome extends Command {
    constructor(client) {
        super(client, {
            name: "welcome-test",
            description: "...",
            cooldown: 5,
            category: "OWNER",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: true,
                usage: "welcome-test",
            },
        });
    }

    /**
     * @param {Message} message
     */
    async messageRun(message) {

        message.channel.send({ content: "Hey <@73193882359173120>! Welcome to the server, please read the rules and enjoy your stay! :D" })

    };
}
