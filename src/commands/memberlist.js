const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");const axios = require("axios");
const fs = require("fs");
const { JsonDatabase } = require("wio.db");
const clandb = new JsonDatabase({ databasePath: "db/clandb.json" });
const memberdb = new JsonDatabase({ databasePath: "db/memberdb.json" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memberlist")
    .setDescription("Fetch the Memberlist"),
    run: async (client, interaction) => {
    
      const messageContent = `
      This list might be outdated. If so please warn the moderators and ask them to update this list.
      `;
      let l = JSON.stringify(clandb.fetch('l'))
      let c = JSON.stringify(clandb.fetch('c'))
      let e = JSON.stringify(clandb.fetch('e'))
      let m = JSON.stringify(clandb.fetch('m'))
      console.log (c+e+m)
      const embed = new EmbedBuilder()
      .setColor(0x1975ff)
      .setTitle("OPERATION OMEGA >XI< MEMBER LIST")
      .setDescription(messageContent)
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        { name: 'Leader', value: l },
        { name: '\u200B', value: '\u200B' },
        { name: 'Co-Leader(s)', value: c, inline: true },
        { name: 'Elder(s)', value: e, inline: true },
        { name: 'Members', value:  m, inline: true }

      )
      .setFooter({ text: 'XI>> Clan member list.', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
      

      interaction.channel.send({ embeds: [embed] });
      
    }
 };
