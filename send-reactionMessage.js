require("dotenv").config();

const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const roles = require("./roles.json");

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers
] });

client.on("ready", async (client) => {
  try {
    const channel = await client.channels.cache.get("reactionChannelID");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
        row.components.push(
            new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
        );
    });

    await channel.send({ content: "Claim or remove a role", components: [row] });

    process.exit()

  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.token)