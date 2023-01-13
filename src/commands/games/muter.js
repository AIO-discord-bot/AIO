const { Command } = require("@src/structures");
const { Message, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = class muteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "muter",
            description: "A muter roullete that mutes the winner.",
            category: "GAMES",
            command: {
                enabled: false,
                minArgsCount: 1,
            },
            slashCommand: {
                enabled: false,
                options: [
                    {
                        name: "muter",
                        description: "Start the muter",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "time",
                                description: "The time duration in which the winner will be muted",
                                type: "String",
                                required: true,
                            },
                        ]

                    }

                ]
            }

        });
    }
}

