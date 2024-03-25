const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const { prefix, owner, token } = require("./config.js");
const { readdirSync } = require("fs")
const  moment   = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

//command-handler
const commands = [];
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`${client.user.username} Aktif Edildi!`);

 
   

})



//event-handler
const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
//

client.login(token)



client.on('guildMemberAdd', member => {
    const sunucu = client.guilds.cache.get(member.guild.id);
    const kanal2 = sunucu.channels.cache.get('1221205396220280925');
    const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('New Member Joined')
    .setDescription(`Helloo!, ${member}!`)
    .addFields(
        { name: 'Username', value: `${member.user.username}${member.user.displayName}`, inline: true },
        { name: 'Join Date', value: member.user.createdAt.toDateString(), inline: true },
        { name: 'ID:', value: member.user.id, inline: false },
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
//    .setImage(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
   
sunucu.channels.cache.get('1221827736822349857').send({ embeds: [embed] });
sunucu.channels.cache.get('1216057048169447454').send({ embeds: [embed] });
member.roles.add('1221832648113262632')
    setTimeout(() => {
        kanal2.setName(`LastJoin ${member.displayName}`).catch(console.error);
    }, 1000);


});

client.on('guildMemberRemove', member => {
    const sunucu = client.guilds.cache.get(member.guild.id);
    const kanal2 = sunucu.channels.cache.get('1221207424984416328');

    const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Member left')
    .setDescription(`Byee :c, ${member}!`)
    .addFields(
        { name: 'Username', value: `${member.user.username}${member.user.displayName}`, inline: true },
        { name: 'Join Date', value: member.user.createdAt.toDateString(), inline: true },
        { name: 'ID:', value: member.user.id, inline: true },
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
//    .setImage(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
   

// İlgili kanala embed'i gönder
sunucu.channels.cache.get('1221827736822349857').send({ embeds: [embed] });


    setTimeout(() => {
        kanal2.setName(`LastLeave ${member.displayName}`).catch(console.error);
    }, 1000);
});
