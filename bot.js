require("dotenv").config();
require("module-alias/register");
chalk = require("chalk")

const path = require("path");
const { startupCheck } = require("@utils/botUtils");
const { BotClient } = require("@src/structures");

global.__appRoot = path.resolve(__dirname);

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");

const { AutoPoster } = require('topgg-autoposter')
const poster = AutoPoster(process.env.TOP_GG_TOKEN, client)
poster.on('posted', (stats) => {
  console.log(chalk.green(`Posted stats to Top.gg | ${stats.serverCount} servers`))
})

// catch client errors and warnings
client.on("error", (err) => client.logger.error(`Client Error`, err));
client.on("warn", (message) => client.logger.warn(`Client Warning: ${message}`));
client.on("debug", (message) => console.log(message));

// find unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(err);
  client.logger.error(`Unhandled exception`, err);
});

(async () => {
  await startupCheck();
  if (client.config.DASHBOARD.enabled) {
    client.logger.log(chalk.yellow(`Launching dashboard`));
    try {
      const { launch } = require("@root/dashboard/app");
      await launch(client);
    } catch (ex) {
      client.logger.error(chalk.yellow(`Failed to launch dashboard`, ex));
    }
  }
  await client.initializeMongoose();
  await client.login(process.env.BOT_TOKEN);
})();