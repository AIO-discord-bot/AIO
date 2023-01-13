const { Command } = require("@src/structures");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER, DASHBOARD } = require("@root/config");




module.exports = class changelogs extends Command {
    constructor(client) {
        super(client, {
            name: "whitelist",
            description: "whitelist a server from our removal list",
            category: "UTILITY",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: true,
                usage: "whitelist <serverID>",
            },
        });
    }



    /**
     * @param {Message} message
     */
    async messageRun(message) {
        const args = message.content.split(" ").slice(1);
        let msg = await message.channel.send("Whitelisting...");
        setTimeout(() => { msg.edit(`Checking Server Ownership... `) }, 5);
        setTimeout(() => { msg.edit(`<:EmployeeVerified:998404057809047672> Checking Server Ownership... Done!`) }, 3000);
        setTimeout(() => { msg.edit(`Transferring Keys`) }, 1000);
        setTimeout(() => { msg.edit(`Running: Event.256 => Whitelist`) }, 1000)
        message.reply(`<:Online:998419181810749470> Whitelisted ${args[0]}!`)

    };
}
