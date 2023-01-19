const Discord = require("discord.js");
module.exports.run = async (client, message, args, prefix) => {
    message.reply(`help\nbag\nperfil\nchop\nsaldo\nstart\nloja`);
};

module.exports.conf = {
    aliases: ['help']
}