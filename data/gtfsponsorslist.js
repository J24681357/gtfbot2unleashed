var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var sponsors = require(gtf.LISTS).gtfsponsors;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "names") {
    results = Object.keys(sponsors).map(function (x) {
      return sponsors[x]["name"]
    });
    return results;
  }
}

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var gtfsponsors = require(gtf.LISTS).gtfsponsors;
  var final = [];
  var ids = Object.keys(gtfsponsors);

  for (var key = 0; key < ids.length; key++) {
    var idkey = gtfsponsors[ids[key]];

      var count = 0;

      if (args["name"] !== undefined) {
        if (args["name"].length == 0) {
          count++;
        } else {
          var names = args["name"];
          for (var iname = 0; iname < names.length; iname++) {
            if (idkey["name"].includes(names[iname])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            if (idkey["type"].toLowerCase().replace(/-/,"_").replace(/ /g, "_").includes(types[itype].toLowerCase().replace(/-/,"_").replace(/ /g, "_"))) {
              count++;
              break;
            }
          }
        }
      }
      
      if (count == total) {
        final.push(idkey);
      }
  }
  if (final.length == 0) {
    return "";
  }

  return final;
};

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.CARS).find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};

module.exports.creditbonus = function (credits, gtfcar, userdata) {
  if (userdata["sponsor"]["name"] == "None") {
    return 0
  }
  var sponsor = require(gtf.SPONSORS).find({"name":[userdata["sponsor"]["name"]]})[0]
  
  if (sponsor["type"] == "Rims") {
    if (gtfcar["rims"]["current"].includes(sponsor["require"][0])) {
    return Math.round(credits * (sponsor["percent"] / 100))
  } else {
    return 0
  }
  }

  if (sponsor["type"] == "Cars") {
    var re = new RegExp("^" + sponsor["name"], 'ig');
    if (gtfcar["name"].match(re)) {
    return Math.round(credits * (sponsor["percent"] / 100))
  } else {
    return 0
  }
  }

  return 0
 
};