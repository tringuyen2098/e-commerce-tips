"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const config = require("../configs/config.cfg");

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        //add channel id
        this.channelId = config.channel_id;
        this.client.on("ready", () => {
            console.log(`Logged is as ${this.client.user.tag}!`);
        });
        this.client.login(config.bot_discord_token);
    }

    sendToFormatCode(logData) {
        const {
            code,
            message = "This is some additional information about the code.",
            title = "Code Example",
        } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt("00ff00", 16),
                    title,
                    description:
                        "```json\n" + JSON.stringify(code, null, 2) + "\n```",
                },
            ],
        };
        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = "message") {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId);
            return;
        }
        channel.send(message).catch((e) => console.log(e));
    }
}
const loggerService = new LoggerService();
module.exports = loggerService;
