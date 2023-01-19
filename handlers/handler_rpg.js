const Discord = require("discord.js");
const { Permissions } = require('discord.js');
module.exports = async function (client, message, config) {
  try {
    if (message.channel.type == "dm") return;
    let db = await client.db.get(`servidores/${message.guild.id}`);
    let prefix = db ? db.prefix ? db.prefix : config.prefix.toLowerCase() : config.prefix.toLowerCase();

    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let ave = args.shift();
    let comando = client.commands.get(ave);
    if (!comando) return;

    await require("../utilitarios/xp_event.js")(client, message, args, prefix);
    comando.run(client, message, args, prefix);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return;
    return;
  }
};