const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { JsonDatabase } = require("wio.db");
const clandb = new JsonDatabase({ databasePath: "db/clandb.json" });
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeclanmember")
    .setDescription("Remove a clanmember from the Database")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The target username, not displayname.")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has("1216057007107211425")) {
      interaction.reply(`${interaction.member.username} You cant do this :C`);
    } else {
      const resp = interaction.options.getString("username");
      const dosyaYolu = "db/clandb.json";
      const fs = require("fs");

      fs.readFile(dosyaYolu, "utf8", (hata, veri) => {
        try {
          if (hata) throw hata;

          // JSON verisini bir JavaScript nesnesine dönüştür
          const jsonVeri = JSON.parse(veri);
          console.log(veri)

          // Hem "members" hem de "e" dizilerinden silinecek satırı bulun
          const silinecekSatirIndexMembers = jsonVeri.members.indexOf(resp);
          const silinecekSatirIndexM = jsonVeri.m.indexOf(resp);
          const silinecekSatirIndexE = jsonVeri.e.indexOf(resp);
          const silinecekSatirIndexC = jsonVeri.c.indexOf(resp);

          // "members" dizisindeki satırı silin
          if (silinecekSatirIndexMembers !== -1) {
            jsonVeri.members.splice(silinecekSatirIndexMembers, 1);
          }

          // "m" dizisindeki satırı silin
          if (silinecekSatirIndexM !== -1) {
            jsonVeri.m.splice(silinecekSatirIndexM, 1);
          }
          // "e" dizisindeki satırı silin
          if (silinecekSatirIndexE !== -1) {
            jsonVeri.e.splice(silinecekSatirIndexE, 1);
          } 
          // "c" dizisindeki satırı silin
          if (silinecekSatirIndexC !== -1) {
            jsonVeri.c.splice(silinecekSatirIndexC, 1);
          }
          // Düzenlenmiş JSON verisini dosyaya yaz
          fs.writeFile(
            dosyaYolu,
            JSON.stringify(jsonVeri, null, 2),
            "utf8",
            (hata) => {
              if (hata) throw hata;
             interaction.reply(`${resp} DB'den silindi.`);
            }
          );
        } catch (hata) {
          console.error("Bir hata oluştu:", hata);
        }
      });
    }
  },
};
