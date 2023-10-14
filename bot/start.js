import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const start = (bot_token) => {
  const bot = new Telegraf(bot_token);
  const welcomeMsg = `Welcome to Torrento Bot!
- ⚡️Download torrents!
`;
  bot.use(Telegraf.log());
  bot.start((ctx) => ctx.reply(welcomeMsg));
  bot.help((ctx) => ctx.replyWithMarkdownV2("Please send a *Magnet Link*"));
  bot.on(message("text"), ctx => {
    ctx.replyWithMarkdownV2("validating torrent \n" + `\`\`\`sh\n${ctx.message.text}\n\`\`\``);
  });

  // Set telegram commands
  bot.telegram.setMyCommands([
    { command: "/start", description: "Start the bot" },
    { command: "/help", description: "Show help" },
  ]);
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
