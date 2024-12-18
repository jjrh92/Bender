FROM node:current-alpine

# cd bot
WORKDIR /bot

# Copy files to the working directory
COPY package.json ./
COPY Bot.js ./

ARG TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
ARG METAR_TOKEN=${METAR_TOKEN}
ARG WEATHER_TOKEN=${WEATHER_TOKEN}
ARG GPT_TOKEN=${GPT_TOKEN}
ARG NASA_TOKEN=${NASA_TOKEN}
ARG TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
ARG DISCORD_TOKEN=${DISCORD_TOKEN}

# Instalar las dependencias
RUN npm install

# Comando run de la imagen
CMD [ "node", "Bot.js" ]
