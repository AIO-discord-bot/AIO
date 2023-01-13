const { MessageEmbed, Message, CommandInteraction, Intents, Discord } = require("discord.js");
const { Command } = require("@src/structures");
const { EMBED_COLORS } = require("@root/config");
const client = require("../../structures/BotClient.js")


module.exports = class downtime extends Command {
    constructor(client) {
        super(client, {
            name: "run_agregation_script.flp=1@migratefrom=5",
            description: "...",
            cooldown: 1,
            category: "OWNER",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: true,
                usage: "run_agregation_script.flp=1@migratefrom=5",
            },
        });
    }

    /**
     * @param {Message} message
     */
    async messageRun(message) {
        const response = new MessageEmbed()
            .setTitle(`**AIO Downtime**`)
            .setColor("#36393F")
            .setDescription("> [**AIO is currently experiencing problems with the dashboard!**\n> **We are working on fixing this issue!**\n> **We will be back online as soon as possible!**](https://aiotechltd.statuspage.io/incidents/23sj5jmz73xg)")
            .addField("<:Warning:998404110619512832> | HTTP Error:", "ERR_TOO_MANY_REDIRECTS", false)
            .addField("<:regions_aio:1020102027549880320> | Places Effected:", "United Kingdom | Australia | Netherlands + 73 more", false)
            .addField("<:browser_aio:1020102763365019678> | Browsers Effected:", "All", false)
            .addField("<a:infosymbol:998404108631425135> | Estimated Time Till fix:", "<t:1663292280:R>", false)
            .setFooter("AIO | Downtime | Sorry for the inconvenience", "https://cdn.discordapp.com/attachments/998404091157946480/1020100591701200936/404.png")
            .setImage("https://media.discordapp.net/attachments/998404091157946480/998404103703113758/AIO_Construction.png")
            .setThumbnail("https://cdn.discordapp.com/attachments/998404091157946480/1020100591701200936/404.png")
        message.channel.send({ content: "mention", embeds: [response] })

    };
}