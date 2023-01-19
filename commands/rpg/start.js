const Discord = require("discord.js");
const { MessageActionRow, MessageButton, createMessageComponentCollector } = require('discord.js');
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
module.exports.run = async function (client, message, args, prefix) {
    let user = message.author;
    let start = await client.db.get(`start/${message.author.id}`);
    if (start) return;
    let msg = `Olá ${message.author} você está preparado para entrar na maior jornada de **RPG** da sua vida?`;
    let habilidades = ["Lenhador", "Samurai", "Pescador"];
    let result_hab = habilidades[Math.floor(Math.random() * habilidades.length)];

    let embed = new Discord.MessageEmbed()
        .setDescription(msg)
        .setColor("BLUE")
        .setThumbnail(user.avatarURL)

    const button1 = new MessageButton()
    button1.setCustomId('primary1')
    button1.setLabel('Cancelar')
    button1.setEmoji('980770947571277834')
    button1.setStyle(`DANGER`)

    const row = new MessageActionRow().addComponents([new MessageButton()
        .setCustomId('primary')
        .setLabel('Entrar')
        .setEmoji('980770829996523540')
        .setStyle('SUCCESS')], [button1])

    const m = await message.reply({
        embeds: [embed],
        components: [row]
    })

    const filter = i => i.customId === 'primary' && i.user.id === message.author.id;
    const collector = m.createMessageComponentCollector({ filter, time: 150000 });
    const filter2 = i => i.customId === 'primary1' && i.user.id === message.author.id;
    const collector2 = m.createMessageComponentCollector({ filter: filter2, time: 150000 });

    collector.on('collect', async i => {
        if (i.customId === 'primary') {
            let msg_ok = `${user} Seja bem vindo(a) ao meu mundo! tome **${config.emoji_ouro} R$500** Moedas para te ajudar na sua jornada. Boa Sorte!!`
            client.db.set(`start/${user.id}`, { hp: 8 });
            client.db.set(`moedas/${user.id}`, { moedas: 500 });
            client.db.set(`perfil/${user.id}`, { perfil_habilidade: result_hab });
            await i.update({ content: msg_ok, components: [], embeds: [] });
            return;
        };
    });

    collector2.on('collect', async e => {
        if (e.customId === 'primary1') {
            let msg_cancell = `${config.emoji_sucess} Cancelado com sucesso !`
            await e.update({ content: msg_cancell, components: [], embeds: [] });
            return;
        };
    });

    collector.on('end', collected => { return; });
    collector2.on('end', collected => { return; });
};