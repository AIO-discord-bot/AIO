const cron = require('node-cron');
const { Command } = require("@src/structures");
const { client, MessageEmbed } = require("discord.js");
const msg = "1017197397564211240-1017203649925087333"

module.exports = class statspost extends Command {
    constructor(client) {
        super(client, {
            name: "poststats",
            description: "Post Stats of AIO",
            cooldown: 1,
            category: "OWNER",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: true,
                usage: "poststats",
            },
        });
    }

    /**
     * @param {Message} message
     * @param {import('@src/structures').BotClient} client
     */

    async messageRun(message) {
        const response = new MessageEmbed()
            .setTitle(`**AIO Stats**`)
            .setColor("#36393F")
            .setDescription("__Current Live Stats__")
            .addField("Current Servers", "N/", true)
            .addField("Current Users", "N/A", true)

        message.channel.send({ embeds: [response] })

        cron.schedule('1,2,4,5 * * * *', () => {
            console.log('running every minute 1, 2, 4 and 5');
        });
    }
}


