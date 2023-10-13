import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const start = (bot_token) => {
  const bot = new Telegraf(bot_token);
  const welcomeMsg = `Welcome to Torrento Bot!
- ⚡️Download torrents!
`;
  bot.use(Telegraf.log());
  bot.start((ctx) => ctx.reply(welcomeMsg));
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
