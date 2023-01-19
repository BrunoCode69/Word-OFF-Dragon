const Discord = require("discord.js");
const client = new Discord.Client({ intents: Object.keys(Discord.Intents.FLAGS) });
const config = require("./config.json");
const firebase = require("firebase");
const dotenv = require("dotenv").config();
const FireSimple = require("./utilitarios/database.js");

client.db = new FireSimple({
  apiKey: process.env.apikey,
  databaseURL: process.env.database_url
});

client.on("messageCreate", async (message) => {
  module.exports = require("./handlers/handler_rpg")(client, message, config);
});

client.on("ready", () => {
  module.exports = require("./LoadCommands/LoadRPG")(client);
  client.user.setPresence({ activities: [{ name: 'w!start' }] });
});

client.login(process.env.token);