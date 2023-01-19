const Discord = require("discord.js");
const fs = require("fs");
const { join } = require("path");

module.exports = async (client) => {
  let dir = __dirname
  client.commands = new Discord.Collection();

  const cmds = fs.readdirSync(join(__dirname, "../commands/rpg/")).filter(file => file.endsWith(".js"));
  for (let file of cmds) {
    let ave = require(join(__dirname, "../commands/rpg/", `${file}`));
    client.commands.set(`${file}`.replace(".js", ""), ave);
    if (ave.conf && ave.conf.aliases) {
      ave.conf.aliases.forEach(function (alias) {
        client.commands.set(alias, ave);
      });
    };
  };
  console.log("Categoria rpg carregada com sucesso !");
};