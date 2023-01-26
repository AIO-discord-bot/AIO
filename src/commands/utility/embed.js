const { Command } = require("@src/structures");
const { client, MessageEmbed, CommandInteraction } = require("discord.js");


module.exports = class embed extends Command {
    constructor(client) {
        super(client, {
            name: "embed",
            description: "Create a custom embed",
            category: "UTILITY",
            botPermissions: ["EMBED_LINKS"],
            command: {
                enabled: false
            },
            slashCommand: {
                enabled: true,
                options: [
                    {
                        name: "title",
                        description: "The title of the embed - max 50 characters",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "description",
                        description: "The description of the embed - max 2048 characters",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "embed-color",
                        description: "The color of the embed - # hex",
                        type: "STRING",
                        required: true
                    }
                ]
            },
        });
    }

/**
   * @param {CommandInteraction} interaction
*/

async interactionRun(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("embed-color");

    const embed = new MessageEmbed()
        .setTitle(`${title}`)
        .setAuthor(`${interaction.user.username}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`)
        .setDescription(`${description}\n\n\n Sent <t:${Math.round(interaction.createdTimestamp / 1000)}:R>`)
        .setColor(color)

    await interaction.followUp({ embeds: [embed]});

}
}
