const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");const axios = require("axios");
const fs = require("fs");
const { JsonDatabase } = require("wio.db");
const clandb = new JsonDatabase({ databasePath: "db/clandb.json" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("friends")
    .setDescription("Check friend list")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("username")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    try {
      const apiUrl = "https://users.roblox.com/v1/usernames/users";
      const username = interaction.options.getString("username");

      const requestBody = {
        usernames: [username],
        excludeBannedUsers: false,
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data.length > 0) {
        const userData = response.data.data[0];
        console.log(userData)
        const userId = userData.id;

        const apiEndpoint =
          "https://friends.roblox.com/v1/users/" + userId + "/friends/";

        try {
          const apiCevap = await axios.get(apiEndpoint);
          const cevap = apiCevap.data.data;


          const kullanicilar = cevap.map((item) => item.name);

          const dbresp = clandb.fetch("members");

          let added = 0;
          let notadded = 0;
          let messageContent = "";
          
          dbresp.forEach((eleman) => {
            if(eleman == username) {
              messageContent += `**${eleman}** is player himself/herself. Skipping... ❗\n`;
            }
              else if (kullanicilar.includes(eleman)) {
                  messageContent += `**${eleman}**: is added. ✅\n`;
                  added++;
              } else {
                  messageContent += `**${eleman}**: is NOT added. ❌\n`;
                  notadded++;
              }
          });
          
          messageContent += `\n\nYou added **${added}** members, **${notadded}** members not yet added`
          messageContent += `Try using /userlist to fetch current members list.`
       
          

          const embed = new EmbedBuilder()
          .setColor(0x1975ff)
          .setTitle(username)
          .setDescription(messageContent)
          .setThumbnail(await getAvatarUrl(userId))
          .setFooter({ text: 'XI', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

          interaction.channel.send({ embeds: [embed] });
          


        } catch (error) {
          console.error("API isteği sırasında bir hata oluştu:", error);
        }
      } else {
        interaction.reply("Username is incorrect.");
      }
    } catch (error) {
      console.error(error);
      interaction.reply("Bir hata oluştu.");
    }
  },
};


async function getAvatarUrl(userId) {
  try {
    const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
    const response = await axios.get(apiUrl);
    return response.data.data[0].imageUrl;
  } catch (error) {
    console.error('Avatar alınırken hata oluştu: ', error);
    return null;
  }
}