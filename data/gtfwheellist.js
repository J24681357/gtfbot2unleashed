var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var wheels = require(gtf.LISTS).gtfwheellist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "makes") {
    results = Object.keys(wheels).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
    });
    return results;
  }
}

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var wheels = require(gtf.LISTS).gtfwheellist;
  var final = [];
  var total = Object.keys(args).length;

  var makes = Object.keys(wheels);

  for (var key = 0; key < makes.length; key++) {
    var makekey = wheels[makes[key]];
    for (var i = 0; i < makekey.length; i++) {
      var count = 0;
      if (args["make"] !== undefined) {
        var make = args["make"];
        var x = makekey[i]["make"];
        if (x.toLowerCase().replace(/-/,"_").replace(/ /g, "_") === make.toLowerCase().replace(/-/,"_").replace(/ /g, "_")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        var name = args["name"];
        var x = makekey[i]["name"];
        if (x === name) {
          count++;
        }
      }

      if (args["fullname"] !== undefined) {
        var fullname = args["fullname"];
        var x = makekey[i]["make"] + " " + makekey[i]["name"]
        if (x === fullname) {
          console.log("Ok")
          count++;
        }
      }

      if (count == total) {
        final.unshift(makekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  return final.sort((x, y) => x["cost"] - y["cost"]);
};

module.exports.checkwheelsavail = function (part, gtfcar) {
  if (part["name"] == "Default") {
    if (gtfcar["rims"]["current"] == part["name"]) {
      return ["✅", ""]
    } else {
      return ["", ""]
    }
    
  }
  if (gtfcar["rims"]["list"].includes(part["make"] + " " + part["name"])) {
      if (gtfcar["rims"]["current"] == (part["make"] + " " + part["name"])) {
       return ["✅", ""]
      } else {
        return ["📦", ""]
      }
  }
  return ["", ""];
};

///////////////////////////////////////////////////////////////////////////////////////////////
