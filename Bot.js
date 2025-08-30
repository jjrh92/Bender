require("dotenv").config();
const express = require("express");
const app = express();
const { Telegraf } = require("telegraf");
const { Client, GatewayIntentBits } = require("discord.js");

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

app.get("/", (res) => {
  res.send(`
    <h1>Bender (Bot) is running!🚀</h1>
    <p>Version 1.7.0</p>
    <p>Watching for events on Discord and reporting to Telegram.</p>
    <p>Made with <3</p>
    <a href="https://www.julioreyes.dev">Visit my portfolio!</a>
    <p>Always learning and improving!</p>
    `);
});

const port = 1402;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const discordToken = process.env.DISCORD_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

bot.start((ctx) => {
  ctx.sendChatAction("typing");
  ctx.replyWithHTML(
    `<code>🤖 Bender V-1.7.0\n Watching for events on discord.</code>`
  );
});

bot.help((ctx) => {
  ctx.sendChatAction("typing");
  ctx.replyWithHTML(
    `<code>🤖 Bender V-1.7.0\n Watching for events on discord.</code>`
  );
});

const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
};

discordClient.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member.user;
  if (!oldState.channelId && newState.channelId) {
    sendTelegramMessage(
      `<code>🗣️🗣️🗣️\n\n${user.username} connected to ${newState.channel.name}\n\n🟢🟢🟢</code>`
    );
  } else if (oldState.channelId && !newState.channelId) {
    sendTelegramMessage(
      `<code>🗣️🗣️🗣️\n\n${user.username} disconnected from ${oldState.channel.name}\n\n🔴🔴🔴</code>`
    );
  }
});

discordClient.once("ready", () => {
  const activities = [
    { name: "🚀 Online 🚀", type: 4 },
    { name: "🤖 Online 🤖", type: 4 },
    { name: "🗣️ Online 🗣️", type: 4 },
    { name: "🟢 Online 🟢", type: 4 },
  ];

  let i = 0;
  setInterval(() => {
    const activity = activities[i];
    discordClient.user.setPresence({
      activities: [activity],
      status: "online",
    });

    i = (i + 1) % activities.length;
  }, 16 * 1000);
});

discordClient.login(discordToken);
bot.launch();

app.listen(port, () => {
  console.log(`Bender V-1.7.0 listening on port ${port}`);
});