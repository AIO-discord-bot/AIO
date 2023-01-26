const { getSettings } = require("@root/src/schemas/Guild");
const { MessageActionRow, MessageButton } = require("discord.js");

const express = require("express"),
  utils = require("../utils"),
  CheckAuth = require("../auth/CheckAuth"),
  router = express.Router();

router.get("/premium", CheckAuth, async (req, res) => {
  res.render("manage/premium", {
    user: req.userInfos,
    currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
  });

});




router.get("/:serverID", CheckAuth, async (req, res) => {
  res.redirect(`/manage/${req.params.serverID}/management`);
});

router.get("/:serverID/management", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  // Fetch guild informations
  const guildInfos = await utils.fetchGuild(guild.id, req.client, req.user.guilds);

  res.render("manager/basic", {
    guild: guildInfos,
    user: req.userInfos,
    bot: req.client,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
  });
});

router.get("/:serverID/greeting", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  // Fetch guild informations
  const guildInfos = await utils.fetchGuild(guild.id, req.client, req.user.guilds);

  res.render("manager/greeting", {
    guild: guildInfos,
    user: req.userInfos,
    bot: req.client,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
  });
});

router.get("/:serverID/embed", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  // Fetch guild informations
  const guildInfos = await utils.fetchGuild(guild.id, req.client, req.user.guilds);

  res.render("manager/embedBuilder", {
    guild: guildInfos,
    user: req.userInfos,
    bot: req.client,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
  });
});

router.get("/:serverID/commands", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  // Fetch guild informations
  const guildInfos = await utils.fetchGuild(guild.id, req.client, req.user.guilds);

  res.render("manager/commands", {
    guild: guildInfos,
    user: req.userInfos,
    bot: req.client,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    commands: req.client.commands
      .map((cmd) => ({
        name: cmd.name,
        description: cmd.description,
        disabled: settings?.disabledCommands?.includes(cmd.name),
      }))
      .sort((cmd) => cmd.name),
  });
});

router.get("/:serverID/ticketpanels", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  // Fetch guild informations
  const guildInfos = await utils.fetchGuild(guild.id, req.client, req.user.guilds);

  res.render("manager/ticketpanels", {
    guild: guildInfos,
    user: req.userInfos,
    bot: req.client,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
  });
});

router.post("/:serverID/management", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;

  if (Object.prototype.hasOwnProperty.call(data, "managementUpdate")) {
    if (data.prefix && data.prefix !== settings.prefix) {
      settings.prefix = data.prefix;
    }

    data.ranking = data.ranking === "on" ? true : false;
    if (data.ranking !== (settings.ranking.enabled || false)) {
      settings.ranking.enabled = data.ranking;
    }

    data.flag_translation = data.flag_translation === "on" ? true : false;
    if (data.flag_translation !== (settings.flag_translation.enabled || false)) {
      settings.flag_translation.enabled = data.flag_translation;
    }

    data.modlog_channel = guild.channels.cache.find((ch) => "#" + ch.name === data.modlog_channel)?.id || null;
    if (data.modlog_channel !== settings.modlog_channel) {
      settings.modlog_channel = data.modlog_channel;
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, "ticketUpdate")) {
    if (data.limit && data.limit != settings.ticket.limit) {
      settings.ticket.limit = data.limit;
    }

    data.channel = guild.channels.cache.find((ch) => "#" + ch.name === data.channel)?.id;
    if (data.channel !== settings.ticket.log_channel) {
      settings.ticket.log_channel = data.channel;
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, "inviteUpdate")) {
    data.tracking = data.tracking === "on" ? true : false;
    if (data.tracking !== (settings.invite.tracking || false)) {
      settings.invite.tracking = data.tracking;
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, "automodUpdate")) {
    if (data.max_strikes != settings.automod.strikes) {
      settings.automod.strikes = data.max_strikes;
    }

    if (data.automod_action !== settings.automod.action) {
      settings.automod.action = data.automod_action;
    }

    if (data.max_lines && data.max_lines !== settings.automod.max_lines) {
      settings.automod.max_lines = data.max_lines;
    }

    if (data.max_mentions && data.max_mentions !== settings.automod.max_mentions) {
      settings.automod.max_mentions = data.max_mentions;
    }
    if (data.max_role_mentions && data.max_role_mentions !== settings.automod.max_role_mentions) {
      settings.automod.max_role_mentions = data.max_role_mentions;
    }

    data.anti_links = data.anti_links === "on" ? true : false;
    if (data.anti_links !== (settings.automod.anti_links || false)) {
      settings.automod.anti_links = data.anti_links;
    }

    data.anti_scam = data.anti_scam === "on" ? true : false;
    if (data.anti_scam !== (settings.automod.anti_scam || false)) {
      settings.automod.anti_scam = data.anti_scam;
    }

    data.anti_invites = data.anti_invites === "on" ? true : false;
    if (data.anti_invites !== (settings.automod.anti_invites || false)) {
      settings.automod.anti_invites = data.anti_invites;
    }

    data.anti_ghostping = data.anti_ghostping === "on" ? true : false;
    if (data.anti_ghostping !== (settings.automod.anti_ghostping || false)) {
      settings.automod.anti_ghostping = data.anti_ghostping;
    }
  }
  await settings.save();
  res.redirect(303, `/manage/${guild.id}/management`);
});

router.post("/:serverID/greeting", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;

  if (Object.prototype.hasOwnProperty.call(data, "welcomeDisable")) {
    settings.welcome.enabled = false;
  }

  if (
    Object.prototype.hasOwnProperty.call(data, "welcomeEnable") ||
    Object.prototype.hasOwnProperty.call(data, "welcomeUpdate")
  ) {
    data.content = data.content.replace(/\r?\n/g, "\\n");
    if (data.content && data.content !== settings.welcome.content) {
      settings.welcome.content = data.content;
    }

    data.description = data.description?.replaceAll(/\r\n/g, "\\n");
    if (data.description && data.description !== settings.welcome.embed?.description) {
      settings.welcome.embed.description = data.description;
    }

    if (data.footer && data.footer !== settings.welcome.embed?.footer) {
      settings.welcome.embed.footer = data.footer;
    }

    if (data.hexcolor && data.hexcolor !== settings.welcome.embed?.color) {
      settings.welcome.embed.color = data.hexcolor;
    }

    data.thumbnail = data.thumbnail === "on" ? true : false;
    if (data.thumbnail !== (settings.welcome.embed?.thumbnail || false)) {
      settings.welcome.embed.thumbnail = data.thumbnail;
    }

    data.channel = guild.channels.cache.find((ch) => "#" + ch.name === data.channel)?.id;
    if (data.channel !== settings.welcome.channel) {
      settings.welcome.channel = data.channel;
    }

    if (!settings.welcome.enabled) settings.welcome.enabled = true;
  }

  if (Object.prototype.hasOwnProperty.call(data, "farewellDisable")) {
    settings.farewell.enabled = false;
  }

  if (
    Object.prototype.hasOwnProperty.call(data, "farewellEnable") ||
    Object.prototype.hasOwnProperty.call(data, "farewellUpdate")
  ) {
    data.content = data.content.replace(/\r?\n/g, "\\n");
    if (data.content && data.content !== settings.farewell.content) {
      settings.farewell.content = data.content;
    }

    data.description = data.description?.replaceAll(/\r\n/g, "\\n");
    console.log(data.description);
    if (data.description && data.description !== settings.farewell.embed?.description) {
      settings.farewell.embed.description = data.description;
    }

    if (data.footer && data.footer !== settings.farewell.embed?.footer) {
      settings.farewell.embed.footer = data.footer;
    }

    if (data.hexcolor && data.hexcolor !== settings.farewell.embed?.color) {
      settings.farewell.embed.color = data.hexcolor;
    }

    data.thumbnail = data.thumbnail === "on" ? true : false;
    if (data.thumbnail !== (settings.farewell.embed?.thumbnail || false)) {
      settings.farewell.embed.thumbnail = data.thumbnail;
    }

    data.channel = guild.channels.cache.find((ch) => "#" + ch.name === data.channel)?.id;
    console.log(data.channel);
    if (data.channel !== settings.farewell.channel) {
      settings.farewell.channel = data.channel;
    }

    if (!settings.farewell.enabled) settings.farewell.enabled = true;
  }

  await settings.save();
  res.redirect(303, `/manage/${guild.id}/greeting`);
});

router.post("/:serverID/commands", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;
  const commands = req.client.commands.map((cmd) => cmd.name);

  settings.disabledCommands = commands.filter((cmd) => !data[cmd]);
  settings.markModified("disabledCommands");

  await settings.save();
  res.redirect(303, `/manage/${guild.id}/commands`);
});

router.post("/:serverID/ticketpanels", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;
  if (!settings.ticketPanels) settings.ticketPanels = [];
  settings.ticketPanels.push({
    name: data.name,
    channel: data.channel,
    role: JSON.parse(data.role),
  });

  guild.channels
    .fetch(data.channel)
    .then((ch) => {
      if (ch) {
        ch.send({
          embeds: [
            {
              title: data.name,
              description: "To create a new ticket, react with ✉️",
              color: 0xc0c0c0,
              footer: {
                name: "AIO",
              },
              timestamp: new Date().getTime(),
            },
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setEmoji("✉️")
                .setStyle("SECONDARY")
                .setCustomId("TICKET_CREATE_PANEL_" + encodeURIComponent(data.name))
            ),
          ],
        });
      }
    })
    .catch((e) => console.error(e));

  settings.markModified("ticketPanels");
  await settings.save();
  res.redirect(303, `/manage/${guild.id}/ticketpanels`);
});

router.post("/:serverID/ticketpanels/send", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;

  settings.ticketPanels.find((x) => x._id == data.id).channel = data.channel;

  guild.channels
    .fetch(data.channel)
    .then((ch) => {
      if (ch) {
        ch.send({
          embeds: [
            {
              title: settings.ticketPanels.find((x) => x._id == data.id).name,
              description: "To create a new ticket, react with ✉️",
              color: 0xc0c0c0,
              footer: {
                name: "AIO",
              },
              timestamp: new Date().getTime(),
            },
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setEmoji("✉️")
                .setStyle("SECONDARY")
                .setCustomId(
                  "TICKET_CREATE_PANEL_" + encodeURIComponent(settings.ticketPanels.find((x) => x._id == data.id).name)
                )
            ),
          ],
        });
      }
    })
    .catch((e) => console.error(e));

  settings.markModified("ticketPanels");
  await settings.save();
  res.redirect(303, `/manage/${guild.id}/ticketpanels`);
});

router.post("/:serverID/ticketpanels/delete", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;

  settings.ticketPanels = settings.ticketPanels.filter((x) => x._id != data.id);

  settings.markModified("ticketPanels");
  await settings.save();
  res.redirect(303, `/manage/${guild.id}/ticketpanels`);
});

router.post("/:serverID/ticketpanels/update", CheckAuth, async (req, res) => {
  // Check if the user has the permissions to edit this guild
  const guild = req.client.guilds.cache.get(req.params.serverID);
  if (
    !guild ||
    !req.userInfos.displayedGuilds ||
    !req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
  ) {
    return res.render("404", {
      user: req.userInfos,
      currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
    });
  }

  const settings = await getSettings(guild);
  const data = req.body;
  settings.ticketPanels.find((x) => x._id == data.id).role = JSON.parse(data.role);

  settings.markModified("ticketPanels");
  await settings.save();
  res.redirect(303, `/manage/${guild.id}/ticketpanels`);
});

module.exports = router;
