const { Command } = require("@src/structures");
const { MessageEmbed, Message } = require("discord.js");
const { MESSAGES, EMBED_COLORS } = require("@root/config.js");



module.exports = class gprem extends Command {
  constructor(client) {
    super(client, {
      name: "gprem",
      description: "...",
      cooldown: 5,
      category: "FUN",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "gprem",
    },
});
}

  /**
   * @param {Message} message
   */
  async messageRun(message) {
    const response = new MessageEmbed()
       .setAuthor(':')
       .setTitle('PREMIUM GIVEN')
       .setDescription('Auth = River#0003 | Perm level: 8 | Pos: OWNER | Paid: false')
    await message.reply({ embeds: [response] })
  }

}
