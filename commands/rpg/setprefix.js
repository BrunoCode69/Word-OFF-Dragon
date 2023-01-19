const config = require(`../../config.json`);
module.exports.run = async function (client, message, args, prefix) {
    let db = await client.db.get(`servidores/${message.guild.id}`);
    let prefix_setado = args[0];

    if (!prefix_setado) return message.reply(`${config.emoji_erro} Desculpe... más você não definiu o prefixo, tente \`${prefix}setprefix [prefixo]\`.`);
    if (!isNaN(prefix_setado)) return message.reply(`${config.emoji_erro} O prefixo não pode ser um numero.`);

    client.db.set(`servidores/${message.guild.id}`, {
        prefix: prefix_setado.toLowerCase()
    });

    message.reply(`${config.emoji_sucess} Prefixo alterado para **\`${prefix_setado}\`** com sucesso !`);
};