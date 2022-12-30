var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var gtfweathers = require(gtf.LISTS).gtfweather;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtfweathers;
  }
  if (args == "ids") {
    results = Object.keys(gtfweathers).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
  if (args == "names") {
    results = Object.keys(gtfweathers).map(function (x) {
      return gtfweathers[x]["name"];
    });
    return results;
  }
};

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var weatherchange = args["weatherchange"]
  if (typeof weatherchange === 'undefined') {
    weatherchange = 0
    delete args["weatherchange"]
  } else {
    delete args["weatherchange"]
  }
  var total = Object.keys(args).length;
  var gtfweather = require(gtf.LISTS).gtfweather;
  var final = [];
  var weathers = Object.keys(gtfweather);

  for (var key = 0; key < weathers.length; key++) {
    var wkey = gtfweather[weathers[key]];

    var count = 0;
    if (typeof args["name"] !== 'undefined') {
      if (args["name"].length == 0 || args["name"][0] == "R" || args["name"][0] == "Random") {
        count++;
      } else {
        var names = args["name"];
        for (var iname = 0; iname < names.length; iname++) {
          if (wkey["name"].toLowerCase().includes(names[iname].toLowerCase())) {
            count++;
            break;
          }
        }
      }
    }
    if (count == total) {
      if (wkey["wet"]) {
        if (wkey["name"] == "Storm") {
          wkey["wetsurface"] = require(gtf.MATH).randomInt(50, 100);
        } else {
        wkey["wetsurface"] = require(gtf.MATH).randomInt(5, 100);
        }
      } else {
        wkey["wetsurface"] = 0;
      }
      wkey["weatherchange"] = weatherchange
      final.unshift(wkey);
    }
  }
  if (final.length == 0) {
    return "";
  }
  return final;
};

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.WEATHER).find(args);
  var randomizer = [];
  for (var i = 0; i < list.length; i++) {
    randomizer = randomizer.concat(Array(list[i]["chance"] * 100).fill(list[i]["name"]));
  }

  for (var i = 0; i < num; i++) {
    var rweather = randomizer[Math.floor(Math.random() * randomizer.length)];

    for (var j = 0; j < list.length; j++) {
      if (list[j]["name"] == rweather) {
        rweather = list[j];
        break;
      }
    }
    rlist.push(rweather);
  }
  return rlist;
};

module.exports.advanceweather = function (weather, length) {
  var owetsurface = weather["wetsurface"]
  var oweatherchange = weather["weatherchange"]
  var rnorm = require("random-normal")
  if (weather["weatherchange"] == 0) {
    return weather
  }
  var rnum = require(gtf.MATH).randomInt(0,99)
 
  if (rnum < weather["weatherchange"]) {
    if (weather["name"] == "Clear") {
      weather = require(gtf.WEATHER).random({name: ["Partly Cloudy", "Overcast"]}, 1)[0]
      
    }
    if (weather["name"] == "Partly Cloudy") {
      weather = require(gtf.WEATHER).random({name: ["Clear", "Overcast", "Rain"]}, 1)[0]
    }
    if (weather["name"] == "Overcast") {
      weather = require(gtf.WEATHER).random({name: ["Partly Cloudy", "Overcast", "Rain"]}, 1)[0]
      
    }
    if (weather["name"] == "Rain" && require(gtf.MATH).randomInt(1,2) == 1) {
      weather = require(gtf.WEATHER).random({name: ["Overcast" ,"Overcast"]}, 1)[0]
    }
    weather["wetsurface"] = owetsurface
   weather["weatherchange"] = oweatherchange
  }
  if (owetsurface == 0 && weather["name"] == "Rain") {
    weather["wetsurface"] = require(gtf.MATH).randomInt(5,15)
  } else {
    if (weather["name"] == "Rain") {
    weather["wetsurface"] = parseInt(weather["wetsurface"] + Math.abs(rnorm({mean: (20 * (0.25 * length) ), dev:3})))
    }
    if (weather["name"] == "Overcast" || weather["name"] == "Partly Cloudy") {
       weather["wetsurface"] = parseInt(weather["wetsurface"] - (5 * (0.25 * length)))
    }
    if (weather["name"] == "Clear") {
      weather["wetsurface"] = parseInt(weather["wetsurface"] - (10 * (0.25 * length)))
    }
   }
  if (weather["wetsurface"] >= 100) {
    weather["wetsurface"] = 100
  }
  if (weather["wetsurface"] <= 0) {
    weather["wetsurface"] = 0
  }
  return weather
}