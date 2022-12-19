var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var paint = require(gtf.LISTS).gtfpaintslist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "type") {
    results = Object.keys(paint).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
};

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var paint = require(gtf.LISTS).gtfpaintlist;
  var final = [];
  var total = Object.keys(args).length;

  var types = Object.keys(paint);

  for (var key = 0; key < types.length; key++) {
    var typekey = paint[types[key]];
    for (var i = 0; i < typekey.length; i++) {
      var count = 0;
      if (args["type"] !== undefined) {
        var type = args["type"];
        var x = typekey[i]["type"];
        if (x.toLowerCase().replace(/ /g, "-") === type.toLowerCase().replace(/ /g, "-")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        var name = args["name"];
        var x = typekey[i]["name"];
        if (x === name) {
          count++;
        }
      }

      if (count == total) {
        final.push(typekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  return final.sort((x, y) => x["cost"] - y["cost"]);
};

module.exports.checkpaintsavail = function (paint, gtfcar) {
  var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] });
  
  if (ocar["type"].includes("Race Car")) {
    if (paint["name"] == "Default") {
      if (gtfcar["livery"]["current"] == paint["name"]) {
       return "✅"
      } else {
        return ""
      }
    }
    var nameid = parseInt(paint["name"].split(" ").pop()) - 1
    var list = ["❌","❌","❌"]
    var liveries = ocar["image"].length - 1
    for (var x = 0; x < liveries; x++) {
      if (gtfcar["livery"]["current"].includes(paint["name"])) {
      if (gtfcar["livery"]["current"] == "Livery " + paint["name"]) {
       list[x] = "✅"
      } else {
        list[x] = ""
      }
      continue;
    }
      list[x] = ""
    }
    return list[nameid]
    
  } 
  else {
    if (paint["name"] == "Default" && gtfcar["color"]["current"] == "Default") {
      return "✅"
    }
    
  if (gtfcar["color"]["current"] == paint["type"] + " " + paint["name"]) {
    return "✅";
  } else if (gtfcar["color"]["current"] == "Default") {
    return "";
  }

    return ""
    
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
