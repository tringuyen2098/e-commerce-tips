"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const config = require("../configs/config.cfg");

client.on("ready", () => {
    console.log(`Logged is as ${client.user.tag}`);
});
// const token =
//     "MTEzOTM5MjQ2NDExMzg5MzQ4Ng.G6MP5m.t193dEaOj3PdeuoqlhBLruf3wJH4OS818m4AiI";

client.login(config.bot_discord_token);

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (msg.content === "hello") {
        msg.reply(`Hello! How can i assistance you today`);
    }
});
