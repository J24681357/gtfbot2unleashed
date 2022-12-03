var dir = "../"
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

/*
module.exports.list = function (args) {
  var gtftimes = require(gtf.LISTS).gtftime;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtftimes;
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
*/

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var timeprogression = args["timeprogression"]
  if (typeof timeprogression  === 'undefined') {
    delete args["timeprogression"]
    timeprogression = 1
  } else {
     delete args["timeprogression"]
  }
  
  var arg_hour_total = 0;
  if (args["hours"] !== undefined) {
    var arg_hours = args["hours"];
    delete args["hours"];
    arg_hour_total = 1;
  }
  var total = Object.keys(args).length;
  var gtftime = require(gtf.LISTS).gtftime;
  var final = [];
  var times = Object.keys(gtftime);

  for (var key = 0; key < times.length; key++) {
    var tkey = gtftime[times[key]];

    var count = 0;
    if (args["name"] !== undefined) {
      if (args["name"].length == 0 || args["name"][0] == "R" || args["name"][0] == "Random") {
        count++;
      } else {
        var names = args["name"];
        for (var iname = 0; iname < names.length; iname++) {
          if (tkey["name"].toLowerCase().includes(names[iname].toLowerCase())) {
            count++;
            break;
          }
        }
      }
    }
    if (count == total) {
      var j = tkey["min"];

      while (j != tkey["max"] + 1) {
        var dict = {
          name: tkey["name"],
          emoji: tkey["emoji"],
          hour: j,
          minutes: "00",
          seconds: 00,
          timeprogression: timeprogression
        };
        var countx = 0;

        if (arg_hours !== undefined) {
          if (arg_hours.length == 0) {
            countx++;
          } else {
            for (var ihour = 0; ihour < arg_hours.length; ihour++) {
              if (parseInt(dict["hour"]) == parseInt(arg_hours[ihour])) {
                countx++;
                break;
              }
            }
          }
        }
        if (countx == arg_hour_total) {
          final.unshift(dict);
        }
        j++;
        if (j == 24) {
          j = 0;
        }
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  return final;
};

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.TIME).find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};

module.exports.increasetime = function (time, milli) {
 var timemil = ((time["hour"] * 3600000)) + (time["minutes"] * 60000) + (time["seconds"] * 1000)
 var duration = typeof time["timeprogression"] !== 'undefined' ? timemil + (milli*time["timeprogression"]) : timemil + milli
 var milliseconds = Math.floor((duration % 1000) / 100)
    seconds = Math.floor((duration / 1000) % 60)
    minutes = Math.floor((duration / (1000 * 60)) % 60)
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  time["hour"] = (hours < 10) ? hours : hours;
  time["minutes"] = (minutes < 10) ? "0" + minutes : minutes;
  time["seconds"] = (seconds < 10) ? "0" + seconds : seconds;
  
  time["hour"] = (parseInt(time["hour"]) >= 24) ? (time["hour"] % 24) : time["hour"]
  return time
  // https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
}