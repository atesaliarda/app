const Discord = require("discord.js")

exports.run = (client, message, args) => {
  message.delete()

  var embed = new Discord.RichEmbed()

.setTitle(`Oil Bot Bilgi ` ,message.author.avatarURL)
.addField(`Sahip`, `<@290922519769382913>`,true) //imdatt efe dc bak bi haa burda niye hata var
.addField(`Kodlayan`,`<@290922519769382913>`,true)
.addField(`Geliştiricisi`,`<@290922519769382913>`,true)
.setColor("GREEN")
.setThumbnail(client.user.avatarURL) // şş saşlkda guild
.addField(`Sunucu Sayısı`,client.guilds.size,true) // bu varmı böyle bişe hm unutum 1 dk
.addField(`Kullanıcı Sayısı`,client.users.size,true) // nası ya sldak neydi ?
.addField(`Komut Sayısı`,client.commands.size,true)
.addField(`Discord.js Versiyon`,Discord.version,true)
.addField(`Bot ID`,client.user.id,true) //cilent olan herşey botla ilgimi ? timam
.setDescription(`**[Destek Sunucusu !](https://discord.gg/NzXJPer) [Web Panel!](https://oilbot.glitch.me) [Bot Davet !](https://discordapp.com/oauth2/authorize?client_id=601707719375978496&scope=bot&permissions=2146958847)  <a:red:572163715139371020> [Bota Oy Ver !](https://discordbots.org/bot/559720149175894038/vote)**`)
.setTimestamp()
.setFooter(`${message.author.username} | Tarafından Kontrol Ediliyor..`, message.author.avatarURL )
message.channel.sendEmbed(embed)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yapıcı"],
  permLevel: 0,
  kategori: "genel",
};

exports.help = {
  name: 'yapımcım',
  description: 'Bot Yapımcısını Gösterir.',
  category: 'genel',
  usage: 'test'
};