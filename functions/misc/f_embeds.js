var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
module.exports.alert = function (object, msg, userdata) {
  var name = object["name"];
  var desc = object["description"];
  var embed = object["embed"];
  var seconds = object["seconds"];
  var help_desc = "";
  var color = "";
  if (name.includes("⚠")) {
    color = 0xffff00;
  }
  if (name.includes("❌")) {
    color = 0xff0000;
  }
  if (name.includes("✅") || name.includes("🎉") || name.includes(emote.goldmedal)) {
    color = 0x216c2a;
    message = "";
  }
  var message = msg.content.split("***").join(" ");
  if (message.length == 0) {
    message = "";
  } else {
    message = ' "' + message + '"'
  }

  if (desc.includes("Invalid arguments") && color == 0xff0000) {
    var help = msg.content.slice(1).split(" ");
    help_desc = "\n\n" + require("../../commands/gtfhelp").execute(msg, help, { id: "TEXT" })[1];
  }

  if (embed == "") {
    var embed = new EmbedBuilder();
    embed.setAuthor({name: msg.guild.members.cache.get(userdata["id"]).user.username, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});

    embed.setColor(color);
    if (["✅", "🎉", emote.goldmedal].indexOf(name) + 1) {
      embed.setFields([{name:name, value: desc + help_desc}]);
    } else {
      embed.setFields([{name:name + message, value: desc + help_desc}]);
    }
    
    return msg.channel.send({ embeds: [embed] }).then(msg => {
      if (seconds > 0) {
        setTimeout(() => {
          msg.delete()
          require(gtf.MAIN).embedcounts[userdata["id"]]--;
          }, seconds * 1000)
      }
    });
  } else {
    embed.setFields([{name: name + ' "' + message + '"', value: desc}]);
    embed.setColor(color);
  return msg.edit({ embeds: [embed] }).then(msg => {
      if (seconds > 0) {
        setTimeout(() => {
          msg.delete()
          require(gtf.MAIN).embedcounts[userdata["id"]]--;
          }, seconds * 1000)
      }
    });
  }
  return;
};

module.exports.checkgarageerror = function (embed, msg, userdata) {
  if (stats.garagecount(userdata) >= require(gtf.GTF).garagelimit) {
    require(gtf.EMBED).alert({ name: "❌ Garage Full", description: "You have reached your garage limit of " + require(gtf.GTF).garagelimit + " or above.\nSell one of your cars using **/garage - Sell Car** in order to add more cars to your garage.", embed: "", seconds: 7 }, msg, userdata);
    return true;
  } else {
    return false;
  }
};

module.exports.checknocars = function (userdata) {
  return stats.currentcarmain(userdata) == "No car.";
};
