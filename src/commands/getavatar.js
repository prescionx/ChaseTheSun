const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getavatar")
    .setDescription("Get the avatar of specified player")
    .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("username")
      .setRequired(true)
      ),
  run: async (client, interaction) => {
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
        const userData = response.data.data[0];
        const userId = userData.id;
        const avatarUrl = await getAvatarUrl(userId);

        const embed = new EmbedBuilder()
          .setTitle(`${userData.displayName} (${username})`)
          .setThumbnail(avatarUrl)
          interaction.channel.send({ embeds: [embed] });
  
      } else {
        interaction.reply('Cant find user');
      }
    } catch (error) {
      console.error('API error ', error);
      interaction.reply('An error bbb');
    }
  }
};

async function getAvatarUrl(userId) {
  try {
    const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
    const response = await axios.get(apiUrl);
    return response.data.data[0].imageUrl;
  } catch (error) {
    console.error('Avatar error: ', error);
    return null;
  }
}
