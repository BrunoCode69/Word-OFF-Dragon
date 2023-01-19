const Discord = require("discord.js");
const { MessageActionRow, MessageButton, createMessageComponentCollector } = require('discord.js');
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const mercadopago = require('mercadopago');
const email = 'gmailtransactions@gmail.com';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
mercadopago.configure({ access_token: config.acess_token });
module.exports.run = async function (client, message, args, prefix) {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.tag === args.join(" ")) || message.author;

    let saldo_moedas = await client.db.get(`moedas/${user.id}/moedas`);
    let saldo_diamantes = await client.db.get(`moedas/${user.id}/diamantes`);
    if (!saldo_moedas) saldo_moedas = 0;
    if (!saldo_diamantes) saldo_diamantes = 0;;

    try {
        let button = new MessageButton()
        button.setCustomId('primary')
        button.setLabel('Recarregar diamantes')
        button.setEmoji('1059567302380617928')
        button.setStyle('SECONDARY')

        let row = new MessageActionRow().addComponents([button]);

        let message_send = `> **${config.emoji_ouro} Moedas**: \`${saldo_moedas}\`\n\n`;
        message_send += `> **${config.emoji_diamante} Diamantes**: \`${saldo_diamantes}\``;
        let embed = new Discord.MessageEmbed()
        embed.setTitle(`Mostrando a carteira do usuario: ${user.username}`)
        embed.setDescription(message_send)
        embed.setColor('BLUE')
        embed.setFooter('Obrigado por usar meus comandos !')
        embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/7107/7107559.png')
        embed.setTimestamp()

        if (user.id == message.author.id) {
            let send = await message.reply({
                embeds: [embed],
                components: [row]
            });

            const filter = i => i.user.id === user.id;
            const collector = send.createMessageComponentCollector({ filter, time: 150000 });

            collector.on('collect', async function (i) {
                if (i.customId === 'primary') {

                    const button_item1 = new MessageButton()
                        .setCustomId('item_1')
                        .setEmoji('1016413328324702370')
                        .setLabel('100')
                        .setStyle('SECONDARY')

                    const button_item2 = new MessageButton()
                        .setCustomId('item_2')
                        .setEmoji('1016413328324702370')
                        .setLabel('250')
                        .setStyle('SECONDARY')

                    const button_item3 = new MessageButton()
                        .setCustomId('item_3')
                        .setEmoji('1016413328324702370')
                        .setLabel('500')
                        .setStyle('SECONDARY')

                    const row = new MessageActionRow().addComponents([button_item1], [button_item2], [button_item3]);

                    let message_pv = `Olá ${user},  aqui você pode comprar diamantes de forma rapida e segura, veja abaixo o menu de valores:\n\n`;
                    message_pv += `**-------------------------**\n`;
                    message_pv += `**Item**: ${config.emoji_diamante} Diamante\n`;
                    message_pv += `**Quantidade**: \`100\`\n`;
                    message_pv += `**Valor em BRL**: \`1,50\`\n`;
                    message_pv += `**-------------------------**\n\n`;
                    message_pv += `**Item**: ${config.emoji_diamante} Diamante\n`;
                    message_pv += `**Quantidade**: \`250\`\n`;
                    message_pv += `**Valor em BRL**: \`3,50\`\n`;
                    message_pv += `**-------------------------**\n\n`;
                    message_pv += `**Item**: ${config.emoji_diamante} Diamante\n`;
                    message_pv += `**Quantidade**: \`500\`\n`;
                    message_pv += `**Valor em BRL**: \`5,00\`\n`;
                    message_pv += `**-------------------------**\n\n`;
                    message_pv += `Clique na opção de recarga desejada para saber informações sobre meios de pagamento.`

                    let embed = new Discord.MessageEmbed()
                    embed.setTitle(`Menu de recarga`)
                    embed.setDescription(message_pv)
                    embed.setColor('BLUE')
                    embed.setThumbnail('https://cdn-icons-png.flaticon.com/512/530/530966.png')
                    let send_pv = await client.users.cache.get(user.id).send({
                        embeds: [embed],
                        components: [row]
                    });

                    i.update({
                        content: `${config.emoji_sucess} Ticket de compra iniciado no seu PV`,
                        embeds: [],
                        components: []
                    });

                    const filter = i => i.user.id === user.id;
                    const collector = send_pv.createMessageComponentCollector({ filter, time: 150000 });

                    collector.on('collect', async function (i) {
                        if (i.customId === 'item_1') {

                            const button = new MessageButton()
                                .setCustomId('compra_item')
                                .setLabel(`Comprar item`)
                                .setStyle('SUCCESS')


                            const button_c = new MessageButton()
                                .setCustomId('cancelar')
                                .setLabel(`Cancelar`)
                                .setStyle('DANGER')

                            const row = new MessageActionRow().addComponents([button], [button_c])


                            let menu_item_1 = `**📌 Item**: \`100 Diamantes\`\n`;
                            menu_item_1 += `**💰 Valor:** \`BRL 1,50\`\n`;
                            menu_item_1 += `**✅ Forma de pagamento:** \`Pix copia e cola\``;

                            let embed = new Discord.MessageEmbed()
                                .setTitle('Informações da compra')
                                .setDescription(menu_item_1)
                                .setColor('BLUE')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/5790/5790705.png')
                                .setTimestamp()

                            i.update({
                                embeds: [embed],
                                components: [row]
                            });

                            const filter_ = i => i.user.id === user.id;
                            const collector_ = send_pv.createMessageComponentCollector({ filter: filter_, time: 150000 });

                            collector_.on("collect", async function (i) {
                                if (i.customId == "compra_item") {
                                    const payment_data = {
                                        transaction_amount: config["100_dimas_value"],
                                        description: 'mercadopagoapi',
                                        payment_method_id: 'pix',
                                        payer: {
                                            email,
                                            first_name: user.username,
                                        }
                                    }
                                    mercadopago.payment.create(payment_data).then(async function (result) {
                                        const code = result.body.point_of_interaction.transaction_data.qr_code;
                                        let pix = result;

                                        let embed = new Discord.MessageEmbed()
                                            .setTitle('Pagamento gerado')
                                            .setDescription(`**Copie o codigo abaixo**:\n\n\`${code}\`\n\n**Abra seu aplicativo de pagamentos e vá na area  PIX, chegando lá procure por "pix copia e cola" e cole o codigo e realize o pagamento**.\n\n**Guarde o numero da compra**: \`${pix.body.id}\`\n\n⚠ Se o pagamento não for realizado em até **10 Minutos** iremos descartar a compra.`)
                                            .setFooter('Assim que você efetuar o pagamento vamos adicionar os diamantes na sua carteira.')
                                            .setColor('BLUE')
                                            .setThumbnail('https://cdn-icons-png.flaticon.com/512/925/925049.png')
                                            .setTimestamp()

                                        i.update({
                                            embeds: [embed],
                                            components: []
                                        });


                                        let interval = setInterval(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") {
                                                    let embed = new Discord.MessageEmbed()
                                                        .setTitle('Pagamento recebido !')
                                                        .setDescription(`Você acaba de comprar **${config.emoji_diamante} 100 Diamantes !**`)
                                                        .setColor('BLUE')
                                                        .setThumbnail('https://cdn-icons-png.flaticon.com/512/9132/9132953.png')
                                                        .setFooter('🤝 Obrigado por contribuir e confiar em nosso projeto.')
                                                        .setTimestamp()

                                                    client.users.cache.get(user.id).send({
                                                        embeds: [embed]
                                                    });

                                                    let dimas_saldo = await client.db.get(`moedas/${user.id}/diamantes`);
                                                    if (!dimas_saldo) dimas_saldo = 0;

                                                    client.db.set(`moedas/${user.id}`, {
                                                        diamantes: dimas_saldo + 100
                                                    });

                                                    clearInterval(interval);
                                                }
                                                return;
                                            });
                                        }, 5000);

                                        let timeout = setTimeout(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") return;
                                                client.users.cache.get(user.id).send({
                                                    content: `Aguardamos cerca de 10 minutos, e o pagamento não foi realizado... então cancelamos a fatura.`
                                                });
                                                clearTimeout(timeout);
                                                clearInterval(interval);
                                                return;
                                            });
                                        }, 600000);
                                    });
                                };
                            });
                        } else if (i.customId == "cancelar") {
                            i.update({
                                content: `**${config.emoji_sucess} | Cancelado com sucesso.**`,
                                embeds: [],
                                components: []
                            });
                        } else if (i.customId === 'item_2') {

                            const button = new MessageButton()
                                .setCustomId('compra_item')
                                .setLabel(`Comprar item`)
                                .setStyle('SUCCESS')


                            const button_c = new MessageButton()
                                .setCustomId('cancelar')
                                .setLabel(`Cancelar`)
                                .setStyle('DANGER')

                            const row = new MessageActionRow().addComponents([button], [button_c])


                            let menu_item_2 = `**📌 Item**: \`250 Diamantes\`\n`;
                            menu_item_2 += `**💰 Valor:** \`BRL 3,50\`\n`;
                            menu_item_2 += `**✅ Forma de pagamento:** \`Pix copia e cola\``;

                            let embed = new Discord.MessageEmbed()
                                .setTitle('Informações da compra')
                                .setDescription(menu_item_2)
                                .setColor('BLUE')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/5790/5790705.png')
                                .setTimestamp()

                            i.update({
                                embeds: [embed],
                                components: [row]
                            });

                            const filter_ = i => i.user.id === user.id;
                            const collector_ = send_pv.createMessageComponentCollector({ filter: filter_, time: 150000 });

                            collector_.on("collect", async function (i) {
                                if (i.customId == "compra_item") {
                                    const payment_data = {
                                        transaction_amount: config["250_dimas_value"],
                                        description: 'mercadopagoapi',
                                        payment_method_id: 'pix',
                                        payer: {
                                            email,
                                            first_name: user.username,
                                        }
                                    }
                                    mercadopago.payment.create(payment_data).then(async function (result) {
                                        const code = result.body.point_of_interaction.transaction_data.qr_code;
                                        let pix = result;

                                        let embed = new Discord.MessageEmbed()
                                            .setTitle('Pagamento gerado')
                                            .setDescription(`**Copie o codigo abaixo**:\n\n\`${code}\`\n\n**Abra seu aplicativo de pagamentos e vá na area  PIX, chegando lá procure por "pix copia e cola" e cole o codigo e realize o pagamento**.\n\n**Guarde o numero da compra**: \`${pix.body.id}\`\n\n⚠ Se o pagamento não for realizado em até **10 Minutos** iremos descartar a compra.`)
                                            .setFooter('Assim que você efetuar oo pagamento vamos adicionar os diamantes na sua carteira.')
                                            .setColor('BLUE')
                                            .setThumbnail('https://cdn-icons-png.flaticon.com/512/925/925049.png')
                                            .setTimestamp()

                                        i.update({
                                            embeds: [embed],
                                            components: []
                                        });


                                        let interval = setInterval(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") {
                                                    let embed = new Discord.MessageEmbed()
                                                        .setTitle('Pagamento recebido !')
                                                        .setDescription(`Você acaba de comprar **${config.emoji_diamante} 250 Diamantes !**`)
                                                        .setColor('BLUE')
                                                        .setThumbnail('https://cdn-icons-png.flaticon.com/512/9132/9132953.png')
                                                        .setFooter('🤝 Obrigado por contribuir e confiar em nosso projeto.')
                                                        .setTimestamp()

                                                    client.users.cache.get(user.id).send({
                                                        embeds: [embed]
                                                    });

                                                    let dimas_saldo = await client.db.get(`moedas/${user.id}/diamantes`);
                                                    if (!dimas_saldo) dimas_saldo = 0;

                                                    client.db.set(`moedas/${user.id}`, {
                                                        diamantes: dimas_saldo + 250
                                                    });

                                                    clearInterval(interval);
                                                }
                                                return;
                                            });
                                        }, 5000);

                                        let timeout = setTimeout(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") return;
                                                client.users.cache.get(user.id).send({
                                                    content: `Aguardamos cerca de 10 minutos, e o pagamento não foi realizado... então cancelamos a fatura.`
                                                });
                                                clearTimeout(timeout);
                                                clearInterval(interval);
                                                return;
                                            });
                                        }, 600000);
                                    });
                                };
                            });
                        } else if (i.customId == "cancelar") {
                            i.update({
                                content: `**${config.emoji_sucess} | Cancelado com sucesso.**`,
                                embeds: [],
                                components: []
                            });
                        } else if (i.customId === 'item_3') {

                            const button = new MessageButton()
                                .setCustomId('compra_item')
                                .setLabel(`Comprar item`)
                                .setStyle('SUCCESS')


                            const button_c = new MessageButton()
                                .setCustomId('cancelar')
                                .setLabel(`Cancelar`)
                                .setStyle('DANGER')

                            const row = new MessageActionRow().addComponents([button], [button_c])


                            let menu_item_3 = `**📌 Item**: \`500 Diamantes\`\n`;
                            menu_item_3 += `**💰 Valor:** \`BRL 5,00\`\n`;
                            menu_item_3 += `**✅ Forma de pagamento:** \`Pix copia e cola\``;

                            let embed = new Discord.MessageEmbed()
                                .setTitle('Informações da compra')
                                .setDescription(menu_item_3)
                                .setColor('BLUE')
                                .setThumbnail('https://cdn-icons-png.flaticon.com/512/5790/5790705.png')
                                .setTimestamp()

                            i.update({
                                embeds: [embed],
                                components: [row]
                            });

                            const filter_ = i => i.user.id === user.id;
                            const collector_ = send_pv.createMessageComponentCollector({ filter: filter_, time: 150000 });

                            collector_.on("collect", async function (i) {
                                if (i.customId == "compra_item") {
                                    const payment_data = {
                                        transaction_amount: config["500_dimas_value"],
                                        description: 'mercadopagoapi',
                                        payment_method_id: 'pix',
                                        payer: {
                                            email,
                                            first_name: user.username,
                                        }
                                    }
                                    mercadopago.payment.create(payment_data).then(async function (result) {
                                        const code = result.body.point_of_interaction.transaction_data.qr_code;
                                        let pix = result;

                                        let embed = new Discord.MessageEmbed()
                                            .setTitle('Pagamento gerado')
                                            .setDescription(`**Copie o codigo abaixo**:\n\n\`${code}\`\n\n**Abra seu aplicativo de pagamentos e vá na area  PIX, chegando lá procure por "pix copia e cola" e cole o codigo e realize o pagamento**.\n\n**Guarde o numero da compra**: \`${pix.body.id}\`\n\n⚠ Se o pagamento não for realizado em até **10 Minutos** iremos descartar a compra.`)
                                            .setFooter('Assim que você efetuar oo pagamento vamos adicionar os diamantes na sua carteira.')
                                            .setColor('BLUE')
                                            .setThumbnail('https://cdn-icons-png.flaticon.com/512/925/925049.png')
                                            .setTimestamp()

                                        i.update({
                                            embeds: [embed],
                                            components: []
                                        });


                                        let interval = setInterval(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") {
                                                    let embed = new Discord.MessageEmbed()
                                                        .setTitle('Pagamento recebido !')
                                                        .setDescription(`Você acaba de comprar **${config.emoji_diamante} 500 Diamantes !**`)
                                                        .setColor('BLUE')
                                                        .setThumbnail('https://cdn-icons-png.flaticon.com/512/9132/9132953.png')
                                                        .setFooter('🤝 Obrigado por contribuir e confiar em nosso projeto.')
                                                        .setTimestamp()

                                                    client.users.cache.get(user.id).send({
                                                        embeds: [embed]
                                                    });

                                                    let dimas_saldo = await client.db.get(`moedas/${user.id}/diamantes`);
                                                    if (!dimas_saldo) dimas_saldo = 0;

                                                    client.db.set(`moedas/${user.id}`, {
                                                        diamantes: dimas_saldo + 500
                                                    });

                                                    clearInterval(interval);
                                                }
                                                return;
                                            });
                                        }, 5000);

                                        let timeout = setTimeout(async () => {
                                            let headers = { Authorization: `Bearer ${config.acess_token}` }
                                            let setings = { method: 'GET', headers: headers }
                                            let fatura_id = pix.body.id;
                                            let url = `https://api.mercadopago.com/v1/payments/${fatura_id}`;

                                            fetch(url, setings).then(res => res.json()).then(async function (json) {
                                                const fatura = json.status;
                                                if (fatura == "approved") return;
                                                client.users.cache.get(user.id).send({
                                                    content: `Aguardamos cerca de 10 minutos, e o pagamento não foi realizado... então cancelamos a fatura.`
                                                });
                                                clearTimeout(timeout);
                                                clearInterval(interval);
                                                return;
                                            });
                                        }, 600000);
                                    });
                                };
                            });
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
        } else {
            message.reply({
                embeds: [embed]
            })
        }
    } catch (error) {
        message.reply(`${config.emoji_erro} | Falha ao mostrar o saldo do usuario: ${user} :(`);
    };
};