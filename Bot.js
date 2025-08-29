require("dotenv").config();
const express = require("express");
const app = express();
const cron = require("node-cron");
const { Telegraf, Input } = require("telegraf");
const { Client, GatewayIntentBits } = require("discord.js");

// Initialize Discord client
const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3000;

// Telegram Bot Token
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
// Discord Bot Token
const discordToken = process.env.DISCORD_TOKEN;
// Telegram Chat ID
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

bot.start((ctx) => {
  ctx.sendChatAction("typing");
  ctx.replyWithHTML(
    // `<code>🤖 Bender V-1.7.0\nAvailable Commands:</code>\n<code>/metar "icao"</code>\n<code>/taf "icao"</code>\n<code>/weather "city"</code>\n<code>/gpt "query"</code>`
    `<code>🤖 Bender V-1.7.0\n Watching for events on discord.</code>`
  );
});

bot.help((ctx) => {
  ctx.sendChatAction("typing");
  ctx.replyWithHTML(
    // `<code>🤖 Bender V-1.7.0\nAvailable Commands:</code>\n<code>/metar "icao"</code>\n<code>/taf "icao"</code>\n<code>/weather "city"</code>\n<code>/gpt "query"</code>`
    `<code>🤖 Bender V-1.7.0\n Watching for events on discord.</code>`
  );
});

// Function to send message to Telegram
const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  // axios
  //   .post(url, {
  //     chat_id: telegramChatId,
  //     text: message,
  //     parse_mode: "HTML",
  //   })
  //   .catch((error) =>
  //     console.error("Error sending message to Telegram:", error)
  //   );
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

// Discord bot event listener for voice state updates
discordClient.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member.user;
  if (!oldState.channelId && newState.channelId) {
    // User joined a voice channel
    sendTelegramMessage(
      `<code>🗣️📢\n\nHeads up: The user ${user.username} has connected to ${newState.channel.name}.\n\n🟢🟢🟢</code>`
    );
  } else if (oldState.channelId && !newState.channelId) {
    // User left a voice channel
    sendTelegramMessage(
      `<code>🗣️📢\n\nHeads Up: The user ${user.username} has disconnected from ${oldState.channel.name}.\n\n🔴🔴🔴</code>`
    );
  }
});

// bot.command(["metar", "METAR", "Metar"], (ctx) => {
//   ctx.sendChatAction("typing");
//   let userMessage = ctx.message.text.slice(7, 11).toUpperCase();

//   if (userMessage.length < 4) {
//     ctx.replyWithHTML(
//       `<code>🤖 Your request cannot be proccessed, the ICAO code must contain 4 digits, example "/metar SVBS"</code>`
//     );
//   } else {
//     let url = `https://api.checkwx.com/bot/metar/${userMessage}?x-api-key=${process.env.METAR_TOKEN}`;

//     fetch(url)
//       .then((response) => response.text())

//       .then((response) => {
//         ctx.replyWithHTML(
//           `<code>🤖Your METAR request ${ctx.from.first_name} ☁️✈️:</code><code>\n${response}</code>`
//         );
//       });
//   }
// });

// bot.command(["taf", "TAF", "Taf"], (ctx) => {
//   ctx.sendChatAction("typing");
//   let userMessage = ctx.message.text.slice(4, 11).toUpperCase();

//   if (userMessage.length < 4) {
//     ctx.replyWithHTML(
//       `<code>🤖 Your request cannot be processed, please remember that ICAO code contains 4 digits, example "/taf SVBS"</code>`
//     );
//   } else {
//     let url = `https://api.checkwx.com/taf/${userMessage}/?x-api-key=${process.env.METAR_TOKEN}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((response) => {
//         let rawData = response.data;

//         ctx.replyWithHTML(
//           `<code>🤖 Your TAF Request ${ctx.from.first_name} ☁️✈️:</code><code>\n${rawData}</code>`
//         );
//       });
//   }
// });

// bot.command(["weather", "WEATHER", "Weather"], (ctx) => {
//   ctx.sendChatAction("typing");
//   let userMessage = ctx.message.text.slice(7, 11).toUpperCase();

//   if (userMessage.length < 4) {
//     ctx.replyWithHTML(
//       `<code>🤖 Your request cannot be processed, please enter the name of the city to consult. Example "/weather Caracas"</code>`
//     );
//   } else {
//     let url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${userMessage}&aqi=no&lang=es`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((response) => {
//         let location = response.location.name;
//         let region = response.location.region;
//         let time = response.location.localtime;
//         let temp = response.current.temp_c;
//         let text = response.current.condition.text;
//         let wind = response.current.wind_kph;
//         let windDir = response.current.wind_dir;
//         let pressure = response.current.pressure_mb;
//         let humidity = response.current.humidity;
//         let feelslike = response.current.feelslike_c;
//         let visibility = response.current.vis_km;

//         ctx.replyWithHTML(
//           `<code>🤖Your Weather Request ${ctx.from.first_name} ☁️✈️:</code>\n<code>Date & local time at ${location} ${region} it's ${time}.With ${temp}°C celcius degrees, and the current weather state is ${text} with winds of ${wind} km/h bearing ${windDir}.Barometric pressure of ${pressure} milibars with ${humidity}% of humidity. Thermal Sensation of ${feelslike}°C and visibility of ${visibility}KMs.</code>`
//         );
//       });
//   }
// });

// bot.command(["gpt", "GPT", "Gpt"], async (ctx) => {
//   await ctx.persistentChatAction("typing", async () => {
//     let userMessage = ctx.message.text.slice(5, 10000);

//     if (userMessage.length < 4) {
//       ctx.replyWithHTML(
//         `<code>🤖 Your rquest cannot be processed, please enter a valid query. Example "/gpt query"</code>`
//       );
//     } else {
//       const OpenAI = require("openai");
//       const openai = new OpenAI({
//         apiKey: process.env.GPT_TOKEN,
//       });

//       const AskGPT = async () => {
//         const chatCompletion = await openai.chat.completions.create({
//           model: "gpt-3.5-turbo",
//           messages: [{ role: "user", content: userMessage }],
//           max_tokens: 2048,
//         });

//         let reply = chatCompletion.choices[0].message.content;
//         ctx.replyWithHTML(
//           `<code>🤖Query response for ${ctx.from.first_name}:</code>\n<code>${reply}</code>`
//         );
//       };

//       await AskGPT();
//     }
//   });
// });

// bot.command (["cmd"], (ctx) => {

//     ctx.replyWithMarkdownV2 ('||texto||');
//     ctx.sendChatAction ("record_voice");
//     ctx.sendVoice(Input.fromLocalFile("./audio.ogg"));

// });

// Schedule NASA APOD execution at 11 PM every day (04:00 zulu time)

// cron.schedule("0 3 * * *", () => {
//   const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}`;
//   fetch(nasaURL)
//     .then((response) => response.text())
//     .then((response) => {
//       let parsedResponse = JSON.parse(response);
//       let imageTitle = parsedResponse.title;
//       let imageURL = parsedResponse.url;
//       let date = parsedResponse.date;
//       let dateParts = date.split("-");
//       let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
//       let author = parsedResponse.copyright;

//       bot.telegram.sendPhoto(-1001212168810, imageURL, {
//         caption: `<code>🎒📷🚀🪐🛰️🌌☄️🛸🌕📡🪐\n\nNASA's APOD (Astronomy Picture of the Day) para hoy ${formattedDate}.\n\n"${imageTitle}".\n\nBuenas Noches</code>`,
//         parse_mode: "HTML",
//       });
//     });
// });

// Schedule Chuck's Joke execution at 7 AM every day (11:00 zulu time)

// cron.schedule("0 11 * * *", () => {
//   const jokesURL = `https://api.chucknorris.io/jokes/random`;
//   fetch(jokesURL)
//     .then((response) => response.text())
//     .then((response) => {
//       let parsedResponse = JSON.parse(response);
//       let joke = parsedResponse.value;
//       bot.telegram.sendMessage(
//         -1001212168810,
//         `<code>☀️Buenos Dias🎒\n\n🧔${joke}😹\n\nQue el dia de hoy sea mejor que ayer.</code>`,
//         { parse_mode: "HTML" }
//       );
//     });
// });

// cron.schedule('*/4 * * * * *', () => {
// Test every 4 seconds

discordClient.login(discordToken);
bot.launch();

app.listen(port, () => {
  console.log(`Bender V-1.7.0 listening on port ${port}`);
});
