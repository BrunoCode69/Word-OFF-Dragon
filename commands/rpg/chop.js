const Discord = require("discord.js");
const config = require("../../config.json");
module.exports.run = async function (client, message, args, prefix) {
    let user = message.author;
    let start = await client.db.get(`start/${user.id}`);
    let db = await client.db.get(`inventario/${user.id}/itens/tools/machado`);
    let db_madeira = await client.db.get(`inventario/${user.id}/itens/tools/madeira`);
    let db_apple = await client.db.get(`inventario/itens/consumables/${user.id}/apple`);
    let durabilidade = await client.db.get(`inventario/${message.author.id}/itens/tools/machado/iten_durabilit_duraction`);
    if (!db_apple) db_apple = 0;
    if (!db_madeira) db_madeira = 0;
    if (!durabilidade) durabilidade = 0;

    let timeout_chop_15_m = (900000);
    let timeout_chop_30_m = (1, 8e+6);

    if (!start) {
        return message.reply(`Humm... não funcionou, tente \`${prefix}start\` e volte aqui.`);
    }

    if (!db) {
        return message.reply(`<:cancell:980770947571277834> Você não possui um  **${config.emoji_machado} Machado** no inventario, compre um na loja com \`${prefix}loja\`.`);
    }

    let ma = [1, 2, 3, 1, 2, 0, 0, 0, 0, 0];
    let made = [0, 2, 0, 0, 3, 0, 1, 1, 2];
    let caiu = ma[Math.floor(Math.random() * ma.length)];
    let caiu1 = made[Math.floor(Math.random() * made.length)];

    let embed = new Discord.MessageEmbed()
    embed.setTitle(`Lenhador`);
    embed.setDescription(`Você lenhou **${config.emoji_madeira} ${caiu1} Madeiras** e caíram **${caiu} ${config.emoji_apple} maçãs.**`);
    embed.setColor("BLUE");
    embed.setThumbnail("https://cdn-icons-png.flaticon.com/512/405/405584.png");
    embed.setTimestamp();
    try {
        await client.db.set(`inventario/${message.author.id}/itens/consumables/apple`, {
            item_name: "Maçã",
            item_emoji: config.emoji_apple,
            item_quantia: parseInt(db_apple) + parseInt(caiu)
        });
        await client.db.set(`inventario/${message.author.id}/itens/resources/madeiras`, {
            item_name: "Madeira",
            item_emoji: config.emoji_madeira,
            item_quantia: parseInt(db_madeira) + parseInt(caiu1)
        });
        await client.db.set(`inventario/${message.author.id}/utils/commands_time`, { chop_delay: Date.now() });
        await client.db.set(`inventario/${message.author.id}/itens/tools/machado`, { iten_durabilit_duraction: durabilidade + 1 });
        message.reply({
            embeds: [embed]
        });
    } catch (error) {
        message.reply(`Ouve uma falha ao salvar os dados... tente executar o comando novamente.`);
    };
};