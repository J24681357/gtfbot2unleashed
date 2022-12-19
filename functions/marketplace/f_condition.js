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
                    gtfcar["condition"]["suspension"] ,gtfcar["condition"]["body"]]
  var weights = [0.06, 0.28, 0.13, 0.13, 0.2]
  var conditionavg = require(gtf.MATH).weightedaverage(conditions, weights)
  var icon = emote.carexcellent
  var name = "Excellent"
  if (conditionavg <= 70) {
    icon = emote.carnormal
    name = "Normal"
  }
  if (conditionavg <= 45) {
    icon = emote.carworn
    name = "Worn"
  } 
  if (conditionavg <= 20) {
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
    for (var i = 0; i < Object.keys(conditionlist); i++) {
      condition = conditionlist[conditionlist[i]]
       conditionlist[condition] = number
    }
  } else {
  conditionlist[condition] = conditionlist[condition] + number

  if (conditionlist[condition] >= 100) {
    conditionlist[condition] = 100
  }
  }
  userdata["garage"][stats.currentcarnum(userdata) - 1]["condition"] = conditionlist

  userdata["garage"][stats.currentcarnum(userdata) - 1]["fpp"] = require(gtf.PERF).perf(userdata["garage"][stats.currentcarnum(userdata) - 1], "GARAGE")["fpp"];
}