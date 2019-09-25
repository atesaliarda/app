const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const Discord = require('discord.js')
const GOOGLE_API_KEY = "AIzaSyCY3Cuwh6UxLKNCJwf-6Yd7F5g3w3cQ2YQ"
const youtube = new YouTube("AIzaSyCY3Cuwh6UxLKNCJwf-6Yd7F5g3w3cQ2YQ");
const { Client, Util, RichEmbed, Message } = require('discord.js');
const queue = new Discord.Collection();
var ayarlar = require('../config.js');
var prefix = ayarlar.prefix;


module.exports.run = async (bot, msg, args) => {
    const db = require('quick.db');
  
  if (db.has(`premium_${msg.guild.id}`) === false) {
    let e = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription("Bu komutu kullanabilmeniz için Premium modun aktif olması gerek!")
    .addField("Premium Nasıl Aktif Edilir? (Merak etmeyin paralı değil)", "Sunucunuzda botun kullandığınız her komutu sunucunuza puan kazandırmaktadır. Sunucunuz 50 puana ulaştığında Premium otomatik olarak aktif edilecek, sunucu sahibine özel mesaj olarak ve Sunucu seviyesini 50 puan yapan 50 puan için son komutun kullanıldığı kanala bildirilecektir.")
    .addField("Sunucu Puanını Nerden Göreceğim?", "`o!sunucu-bilgi` veya `o!premium puan` yazarak görebilirsiniz.")
    msg.channel.send(e)
    return
  }
  
  
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
  
  if(`${args[0]}` == `queue`){
    
    if (!serverQueue) return msg.channel.send({ embed: { description: 'Çalan Şarkı Yok.'}});
    let index = 0;
var queueembed = new RichEmbed() 
.setColor('RANDOM') 
.setTitle('Şarkı Kuyruğu') 
.setDescription(`${serverQueue.songs.map(song => `**${++index}.** ${song.title}`).join('\n')}`) 


return msg.channel.send(queueembed)
  }
  
  if(`${args[0]}` == `döngü`){
		if(!serverQueue) return msg.channel.send('❌ | Şu anda şarkı çalmıyor!');
		if(!msg.channel.send) return msg.channel.send('❌ | Şarkı Kuyruğunu döngüye almak için kanala girmelisin!');
		serverQueue.loop = !serverQueue.loop;
		return msg.channel.send(`✅ | ${serverQueue.loop ? 'loop' : 'unloop' } current queue`);
    
  }
    
    
  
  
  if(`${args[0]}` == `duraklat`){
    if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send({ embed: { description: '⏸ Müzik Duraklatıldı!'}});
		}
		return msg.channel.send({ embed: { description: 'Müzik Tekrar başladı.'}});
  }
  
  if(`${args[0]}` == `devamet`){
    
    if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send({ embed: { description: '▶ Şov devam ediyor!'}});
		}
		return msg.channel.send({ embed: { description: 'Müzik Tekrar Başladı.'}});
  return undefined;
}

  if(`${args[0]}` == `çal`){
    const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send({ embed: { description: 'Lütfen Herhangi Bir Ses Kanalına Gir!'}});
    if (!args[1]) return msg.channel.send({ embed: { color: 'RANDOM', description: `*Doğru kullanım*: **${prefix}müzik çal** ***[Şarkı İsmi]/[Video URL]/[Çalma Listesi URL]***`}});
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send({ embed: { description: 'Bağlanma Yetkim Yok.'}});
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send({ embed: { description: 'Konuşma Yetkim Yok!'}});
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send({ embed: { description: `✅ Playlist: **${playlist.title}** has been added to the queue!`}});
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					
 var selectembed = new RichEmbed()
 .setColor('RANDOM') 
 .setTitle('Müzik Seç')
 .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`) 
 .setFooter('Lütfen Dinlemek İstediğin Şarkının Numarasını Yaz 1-10') 
 
let msgtoDelete = await msg.channel.send({ embed: selectembed})
					
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 30000,
							errors: ['time']
						});
            msgtoDelete.delete();
					} catch (err) {
						console.error(err);
						const noPick = new RichEmbed()
            .setDescription("Hiçbir Şarkı Seçilmedi Şarkı Seçimi İptal Edildi.")
            .setColor('RANDOM')
            msg.channel.send({embed: noPick});
            msgtoDelete.delete()
            return;
					}
          
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 Arama sonucu bulunamadı.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
}
  if(`${args[0]}` == `oynat`){
    const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send({ embed: { description: 'Lütfen Herhangi Bir Sesli Kanala Gir!'}});
    if (!args[2]) return msg.channel.send({ embed: { color: 'RANDOM', description: `*Correct usage is*: **${prefix}play** ***[Song Name]/[Video URL]/[Playlist URL]***`}});
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send({ embed: { description: 'I cannot connect to your voice channel, make sure I have the proper permissions!'}});
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send({ embed: { description: 'I cannot speak in this voice channel, make sure I have the proper permissions!'}});
		}
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}

    let info = await ytdl.getInfo(args[2]);
    let title = await ytdl.getTitle(args[2]);
    let channeltitle = await ytdl.getChannelTitle
    let connection = await msg.member.voiceChannel.join();
    let dispatcher = await connection.play(ytdl(args[2], {
        filter: 'audioonly'
    }));
    return msg.channel.send({ embed: { description: `✅ Playlist: **${playlist.title}** has been added to the queue!`}});
}
  }
  if(`${args[0]}` == `geç`){
    if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'Lütfen Sesli Kanala Giriş Yap!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'Şuan Şarkı Çalmıyor.'}});
		serverQueue.connection.dispatcher.end('Şarkı Geçildi!');
		return undefined;
  }
  if(`${args[0]}` == `ga`){
		if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing that I could skip for you.'}});
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
  }
  if(`${args[0]}` == `durdur`){
    if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'Lütfen Bir Sesli Kanala Gir!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'Şuan Şarkı Çalmıyor.'}});
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Şarkı Durduruldu!');
		return msg.channel.send({ embed: { color: 'RANDOM', description: 'M!'}});
  }
  if(`${args[0]}` == `ses`){
    if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'Lütfen sesli bir kanala gir!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'Şuan Şarkı Çalmıyor!'}});
    var botRoleColorSync = msg.guild.member(bot.user).highestRole.color;
		if (!args[1]) return msg.channel.send({embed: { color: 'RANDOM',  description: `The current volume is: **${serverQueue.volume}**%`}});
		serverQueue.volume = args[1];
    if (args[1] > 100) return msg.channel.send({ embed: { description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
    serverQueue.volume = args[1];
    if (args[1] > 100) return !serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) +
    msg.channel.send({ embed: { description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
 
    if (args[1] < 101) return serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) + msg.channel.send({ embed: { description: `Ses Seviyesi Ayarlandı Ses Seviyesi: __**${args[1]}**%__`}});
	}
 if(`${args[0]}` == `kuyruk`){
   
   if(!serverQueue) return msg.channel.send({ embed: { color: 'RANDOM', description:'Şuan Şarkı Çalmıyor'}});
  const duration = (serverQueue.songs[0].duration.minutes*60000) + ((serverQueue.songs[0].duration.seconds%60000)*1000);
  const persentase = serverQueue.connection.dispatcher.time/duration;
  const curentDurationMinute = Math.floor(serverQueue.connection.dispatcher.time/60000) < 10 ? `0${Math.floor(serverQueue.connection.dispatcher.time/60000)}` : Math.floor(serverQueue.connection.dispatcher.time/60000);
  const currentDurationSeconds = Math.floor((serverQueue.connection.dispatcher.time%60000)/1000) < 10 ? `0${Math.floor((serverQueue.connection.dispatcher.time%60000)/1000)}` : Math.floor((serverQueue.connection.dispatcher.time%60000)/1000);
  const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
  
  const emb = new RichEmbed()
  .setColor('RANDOM')
  .setAuthor(serverQueue.songs[0].author.tag, serverQueue.songs[0].author.avatarURL)
  .setTitle(serverQueue.songs[0].title)
  .setURL(serverQueue.songs[0].url)
  .setThumbnail(serverQueue.songs[0].thumbnail)
  .setDescription(`${progressBar(persentase)} \n\`[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]\`🔊`);
  
  return msg.channel.send('🎶 **Şuan Çalıyor...**', { embed: emb});
};

function progressBar(percent){
	let num = Math.floor(percent*15);
	if(num === 1){
		return '🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 2){
		return '▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 3){
		return '▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 4){
		return '▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 5){
		return '▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 6){
		return '▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬';
	}else if(num === 7){
		return '▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬';
	}else if(num === 8){
		return '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬';
	}else if(num === 9){
		return '▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬';
	}else if(num === 10){
		return '▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬';
	}else if(num === 11){
		return '▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬';
	}else if(num === 12){
		return '▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬';
	}else if(num === 13){
		return '▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬';
  }else if(num === 14){
		return '▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬';
  }else if(num === 15){
		return '▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘';
  }else{
		return '▬▬LIVE or NOT▬▬';
  } 
}
  async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	//console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`, 
    durationh: video.duration.hours,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
    duration: video.duration,   
    mamang: msg.member.voiceChannel.name, 
    meminta: msg.author,
    loop: video.loop,
    channel: video.channel.title,
    author: msg.author};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [song],
			volume: 100,
      loop: true,
			playing: true,
      connection: null
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send({ embed: { description: `I could not join the voice channel: ${error}`}});
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
  
var adedembed = new RichEmbed() 

  .setColor('RANDOM')
  .setAuthor(`Kuyruğa Eklendi`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Şarkı İsmi', `__[${song.title}](${song.url})__`, true)
  .addField('Kanal', `${video.channel.title}`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Şarkı Süresi", `${song.durationh}hrs ${song.durationm}mins ${song.durations}secs`, true)
  .addField('Şarkıyı Açan', `${song.meminta}`)
  .setTimestamp();
		
 return msg.channel.send(adedembed);
	}
	return undefined;
}

function play(guild, song, msg) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
var pleyembed = new RichEmbed() 

  .setColor('RANDOM')
  .setAuthor(`Şimdi Oynatılıyor`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Şarkı İsmi', `__[${song.title}](${song.url})__`, true)
  .addField('Kanal', `${video.channel.title}`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Ses Seviyesi", `${serverQueue.volume}%`, true)
  .addField("Şarkıyı Süresi", `${song.durationh}hrs ${song.durationm}mins ${song.durations}secs`, true)
  .addField('Şarkı Kanalı', `**${song.mamang}**`)
  .addField('Şarkıyı Açan', `${song.meminta}`)
  .setFooter("Eğer şarkıyı duyamıyorsanız kanaldan çıkıp tekrar girin, hala çalmıyorsa bot çalışmalardan dolayı reset yemiş olabilir!")
  .setTimestamp();

	serverQueue.textChannel.send(pleyembed);
  
}
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['m'],
    permLevel: 0,
    kategori: "müzik",
 } 
  
exports.help = {
    name: "müzik",
    description: "Müzik dinlemenizi sağlar.",
    usage: "o!müzik çal, o!müzik durdur, o!müzik geç"

}