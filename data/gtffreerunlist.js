var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var gtftracks = require(gtf.LISTS).gtffreerunlist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtftracks;
  }
  if (args == "ids") {
    results = Object.keys(gtftracks).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
  if (args == "names") {
    results = Object.keys(gtftracks).map(function (x) {
      return gtftracks[x]["name"];
    });
    return results;
  }
};

/*
module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var total = Object.keys(args).length;
  var gtftracks = require(gtf.LISTS).gtffreerunlist;
  var final = [];
  var ids = Object.keys(gtftracks);

  for (var key = 0; key < ids.length; key++) {
    var track = gtftracks[ids[key]];

    var count = 0;

    if (args["id"] !== undefined) {
      if (args["id"].length == 0) {
        count++;
      } else {
        var numbers = args["id"];
        for (var inumber = 0; inumber < numbers.length; inumbers++) {
          if (parseInt(ids[key]) == parseInt(numbers[inumbers])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["name"] !== undefined) {
      if (args["name"].length == 0) {
        count++;
      } else {
        var names = args["name"];
        for (var iname = 0; iname < names.length; iname++) {
          if (track["name"] == names[iname]) {
            count++;
            break;
          }
        }
      }
    }

    if (args["options"] !== undefined) {
      if (args["options"].length == 0) {
        count++;
      } else {
        var options = args["options"];
        for (var ioption = 0; ioption < options.length; ioption++) {
          if (track["options"].includes(options[ioption])) {
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
          if (track["type"] == types[itype]) {
            count++;
            break;
          }
        }
      }
    }

    if (count == total) {
      final.unshift(track);
    }
  }
  if (final.length == 0) {
    return "";
  }
  var id = 1;
  final.map(function (x) {
    x["id"] = id;
    id++;
  });
  final.sort(function (a, b) {
    return a["name"].toString().localeCompare(b["name"]);
  });

  return final;
};
*/

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.TRACKS).find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};