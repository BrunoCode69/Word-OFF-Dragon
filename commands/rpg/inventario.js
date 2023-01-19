const Discord = require("discord.js");
const config = require("../../config.json");
const { MessageActionRow, MessageButton, createMessageComponentCollector } = require('discord.js');
module.exports.run = async function (client, message, args, prefix) {
    let db = await client.db.get(`start/${message.author.id}`);
    let bag_tools = await client.db.get(`inventario/${message.author.id}/itens/tools`);
    let bag_consumables = await client.db.get(`inventario/${message.author.id}/itens/consumables`);
    let bag_resorces = await client.db.get(`inventario/${message.author.id}/itens/resources`);

    if (!db) return message.reply(`**${config.emoji_erro} | Hummm não funcionou... tente usar o comando \`${prefix}start\`**`);

    let message_menu = '';

    const button = new MessageButton();
    button.setCustomId('primary');
    button.setLabel('Inicio');
    button.setEmoji('1060836656816607283');
    button.setStyle("SUCCESS");

    const button1 = new MessageButton();
    button1.setCustomId('primary1');
    button1.setLabel('Ferramentas');
    button1.setEmoji('996191344513011754');
    button1.setStyle("SUCCESS");

    const button2 = new MessageButton();
    button2.setCustomId('primary2');
    button2.setLabel('Consumiveis');
    button2.setEmoji('1060374741157941400');
    button2.setStyle("SUCCESS");

    const button3 = new MessageButton();
    button3.setCustomId('primary3');
    button3.setLabel('Recursos');
    button3.setEmoji('1060822411387346944');
    button3.setStyle("SUCCESS");

    const row = new MessageActionRow().addComponents([button], [button1], [button2], [button3]);

    let message_bag = `Olá ${message.author}, abaixo estará as categorias de **inventario** disponiveis, clique no botão correspondente a categoria desejada:\n\n`;

    let embed = new Discord.MessageEmbed()
        .setTitle(`Inventario de ${message.author.username}`)
        .setDescription(message_bag)
        .setColor("BLUE")
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png')
        .setImage('https://i.pinimg.com/originals/32/d4/79/32d479716f4b14eb970d2fc17a458ace.gif')
        .setFooter("\u3000".repeat(10) + "Obrigado por usar meus comandos !")
        .setTimestamp()

    let send_primary = await message.reply({
        embeds: [embed],
        components: [row]
    });

    const filter = i => i.user.id === message.author.id;
    const collector = send_primary.createMessageComponentCollector({ filter, time: 1500000 });

    collector.on('collect', async function (i) {
        if (i.customId == "primary") {
            button.setDisabled(true);
            button1.setDisabled(false);
            button2.setDisabled(false);
            button3.setDisabled(false);
            i.update({
                embeds: [embed],
                components: [row]
            });
        } else if (i.customId === 'primary1') {
            if (!bag_tools) {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(`Inventario - ferramentas`);
                embed.setDescription("\n\n");
                embed.setColor("BLUE")
                embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                embed.setTimestamp();

                button1.setDisabled(true);
                button2.setDisabled(false);
                button3.setDisabled(false);
                button.setDisabled(false);
                i.update({
                    embeds: [embed],
                    components: [row]
                });
            } else {
                let inventario = Object.keys(bag_tools);
                inventario.forEach(async (item, index) => {
                    let emoji = await client.db.get(`inventario/${message.author.id}/itens/tools/${item}/item_emoji`);
                    let name = await client.db.get(`inventario/${message.author.id}/itens/tools/${item}/item_name`);
                    let durabilidade = await client.db.get(`inventario/${message.author.id}/itens/tools/${item}/item_durabilit`);
                    let duraction = await client.db.get(`inventario/${message.author.id}/itens/tools/${item}/iten_durabilit_duraction`);
                    let repair = durabilidade + duraction * 250 - durabilidade;

                    message_menu += `------------------------------\n${emoji} **${name}**\n**💪 Durabilidade**: \`${duraction}/${durabilidade}\`\n**🔍 Taxa de uso**: \`${parseInt(duraction / durabilidade * 100)}%\`\n`;
                    message_menu += `**🛠 Valor do reparo**: \`R$${repair}\`\n\n`;
                    if (index == (inventario.length - 1)) {
                        println(message_menu);
                        message_menu = "";
                    }
                });

                const println = async function (message_menu) {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(`Inventario - ferramentas`);
                    embed.setDescription(message_menu);
                    embed.setColor("BLUE")
                    embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                    embed.setTimestamp();

                    button.setDisabled(false);
                    button1.setDisabled(true);
                    button2.setDisabled(false);
                    button3.setDisabled(false);

                    i.update({
                        embeds: [embed],
                        components: [row]
                    });
                };

            }
        } else if (i.customId == "primary2") {
            if (!bag_consumables) {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(`Inventario - consumiveis`);
                embed.setDescription("\n\n");
                embed.setColor("BLUE")
                embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                embed.setTimestamp();

                button.setDisabled(false);
                button1.setDisabled(false);
                button3.setDisabled(false);
                button2.setDisabled(true);
                i.update({
                    embeds: [embed],
                    components: [row]
                });
            } else {
                let inventario = Object.keys(bag_consumables);
                inventario.forEach(async function (item, index) {
                    let emoji = await client.db.get(`inventario/${message.author.id}/itens/consumables/${item}/item_emoji`);
                    let name = await client.db.get(`inventario/${message.author.id}/itens/consumables/${item}/item_name`);
                    let quantia = await client.db.get(`inventario/${message.author.id}/itens/consumables/${item}/item_quantia`);

                    message_menu += `------------------------------\n${emoji} **${name}**\n**📌 Quantidade**: \`${quantia}\`\n`;
                    if (index == (inventario.length - 1)) {
                        println(message_menu);
                        message_menu = "";
                    }
                });

                async function println(message_menu) {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(`Inventario - consumiveis`);
                    embed.setDescription(message_menu);
                    embed.setColor("BLUE")
                    embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                    embed.setTimestamp();

                    button.setDisabled(false);
                    button1.setDisabled(false);
                    button2.setDisabled(true);
                    button3.setDisabled(false);
                    i.update({
                        embeds: [embed],
                        components: [row]
                    });
                };
            };
        } else if (i.customId == "primary3") {
            if (!bag_resorces) {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(`Inventario - recursos`);
                embed.setDescription("\n\n");
                embed.setColor("BLUE")
                embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                embed.setTimestamp();

                button.setDisabled(false);
                button1.setDisabled(false);
                button2.setDisabled(false);
                button3.setDisabled(true);
                i.update({
                    embeds: [embed],
                    components: [row]
                });
            } else {
                let inventario = Object.keys(bag_resorces);
                inventario.forEach(async function (item, index) {
                    let emoji = await client.db.get(`inventario/${message.author.id}/itens/resources/${item}/item_emoji`);
                    let name = await client.db.get(`inventario/${message.author.id}/itens/resources/${item}/item_name`);
                    let quantia = await client.db.get(`inventario/${message.author.id}/itens/resources/${item}/item_quantia`);

                    message_menu += `------------------------------\n${emoji} **${name}**\n**📌 Quantidade**: \`${quantia}\`\n`;
                    if (index == (inventario.length - 1)) {
                        println(message_menu);
                        message_menu = "";
                    };
                });

                async function println(message_menu) {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(`Inventario - recursos`);
                    embed.setDescription(message_menu);
                    embed.setColor("BLUE")
                    embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/5609/5609476.png');
                    embed.setTimestamp();

                    button.setDisabled(false);
                    button1.setDisabled(false);
                    button2.setDisabled(false);
                    button3.setDisabled(true);
                    i.update({
                        embeds: [embed],
                        components: [row]
                    });
                };
            };
        };
    });
};

module.exports.conf = {
    aliases: ['bag', 'inv']
};