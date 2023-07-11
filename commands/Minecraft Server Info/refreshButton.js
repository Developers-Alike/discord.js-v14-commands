const mcSchema = require('./schemas/mcstatusschema.js'); //importing the schema
const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js'); //importing from discord.js
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return; //if the interaction isnt a button: return
    if (interaction.customId === 'mc-refresh') { //if the interaction id, matches the one of the buttont we mad earlier
        const data = await mcSchema.findOne({ UserID: interaction.user.id, Guild: interaction.guild.id }); //fetching data from the db
        if (!data) {
            return interaction.reply('You have never used this command before, so no data is here to update it to your last request.') //if no data already exists, your not able to update the button, this can be good for a general used embed. change it if you dont see any need in that feature
        }
        function initServerData(serverIp) { //same as before, check the command file for documentation
            fetch(`https://mcapi.us/server/status?ip=${serverIp}`)
              .then(response => response.json())
              .then(data => {
                const button = new ButtonBuilder()
                .setCustomId('mc-refresh')
                .setLabel('Refresh')
                .setStyle(ButtonStyle.Primary)
                  const embed = new EmbedBuilder()
                  .setTitle('**Server Status**')
                  .addFields(
                    { name: '__Status:__', value: '```' + (data.online ? 'Online' : 'Offline') + '```', inline: true },
                    { name: '__Message of the day:__', value: '```' + (data.motd ? `${data.motd}` : 'not available') + '```', inline: true },
                    { name: '__Players:__', value: '```' + data.players.now + '/' + data.players.max + '```', inline: true },
                    { name: '__Server Version:__', value: '```' + data.server.name + '```', inline: true }
                  )
                  .setTimestamp()
                  .setColor('Green')
                  const row = new ActionRowBuilder().addComponents(button)
                interaction.update({ embeds: [embed], components: [row] });
              });
          }
      
          initServerData(data.ip); //calling the function
    } 
})