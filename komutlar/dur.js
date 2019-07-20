const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyDSiyHBWZI9dDZBWXloNVhrHbpzTTfa0L8');


exports.run = async (client, message, args) => {
    const queue = client.queue;
      const db = require('quick.db');
  client.queue = new Map()

  
  if (db.has(`premium_${message.guild.id}`) === false) {
    let e = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription("Bu komutu kullanabilmeniz için Premium modun aktif olması gerek!")
    .addField("Premium Nasıl Aktif Edilir? (Merak etmeyin paralı değil)", "Sunucunuzda botun kullandığınız her komutu sunucunuza puan kazandırmaktadır. Sunucunuz 50 puana ulaştığında Premium otomatik olarak aktif edilecek, sunucu sahibine özel mesaj olarak ve Sunucu seviyesini 50 puan yapan 50 puan için son komutun kullanıldığı kanala bildirilecektir.")
    .addField("Sunucu Puanını Nerden Göreceğim?", "`o!sunucu-bilgi` veya `o!premium puan` yazarak görebilirsiniz.")
    message.channel.send(e)
    return
  }
    
    var searchString = args.slice(0).join(' ');
    var url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);

    var voiceChannel = message.member.voiceChannel;
        
    const err1 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!voiceChannel) return message.channel.send(err1);
    const err2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err2);
    const songEnd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla durduruldu ve odadan ayrıldım!`)
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('müzik bitti');
    message.channel.send(songEnd);
};

exports.conf = {
    enabled: true,
    aliases: ['stop'],
    permLevel: 0,
   kategori: "müzik"
};

exports.help = {
    name: 'dur',
    description: 'Oynatılan/çalan şarkıyı kapatır. (PREMIUM)',
    usage: 'durdur'
};