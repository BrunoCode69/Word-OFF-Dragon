const ms = require("pixapi");
const Discord = require("discord.js");
module.exports = async function (client, message, args, prefix) {
  let dbE = await client.db.get(`moedas/${message.author.id}`);
  let dbN = await client.db.get(`niveis/${message.author.id}`);

  if (dbN == null) {
    client.db.set(`niveis/${message.author.id}`, {
      xp: 0,
      nivel: 1
    });
    return;
  };

  client.db.set(`niveis/${message.author.id}`, { xp: dbN.xp + Math.floor(Math.random() * (15 - 3)) + 3 });

  if (dbN.nivel * 340 <= dbN.xp) {
    client.db.set(`niveis/${message.author.id}`, {
      nivel: dbN.nivel + 1,
      xp: 0
    });

    let embed4 = new Discord.MessageEmbed()
    embed4.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    embed4.setDescription(`Parabéns ${message.author} Você avançou para o Nível **${dbN.nivel + 1}**. Como recompensa você ganhou **R$${1200 * dbN.nivel}**`)
    embed4.setFooter(`Nivel upado!`)
    embed4.setThumbnail(`https://i.imgur.com/Xueb5Sj.png`)
    embed4.setColor(`#0D02FA`)
    embed4.setTimestamp()
    client.db.set(`moedas/${message.author.id}`, { moedas: dbE.moedas + (1200 * dbN.nivel) })
    message.channel.send({ embeds: [embed4] });
  };
};