const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function sendReactionRole(client, roles) {
    const channel = await client.channels.cache.get(process.env.reactionChannelId);
    if (!channel) return;

    const rows = [];
    let row = new ActionRowBuilder();

    roles.forEach((id, index) => {
        if (index % 5 === 0 && index !== 0) { // Every 5 entries, start a new row
            rows.push(row);
            row = new ActionRowBuilder();
        }
        let role = channel.guild.roles.cache.find(role => role.id === id);
        row.addComponents(
            new ButtonBuilder().setCustomId(id).setLabel(role.name).setStyle(ButtonStyle.Primary)
        );
    });

    rows.push(row); // Push the last row even if it's not full

    // Fetch messages
    const messages = await channel.messages.fetch({ limit: 100 });
    const now = Date.now();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;

    // Separate messages into those that can be bulk deleted and those that need individual deletion
    const bulkDeletableMessages = messages.filter(msg => now - msg.createdTimestamp < fourteenDays);
    const oldMessages = messages.filter(msg => now - msg.createdTimestamp >= fourteenDays);

    // Bulk delete messages that are less than 14 days old
    if (bulkDeletableMessages.size > 0) {
        await channel.bulkDelete(bulkDeletableMessages);
    }

    // Individually delete messages that are 14 days or older
    for (const msg of oldMessages.values()) {
        await msg.delete();
    }

    await channel.send({ content: "Claim or remove a role", components: rows });
}

module.exports = sendReactionRole;