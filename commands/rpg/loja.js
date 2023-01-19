const Discord = require('discord.js');
const { MessageActionRow, MessageButton, createMessageComponentCollector } = require('discord.js');
const config = require('../../config.json');
module.exports.run = async function (client, message, args, prefix) {
    let user = message.author;
    let start = await client.db.get(`start/${user.id}`);
    let db = await client.db.get(`moedas/${user.id}`);

    if (!start) {
        return message.reply(`Humm... não funcionou, tente \`${prefix}start\` e volte aqui.`);
    }

    let message_menu = `Olá ${user}, Bem vindoª a minha loja !!\nabaixo uma lista de itens a venda... fique avontade:\n\n`;
    message_menu += `**${config.emoji_machado} MACHADO**\n\n`;
    message_menu += `**${config.emoji_pesca} VARA DE PESCA**\n\n`;
    message_menu += `**${config.emoji_potion_cura} POÇÃO DE CURA**\n\n`;

    const button = new MessageButton()
        .setCustomId('primary_1')
        .setEmoji('996191344513011754')
        .setStyle('SUCCESS')

    const button_machado = new MessageButton()
        .setCustomId('primary_2')
        .setEmoji('1059237294969716847')
        .setStyle('SUCCESS')

    const button_potion_cure = new MessageButton()
        .setCustomId('primary_3')
        .setEmoji('1059239445389385748')
        .setStyle('SUCCESS')

    const row = new MessageActionRow().addComponents([button], [button_machado], [button_potion_cure]);

    let send = await message.reply({
        embeds: [new Discord.MessageEmbed()
            .setTitle(`Loja de Itens e Ferramentas`)
            .setDescription(message_menu)
            .setColor("BLUE")
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3209/3209711.png')
            .setFooter(`Para obter informações de um item clique no emoji correspondente a ele.`)],
        components: [row]
    });


    const filter = i => i.user.id === message.author.id;
    const collector = send.createMessageComponentCollector({ filter, time: 150000 });

    collector.on('collect', async function (i) {
        if (i.customId === 'primary_1') {
            let menu_item_1 = `**📌 Nome**: \`Machado\`\n`;
            menu_item_1 += `**🔷 Função**: \`O machado é usado para coletar madeira no comando: .chop\`\n`;
            menu_item_1 += `**💰 Valor:** \`R$10000\`\n`;
            menu_item_1 += `**💪 Durabilidade:** \`0/10\``

            const button = new MessageButton()
                .setCustomId('compra_item')
                .setLabel(`Comprar item`)
                .setStyle('SUCCESS')


            const button_c = new MessageButton()
                .setCustomId('cancelar')
                .setLabel(`Cancelar`)
                .setStyle('DANGER')

            const row = new MessageActionRow().addComponents([button], [button_c])

            let send_2 = new Discord.MessageEmbed()
                .setTitle(`Informações do item`)
                .setDescription(menu_item_1)
                .setColor("BLUE")
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/3856/3856367.png')
                .setFooter(`Clique no botão "Comprar item" para adiquirir o produto.`)
            i.update({
                embeds: [send_2],
                components: [row]
            });

            const filter = i => i.user.id === message.author.id;
            const collector = send.createMessageComponentCollector({ filter, time: 150000 });

            collector.on("collect", async function (i) {
                if (i.customId == "compra_item") {
                    let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                    if (!db || db < 10000) {
                        i.update({
                            content: `**${config.emoji_erro} | Você não possui moedas suficientes para realizar a compra.**`,
                            embeds: [],
                            components: []
                        });
                    } else {
                        let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                        let db_inventario = await client.db.get(`inventario/${i.user.id}/itens/machado`);

                        if (!db_inventario) {
                            let embed = new Discord.MessageEmbed()
                                .setTitle('Compra realizada')
                                .setDescription(`Você acaba de comprar um **${config.emoji_machado} Machado** no valor de \`R$10000\``)
                                .setColor("BLUE")
                                .setFooter('Obrigado pela compra... volte sempre !')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/313/313201.png')
                            i.update({
                                embeds: [embed],
                                components: []
                            });

                            client.db.set(`inventario/${i.user.id}/itens/tools/machado`, {
                                item_name: "Machado",
                                item_emoji: config.emoji_machado,
                                item_durabilit: 10,
                                iten_durabilit_duraction: 0
                            });

                            client.db.set(`moedas/${i.user.id}`, {
                                moedas: db - 10000
                            });
                        } else {
                            i.update({
                                content: `**${config.emoji_erro} | Você já possui um machado no inventario, espere ele degradar para poder comprar outro.**`,
                                embeds: [],
                                components: []
                            });
                        };
                    };
                } else if (i.customId == "cancelar") {
                    i.update({
                        content: `**${config.emoji_sucess} | Cancelado com sucesso.**`,
                        embeds: [],
                        components: []
                    });
                };
            });
        };
        //////////////////////////////////////////

        if (i.customId === 'primary_2') {
            let menu_item_1 = `**📌 Nome**: \`Vara de pesca\`\n`;
            menu_item_1 += `**🔷 Função**: \`A vara de pesca é usada para pescar no comando: .fish\`\n`;
            menu_item_1 += `**💰 Valor:** \`R$10000\`\n`;
            menu_item_1 += `**💪 Durabilidade:** \`0/10\``

            const button = new MessageButton()
                .setCustomId('compra_item')
                .setLabel(`Comprar item`)
                .setStyle('SUCCESS')


            const button_c = new MessageButton()
                .setCustomId('cancelar')
                .setLabel(`Cancelar`)
                .setStyle('DANGER')

            const row = new MessageActionRow().addComponents([button], [button_c])

            let send_2 = new Discord.MessageEmbed()
                .setTitle(`Informações do item`)
                .setDescription(menu_item_1)
                .setColor("BLUE")
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/3856/3856367.png')
                .setFooter(`Clique no botão "Comprar item" para adiquirir o produto.`)
            i.update({
                embeds: [send_2],
                components: [row]
            });

            const filter = i => i.user.id === message.author.id;
            const collector = send.createMessageComponentCollector({ filter, time: 150000 });

            collector.on("collect", async function (i) {
                if (i.customId == "compra_item") {
                    let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                    if (!db || db < 10000) {
                        i.update({
                            content: `**${config.emoji_erro} | Você não possui moedas suficientes para realizar a compra.**`,
                            embeds: [],
                            components: []
                        });
                    } else {
                        let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                        let db_inventario = await client.db.get(`inventario/${i.user.id}/itens/tools/vara_de_pesca`);

                        if (!db_inventario) {
                            let embed = new Discord.MessageEmbed()
                                .setTitle('Compra realizada')
                                .setDescription(`Você acaba de comprar um **${config.emoji_pesca} Vara de pesca** no valor de \`R$10000\``)
                                .setColor("BLUE")
                                .setFooter('Obrigado pela compra... volte sempre !')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/313/313201.png')
                            i.update({
                                embeds: [embed],
                                components: []
                            });

                            client.db.set(`inventario/${i.user.id}/itens/tools/vara_de_pesca`, {
                                item_name: "Vara de pesca",
                                item_emoji: config.emoji_pesca,
                                item_durabilit: 10,
                                iten_durabilit_duraction: 0
                            });

                            client.db.set(`moedas/${i.user.id}`, {
                                moedas: db - 10000
                            });
                        } else {
                            i.update({
                                content: `**${config.emoji_erro} | Você já possui uma vara de pesca no inventario, espere ela degradar para poder comprar outra.**`,
                                embeds: [],
                                components: []
                            });
                        };
                    };
                } else if (i.customId == "cancelar") {
                    i.update({
                        content: `**${config.emoji_sucess} | Cancelado com sucesso.**`,
                        embeds: [],
                        components: []
                    });
                };
            });
        };

        /////////////////////////////

        if (i.customId === 'primary_3') {
            let menu_item_1 = `**📌 Nome**: \`Poção de cura\`\n`;
            menu_item_1 += `**🔷 Função**: \`Regenera uma quantia aleatoria de HP\`\n`;
            menu_item_1 += `**💰 Valor:** \`R$20000\`\n`;
            menu_item_1 += `**📌 quantidade:** \`1\``

            const button = new MessageButton()
                .setCustomId('compra_item')
                .setLabel(`Comprar item`)
                .setStyle('SUCCESS')


            const button_c = new MessageButton()
                .setCustomId('cancelar')
                .setLabel(`Cancelar`)
                .setStyle('DANGER')

            const row = new MessageActionRow().addComponents([button], [button_c])

            let send_2 = new Discord.MessageEmbed()
                .setTitle(`Informações do item`)
                .setDescription(menu_item_1)
                .setColor("BLUE")
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/3856/3856367.png')
                .setFooter(`Clique no botão "Comprar item" para adiquirir o produto.`)
            i.update({
                embeds: [send_2],
                components: [row]
            });

            const filter = i => i.user.id === message.author.id;
            const collector = send.createMessageComponentCollector({ filter, time: 150000 });

            collector.on("collect", async function (i) {
                if (i.customId == "compra_item") {
                    let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                    if (!db || db < 20000) {
                        i.update({
                            content: `**${config.emoji_erro} | Você não possui moedas suficientes para realizar a compra.**`,
                            embeds: [],
                            components: []
                        });
                    } else {
                        let db = await client.db.get(`moedas/${i.user.id}/moedas`);
                        let db_inventario = await client.db.get(`inventario/${i.user.id}/itens/consumables/potion_cure`);
                        let db_inventario_ = await client.db.get(`inventario/${i.user.id}/itens/consumables/potion_cure/item_quantia`);
                        if (!db_inventario_) db_inventario_ = 0;

                        if (!db_inventario) {
                            let embed = new Discord.MessageEmbed()
                                .setTitle('Compra realizada')
                                .setDescription(`Você acaba de comprar uma **${config.emoji_potion_cura} Poção de cura** no valor de \`R$20000\``)
                                .setColor("BLUE")
                                .setFooter('Obrigado pela compra... volte sempre !')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/313/313201.png')
                            i.update({
                                embeds: [embed],
                                components: []
                            });

                            client.db.set(`inventario/${i.user.id}/itens/consumables/potion_cure`, {
                                item_name: "Poção de cura",
                                item_emoji: config.emoji_potion_cura,
                                item_quantia: db_inventario_ + 1
                            });

                            client.db.set(`moedas/${i.user.id}`, {
                                moedas: db - 20000
                            });
                        } else {
                            i.update({
                                content: `**${config.emoji_erro} | Você já possui uma Poção de cura, espere ela degradar para poder comprar outra.**`,
                                embeds: [],
                                components: []
                            });
                        };
                    };
                } else if (i.customId == "cancelar") {
                    i.update({
                        content: `**${config.emoji_sucess} | Cancelado com sucesso.**`,
                        embeds: [],
                        components: []
                    });
                };
            });
        };
    });
};