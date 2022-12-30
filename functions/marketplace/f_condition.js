var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.condition = function (gtfcar) {
  var conditions = [gtfcar["condition"]["oil"],
                    gtfcar["condition"]["engine"],
                    gtfcar["condition"]["transmission"],
                    gtfcar["condition"]["suspension"] ,gtfcar["condition"]["body"]].map(function(x) {
   if (x <= 0) {
     x = 0
   }
      return x
        })
  var weights = [0.06, 0.28, 0.13, 0.13, 0.2]
  var conditionavg = require(gtf.MATH).weightedaverage(conditions, weights)
  var icon = emote.carexcellent
  var name = "Excellent"
  if (conditionavg < 70) {
    icon = emote.carnormal
    name = "Normal"
  }
  if (conditionavg < 45) {
    icon = emote.carworn
    name = "Worn"
  }
  if (conditionavg < 20) {
    icon = emote.carbad
    name = "Bad"
  }
  if (conditionavg <= 5) {
    icon = emote.cardead
    name = "Wreaked"
  }
  var health = require(gtf.MATH).round(conditionavg, 1)
  if (health <= 0) {
    health = 0
  }
  return {
  health: health,
  name: name,
  emote: icon
  }
}
module.exports.updatecondition = function(number, condition, userdata) {
  var conditionlist = userdata["garage"][stats.currentcarnum(userdata) - 1]["condition"];

  if (condition == "all") {
    var keys = Object.keys(conditionlist)
    for (var i = 0; i < keys.length; i++) {
      conditionlist[keys[i]] = number
    }
  } else {
  conditionlist[condition] = Math.round(conditionlist[condition] + number)

  if (conditionlist[condition] >= 100) {
    conditionlist[condition] = 100
  }
  if (conditionlist[condition] <= 0) {
    conditionlist[condition] = 0
  }
  }
  userdata["garage"][stats.currentcarnum(userdata) - 1]["condition"] = conditionlist

  userdata["garage"][stats.currentcarnum(userdata) - 1]["fpp"] = require(gtf.PERF).perf(userdata["garage"][stats.currentcarnum(userdata) - 1], "GARAGE")["fpp"];
}
module.exports.updatecurrentcarclean = function (length, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  var rnumber = require(gtf.MATH).randomInt(1, 5);
  var clean = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"]);
  clean = clean - rnumber;

  if (clean <= 0) {
    clean = 0;
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean;

  id = stats.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};
module.exports.updatedamage = function (racesettings, car, userdata) {
  console.log(car["damage"])
    var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  var length = racesettings["distance"]["km"]
  var damage = car["damage"]

 ///CLEAN
  var rclean = require(gtf.MATH).round(require(gtf.MATH).randomInt(1, 5) * (length/45), 2);
  require(gtf.CONDITION).updatecondition(-rclean, "clean", userdata)

  ////OIL
  var roil = require(gtf.MATH).round(length/6, 2);

  require(gtf.CONDITION).updatecondition(-roil, "oil", userdata)

  while (damage >= 0) {
    var d = require(gtf.MATH).randomInt(2,5)
    var select = ["engine", "transmission", "suspension", "body"][require(gtf.MATH).randomInt(0,3)]
    require(gtf.CONDITION).updatecondition(-d, select, userdata)
    damage = damage - d
  }
}
