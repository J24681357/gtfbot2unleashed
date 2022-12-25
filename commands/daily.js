var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "daily",
  title: "GTF Daily Workout",
  level: 4,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
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

    embed.setTitle("__GTF Daily Workout - Prize__");
    var prizes = [];

    if (stats.dailyworkout(userdata)["done"]) {
      require(gtf.EMBED).alert({ name: "❌ Invalid", description: "You have already earned your daily workout for the day.", embed: "", seconds: 5 }, msg, userdata);
      return;
    }

    if (require(gtf.EMBED).checkgarageerror(embed, msg, userdata)) {
      return;
    }
    if (stats.mileage(userdata) < 42.10) {
      var mile = ["42.1 km", "26.2 mi"]
      var m = "**Mileage: " + userdata["mileage"][userdata["settings"]["UNITS"]] + [" km", " mi"][userdata["settings"]["UNITS"]] + emote.mileage + " -> " + mile[userdata["settings"]["UNITS"]] + emote.mileage + "**"
      require(gtf.EMBED).alert({ name: "❌ Insufficient Mileage", description: "You are unable to earn your daily workout car because you have not drove " + mile[userdata["settings"]["UNITS"]] + "." + "\n" + m, embed: "", seconds: 0 }, msg, userdata);
      return;
    }

    stats.setdailyworkout(true, userdata)

    results = "🎉 " + "__** Daily Workout - " + stats.lastonline(userdata) + "**__" + " 🎉";
    var car = require(gtf.CARS).random({lowerfpp:500}, 1)[0];
    prizes.push({
      id: -1, type:"CAR", name: car["name"] + " " + car["year"], item: car, author: "DAILY WORKOUT", inventory: false });
    
    var car2 = require(gtf.CARS).random({upperfpp:500, types:["Production"]}, 1)[0];
      prizes.push( {
      id: -1, type:"CAR", name: car2["name"] + " " + car2["year"], item: car2, author: "DAILY WORKOUT", inventory: false });
    var credits = 1000 * gtftools.randomInt(5, 10)
    var credits2 = 1000 * gtftools.randomInt(15, 50)
    
    prizes.push({
      id: -1, type: "CREDITS", name: gtftools.numFormat(credits) + emote.credits, item: credits, author: "DAILY WORKOUT", inventory: false });
    prizes.push({
      id: -1, type: "CREDITS", name: gtftools.numFormat(credits2) + emote.credits, item: credits2, author: "DAILY WORKOUT", inventory: false });
    prizes = gtftools.shuffle(prizes)

    require(gtf.MARKETPLACE).fourgifts("GTF Daily Workout", results, prizes, embed, msg, userdata);
  }
};
