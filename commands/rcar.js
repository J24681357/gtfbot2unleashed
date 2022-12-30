var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "rcar",
  title: "GT Fitness Car Randomizer",
  cooldown: 5,
  license: "N", level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],
  license: "N", aliases: ["rc", "rcar"],

  delete: false,
  requirecar: false,
  availitoeveryone: true,
  availinmaint: true,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  description: [],
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

    var filter = {}
    if (typeof query["options"] === "undefined") {
      query["options"] = "show"
    }
    if (query["options"] == "info") {
        
      embed.setTitle( " __GTF Car Randomizer: Info__");
      require(gtf.CARS).stats(embed)
      require(gtf.DISCORD).send(msg, {embeds: [embed]});
      return;
  }

    if (typeof query["type"] !== 'undefined') {
      filter["types"] = [query["type"]]
      embed.setTitle("__**" + query["type"] + "**__")
    }

    var car = require(gtf.CARS).random(filter, 1)[0];
    var imagestyle = 0
    var extra = ""
    if (car["image"].length >= 2) {
      var choose = ["A", "B", "B", "B","B", "B","B","B","B", "B"]
      if (choose[Math.floor(Math.random() * choose.length)] == "A") {
        imagestyle = require(gtf.MATH).randomInt(1, car["image"].length - 1)
        extra = " | `⭐" + imagestyle + "`" 
      } else {
        imagestyle = 0
      }
    }
    var progress = "⬜";
    var progressb = "⬛";
    var bar = [progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb]; 
    var fpp = require(gtf.PERF).perf(car, "DEALERSHIP")["fpp"];
    var xfpp = 100

    for (var i = 0; i < bar.length; i++) {
      if (fpp >= xfpp) {
        xfpp = xfpp + 100
        bar[i] = progress;
      }
    }
    embed.setDescription(emote.gtflogo + " **" + car["name"] + " " + car["year"] + "** " + gtftools.toEmoji(car["country"]) + " `" + car["type"] + "`\n" + require(gtf.MATH).numFormat(car["power"]) + " hp | " + require(gtf.MATH).numFormat(car["weight"]) + " lbs | " + car["drivetrain"] + " | " + car["engine"] + " " + extra + "\n" + "**Performance:** " + bar.join(""));
    embed.setImage(car["image"][imagestyle]);

      var emojilist = [
  { emoji: emote.google, 
  emoji_name: "google", 
  name: 'Car Info', 
  extra: "https://www.google.com/search?q=" + car["name"].replace(/ /ig, "+") + "+" + car["year"],
  button_id: 0 }
      ]
var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
    require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons});
  },
};
