const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js'); //import stuff from discord.js
const mcSchema = require('../../schemas/mcstatusschema');//import the schema file
const fetch = require('node-fetch');//importing node fetch



module.exports = {
    data: new SlashCommandBuilder()
    .setName('mc-server-info') //command name
    .setDescription('Displays server info about your server.') //command description
    .addStringOption(str => str //adding the ip option
        .setName('ip')//name of the ip option
        .setDescription('The ip of the server you want to see the status of.')//description of the ip option
        .setRequired(true)),//setting this option as required so the user cant just skip it
  async execute(interaction) {
    const ipop = interaction.options.getString('ip'); //getting the value of the ip option that has been entered by the user
    const data = await mcSchema.findOne({ UserID: interaction.user.id, Guild: interaction.guild.id });//find data in the database
    if (data) {//if data already exists: overwrite data with new data
        await mcSchema.findOneAndDelete({ UserID: interaction.user.id, Guild: interaction.guild.id });
        await mcSchema.create({ ip: ipop,UserID: interaction.user.id, Guild: interaction.guild.id })
      } else if (!data) {
        await mcSchema.create({ ip: ipop,UserID: interaction.user.id, Guild: interaction.guild.id }) //handling the first time this command is used by a new user
      }
    function initServerData(serverIp) { //getting the server info and sending it
        fetch(`https://mcapi.us/server/status?ip=${serverIp}`) //fetch it from the api
          .then(response => response.json()) //convert the response to json
          .then(data => { 
            if (data.server.name === null) { //server name does not exist, reply with the specified message saying that it either doesnt exist or is offline
                interaction.reply('This server is either offline or you provided an invalid adress.') }
            
            else {
            const button = new ButtonBuilder()//create a new button
            .setCustomId('mc-refresh')//setting the id of the button
            .setLabel('Refresh')//text displayed on the button
            .setStyle(ButtonStyle.Primary)//setting the color blue
              const embed = new EmbedBuilder()//creating a new embed
              .setTitle('**Server Status**')//setting the title
              .addFields( //add all the different fields
                { name: '__Status:__', value: '```' + (data.online ? 'Online' : 'Offline') + '```', inline: true }, 
                { name: '__Message of the day:__', value: '```' + (data.motd ? `${data.motd}` : 'not available') + '```', inline: true },
                { name: '__Players:__', value: '```' + data.players.now + '/' + data.players.max + '```', inline: true },
                { name: '__Server Version:__', value: '```' + data.server.name + '```', inline: true }
              )
              .setTimestamp() //make a little timestamp that the bottom of our embed
              .setColor('Green') //set the embed color to green
              const row = new ActionRowBuilder().addComponents(button)// creating a new row so the button can be sent
            interaction.reply({ embeds: [embed], components: [row] });} //sending the embed and the button
          });
      }
      

      
    initServerData(ipop); //calling the function
  },
};