var dir = "../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.checklevel = function (level, embed, msg, userdata) {
  var exp = stats.exp(userdata);
  var currentlevel = stats.level(userdata);
  if (currentlevel >= level || level == 0) {
    return true;
  } else {
    require(gtf.EMBED).alert({ name: "❌ " + "Level " + level + " Required", description: "🔒 Your level does not meet the requirements." + "\n\n" + "**license: "N", level: Lv." + currentlevel + emote.exp + " -> " + "Lv." + level + "**", embed: "", seconds: 10 }, msg, userdata);
    return false;
  }
};

module.exports.createexpbar = function (userdata) {
  var progress = userdata["settings"]["ICONS"]["bar"][0];
    var progressb = userdata["settings"]["ICONS"]["bar"][1];
    var expbar = [progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb];
    
    var nextlevel = stats.level(userdata) + 1;
    if (nextlevel >= 50) {
      nextlevel = 50;
    }
    var nextlevelexp = require(gtf.LISTS).gtfexp[nextlevel.toString()]["exp"];

    var curr = stats.level(userdata)
    var currexp = stats.exp(userdata);
    var currlevelexp = require(gtf.LISTS).gtfexp[curr.toString()]["exp"];
    for (var i = 0; i < expbar.length; i++) {
      if (currlevelexp <= currexp) {
        currlevelexp += nextlevelexp / 10
        expbar[i] = progress;
      }
    }
  return expbar
}

module.exports.islevelup = function (userdata) {
  var exp = stats.exp(userdata);
  var level = stats.level(userdata);
  var levelup = 0;
  var leveldetails = [""];
  var explevels = require(gtf.LISTS).gtfexp;

  for (var i = level; i < Object.keys(explevels).length; i++) {
    if (exp >= explevels[(i + 1).toString()]["exp"]) {
      levelup++;
      if (typeof explevels[(i + 1).toString()]["rewards"] != "undefined") {
        for (var j = 0; j < explevels[(i + 1).toString()]["rewards"].length; j++) {
          if (explevels[(i + 1).toString()]["rewards"][j].includes("Car Reward")) {
            require(gtf.EXP).levelreward(explevels[(i + 1).toString()]["rewards"][j], userdata);
          }
        }
        leveldetails.push(explevels[(i + 1).toString()]["rewards"].slice(0,2).join("/n"));
      }
    } else {
      break;
    }
  }
  stats.addlevel(levelup, userdata);
  var bool = (levelup >= 1)
  return [bool, levelup, leveldetails.slice(0, 5).join("\n")];
};

module.exports.levelreward = function (name, userdata) {
  var options = {};
  if (name == "Level 5 Car Reward") {
    options = { lowerfpp: 250, upperfpp: 300, types: ["Production"] };
  }
  if (name == "Level 10 Car Reward") {
    options = { lowerfpp: 400, upperfpp: 450, types: ["Production"] };
  }
  if (name == "Level 15 Car Reward") {
    options = { types: ["Race Car: GT4"] };
  }
  if (name == "Level 20 Car Reward") {
    options = { lowerfpp: 450, upperfpp: 600, types: ["Production"] };
  }
  if (name == "Level 25 Car Reward") {
    options = { types: ["Race Car: GT3"] };
  }
  if (name == "Level 30 Car Reward") {
    options = { lowerfpp: 550, upperfpp: 1000, types: ["Production"] };
  }
  if (name == "Level 40 Car Reward") {
    options = { types: ["Race Car: LMP"] };
  }
  if (name == "Level 50 Car Reward") {
    options = { types: ["Concept"] };
  }
  ///var car = require(gtf.CARS).random(options, 1)[0];
  //stats.addachievement(name, userdata)
  //stats.addgift(name, car, "CAR", "🎁 Prize", true, userdata);
};
