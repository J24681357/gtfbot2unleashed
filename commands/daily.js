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

    if (userdata["dailyworkout"]) {
      require(gtf.EMBED).alert({ name: "❌ Invalid", description: "You have already earned your daily workout for the day.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }

    if (require(gtf.EMBED).checkgarageerror(embed, msg, userdata)) {
      return;
    }

    if (parseFloat(stats.mileage("KM", false, userdata)) < 42.1 && parseFloat(stats.mileage("MI", false, userdata)) < 26.2) {
      var mile = ["42.1 km", "26.2 mi"]
      var m = "**Mileage: " + userdata["mileage"][userdata["settings"]["MILEAGE"]] + [" km", " mi"][userdata["settings"]["MILEAGE"]] + emote.mileage + " -> " + mile[userdata["settings"]["MILEAGE"]] + emote.mileage + "**"
      require(gtf.EMBED).alert({ name: "❌ Insufficient Mileage", description: "You are unable to earn your daily workout car because you have not drove " + mile[userdata["settings"]["MILEAGE"]] + "." + "\n" + m, embed: "", seconds: 0 }, msg, userdata);
      return;
    }

    userdata["dailyworkout"] = true;

    results = "🎉 __** Daily Workout Prize **__ 🎉";
    var car = require(gtf.CARS).random({lowerfpp:500}, 1)[0];
    prizes.push(["CAR", {
      id: -1, name: car["name"] + " " + car["year"], item: car, author: "DAILY WORKOUT", isgift: false }]);
    var car2 = require(gtf.CARS).random({upperfpp:500, types:["Production"]}, 1)[0];
      prizes.push(["CAR", {
      id: -1, name: car2["name"] + " " + car2["year"], item: car2, author: "DAILY WORKOUT", isgift: false }]);
    var credits = 1000 * gtftools.randomInt(5, 10)
    var credits2 = 1000 * gtftools.randomInt(15, 50)
    prizes.push(["CREDITS", {
      id: -1, name: gtftools.numFormat(credits) + emote.credits, item: credits, author: "DAILY WORKOUT", isgift: false }]);
    prizes.push(["CREDITS", {
      id: -1, name: gtftools.numFormat(credits2) + emote.credits, item: credits2, author: "DAILY WORKOUT", isgift: false }]);
    prizes = gtftools.shuffle(prizes)

    require(gtf.MARKETPLACE).fourgifts("GTF Daily Workout", results, prizes, embed, msg, userdata);
  }
};
