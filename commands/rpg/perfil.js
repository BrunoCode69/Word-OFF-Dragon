const Discord = require("discord.js");
const { MessageActionRow, MessageButton, createMessageComponentCollector } = require('discord.js');
const createMessageCollector = require("discord.js");
const config = require("../../config.json");
module.exports.run = async function (client, message, args, prefix) {
  try {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.tag === args.join(" ")) || message.author;
    let db = await client.db.get(`perfil/${user.id}`);
    let db_ = await client.db.get(`start/${user.id}`);

    let nome = db ? db.perfil_nome ? db.perfil_nome : "Não definido" : "Não definido"
    let idade = db ? db.perfil_idade ? db.perfil_idade : "Não definido" : "Não definido"
    let bio = db ? db.perfil_bio ? db.perfil_bio : "Não definido" : "Não definido"
    let genero = db ? db.perfil_genero ? db.perfil_genero : "Não definido" : "Não definido"
    let estado_c = db ? db.perfil_estado_civil ? db.perfil_estado_civil : "Não definido" : "Não definido"
    let região = db ? db.perfil_regiao ? db.perfil_regiao : "Não definido" : "Não definido"
    let habilidade = db ? db.perfil_habilidade ? db.perfil_habilidade : "Nenhuma" : "Nenhuma"
    let vida = db_ ? db_.hp ? db_.hp : 8 : 8

    if (vida == 1) vida = "❤"
    if (vida == 2) vida = "❤❤"
    if (vida == 3) vida = "❤❤❤"
    if (vida == 4) vida = "❤❤❤❤"
    if (vida == 5) vida = "❤❤❤❤❤"
    if (vida == 6) vida = "❤❤❤❤❤❤"
    if (vida == 7) vida = "❤❤❤❤❤❤❤"
    if (vida == 8) vida = "❤❤❤❤❤❤❤❤"

    let level_sys = await client.db.get(`niveis/${user.id}`) || { xp: 0, nivel: 1 };
    let xp = level_sys.xp, level = level_sys.nivel, nextLvl = level_sys.nivel * 340;
    let progress_bar = getProgress(xp, level, nextLvl);

    function getProgress(xp, level, nextLvl) {
      let percent = parseInt((xp / nextLvl) * 100);
      let p2 = parseInt(percent / 10);
      let txt = ""

      if (percent >= 10) {
        txt += "<:11:981019711531782185>"
        txt += "<:12:981019438000271460>".repeat((p2 - 1) || 0)
        txt += "<:20:981019100136505404>".repeat(9 - p2)
        txt += "<:30:981018767112929320> ";
      } else {
        txt = "<:10:981018298256875540><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:20:981019100136505404><:30:981018767112929320>"
      }
      return txt;
    }

    let msg_desc = `**Aqui está as informações do perfil de ${user}\n\n`
    msg_desc += `<:nome:982893555041329183> NOME: \`${nome}\`\n`
    msg_desc += `<:idade:982895998932250654> IDADE: \`${idade}\`\n`
    msg_desc += `<:genero:982900604034760724> GENERO: \`${genero}\`\n`
    msg_desc += `<:habilidade:982903103475032084> HABILIDADE: \`${habilidade}\`\n`
    msg_desc += `<:hp:982905184558665728> VIDA: ${vida}\n`
    msg_desc += `🟢 XP: \`${xp}/${nextLvl}\`\n`
    msg_desc += `<:progresso:982896830180372501> PROGRESSO: ${progress_bar}> \`${parseInt((xp / nextLvl) * 100)}%\`**\n\n`
    msg_desc += `<:bio:989605092699295854> BIOGRAFIA: \n\`\`\`${bio}\`\`\`\n\n`

    let embed_1 = new Discord.MessageEmbed()
      .setTitle(`Perfil de ` + user.tag)
      .setDescription(msg_desc)
      .setColor("BLUE")
      .setThumbnail(user.avatarURL())
      .setTimestamp()

    const button = new MessageButton()
      .setCustomId('primary')
      .setLabel('Nome')
      .setEmoji('995380726369353808')
      .setStyle('SUCCESS')

    const button_year = new MessageButton()
      .setCustomId('primary_year')
      .setLabel('Idade')
      .setEmoji('995380726369353808')
      .setStyle('SUCCESS')

    const button_gen = new MessageButton()
      .setCustomId('primary_gen')
      .setLabel('Genero')
      .setEmoji('995380726369353808')
      .setStyle('SUCCESS')

    const button_bio = new MessageButton()
      .setCustomId("primary_bio")
      .setLabel("Biografia")
      .setEmoji("995380726369353808")
      .setStyle("SUCCESS")

    const row = new MessageActionRow().addComponents([button, button_year, button_gen, button_bio]);

    if (!(user.id == message.author.id)) {
      message.reply({
        embeds: [embed_1]
      });
    } else {
      const send = await message.reply({
        embeds: [embed_1],
        components: [row]
      });

      const collector = send.createMessageComponentCollector({ time: 150000 });

      collector.on('collect', async function (i) {
        if (i.customId === 'primary' && i.user.id == message.author.id) {
          send.delete();
          const send_menu = await message.reply({ content: `Qual será o novo nome?: `, components: [], embeds: [] });
          const collector_ = send_menu.channel.createMessageCollector({ time: 150000 });

          collector_.on('collect', async function (m) {
            if (m.author.id != message.author.id) return;
            send_menu.delete()
            m.delete();
            if (!isNaN(m.content)) {
              collector_.stop()
              message.reply(`${config.emoji_erro} O nome não pode conter apenás numeros.`);
              return;
            }

            if (m.content.length > 15) {
              collector_.stop()
              return message.reply(`${config.emoji_erro} O nome não pode conter mais de **15** caracteres.`);
            }

            message.channel.send(`${config.emoji_sucess} O nome **\`${m}\`** foi definido com sucesso !`);
            client.db.set(`perfil/${user.id}`, { perfil_nome: `${m}` })
            collector_.stop();
            return;
          });
        } else if (i.customId === "primary_year" && i.user.id == message.author.id) {
          send.delete();
          const send_menu = await message.channel.send({ content: `Qual será a nova idade?: `, components: [], embeds: [] });

          const collector_ = send_menu.channel.createMessageCollector({ time: 150000 });

          collector_.on('collect', async function (m) {
            if (m.author.id != message.author.id) return;
            m.delete();
            if (isNaN(m.content)) {
              send_menu.delete();
              collector_.stop();
              return message.channel.send({ content: `${config.emoji_erro} Você precisa informar uma idade valida.` });
            }
            if (m.content > 50) {
              send_menu.delete();
              collector_.stop();
              return message.channel.send({ content: `${config.emoji_erro} Infelizmente pessoas acima de **50** anos de idade não são aceitas.`, components: [], embeds: [] });
            } else {
              send_menu.delete();
              collector_.stop();
              message.channel.send({ content: `${config.emoji_sucess} Idade alterada para **\`${m.content}\`** com successo !`, components: [], embeds: [] });
              client.db.set(`perfil/${user.id}`, { perfil_idade: m.content });
            }
          });
        } else if (i.customId == "primary_gen" && i.user.id == message.author.id) {
          send.delete();
          const send_menu = await message.channel.send({ content: `Informe o genero usando \`m\` para Masculino, ou \`f\` para Feminino: `, components: [], embeds: [] });
          const collector_ = send_menu.channel.createMessageCollector({ time: 150000 });

          collector_.on('collect', async (m) => {
            if (m.author.id != message.author.id) return;
            collector_.stop();
            m.delete();
            const generos = ['m', 'f']
            if (!generos.includes(m.content.toLowerCase())) {
              collector_.stop();
              send_menu.delete();
              return message.reply(`${config.emoji_erro} Genero invalido.`);
            } else if (m.content.toLowerCase() == "m") {
              send_menu.delete();
              collector_.stop()
              client.db.set(`perfil/${user.id}`, { perfil_genero: "Masculino" });
              return message.reply(`${config.emoji_sucess} O genero **Masculino** foi setado com sucesso !`);
            } else if (m.content.toLowerCase() == "f") {
              send_menu.delete();
              collector_.stop()
              client.db.set(`perfil/${user.id}`, { perfil_genero: "Feminino" });
              return message.reply(`${config.emoji_sucess} O genero **Feminino** foi setado com sucesso !`);
            }
          });
        } else if (i.customId == "primary_bio" && i.user.id == message.author.id) {
          send.delete();
          const send_menu = await message.channel.send({ content: `Informe o texto de biografia: `, components: [], embeds: [] });

          const collector_ = send_menu.channel.createMessageCollector({ time: 150000 });

          collector_.on('collect', async (m) => {
            if (m.author.id != message.author.id) return;
            collector_.stop();
            send_menu.delete();
            m.delete();
            client.db.set(`perfil/${user.id}`, { perfil_bio: m.content });
            return message.reply(`${config.emoji_sucess} Biografia atualizada com sucesso !`);
          });
        }
      });
    }
  } catch (err) {
    return message.reply(`Ocorreu um erro interno. Tente novamente mais tarde. codigo de erro:\n\n \`\`\`js\n${err}\n\`\`\``);
  }
}

module.exports.conf = {
  aliases: ['avatar']
}