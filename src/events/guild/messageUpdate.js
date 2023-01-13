const { MessageEmbed, Message, guild, message } = require("discord.js");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Guild} guild
 * @param {Message} oldMessage
 * @param {Message} newMessage
 */
module.exports = async (client, guild, oldMessage, newMessage, message) => {


    if (oldMessage == null || newMessage == null) return;



    if (oldMessage.author.bot) return;

    if (oldMessage.content === newMessage.content) return;

    const count = 1950;

    const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
    const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? " ..." : "");

    const Log = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`📘 A [message](${newMessage.url}) was edited in ${newMessage.channel}.\n 
        **Original:** ${Original}\n \n**Edited:**\n ${Edited}`)
        .setFooter(`Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`)

    const channel = guild.channels.cache.find(c => c.name === "logs");
    channel.send({ embeds: [Log] })
}

console.log("message update event loaded");

