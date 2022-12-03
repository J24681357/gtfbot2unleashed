var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var gtfcareerraces = require(gtf.LISTS).gtfcareerraces;
  var final = [];
  var eventids = Object.keys(gtfcareerraces);

  for (var key = 0; key < eventids.length; key++) {
    var eventidkey = gtfcareerraces[eventids[key]];

      var count = 0;

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            var re = new RegExp("^" + types[itype] + "-", 'ig');
            if (eventidkey["eventid"].match(re)) {
              count++;
              break;
            }
          }
        }
      }
      
      if (count == total) {
        final.push(eventidkey);
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
