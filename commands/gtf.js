var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "gtf",
  title: "GTF Facts",
  license: "N", level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],
  
  availinmaint: true, 
  requirecar: false,
  requireuserdata: false,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: false,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var facts = [
      "GT Fitness (or GTF) was first announced on May 23th, 2016, where Kazunori explained about the FitnessGram Pacer Test feature for the game.",
      "In a PlayStation conference about GT Sport, Kazunori suddenly talked about GT Fitness instead, because it's his favorite in the Gran Turismo series.",
      "During E3 2017, Kazunori announced the GT Fitness World Cup where players would participate in 24 hour races for all tracks.",
      '"Join the Fitness Race" is the current motto for GT Fitness.',
      "Mirror System - Fitness Psychedelic was the first song released exclusively for GT Fitness.",
      "In 2017, Kazunori partnered up with J24681357 to include a GT Fitness expansion pack for GT Sport.",
      "GT Fitness was delayed 3 times during the 2016-2018 period.",
      "GT Fitness was released on March 4th, 2018.",
      "GT Fitness: Tsukuba Circuit was the first DLC released for GT Fitness featuring challenges with the Nissan GT-R NISMO '17 in Tsukuba Circuit.",
      "GT Fitness: One Lap Wonders was the second DLC released for GT Fitness with challenges to finish under 1 lap.",
      "The 1968 Fiat 500 F Gr.3 is hidden in the GT Fitness game files.",
      "Fitness Path Editor is the #1 song of the 2018 music charts, exclusively in GT Fitness.",
      "The GT Fitness expansion pack includes unique blue and grey styled liveries for multiple cars in GT Sport.",
      "The Porsche 911 GT3 RS (991) '16 does not have a GTF livery due to licensing issues.",
      "GT Fitness features over 8 levels of intense driving challenges for GT Sport players.",
      "J24681357's YouTube Club was first created on March 19th, 2017, but Kazunori forced J24681357 to refine it into a GT Fitness club.",
      "GT Fitness is actually a fake game.",
      "GT Fitness includes rain, storm, and hail weather for all tracks because J24681357 says so.",
      "Each GT Fitness car has fox plushies on the back seats.",
      "GT Fitness has no micro-transactions for GTF cars, as promised.",
      "GT Fitness will have micro-transactions in the future, because of low sales in Q2 2018.",
      "GT Fitness was a brilliant idea made by J24681357 in 2016, but was stolen by Kazunori during the same year.",
      "The Top Gear Test Track is hidden in the GT Fitness game files.",
      "The Toyota Supra SZ-R '97 is hidden in the GT Fitness game files with no interior.",
      "Kazunori wanted a Nissan GT-R GT3 with a GTF livery, but that would make no sense.",
      'In the gameplay of GT Fitness, every sector beep and the START sound are replaced with the earrape version of the Windows 2000 "Ding" sound.',
      "Kazunori regretted GT Fitness after it was rated 5/10 from IGN.",
      "Kazunori added micro-transactions for GT Sport on July 30th, 2018, in support of implementing more DLC for GT Fitness.",
      "On January 25th, 2019, the GT Fitness Challenges has been shut down due to lack of activity and lack of memes.",
      "J24681357 has a massive addiction to foxes.",
      "In 2019, all of the custom commands in GT Fitness has been moved to Botisimo, leaving MEE6 and Dyno very lonely.",
      "GT Fitness is going to shut down tomorrow.",
      "In GT Fitness, the level up system are based on the licenses you earn from Gran Turismo 5.",
      "The J License (J24681357's first initial) is the most epic license you can earn exclusively in GT Fitness.",
      "The J2 License is the most epic license you can earn, not the J License.",
      "Kart Space III is hidden in the GT Fitness game files.",
      "The ending credits for GT Fitness features Kazunori staring at you for 20 minutes.",
      "GT Fitness 2 is coming to E3 2019.",
      "GT Fitness 2 is never coming out.",
      "<@353693890714402816> was the first administrator of GT Fitness.",
      "<@293180128568147969> was the first moderator of GT Fitness.",
      "The Nissan GT-R V-Spec '09 is hidden in the GT Fitness game files, imported from Gran Turismo PSP.",
      "There is a hidden nitro button in GT Fitness that boosts your car's top speed to over 999 MPH.",
      "The GT Fitness July Update in July 2019 features a new GTF livery of the Toyota Sports 800 '65.",
      "Botisimo, a former bot to use for custom GTF commands, has been removed on December 5, 2019 in replacement for a new GTF bot.",
      "Jay The Fox, J24681357's pet, is the mascot of GT Fitness.",
      "Igor Fraga won first place in the 2019 GT Fitness World Tour Nations Finals after ramming all drivers off road in Interlagos.",
      "In 2019, monthly GTF Photo Contests, hosted by <@353693890714402816>, featured scenic themes from multiple racing games.",
      "Do not give Jay The Fox a cheesecake.",
      "<#327526878791598080> initially contained announcements/updates for the servers.",
      "In 2019, monthly GTF Photo Contests, hosted by <@353693890714402816>, featured themes from multiple racing games.",
      "A GTF Course Maker is hidden in the GTF game files.",
      "On January 25, 2020, <@353693890714402816> stepped down as administrator for GTF.",
      "On August 4th, 2019, the table meme from GT Fitness has been emerged.",
      "<#348854157698138112> was created on August 20th, 2017.",
      "The 2021 GT Fitness World Tour is the first event in which players drive across 10 different countries to race each other.",
      "Gran Turismo 7 is coming in 2022.",
      "GT Fitness 2 is coming to the PS5.",
    ];
    var rfact = facts[Math.floor(Math.random() * facts.length)];
    embed.setDescription(emote.gtflogo + " **" + rfact + "**");
    //embed.setDescription("[Guide](https://discordjs.guide/ 'optional hovertext')");
     require(gtf.DISCORD).send(msg, {embeds:[embed]})
  },
};
