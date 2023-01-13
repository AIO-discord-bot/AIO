const { Command } = require("@src/structures");
const { Message, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = class tictactoeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "tictactoe",
            description: "Play tictactoe with AIO",
            category: "GAMES",
            command: {
                enabled: true,
            },
            slashCommand: {
                enabled: true,
                ephemeral: true,
                options: [],
            },
        });
    }


    /**
     * @param {Message} message
     * @param {string[]} args
     */

    async messageRun(message, args) {
        let opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!opponent) return message.channel.send({ content: "Please provide the user to challenge!" })
        const embed = new MessageEmbed()
            .setTitle('TicTacToe')

        await message.reply({ embeds: [embed] })
    }

    async interactionRun(interaction) {
        const embed = new MessageEmbed()
            .setTitle('TicTacToe')

        await interaction.followUp({ embeds: [embed] })
    }
}
