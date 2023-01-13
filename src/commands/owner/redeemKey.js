const { Command } = require("@src/structures");
const { Message, MessageEmbed } = require("discord.js");
const { getRandomValues } = require("crypto");
const { redeemKey } = require("@schemas/PremiumKeys");
const ems = require("enhanced-ms")

module.exports = class redeemmKey extends Command {
    constructor(client) {
        super(client, {
            name: "test-1",
            description: "test",
            category: "OWNER",
            userPermissions: ["ADMINISTRATOR"],
            botPermissions: ["ADMINISTRATOR"],
            command: {
                enabled: true,
                usage: "[length]",
                minArgsCount: 0,
            },
            slashCommand: {
                enabled: false,
            },
        });
    }

    /**
    * @param {Message} message
    * @param {string[]} args
    */

    async messageRun(message, args) {
        const key = args[0] ? args[0] : null;
        if (!key) return message.reply({
            content: "Add a fucking key you idiot." // please remove this in production.
        })
        const someRandomData = await redeemKey(message.author.id, key);
        const keyData = someRandomData[0];
        const response = someRandomData[1];
        // this is a fucked way of handling this ^

        let redeemembed;
        console.log(keyData);
        console.log(response);
        
        /*
            @TODO: Add "You've already redeemed this key!"
       */
        if (response.includes("OK")) // KEY OK NOTIFY USER
            redeemembed = new MessageEmbed()
                .setTitle("Key Redeemed")
                .setDescription(`You have redeemed a premium key for ${ems(ems(keyData.premiumExpiresAt), { shortFormat: false })}!\n - Your premium will expire in <t:${Math.round((ems(keyData.premiumExpiresAt) + new Date().getTime()) / 1000)}:R>`)
                .setColor("GREEN")
                .setTimestamp()
        if (response.includes("ERROR"))
            redeemembed = new MessageEmbed()
                .setTitle("Something Went Wrong")
                .setDescription(`We couldn't give the premium at this time. Please give us more money to fix this issue.`)
                .setColor("RED")
                .setTimestamp()
        else
            redeemembed = new MessageEmbed()
                .setTitle("Something Went Wrong")
                .setDescription(`You may have entered a expired or invalid key! Check that key and try again.`)
                .setThumbnail("[premium image here]")
                .setColor("RED")
                .setTimestamp()

        await message.reply({
            embeds: [redeemembed],
            content: "Matt is retarded"
        });
    }
}