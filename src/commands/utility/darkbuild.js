const { Command } = require("@src/structures");
const { client, MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");


module.exports = class button extends Command {
    constructor(client) {
        super(client, {
            name: "darkbuild",
            description: "Send an embed with the annie/dark Discord build override",
            category: "UTILITY",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: false
            },
            slashCommand: {
                enabled: true,
            }
        });
    }
    async interactionRun(interaction) {

        // MAKE EMBED
        const embed = new MessageEmbed()
         .setDescription("https://discord.com/__development/link?s=Z7XEywE8rsgTvI0MR9P4OknzH4LtPi9j9%2Br8Hwzrohg%3D.eyJ0YXJnZXRCdWlsZE92ZXJyaWRlIjp7ImRpc2NvcmRfd2ViIjp7InR5cGUiOiJicmFuY2giLCJpZCI6ImFubmllL2RhcmsifX0sInJlbGVhc2VDaGFubmVsIjpudWxsLCJ2YWxpZEZvclVzZXJJZHMiOltdLCJhbGxvd0xvZ2dlZE91dCI6ZmFsc2UsImV4cGlyZXNBdCI6IlN1biwgMjggSmFuIDIwMjQgMDE6NTU6MDcgR01UIn0%3D")
         .setColor("#04441c")    

         interaction.followUp({ embeds: [embed] });
    }
}