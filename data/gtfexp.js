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
    require(gtf.EMBED).alert({ name: "❌ " + "Level " + level + " Required", description: "🔒 Your level does not meet the requirements." + "\n\n" + "**Level: Lv." + currentlevel + emote.exp + " -> " + "Lv." + level + "**", embed: "", seconds: 3 }, msg, userdata);
    return false;
  }
};

module.exports.islevelup = function (userdata) {
  var exp = stats.exp(userdata);
  var level = stats.level(userdata);
  var levelup = 0;
  var levelupbool = false;
  var leveldetails = [""];
  var explevels = require(gtf.LISTS).gtfexp;
  //console.log(explevels[(level).toString()]["exp"] + 1)

  for (var i = level; i < Object.keys(explevels).length; i++) {
    if (exp >= explevels[(i + 1).toString()]["exp"]) {
      levelup++;
      levelupbool = true;
      if (typeof explevels[(i + 1).toString()]["rewards"] != "undefined") {
        for (var j = 0; j < explevels[(i + 1).toString()]["rewards"].length; j++) {
          if (explevels[(i + 1).toString()]["rewards"][j].includes("Car Reward")) {
            require(gtf.EXP).levelreward(explevels[(i + 1).toString()]["rewards"][j], userdata);
          }
        }
        leveldetails.push(explevels[(i + 1).toString()]["rewards"].join("\n"));
      }
    } else {
      break;
    }
  }
  stats.levelup(levelup, userdata);
  return [levelupbool, levelup, leveldetails.slice(0, 5).join("\n")];
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
  var car = require(gtf.CARS).random(options, 1)[0];
  stats.addgift(name, car, "CAR", "🎁 Prize", true, userdata);
};