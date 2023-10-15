import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { toTitle } from "../utils/utils.js";
import { decode } from "magnet-uri";
import commands from "./commands.js";
import validateMagnetLink, { magnetLinkRegex } from "./validate-torrent.js";
import WebTorrent from "webtorrent";

import fs from "fs";

const start = (bot_token) => {
  const bot = new Telegraf(bot_token);
  const welcomeMsg = `Welcome to Torrento Bot!
- ⚡️Download torrents!
`;
  bot.use(Telegraf.log());
  bot.start((ctx) => ctx.reply(welcomeMsg));
  bot.help((ctx) =>
    ctx.replyWithMarkdownV2(
      `Hi, _${toTitle(ctx.from.username)}_\nPlease send a *Magnet Link*`,
    ),
  );
  bot.on(message("text"), (ctx) => {
    const magnetLink = ctx.message.text;
    if (!validateMagnetLink(magnetLink)) {
      ctx.replyWithMarkdownV2("Not a valid *Torrent Link*\nPlease send a valid torrent link");
      return;
    }

    ctx.reply("Starting to download torrent! 🚀");

    // WIP
    // console.log(ctx.message.text);
    // const client = new WebTorrent();
    // const downloadPath = './downloads';

  });

  // Set telegram commands
  bot.telegram.setMyCommands(commands);
  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => {
    console.log("Recieved SIGINT, Shutting down the bot gracefully");
    bot.stop("SIGINT");
  });
  process.once("SIGTERM", () => {
    console.log("Recieved SIGTERM, Shutting down the bot gracefully");
    bot.stop("SIGTERM");
  });
};

export default start;
