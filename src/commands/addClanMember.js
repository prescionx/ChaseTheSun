const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { JsonDatabase } = require("wio.db");
const clandb = new JsonDatabase({ databasePath: "db/clandb.json" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addclanmember")
    .setDescription("Add a clanmember to the Database")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The target username, not displayname.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("please use m for member, e for elder and c for co-leader")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const resp = interaction.options.getString("username");
    const role = interaction.options.getString("role");

    if (!interaction.member.roles.cache.has("1216057007107211425")) {
      interaction.reply(`${interaction.member.username} You cant do this :C`);
    } else {

        try {
            const apiUrl = 'https://users.roblox.com/v1/usernames/users';
            const username = interaction.options.getString('username');
      
            const requestBody = {
              usernames: [username],
              excludeBannedUsers: false
            };
      
            const response = await axios.post(apiUrl, requestBody, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
      
            if (response.data.data.length > 0) {
             
      if (!role || !['m', 'e', 'c'].includes(role) || role.length > 1) {
        interaction.reply(`Please use **m** for Member, **e** for Elder and **c** for Co-leader`);
    } else {
        clandb.push(`members`, resp);
        if      (role == "m") {  clandb.push(`m`, resp);}  
        else if (role == "e") {  clandb.push(`e`, resp);}  
        else if (role == "c") {  clandb.push(`c`, resp);}  
        interaction.reply("**"+ resp + "** added as "+role);
      
    }
        
            } else {
              interaction.reply('Check the username again.');
            }
          } catch (error) {
            console.error('API isteği sırasında hata oluştu: ', error);
            interaction.reply('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
          }

    
    }
  },
};
