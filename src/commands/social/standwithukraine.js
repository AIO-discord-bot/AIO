const { Command } = require("@src/structures");
const { MessageEmbed, Message } = require("discord.js");
const { MESSAGES, EMBED_COLORS } = require("@root/config.js");



module.exports = class standwithukraine extends Command {
  constructor(client) {
    super(client, {
      name: "standwithukraine",
      description: "...",
      cooldown: 500000,
      category: "SOCIAL",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "standwithUkraine",
    },
});
}

  /**
   * @param {Message} message
   */
  async messageRun(message) {
    const response = new MessageEmbed()
       .setAuthor('Standing with Ukraine')
       .setTitle('You **stood** with Ukraine!')
       .setDescription('You stand with \`47,343`\+ other users!')
       .setImage('https://cdn.discordapp.com/attachments/836684006472417300/950254155807744010/You_are_number_num47000roundTouser_to_stand_with_Ukraine.gif')
    await message.reply({ embeds: [response] })
  }

}
     
