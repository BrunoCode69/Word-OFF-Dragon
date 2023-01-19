module.exports.run = async function (client, message, args, prefix) {
    message.reply(`🏓 Meu ping é \`${client.ws.ping}ms\``);
}