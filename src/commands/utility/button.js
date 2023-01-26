const { Command } = require("@src/structures");
const { client, MessageEmbed, CommandInteraction, MessageActionRow } = require("discord.js");
const { MessageButton } = require("discord.js");


module.exports = class button extends Command {
    constructor(client) {
        super(client, {
            name: "button",
            description: "Add a button to a custom embed",
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
                    },

                    {
                        name: "url",
                        description: "The url to link the button to",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "button-text",
                        description: "The text to add to the button (max 15 characters)",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "emoji",
                        description: "The emoji to add to the button",
                        type: "STRING",
                        required: false,
                    },
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
    const url = interaction.options.getString("url");
    const buttontext = interaction.options.getString("button-text");
    const emoji = interaction.options.getString("emoji");

    const embed = new MessageEmbed()
        .setTitle(`${title}`)
        .setAuthor(`${interaction.user.username}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`)
        .setDescription(`${description}\n\n\n Sent <t:${Math.round(interaction.createdTimestamp / 1000)}:R> • Do Not click the button if you don't trust the server!`)
        .setColor(color)

    const button = new MessageButton()
        .setStyle("LINK")
        .setLabel(`${buttontext}`)
        .setURL(url)
        if (emoji) button
        .setEmoji(`${emoji}`);

    let row = new MessageActionRow()
        .addComponents(button);

    await interaction.followUp({ embeds: [embed], components: [row] });
}
}
