import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { toTitle } from "../utils/utils.js";
import commands from "./commands.js";
import validateMagnetLink from "./validate-torrent.js";
import WebTorrent from "webtorrent";

const start = (bot_token) => {
  const bot = new Telegraf(bot_token);
  const welcomeMsg = `
  Welcome to Torrento Bot!
⚡️Download torrents!
`;
  bot.use(Telegraf.log());
  bot.start((ctx) => ctx.reply(welcomeMsg));
  bot.help((ctx) =>
    ctx.replyWithMarkdownV2(
      `Hi, ${toTitle(ctx.from.first_name)}\nPlease send a *Magnet Link*`,
    ),
  );
  bot.on(message("text"), (ctx) => {
    const magnetLink = ctx.message.text;
    if (!validateMagnetLink(magnetLink)) {
      ctx.replyWithMarkdownV2(
        "Not a valid *Torrent Link*\nPlease send a valid torrent link",
      );
      return;
    }

    // ctx.reply("Starting to download torrent! 🚀");

    const client = new WebTorrent();
    const downloadPath = "./downloads";
    let progressMessageId = null;
    let lastReportedProgress = -1;

    client.add(magnetLink, { path: downloadPath }, (torrent) => {
      ctx.reply(`Downloading torrent 🚀: ${torrent.name}`);

      const intervalId = setInterval(async () => {
        const currentProgress = Math.round(torrent.progress * 100 * 100) / 100;
        if (currentProgress !== lastReportedProgress) {
          lastReportedProgress = currentProgress;
          if (progressMessageId) {
            await ctx.telegram.editMessageText(
              ctx.chat.id,
              progressMessageId,
              null,
              `Progress: ${currentProgress}%`,
            );
          } else {
            const message = await ctx.reply(`Progress: ${currentProgress}%`);
            progressMessageId = message.message_id;
          }
        }
      }, 5000); // Run every 5 seconds

      torrent.on("done", () => {
        clearInterval(intervalId);
        ctx.reply("Download completed!");
        client.remove(torrent);
      });
    });
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
