const Discord = require('discord.js')
const fs = require('fs');
  const db = require('quick.db');

exports.run = async (client, message, args) => {
    let kullanıcı = await db.fetch(`ksistem_${message.guild.id}`);

  if( kullanıcı == undefined){
message.reply("**Kayıt komutları kapalı açmak için o!kayıtsistemi aç**")
  }else{
      if( kullanıcı == "acik"){
if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`);
  

  
  let channel = message.mentions.channels.first()
  
    if (!channel) {
        return message.reply("Kanalı Etiketlemelisin Dostum.")
    }

  
    db.set(`kkanal_${message.guild.id}`, "<#"+channel.id+">")
  
    const embed = new Discord.RichEmbed()
    .setDescription(`Başarılı: ${channel}, kayıt olma kanalı olarak ayarlandı.`)
    .setColor("RANDOM")
    message.channel.send({embed})
}
  }
}
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['kayıt-kanal'],
    permLevel: `4`,
    kategori: "moderasyon"

}

exports.help = {
    name: 'kayıtkanalı',
    description: 'Sayaç kanalını ayarlar.',
    usage: 'sayaç-kanal-ayarla <#kanal>',

}