const Discord = require('discord.js');
const fs = require('fs');

var ayarlar = require('../config.js');

exports.run = async (client, message) => {
  
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`);

  const db = require('quick.db');
  

  
    let args = message.content.split(' ').slice(1);
    const secenekler = args.slice(0).join(' ');

    if(secenekler.length < 1)  return message.reply("o!kayıtkanalı aç yada kapat yazmalısın!");
    //if(secenekler === "aç" || "kapat") return message.channel.send(errembed);

  if (secenekler !== "aç" && secenekler !== "kapat" && secenekler !== "on" && secenekler !== "off")  return message.reply()

    if (secenekler === "aç" || secenekler === "on") {
        
    var i = db.set(`ksistem_${message.guild.id}`, "acik")
    
        message.channel.send(("!", "") + `${i.replace("acik", ":white_check_mark: Kayıt Sistemi Komutları Artık Kullanılabilir.")}`)
    
 
    };

    if (secenekler === "kapat") {
    
    db.delete(`ksistem_${message.guild.id}`)
    
        message.channel.send(":white_check_mark: Kayıt Sistemi Kapatıldı Artık Komutları da Kullanılamaz.")
    

  }
    };

    exports.conf = {
        enabled: true,
        guildOnly: false,
        aliases: ['kayıt-sistemi'],
        permLevel: `4`,
        kategori: "moderasyon"
      
      };
      
    exports.help = {
        name: 'kayıtsistemi',
        description: 'kayıt sistemi işte.',
        usage: 'kayıtsistemi <aç/kapat>',
    };
   