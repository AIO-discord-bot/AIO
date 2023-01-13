const { MessageEmbed, MessageActionRow, MessageCollector, MessageComponentInteraction, MessageFlags } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");
const { Command } = require("@src/structures");
const { getSettings } = require("@schemas/Guild");
const { Message, CommandInteraction } = require("discord.js");
const { getRoleByName } = require("@utils/guildUtils");

/**
 * @param {import('discord.js').Message} message
 */

async function SetupaAntinuke(Message, settings) {
    const { antinuke } = settings;
}

if (!antinuke.debug && shouldPreformAction(Message)) return;

const { antinuke } = await getSettings(Message.guild);

const embed = new MessageEmbed()
    .setColor(EMBED_COLORS.INFO)
    .setTitle("Anti-Nuke Setup")
    .setDescription("This is the setup for the Anti-Nuke feature.\n\n" +
        "Please enter the role that you want to be able to use the Anti-Nuke features.\n"
        + "This role will be able to use the following commands:\n"
        + "▪︎ `antinukesettings` - This will show the current Anti-Nuke settings.\n"
        + "▪︎ `antinukeaddaction` - This will add an action to the selected action.\n")
    .setFooter({ text: "Please enter the role name below." });

const row = new MessageActionRow()
    .addComponents(
        selectButton = new MessageButton()
            .setCustomId('antinuke-role-input')
            .setText("Select Role")
            .setStyle('PRIMARY')
            .setEmoji()
            .setAction(() => {
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

                collector.on('collect', async i => {
                    await i.editReply({ content: 'I updated :p', components: [] })
                    selectButton = i.message.getComponent('antinuke-role-input').setDisabled(true);
                }, { once: true });

                collector.on('end', async i => {
                    await i.deleteReply()
                })
            })

    )


