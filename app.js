import start from "./bot/start.js";
import dotenv from "dotenv";

dotenv.config();

start(process.env.BOT_TOKEN);
