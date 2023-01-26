const { Command } = require("@src/structures");
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const backup = require("discord-backup");
const client = require("../../../bot");

module.exports = class Backup extends Command {
    constructor(client) {
        super(client, {
            name: "backup",
            description: "Make a backup of your server.",
            category: "PREMIUM",
            userPermissions: ["ADMINISTRATOR"],
            slashCommand: {
                enabled: true,
                ephemeral: false,
                options: [
                    {
                        name: "create",
                        type: "SUB_COMMAND",
                        description: "create a backup of the server"
                    },
                    {
                        name: "delete",
                        type: "SUB_COMMAND",
                        description: "delete the backup created for your server",
                        options: [
                            {
                                name: "backup-id",
                                description: "The backup id provided to you once you created the backup.",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "load",
                        type: "SUB_COMMAND",
                        description: "Load your backup",
                        options: [
                            {
                                name: "backup-id",
                                description: "The backup id provided to you once you created the backup.",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "info",
                        type: "SUB_COMMAND",
                        description: "Get information on the backup you have on this server.",
                        options: [
                            {
                                name: "backup-id",
                                description: "The backup id provided to you once you created the backup.",
                                type: "STRING",
                                required: true
                            }
                        ]
                    }
                ]
            }
        })
    }
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async interactionRun(interaction) {
        const sub = interaction.options.getSubcommand();
        let backupID = interaction.options.getString("backup-id");

        if (sub === "create") {
            const embed = new MessageEmbed()
                .setTitle("Confirmation")
                .setColor("YELLOW")
                .setDescription("Are you sure you would like to create a backup of this server?")

            const a = new MessageButton()
                .setLabel("Yes")
                .setStyle("SUCCESS")
                .setCustomId("yes_create")

            const b = new MessageButton()
                .setLabel("Delete")
                .setStyle("DANGER")
                .setCustomId("dont_create")

            const actionRow = new MessageActionRow()
                .addComponents(a, b);

            await interaction.followUp({
                embeds: [embed], components: [actionRow], ephemeral: true
            })


            const collector = await interaction.channel.createMessageComponentCollector({
                time: 15000,
                componentType: "BUTTON"
            });

            collector.on("collect", async (i) => {
                if (i.customId === "yes_create") {
                    if (i.user.id !== interaction.user.id) return i.followUp({ content: "DONT MESS WITH OTHERS BUTTONS!", ephemeral: true });

                    /**
                        * @param {Guild} [Guild] - The discord server you want to backup
                        * @param {object} [options] - The backup options
                      */
                    backup.create(interaction.guild).then(async (backupData) => {

                        const dmbutton = new MessageButton()
                            .setURL(`https://discord.com/channels/@me/users/${interaction.user.id}`)
                            .setLabel("Open Dms")
                            .setStyle("LINK")

                        const ActionRow = new MessageActionRow().addComponents(dmbutton);

                        await interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Please make sure you have your dms open!")
                                    .setColor("YELLOW")
                            ], components: [
                                ActionRow,
                            ],
                            ephemeral: true
                        });
                        await interaction.user.send({
                            embeds: [new MessageEmbed()
                                .setTitle("Success")
                                .setColor("GREEN")
                                .setDescription(`The id for your backup is - \`${backupData.id}\``)
                            ],
                        })
                    })
                } else if (i.customId === "dont_create") {
                    i.deleteReply();
                    console.log("Delete");
                }
            })
        } else if (sub === "delete") {
            const embed = new MessageEmbed()
                .setTitle("Confirmation")
                .setColor("YELLOW")
                .setDescription("Are you sure you would like to delete this backup the server?")

            const a = new MessageButton()
                .setLabel("Yes")
                .setStyle("SUCCESS")
                .setCustomId("yes_delete")

            const b = new MessageButton()
                .setLabel("Delete")
                .setStyle("DANGER")
                .setCustomId("dont_delete")

            const actionRow = new MessageActionRow()
                .addComponents(a, b);

            await interaction.followUp({
                embeds: [embed], components: [actionRow], ephemeral: true
            })


            const collector = await interaction.channel.createMessageComponentCollector({
                time: 15000,
                componentType: "BUTTON"
            });

            collector.on("collect", async (i) => {
                if (i.customId === "yes_delete") {
                    if (i.user.id !== interaction.user.id) return i.followUp({ content: "DONT MESS WITH OTHERS BUTTONS!", ephemeral: true });

                    // await i.deferUpdate()
                    // a.setDisabled(true)
                    // b.setDisabled(true)
                    /**
                        * @param {Guild} [Guild] - The discord server you want to backup
                        *       @param {object} [options] - The backup options
        */
                    backup.fetch(backupID).then(async (backupData) => {

                        backup.remove(backupID)

                        await interaction.user.send({
                            embeds: [new MessageEmbed()
                                .setTitle("Success")
                                .setColor("GREEN")
                                .setDescription(`Successfully deleted backup`)
                            ],
                        })
                    })
                } else if (i.customId === "dont_delete") {
                    // i.deleteReply();
                    console.log("Delete");
                }
            })
        } else if (sub === "load") {
            const embed = new MessageEmbed()
                .setTitle("Confirmation")
                .setColor("YELLOW")
                .setDescription("Are you sure you would like to load this backup to server?")

            const a = new MessageButton()
                .setLabel("Yes")
                .setStyle("SUCCESS")
                .setCustomId("yes_load")

            const b = new MessageButton()
                .setLabel("Delete")
                .setStyle("DANGER")
                .setCustomId("dont_load")

            const actionRow = new MessageActionRow()
                .addComponents(a, b);

            await interaction.followUp({
                embeds: [embed], components: [actionRow], ephemeral: true
            })


            const collector = await interaction.channel.createMessageComponentCollector({
                time: 15000,
                componentType: "BUTTON"
            });

            collector.on("collect", async (i) => {
                if (i.customId === "yes_load") {
                    if (i.user.id !== interaction.user.id) return i.followUp({ content: "DONT MESS WITH OTHERS BUTTONS!", ephemeral: true });

                    // await i.deferUpdate()
                    // a.setDisabled(true)
                    // b.setDisabled(true)
                    /**
                        * @param {Guild} [Guild] - The discord server you want to backup
                        * @param {object} [options] - The backup options
                     */
                    backup.load(backupID, interaction.guild).then(async (backupData) => {

                        backup.remove(backupID, {
                            clearGuildBeforeRestore: true
                        });

                        await interaction.user.send({
                            embeds: [new MessageEmbed()
                                .setTitle("Success")
                                .setColor("GREEN")
                                .setDescription(`Successfully loaded backup id - \`${backupID}\``)
                            ],
                        })
                    })
                } else if (i.customId === "dont_load") {
                    // i.deleteReply();
                    console.log("Delete");
                }
            })
        } else if (sub === "info") {
            backup.fetch(backupID).then(async (backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(),
                    mm = (date.getMonth() + 1).toString(),
                    dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;

                let backups = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL)
                    .setColor('GREEN')
                    .setDescription(`**Back Up Info**\nBackup ID: ${backupInfos.id} \nServer ID: ${backupInfos.data.guildID} \nBackup Size: ${backupInfos.size} mb \nBackup Created At: ${formatedDate}`)

                await interaction.followUp({
                    embeds: [backups],
                    ephemeral: true
                })
            }).catch(async (err) => {
                let nobackupfound = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL)
                    .setDescription(`> No Backup Found For: \`${backupID}\`!`)

                    .setColor('RED')
                await interaction.followUp({
                    embeds: [nobackupfound],
                    ephemeral: true
                })
            });
        }
    }
}