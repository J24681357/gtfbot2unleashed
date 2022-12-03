var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "restart",
  title: "GTF Bot Restarter",
  cooldown: 3,
  level: 0,
  aliases: ["re"],
  channels: ["gtf-mode", "testing"],

  delete: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  description: ["!restart - (ADMIN ONLY) Restarts the GT Fitness Bot."],
  level: 0,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: false,
      footer: "**❓ The red point would be the starting point.**",
      image: [],
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (userdata["id"] != "237450759233339393") {
        require(gtf.EMBED).alert({ name: "❌ Error", description: "This command is for adminstrators only.", embed: embed, seconds: 0 }, msg, userdata);
        return
    }
    var results = " ";
    results = "__**The GT Fitness bot is restarting....**__";
    embed.setDescription(results);
    require(gtf.DISCORD).send(msg, {embeds:[embed]}, next)
    
    function next(msg) {
      process.exit(1);
    }
  },
};
