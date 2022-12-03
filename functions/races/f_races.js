var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.setracesettings = function (raceprep) {
  if (raceprep["mode"] == "ARCADE") {
    if (raceprep["modearg"] == "beginner") {
      var title = "Arcade Mode - Beginner";
      var type = "LAPS";
      var limit = 10.0;
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];

      var grid = ["8", "9", "10", "11", "12"];

   
      var chance = 90;
    } 
    else if (raceprep["modearg"] == "amateur") {
      var title = "Arcade Mode - Amateur";
      var type = "LAPS";
      var limit = 15.0;
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];
      var grid = ["10", "11", "12", "13", "14", "15", "16"];
    
      var chance = 70;
    } 
    else if (raceprep["modearg"] == "professional" || raceprep["modearg"] == "pro") {
      var title = "Arcade Mode - Professional";
      var type = "LAPS";
      var limit = 25.0;
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];
      var grid = ["12", "13", "14", "15", "16", "17", "18", "19", "20"];
 
      var chance = 50;
    }
    else if (raceprep["modearg"] == "endurance") {
      var type = "TIME";
      var km = 0;
      var limit = ["30m", "45m", "60m", "120m"];
      limit = limit[Math.floor(Math.random() * limit.length)];
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];
      var grid = ["24"];
       
      var chance = 40;
    } 
    else if (raceprep["modearg"].includes("custom")) {
      var difficulty = parseInt(raceprep["modearg"].split("_")[1])
      raceprep["racesettings"]["difficulty"] = difficulty
      return raceprep["racesettings"]
    }
  }
  else if (raceprep["mode"] == "DRIFT") {
    if (raceprep["modearg"] == "driftbeginner") {
      var title = "Drift Trial - Beginner";
      var type = "LAPS";
      var limit = 1;
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];
      var grid = ["1"];
      var chance = 50;
    }
    if (raceprep["modearg"] == "driftprofessional") {
      var title = "Drift Trial - Professional";
      var type = "LAPS";
      var limit = 1;
      var time = require(gtf.TIME).random({}, 1)[0];
      var weather = require(gtf.WEATHER).random({}, 1)[0];
      var grid = ["1"];
      
      var chance = 50;
    }
  }
  else if (raceprep["mode"] == "SSRX") {
    var title = "Special Stage Route X - " + raceprep["modearg"] + "m Top Speed Run";
    var type = "LAPS";
    var limit = 0.01;
    var time = require(gtf.TIME).random({}, 1)[0];
    var weather = require(gtf.WEATHER).random({}, 1)[0];
    var grid = ["1"];
    var category = ["CUSTOM"];
    var chance = 50;
  }
  else if (raceprep["mode"] == "DUEL") {
    var title = "1 Lap Duel - " + raceprep["players"][0]["name"]
    var type = "LAPS";
    var limit = 0.1;
    var time = raceprep["time"]
    var weather = raceprep["weather"]
    var category = ["CUSTOM"];
    var grid = ["2"]
    var chance = 0;
    } 
  else if (raceprep["mode"] == "TIMETRIAL") {
    var title = "Time Trial " + raceprep["modearg"] +  " - " + raceprep["track"]["name"];
    var type = "TIMETRIAL";
    var limit = 0.01;
    var time = require(gtf.TIME).random({name:["Day"]}, 1)[0];
    var weather = require(gtf.WEATHER).random({name: ["Clear", "Partly Cloudy", "Cloudy"]}, 1)[0];
    var grid = ["1"];
    var category = ["CUSTOM"];
    var chance = 0;
  }
  else if (raceprep["modearg"] == "R" || raceprep["modearg"] == "ONLINE") {
    var title = "ONLINE LOBBY";
    var type = "LAPS";
    var track = require(gtf.TRACKS).random({types:["Tarmac"]}, 1)[0];
    var km = track["length"];
    var limit = 0;
    var time = require(gtf.TIME).random({}, 1)[0];
    var weather = require(gtf.WEATHER).random({}, 1)[0];
    var grid = [["ONLINE"]];
    var place = ["ONLINE"];
    var chance = 50;
  }

  if (raceprep["mode"] == "CAREER") {
    racesettings = raceprep["racesettings"];
    racesettings["time"] =  require(gtf.TIME).random({ name: racesettings["time"], timeprogression: racesettings["timeprogression"] }, 1)[0];
    racesettings["weather"] = require(gtf.WEATHER).random({ name: racesettings["weather"], weatherchange: racesettings["weatherchange"]}, 1)[0];
    return racesettings;
  }
  if (raceprep["trackselect"] == "RANDOM") {
    var track = require(gtf.TRACKS).random(raceprep["track"], 1)[0];
    var km = track["length"];
  }
  if (raceprep["trackselect"] == "SELECT") {
    var track = raceprep["track"];
    var km = track["length"];
  }

  if (track["options"].includes("sprint")) {
      limit = 0.1
  }

  if (raceprep["modearg"] == "endurance") {
    title = "Arcade Mode - " + limit + " of " + track["name"];
  }
  if (!isNaN(limit)) {
    var distance = require(gtf.RACE).lapcalc(km, limit);
  } else {
    distance = [limit, "N/A", "N/A"];
  }
  grid = grid[Math.floor(Math.random() * grid.length)];

  
  var racesettings = {
    title: title,
    image: track["image"],
    mode: raceprep["mode"],
    grid: grid,
    carselect: "",
    time: time,
    timeprogression: 1,
    weather: weather,
    weatherchange: 0,
    positions: [],
    track: track,
    tires: "Racing",
    bop: false,
    difficulty: chance,
    type: type,
    laps: distance[0],
    km: distance[1],
    mi: distance[2],
  };
  racesettings["positions"] = require(gtf.RACE).calculatecredits(racesettings, raceprep)
  

  if (raceprep["modearg"] == "driftbeginner") {
    racesettings["originalsectors"] = 3;
    racesettings["sectors"] = 3;
    racesettings["current"] = 0;
    racesettings["points"] = 0;
  }
  if (raceprep["modearg"] == "driftprofessional") {
    racesettings["originalsectors"] = 6;
    racesettings["sectors"] = 6;
    racesettings["current"] = 0;
    racesettings["points"] = 0;
  }
  return racesettings;
};

module.exports.raceprep = function (raceprep, embed, msg, userdata) {
  var embed = new EmbedBuilder();
  raceprep["modearg"] = raceprep["modearg"].toString();
 
  if ((raceprep["mode"] == "ARCADE" || raceprep["mode"] == "DRIFT" || raceprep["mode"] == "SSRX" || raceprep["mode"] == "DUEL" || raceprep["mode"] == "TIMETRIAL")) {
    var racesettings = require(gtf.RACE).setracesettings(raceprep);

  } else if (raceprep["mode"] == "CAREER") {
    embed.fields = [];
    var racesettings = require(gtf.RACE).setracesettings(raceprep);
    var loading = racesettings["misc"]["loading"];
  
  } else if (raceprep["mode"] == "ONLINE") {
    embed.fields = [];

    var racesettings = raceprep["racesettings"];
    racesettings["grid"] = racesettings["players"].length;
    racesettings["title"] = "__Online Lobby__"
    var finalgrid = racesettings["players"]
    racesettings["positions"] = [{ place: '1st', credits: 1000 },
  { place: '2nd', credits: 800 },
  { place: '3rd', credits: 600 },
  { place: '4th', credits: 500 },
  { place: '5th', credits: 400 },
  { place: '6th', credits: 300 },
  { place: '7th', credits: 200 },
  { place: '8th', credits: 100 }]
    racesettings["misc"] = { loading: racesettings["title"] };
  }

  if (raceprep["carselect"] == "GARAGE") {
    var carname = raceprep["car"]["name"];
    var tirechange = raceprep["mode"] != "DRIFT" ? true : false
    
    racesettings["misc"] = { otires: raceprep["car"]["tires"]["current"].slice(), tirechange: tirechange, tirechange: true, car: raceprep["car"] };
  } else {
    if (raceprep["mode"] != "ONLINE") {
    var carname =  racesettings["misc"]["car"]["name"]
    }
  }

    if (raceprep["mode"] == "CAREER") {
      var condition = "CUSTOM"

      if (racesettings["bop"]) {
        condition = "BOP"
      }

      var args = {
        mode: racesettings["mode"],
        makes: racesettings["makes"],
        models: racesettings["models"],
        types: racesettings["types"],
        countries: racesettings["countries"],
        drivetrains: racesettings["drivetrains"],
        engines: racesettings["engines"],
        special: racesettings["special"],
        prohibited: racesettings["prohibited"],
        upperfpp: racesettings["upperfpp"],
        lowerfpp: racesettings["lowerfpp"],
        upperpower: racesettings["upperpower"],
        lowerpower: racesettings["lowerpower"],
        upperweight: racesettings["upperweight"],
        lowerweight: racesettings["lowerweight"],
        condition: condition,
        gtscarclass: "",
      };
  
      var finalgrid = require(gtf.RACE).creategrid(args, racesettings["misc"]["car"], racesettings["grid"]);
    
      var grid = racesettings["grid"];
    } else if (raceprep["mode"] == "ARCADE" || raceprep["mode"] == "SSRX" || raceprep["mode"] == "DUEL" || raceprep["mode"] == "DRIFT" || raceprep["mode"] == "TIMETRIAL") {
      var grid = racesettings["grid"];
      var car = racesettings["misc"]["car"];
      racesettings["category"] = ["CUSTOM"];
      var args = {
        mode: raceprep["mode"],
        makes: [],
        models: [],
        types: [require(gtf.CARS).find({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })[0]["type"].split(":")[0]],
        engines: [],
        drivetrains: [],
        countries: [],
        upperfpp: racesettings["misc"]["car"]["fpp"] + 30,
        lowerfpp: racesettings["misc"]["car"]["fpp"] - 50,
        upperpower: 9999,
        lowerpower: 0,
        upperweight: 9999,
        lowerweight: 0,
        special: [],
        prohibited: [],
        condition: "CUSTOM",
        drivetrains: [],
      };
      if (raceprep["modearg"].includes("custom")) {
        
        var finalgrid = raceprep["players"] 
      } else { 
        var finalgrid = require(gtf.RACE).creategrid(args, racesettings["misc"]["car"], racesettings["grid"]);
          }
    }

  if (raceprep["mode"] == "DUEL") {
    var finalgrid = raceprep["players"]
    racesettings["fpplimit"] = raceprep["fpplimit"]
    racesettings["upperfpp"] = raceprep["fpplimit"]
    racesettings["locationid"] = raceprep["locationid"]
  } else if (raceprep["mode"] == "ONLINE" || raceprep["mode"] == "TIMETRIAL") {
    var finalgrid = raceprep["players"]
  }

 
  
  var prerace = require(gtf.RACE).preracedetails(racesettings, embed, msg, userdata)

  var results = prerace[0]
  var racedetails = prerace[1]
  var msgjson = prerace[2]
  
  var prizemoney = racesettings["positions"].slice(0, 3).map(function (x) {
    var credits = gtftools.numFormat(x["credits"])
    return x["place"] + " " + credits + emote.credits;
  });

  if (raceprep["mode"] == "CAREER") {
    loading = require(gtf.GTF).loadingscreen(loading, "");
  } else {
    loading = require(gtf.GTF).loadingscreen("**" + racesettings["track"]["name"] + "\n" + prizemoney.join(" ") + "**", carname);
  }
  
  embed.setDescription(loading);
  var screen = true
      var emojilist = [
  { emoji: emote.flag, 
  emoji_name: 'flag', 
  name: 'Start', 
  extra: "",
  button_id: 0 },
  {
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid/Session Details',
    extra: "",
    button_id: 1
  }]
  var button_id = 2
  if (racesettings["mode"] == "ONLINE" || racesettings["type"] == "TIMETRIAL") {
  } else {
   emojilist.push({
    emoji: emote.tire,
    emoji_name: "tire",
    name: 'Optimal Tire Usage | On',
    extra: "",
    button_id: button_id
  })
    button_id++
  }
  /*
  if (racesettings["mode"] == "TIMETRIAL") {
    emojilist.push({
    emoji: "🏆",
    emoji_name: "🏆",
    name: 'Leaderboard',
    extra: "",
    button_id: button_id
  })
  
    button_id++
  }
  */
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
  if (racesettings["mode"] != "ONLINE" && racesettings["type"] != "TIMETRIAL" && !racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow") && raceprep["carselect"] == "GARAGE") {
  var tireslist = racesettings["misc"]["car"]["tires"]["list"].filter(function(tire) {
  if (racesettings["tires"].includes("Comfort")) {
    if (tire.includes("Comfort")) {
        return true
      } else {
        return false
    }
  }
  if (racesettings["tires"].includes("Sports")) {
    if (tire.includes("Sports") || tire.includes("Comfort")) {
        return true
      } else {
        return false
    }
  }

  if (racesettings["tires"].includes("Racing")) {
    if (tire.includes("Sports") || tire.includes("Comfort") || tire.includes("Racing")) {
        return true
      } else {
        return false
    }
  }

  if (racesettings["track"]["type"].includes("Dirt")) {
    if (tire.includes("Dirt")) {
      return true
    } else {
      return false
    }
  }
  if (racesettings["track"]["type"].includes("Snow")) {
    if (tire.includes("Snow")) {
      return true
    } else {
      return false
    }
  }
    return true
  }).sort()
  var tmenulist = tireslist.map(function (tire, index) {
          return {
            emoji: "",
            name: tire,
            description: "",
            menu_id: (index)
            }
  })
  var temojilist = []
var menu = gtftools.preparemenu("Change Tires " + "(" + racesettings["misc"]["car"]["tires"]["current"] + ")" , tmenulist, temojilist, msg, userdata);
buttons.unshift(menu)
  }

  embed.setColor(userdata["settings"]["PROGRESSBAR"][2])
    
  var user = msg.guild.members.cache.get(userdata["id"]).user.username;
  embed.setAuthor({name: user, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});

require(gtf.DISCORD).send(msg, msgjson, preracefunc)
  function preracefunc(msg) {
    var results2 = ""
    setTimeout(function () {
      embed.setDescription(results + racedetails);
      if (racesettings["mode"] != "ONLINE" && racesettings["mode"] != "TIMETRIAL" ) {
      embed.setFields([{name:stats.main(userdata), value: "🚘 " + racesettings["misc"]["car"]["name"]}]);
      }

      msg.edit({embeds: [embed],  components: buttons}).then(msg => {
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:undefined, gridhistory:[],msghistory:[], tirehistory: [], timehistory:[], weatherhistory:[]}

        function flagstartrace() {
          if (userdata["raceinprogress"]["active"]) {
          require(dir + "commands/status").execute(msg, {options:"exit"}, userdata);
          } else {
        var user = msg.guild.members.cache.get(userdata["id"]).toString();      
          embed.spliceFields(0, 1);
          
          require(dir + "functions/races/f_races_2").readysetgob(user, racedetails, racesettings, finalgrid, embed, msg, args, [false, null], userdata);
          return
        }
        }
        function trackdetails() {
          if (screen == true) {
            screen = false
             var griddd = finalgrid.slice().map(function (x) {
                  if (x["user"]) {
                    return "**" + x["position"] + ". " + x["name"] + "**" + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
            })
          if (griddd.length >= 10) {
            griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
          }
          var bop = ""
          if (racesettings["bop"]) {
            bop = " " + emote.bop
          }
          if (raceprep["carselect"] == "GARAGE" || raceprep["mode"] == "DRIFT") {
            results2 =
              "__Starting Grid | " +
              racesettings["grid"] +
              " cars" +
              "__" + bop +
              "\n" +
              griddd.join("\n");
          } else {
            results2 =
              "__Starting Grid" +
              " | " +
              racesettings["grid"] +
              " cars" +
              "__" + bop +
              "\n" +
              griddd.join("\n");
          }

          embed.setDescription(results2);
          msg.edit({embeds: [embed], components:buttons});
          } else {
            screen = true
          embed.setDescription(results + racedetails);
          msg.edit({embeds: [embed], components: buttons});
          }
        }
        function tirechangen() {
          if (racesettings["misc"]["tirechange"]) {
          racesettings["misc"]["tirechange"] = false
          emojilist[2]["name"] = "Optimal Tire Usage | Off"
          buttons = gtftools.preparebuttons(emojilist.filter(x=> typeof x["menu_id"] === "undefined"), msg, userdata);
          buttons.unshift(menu)
          msg.edit({embeds: [embed], components:buttons});
          } else {
          racesettings["misc"]["tirechange"] = true
          emojilist[2]["name"] = "Optimal Tire Usage | On"
          buttons = gtftools.preparebuttons(emojilist.filter(x=> typeof x["menu_id"] === "undefined"), msg, userdata);
          buttons.unshift(menu)
          msg.edit({embeds: [embed], components:buttons});
          }
        }

  if (racesettings["mode"] == "ONLINE" || racesettings["type"] == "TIMETRIAL") {
  var functionlist = [flagstartrace, trackdetails]
} else {
var functionlist = [flagstartrace, trackdetails, tirechangen]
  }

if (racesettings["mode"] != "ONLINE" && racesettings["type"] != "TIMETRIAL" && !racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow") && raceprep["carselect"] == "GARAGE") {
var functionlist2 = []
        for (var j = 0; j < tmenulist.length; j++) {
      functionlist2.push(function(int) {
        racesettings["misc"]["car"]["tires"]["current"] = tireslist[int] 
        racesettings["misc"]["otires"] = tireslist[int] 
      })
      }
    emojilist = emojilist.concat(temojilist)
    functionlist = functionlist.concat(functionlist2)
}
if (racesettings["mode"] == "TIMETRIAL") {
  function leaderboards() {
    list = require(gtf.TIMETRIAL).formleaderboard(raceprep["leaderboard"], false, msg, userdata)
    if (list.length == 0) {
      list = [" ", "**No Records Found**"]
    }
    list.push("ㅤ")
   list.unshift("__**Top 10 Stars**__")
   embed.setDescription(list.join("\n"));
    msg.edit({embeds: [embed], components:buttons});
  }
  functionlist.push(leaderboards)
}
      gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
      });
    }, 3000)
  }
}

module.exports.creategrid = function (args, car, amount) {

  var mode = args["mode"]
  var makes = args["makes"];
  var models = args["models"];
  var types = args["types"];
  var countries = args["countries"];
  var drivetrains = args["drivetrains"];
  var engines = args["engines"];
  var upperfpp = args["upperfpp"];
  var lowerfpp = args["lowerfpp"];
  var upperpower = args["upperpower"];
  var lowerpower = args["lowerpower"];
  var upperweight = args["upperweight"];
  var lowerweight = args["lowerweight"];
  var condition = args["condition"];
  var gtscarclass = args["gtscarclass"];
  var special = args["special"]
  var prohibited = args["prohibited"]
  var grid = [];
  if (args["mode"] == "SSRX" || args["mode"] == "DUEL" || amount == 1) {
    fpp = require(gtf.PERF).perf(car, "GARAGE")["fpp"]
    var finalgrid = [{ place: 1, position: 1, drivername: "Player", name: car["name"], user: true, fpp: fpp, oscore: 0, score: 0, points: 0 }];
  
    return finalgrid;
  }

  if (condition != "") {
    if (args["mode"] == "ARCADE") {
      var test = require(gtf.CARS).find({ make: makes, name: models, drivetrains: drivetrains, engines: engines, types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight, special: special, prohibited:prohibited})
      while (lowerfpp >= 0) {
        if (test.length == 1 || test.length == 0) {
        upperfpp = upperfpp + 30
        lowerfpp = lowerfpp - 50
        test = require(gtf.CARS).find({ make: makes, name: models, drivetrains: drivetrains,engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
        }
        if (test.length >= 2) {
          break;
        }
      }
    }

    if (args["mode"] == "CAREER") {
      var test = require(gtf.CARS).find({ make: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
      while (lowerfpp >= 0) {
        if (test.length >= 1) {
          break;
        }
        if (test.length == 0) {
        lowerfpp = lowerfpp - 50
        test = require(gtf.CARS).find({ make: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
        }
      }
    }
    var randomcars = require(gtf.CARS).random({ make: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight, special: special, prohibited:prohibited }, amount);

    var finalgrid = [];
    var index = 0;
    var position = gtftools.randomInt(2, amount - 1);
    var fpp = 0
    var score = randomcars.length * 400
    while (index < randomcars.length) {
      if (position == amount && condition != "AIONLY") {
        fpp = require(gtf.PERF).perf(car, "GARAGE")["fpp"]
        finalgrid.push({ place: index + 1, position: index + 1, drivername: "Player", name: car["name"], user: true, fpp: fpp, oscore: score, score:score, points: 0 });
        index++;
      }
      fpp = require(gtf.PERF).perf(randomcars[index], "DEALERSHIP")["fpp"];
      finalgrid.push({ place: index + 1, position: index + 1, name: randomcars[index]["name"] + " " + randomcars[index]["year"], drivername: require(gtf.GTF).randomdriver(), user: false, fpp: fpp, oscore: score, score: score, points: 0 });
      amount--;
      score = score - 400
      index++;
    }
    if (condition == "BOP") {
      var fppmed = median(finalgrid.slice().map(x => x["fpp"]))

    finalgrid.forEach(function (x) {
    if (x["fpp"] > fppmed + 10) {
      x["fpp"] = gtftools.randomInt(fppmed, fppmed + 10)
    } 
    if (x["fpp"] < fppmed - 10) {
      x["fpp"] = gtftools.randomInt(fppmed - 10, fppmed)
    }
    }); 
    }

    return finalgrid;
  }

  function median(numbers) {
    var median = 0, numsLen = numbers.length;
    numbers.sort();
 
    if (
        numsLen % 2 === 0 
    ) {
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { 
        median = numbers[(numsLen - 1) / 2];
    }
 
    return median;
}
};

module.exports.lapcalc = function (km, limit) {
  var laps = 1;
  var totalkm = km;

  while (totalkm < limit) {
    totalkm = totalkm + km;
    laps++;
  }
  if (laps > 1) {
    var chancel = Math.round(Math.random());
    if (chancel == 1) {
      laps--;
      totalkm = totalkm - km;
    }
  }
  totalkm = Math.round(1000 * totalkm) / 1000;
  var totalmi = Math.round(100 * (totalkm / 1.609)) / 100;
  return [laps, totalkm, totalmi];
};

module.exports.calculatecredits = function (racesettings, raceprep, finalgrid) {

  if (racesettings["mode"] == "ARCADE") {
    if (raceprep["modearg"] == "beginner") {
      var positions = [{ place: '1st', credits: 1000 },
  { place: '2nd', credits: 800 },
  { place: '3rd', credits: 600 },
  { place: '4th', credits: 500 },
  { place: '5th', credits: 400 },
  { place: '6th', credits: 300 },
  { place: '7th', credits: 200 },
  { place: '8th', credits: 100 }]
    } 
    else if (raceprep["modearg"] == "amateur") {
      var positions = [{ place: '1st', credits: 2500 },
  { place: '2nd', credits: 2300 },
  { place: '3rd', credits: 2000 },
  { place: '4th', credits: 1500 },
  { place: '5th', credits: 1300 },
  { place: '6th', credits: 1100 },
  { place: '7th', credits: 900 },
  { place: '8th', credits: 800 },
  { place: '9th', credits: 700 },
  { place: '10th', credits: 600 },
  { place: '12th', credits: 500 },
  { place: '13th', credits: 300 },
  { place: '14th', credits: 200 },
  { place: '15th', credits: 100},
  { place: '16th', credits: 100}
  ]
    } 
    else if (raceprep["modearg"] == "professional" || raceprep["modearg"] == "pro") {
      var positions =  [{ place: '1st', credits: 10000 },
  { place: '2nd', credits: 9000 },
  { place: '3rd', credits: 8000 },
  { place: '4th', credits: 7000 },
  { place: '5th', credits: 6000 },
  { place: '6th', credits: 5000 },
  { place: '7th', credits: 4500 },
  { place: '8th', credits: 4000 },
  { place: '9th', credits: 3000 },
  { place: '10th', credits: 2500 },
  { place: '12th', credits: 2000 },
  { place: '13th', credits: 1700 },
  { place: '14th', credits: 1400},
  { place: '15th', credits: 1200},
  { place: '16th', credits: 1100},
  { place: '17th', credits: 1000},
  { place: '18th', credits: 900},
  { place: '19th', credits: 800},
  { place: '20th', credits: 700}
  ];
    
    }
    else if (raceprep["modearg"] == "endurance") {
       var positions =  [{ place: '1st', credits: 25000 },
  { place: '2nd', credits: 20000 },
  { place: '3rd', credits: 15000 },
  { place: '4th', credits: 10000 },
  { place: '5th', credits: 5000 },
  { place: '6th', credits: 0 },
  { place: '7th', credits: 0 },
  { place: '8th', credits: 0 },
  { place: '9th', credits: 0 },
  { place: '10th', credits: 0 },
  { place: '12th', credits: 0 },
  { place: '13th', credits: 0 },
  { place: '14th', credits: 0},
  { place: '15th', credits: 0},
  { place: '16th', credits: 0},
  { place: '17th', credits: 0},
  { place: '18th', credits: 0},
  { place: '19th', credits: 0},
  { place: '20th', credits: 0}
  ];
    } 
    else if (raceprep["modearg"].includes("custom")) {
      var positions = customcalc(racesettings, raceprep)
      return positions
    }
    ///////
    for (var x = 0; x < positions.length; x++) {
    if (racesettings["type"] == "TIME") {
      var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["misc"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[1])
      position["x"]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (km / 120)));
    } else {
      if (racesettings["laps"] <= 1) {
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["km"] / 10)));
      } else {
  
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] + positions[x]["credits"] * (racesettings["km"] / 50)));
        
        
      }
    }
  }
    return positions
  } 
  else if (racesettings["mode"] == "DRIFT") {
    if (raceprep["modearg"] == "driftbeginner") {
      var positions = [{ place: '1st', credits: 1000 },
  { place: '2nd', credits: 750 },
  { place: '3rd', credits: 400 },
  { place: '4th', credits: 100 }];
    }
    if (raceprep["modearg"] == "driftprofessional") {
      var positions = [{ place: '1st', credits: 1500 },
  { place: '2nd', credits: 850 },
  { place: '3rd', credits: 500 },
  { place: '4th', credits: 250 }]
    }

    for (var x = 0; x < positions.length; x++) {
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["km"] / 2)));
    }
    return positions
} else if (racesettings["mode"] == "SSRX") {
    var positions = [{place:"1st", credits: 0}];
    return positions
  }

  return [{place:"1st", credits: 0}]
  
return positions
  function customcalc(racesettings, raceprep) {
    var credits = ((100 - racesettings["difficulty"]) * 105) + ( racesettings["grid"]-8) * 200
  var positions = []
  for (var x = 0; x < racesettings["grid"]; x++) {
    var temp = {}
    if (x % 10 == 0 && x + 1 != 11) {
      temp["place"] = (x + 1) + "st"
    } else if (x % 10 == 1 && x + 1 != 12) {
      temp["place"] = (x + 1) + "nd"
    } else if (x % 10 == 2 && x + 1 != 13) {
      temp["place"] = (x + 1) + "rd"
    } else {
      temp["place"] = (x + 1) + "th"
    }
    
    if (racesettings["type"] == "TIME") {
      var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["misc"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[1])
      temp["credits"] = Math.round(parseFloat(credits * (km / 80)));
    } else {
      if (racesettings["laps"] <= 1) {

      temp["credits"] = Math.round(parseFloat(credits * (racesettings["km"] / 10)));
      } else {
    var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];

    var percentage = (1 - (fpp/700)) / 5
    if (percentage <= 0) {
      percentage = 1 - Math.abs(percentage)
    } else {
      percentage = 1 + percentage
    }
      
      var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
      if (minfpp >= fpp) {
          percentage = percentage
      } else {
        percentage = percentage - ((fpp - minfpp) * 0.0005)
      }
     if (percentage <= 0.5) {
       percentage = 0.5
     }
      temp["credits"] = Math.round(parseFloat(credits + credits * (racesettings["km"] / 60)) * percentage);
      }
    }
    positions.push(temp)

    credits = Math.ceil((credits - (credits / (racesettings["grid"]/2)  )) / 100) * 100;
  }
  return positions
}
}
//////////////////////////////////////
module.exports.startssrx = function ([speedkmh, speedmph], racesettings, racedetails, finalgrid, user, userdata) {
  stats.updatecurrentcarclean(userdata)
  stats.addmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileagecar(racesettings["km"], racesettings["mi"], userdata);
  var speeduser = [speedkmh + "kmh", speedmph + "mph"]
  speeduser = speeduser[userdata["settings"]["MILEAGE"]]
  
  var results2 = "**Top Speed:** " + speeduser + "\n" + "**Car:** " + racesettings["misc"]["car"]["name"] + " **" + racesettings["misc"]["car"]["fpp"] + emote.fpp + "**";
  return results2;
};

module.exports.start = function (racesettings, racedetails, finalgrid, user, userdata) {
  var score;
  var positions = [...racesettings["positions"]];
  var position;
  var prize = 0;
  var sprize = 0
  var mprize = 0;
  var racemultibonus = ""
  var sponsorbonus = ""
  var championship = ""
  var championshippos = ""
  var positionlist = ["1st","2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th","21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th"]
  var championshippoints = [100,80,60,50,40,30,25,20,15,10,9,8,7,6,5,4,3,2,1,0]

  //////CAREER/////
   if (racesettings["mode"] == "CAREER") {
  if (racesettings["championship"][0]) {
  finalgrid = finalgrid.map(function(x, index) {
    if (index >= championshippoints.length) {
      x["points"] = x["points"] + 0
    } else {
    x["points"] = x["points"] + championshippoints[index]
    }
    return x
  })
  
finalgrid.slice().sort(function(a,b) {
  if (a.points === b.points) {
    return a.position - b.position
  }
  return b.points - a.points
  }).map(function(x, index) {
    if (x["user"]) {
      championshippos = [index, positionlist[index]]
    }
    return x
})
  }
}
  var user = finalgrid.slice().filter(x => x["user"] == true)[0]
  var position = user["position"]

   if (racesettings["mode"] == "CAREER") {
  if (racesettings["championship"][0]) {
  championship = "\n" + "__Total Points__" + "\n" + 
  "**" + championshippos[1] + " Place: **" + "`" + user["points"] + "pts`"

  userdata["raceinprogress"]["championshipnum"]++

  if (userdata["raceinprogress"]["championshipnum"] >= racesettings["championship"][1]) {
    userdata["raceinprogress"]["championshipnum"] = "DONE"
    for (var i = 0; i < racesettings["championship"][1]; i++) {
    stats.updatecareerrace(racesettings["raceid"].split("-").slice(0,2).join("-") + "-" + (i+1), championshippos[1], userdata);
    }
    prize = positions[championshippos[0]]["credits"];
  } else {
    prize = 0
  }
  } else if (typeof positions[position-1] === 'undefined') {
    prize = 0
  } else {
    prize = positions[position-1]["credits"];
  }
  } else if (typeof positions[position-1] === 'undefined') {
    prize = 0
  } else {
    prize = positions[position-1]["credits"];
  }

/*
  if (racesettings["mode"] == "ARCADE") {
    if (racesettings["type"] == "TIME") {
      prize = Math.round(parseFloat(prize * (racesettings["km"] / 120)));
    } else {
      if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize * (racesettings["km"] / 60)));
      } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["km"] / 60)));
      }
    }
  }
  */

  var exp = Math.round(prize / 10);
  //////CAREER/////
  if (racesettings["mode"] == "CAREER") {
    exp = Math.round(Math.round(prize / 10) * 1.6);
  }

  if (stats.racemulti(userdata) > 1) {
    prize = Math.round(prize * stats.racemulti(userdata))
    racemultibonus = " `x" + stats.racemulti(userdata).toString() + "`"
  }

  if (prize == 0) {
    racemultibonus = ""
  }

  sprize = require(gtf.SPONSORS).creditbonus(prize, racesettings["misc"]["car"], userdata)
  if (sprize > 0) {
    sponsorbonus = "\n" + "`" + userdata["sponsor"]["name"] + " Sponsor Bonus:` " + "**" + gtftools.numFormat(sprize) + "**" + emote.credits
  }

  stats.updatecurrentcarclean(racesettings["km"], userdata)
  //stats.updatecurrentcaroil(racesettings["km"], userdata)
  stats.addcredits(prize + sprize, userdata);
  stats.addmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileagecar(racesettings["km"], racesettings["mi"], userdata);
  stats.addexp(exp, userdata);

  if (racesettings["mode"] == "CAREER") {
    if (!racesettings["championship"][0]) {
    stats.updatecareerrace(racesettings["raceid"], positionlist[position-1], userdata);
    }
  }
  return "__**" + [emote.goldmedal + " 1st", emote.silvermedal + " 2nd", emote.bronzemedal + " 3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th","21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th"][position-1] + " Place**__ " + "**+" + gtftools.numFormat(prize) + emote.credits + racemultibonus + " +" + gtftools.numFormat(exp)+ emote.exp + "**" + sponsorbonus + championship;
};
///////////////CAREER/////////////////

module.exports.careerevent = function (races, query, embed, msg, callback, userdata) {
  
  if (races === undefined) {
    return;
  }  
  var screen = false
  var number = query["number"]
  
  if (!gtftools.betweenInt(number, 1, Object.keys(races).length)) {
    return;
  }
  var event = races[Object.keys(races)[number - 1]];
  
  if (stats.currentcarmain(userdata) == "No car.") {
    require(gtf.EMBED).alert({ name: "❌ Error", description: "You do not have a current car.", embed: "", seconds: 0 }, msg, userdata);
    return;
  }

    var currentcar = stats.currentcar(userdata);

  function checktires() {
    currentcar = stats.currentcar(userdata);
    embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}])
    require(gtf.GTF).checktireregulations(currentcar, {tires:event["tires"]}, continuee, "", msg, embed, userdata);  
  }

  function continuee() {
  embed.setColor(userdata["settings"]["PROGRESSBAR"][2]);
  var results = "";
  
  var tracks = event["tracks"];
  var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var title = event["type"] != "TIMETRIAL" ? stats.eventstatus(event["eventid"], userdata) + " __" + event["title"] + " (" + tracks.length + " Races)" + "__" : stats.eventstatus(event["eventid"], userdata) + " __" + event["title"] + " (" + tracks.length + " Events)" + "__"
  embed.setTitle(title);
  
  if (typeof query["track"] !== 'undefined') {
      func(parseInt(query["track"]) - 1)
      return
  }
  event["championship"][1] = tracks.length

  for (var j = 0; j < tracks.length; j++) {
    var raceid = event["eventid"] + "-" + (j + 1).toString();
    var lapsx = tracks[j][2] + " Laps"
    if (typeof tracks[j][2] === 'string') {
      lapsx = tracks[j][2].replace("m", " Minutes")
    }
    var trackname = Object.assign({}, tracks[j][1]);
    if (typeof tracks[j][1] !== 'string') {
      if (raceid.match(/rally/ig)) {
      trackname = "Stage Route " + (j+1)
      }
    } else {
      trackname = tracks[j][1]
    }
    results = results + numberlist[j] + " " + trackname + " **" + lapsx + "** " + stats.checkcareerrace(raceid, userdata) + "\n";
  }
    if (event["type"] == "TIMETRIAL") {
      var prizemoney = ["**" + emote.goldmedal + " " + require(gtf.DATETIME).getFormattedLapTime(event["positions"][0]["time"] * 1000), emote.silvermedal + " " + require(gtf.DATETIME).getFormattedLapTime(event["positions"][1]["time"] * 1000) + " ", emote.bronzemedal + " " + require(gtf.DATETIME).getFormattedLapTime(event["positions"][2]["time"] * 1000) + "**"]
    } else {
  var prizemoney = event["positions"].slice(0, 3).map(function (x) {
    var credits = x["credits"].toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "**" + x["place"] + "**" + " **" + credits + "**" + emote.credits;
  });
    }
    
  if (event["prize"][0] == "RANDOMCAR") {
    var prizename = "Mystery Car";
  }
  if (event["prize"][0] == "CREDITS") {
    var prizename = "**" + gtftools.numFormat(event["prize"][1]["item"]) + "**" + emote.credits;
  }
  var bop = ""
  var weather = ""
  var championship = ""
  var timetrial = ""
  if (event["bop"]) {
    bop = "\n" + emote.bop + " **BOP will be used for balanced gameplay.**"
  }
  if (event["weatherchange"] > 0) {
    weather = "\n" + emote.weather + " **There is ~" + event["weatherchange"] + "%" + " of weather changeability in this event.**"  
  }
  if (event["championship"][0]){
    championship = "\n" + "🏆" + " **This championship must be fully completed in order to reward credits. Due to bot limitations, do not stay in the race results too long or you will lose your progress.**"
  }
  if (event["type"] == "TIMETRIAL") {
    timetrial = "\n" + "⌛ **Multiple laps will be recorded in real time. The time trial ends after a certain amount of laps or the lap time succeed with a gold medal.**"
  }
    if (event["type"] == "TIMETRIAL") {
      var limits = "🚘 **" + event["car"] + "**"
    } else {
  var limits = "**" +
            event["fpplimit"].toString().replace("9999", "--") + emote.fpp + " " + 
            event["upperpower"].toString().replace("9999", "--") + " hp" + " " +     gtftools.numFormat(event["upperweight"].toString().replace("9999", "--")) + " Lbs" + " " +
            emote.tire  + event["tires"] +
            "**"
    }

  results = prizemoney.join(" ") + "\n" 
  + results + "\n" + 
  limits + 
  bop + championship + weather + timetrial+ "\n\n" +emote.goldmedal + " **Reward:** " + prizename 
  if (userdata["settings"]["TIPS"] == 0) {
    results = results + "\n\n" + 
   "**❓ React to one of the numbers below this message that corresponds to a specific race for entry.**"
  }

  embed.setDescription(results);

  var emojilist = [];
  var functionlist = []

  ////
  var index = 0
    for (index; index < tracks.length; index++) {
      if (event["championship"][0]) {
      emojilist.push({
        emoji: numberlist[index], 
        emoji_name: numberlist[index],
        name: "Start Championship",
        extra: "",
        button_id: index
      })
    index++
      break
      }
      emojilist.push({
        emoji: numberlist[index], 
        emoji_name: numberlist[index],
        name: "",
        extra: "",
        button_id: index
      })
      
    }
    emojilist.push({
        emoji: emote.credits, 
        emoji_name: "credits",
        name: "Prizes",
        extra: "",
        button_id: index
    })
    index++
    emojilist.push({
        emoji: emote.exit, 
        emoji_name: "gtfexit",
        name: "Back",
        extra: "Once",
        button_id: index
    })

/////

    function func(index) {
      var trackname = tracks[index][1];
      currentcar = stats.currentcar(userdata)
      if (typeof trackname !== 'string') {
        var t = require(gtf.COURSEMAKER).trackparams(trackname);
        var track = require(gtf.COURSEMAKER).drawtrack(t, bcallback)
        function bcallback(track) {    
        track["name"] = "Route " + (index + 1) 
        track["options"] = ["Drift"];
        track["author"] = "GTFITNESS";
        var racesettings = require(gtf.RACE).setcareerrace(event, track, currentcar, index);
      racesettings["misc"]["loading"] =
        "__**Race " +
        (index + 1) +
        " - " +
        track["name"] +
        "**__\n" +
        prizemoney.join(" ") +
        "\n\n" +
        "🚘 " +
        "**" +
        currentcar["name"] +
        " " +
        currentcar["fpp"] +
        emote.fpp +
        emote.tire +
        currentcar["tires"]["current"]
          .split(" ")
          .map(x => x[0])
          .join("") +
        "**";
         callback(racesettings);
        }
      } else {
        
if (event["type"] == "TIMETRIAL") {
  currentcar = stats.addcar(require(gtf.CARS).find({fullname: [event["car"]] })[0], "LOAN") 
}
        
  var track = require(gtf.TRACKS).find({ name: [trackname] })[0];
    
 var racesettings = require(gtf.RACE).setcareerrace(event, track, currentcar, index);
   
      racesettings["misc"]["loading"] =
        "__**Race " +
        (index + 1) +
        " - " +
        track["name"] +
        "**__\n" +
        prizemoney.join(" ") +
        "\n\n" +
        "🚘 " +
        "**" +
        currentcar["name"] +
        " " +
        currentcar["fpp"] +
        emote.fpp +
        emote.tire +
        currentcar["tires"]["current"]
          .split(" ")
          .map(x => x[0])
          .join("") +
        "**";
        
         callback(racesettings);
      }
    }


var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

  require(gtf.DISCORD).send(msg, { embeds: [embed], components: buttons }, nextfunc)
  function nextfunc(msg) {
    function creditrewards() {
      //////
      if (screen == true) {
        screen = false
        embed.setDescription(results)
        msg.edit({embeds:[embed]})
        return
      }
      screen = true
      results2 = event["positions"].slice(0, 6).map(function (x) {   
    var credits = gtftools.numFormat(x["credits"])
        if (x["place"] == "1st") {
          return "**" + emote.goldmedal + " " + x["place"] + ":**" + " **" + credits + "**" + emote.credits;
        }
        if (x["place"] == "2nd") {
          return "**" + emote.silvermedal + " " + x["place"] + ":**" + " **" + credits + "**" + emote.credits;
        }
        if (x["place"] == "3rd") {
          return "**" + emote.bronzemedal + " " + x["place"] + ":**" + " **" + credits + "**" + emote.credits;
        }
    return "**" + x["place"] + ":**" + " **" + credits + "**" + emote.credits;
  });
  results2.unshift("__Prizes__")
     results2 = results2.join("\n")
    if (userdata["settings"]["TIPS"] == 0) {
    results2 = results2 + "\n\n" + 
   "**❓ Click the button again to go back to the previous screen.**"
  }
  embed.setDescription(results2)
   msg.edit({embeds:[embed]})
   return
  }
  //////
    index = 0
    for (index; index < tracks.length; index++) {
      if (event["championship"][0]) {
      functionlist.push(func)
      break;
      }     
      functionlist.push(func)
    }
    functionlist.push(creditrewards)
    if (event["eventid"].includes("seasonal")) {
      functionlist.push(function(){
      require(dir + "commands/seasonal").execute(msg, {options:"list"}, userdata);
    })
    } else {
    functionlist.push(function(){
      require(dir + "commands/career").execute(msg, {options:event["eventid"].split("-")[0]}, userdata);
    })
    }
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
  }
}
  console.log(event["car"] != "GARAGE")
  if (event["car"] != "GARAGE") {
    continuee()
    return
  } else {
  var regulations = require(gtf.GTF).checkregulations(currentcar, event, checktires, "", msg, embed,userdata);
  }
};

module.exports.setcareerrace = function (event, track, currentcar, index) {
  var title = event["type"] == "TIMETRIAL" ? event["title"] : event["title"] + " - " + "Race " + (index + 1)
  
  var racesettings = {
    title: title,
    image: track["image"],
    grid: event["grid"],
    type: event["type"],
    category: event["category"],
    time: event["time"],
    timeprogression: event["timeprogression"],
    weather: event["weather"],
    weatherchange: event["weatherchange"],
    positions: event["positions"],
    track: track,
    cleanbonus: 3,
    difficulty: event["difficulty"],
    laps: event["tracks"][index][2],
    km: Math.round(1000 * track["length"] * event["tracks"][index][2]) / 1000,
    mi: Math.round(100 * ((track["length"] * event["tracks"][index][2]) / 1.609)) / 100,

    mode: "CAREER",
    raceid: event["eventid"] + "-" + event["tracks"][index][0],
    eventlength: event["tracks"].length,

    models: event["models"],
    makes: event["makes"],
    types: event["types"],
    countries: event["countries"],
    tires: event["tires"],
    drivetrains: event["drivetrains"],
    engines: event["engines"],
    special: event["special"],
    prohibited: event["prohibited"],
    bop: event["bop"],
    championship: event["championship"],
    fpplimit: event["fpplimit"],
    upperfpp: event["upperfpp"],
    lowerfpp: event["lowerfpp"],
    upperpower: event["upperpower"],
    lowerpower: event["lowerpower"],
    upperweight: event["upperweight"],
    lowerweight: event["lowerweight"],
    prize: event["prize"],
    misc: { otires: currentcar["tires"]["current"].slice(), tirechange: true, car: currentcar },
  };
  return racesettings;
};

module.exports.startonline = function (racesettings, racedetails, finalgrid, user, userdata) {

  var positions = [];
  var position;
  var prize = 1000;
  var winners = [];
  var finalgridwinners = racesettings["players"];

  if (racesettings["type"] == "TIME") {
      prize = Math.round(parseFloat(prize * (racesettings["km"] / 120))) 
  } else {
      if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize + prize * (racesettings["km"] / 60)));
    } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["km"] / 60)));
      }
  }

  for (var x = 0; x < finalgridwinners.length; x++) {
    if (x % 10 == 0 && x + 1 != 11) {
      positions.push({place:emote.goldmedal + " " + (x + 1) + "st", credits:prize});
    } else if (x % 10 == 1 && x + 1 != 12) {
      positions.push({place:emote.silvermedal + " " + (x + 1) + "nd", credits:prize});
    } else if (x % 10 == 2 && x + 1 != 13) {
      positions.push({place:emote.bronzemedal + " " + (x + 1) + "rd", credits:prize});
    } else {
      positions.push({place:x + 1 + "th", credits:prize});
    }
    prize = Math.ceil((prize - (prize / finalgridwinners.length)) / 100) * 100;
  }

  var rnorm = require("random-normal");

  finalgridwinners = finalgridwinners.sort((x, y) => y["score"] - x["score"]);

  var index = 0;

  var exp = 0;

  finalgridwinners.forEach(function (x, i) {
    position = positions[x["position"] - 1]["place"]
    prize = positions[x["position"] - 1]["credits"]
    if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize * (racesettings["km"] / 10)));
      } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["km"] / 10)));
    }

    if (x["user"]) {
    winners.push("**" + position + "** " + "<@" + x["id"] + ">" + " " + "**+" + prize + emote.credits + " +" + exp + emote.exp + "**" + "\n" + x["car"]["name"]);
    } else {
      winners.push("**" + position + "** `"+ x["drivername"] + "` " + "**+" + prize + emote.credits + " +" + exp + emote.exp + "**" + "\n" + x["car"]["name"]);
    }

    if (x["user"]) {
      require(gtf.LOBBY).saveuserdata(x, exp, prize, racesettings)
    }
  });

  return winners.slice(0,5).join("\n");
};

module.exports.preracedetails = function(racesettings, embed, msg, userdata) {
  var results = ""
  embed.setTitle("__" + racesettings["title"] + "__");
  var laps = racesettings["laps"];
  if (racesettings["type"] == "LAPS") {
    var lapntime = "**Lap(s):** " + laps + "\n" + "**Total Distance:** " + [racesettings["km"] + " km", racesettings["mi"] + " mi"][userdata["settings"]["MILEAGE"]] + "\n"
  } 

  if (racesettings["type"] == "TIME") {
     var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["misc"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  speed111[0] = Math.round(speed111[0] * 1.609)
    racesettings["km"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[1])
    racesettings["mi"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[0])
    var lapntime = "**Time:** " + laps.replace("m", " Minutes") + "\n" + "**Total Distance (Estimated):** " + [racesettings["km"] + " km", racesettings["mi"] + " mi"][userdata["settings"]["MILEAGE"]] + "\n";
  }

  if (racesettings["type"] == "TIMETRIAL") {
    var lapntime = "**Total Distance:** ---" + "\n"
  } 
 
 
  var racedetails = "__Session Details__" + "\n" +
    "**Track:** " + racesettings["track"]["name"] + "\n" +
    "**Track Conditions:** " + racesettings["time"]["emoji"] +
    " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] + " | " + 
  racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + " 💧" + racesettings["weather"]["wetsurface"] + "%" + "\n" +
    lapntime + "**Grid:** " + racesettings["grid"] + " cars";
  
  if ((racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") && racesettings["type"] != "TIMETRIAL") {
    racedetails = racedetails + "\n\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-conditions", name2:racesettings["weather"]["name"]}) + " " + require(gtf.ANNOUNCER).say({name1:"pre-race-comments"}) + "`"
  }

  var msgjson = { embeds: [embed], components:[] }
  if (typeof racesettings["image"] !== "undefined") {
    if (racesettings["image"]) {
  if (racesettings["image"].length != 0) {
    if (racesettings["image"].includes("https://")) {
      embed.setThumbnail(racesettings["image"]);
    } else {
    var attachment = Buffer.isBuffer(racesettings["image"]) ? new AttachmentBuilder(racesettings["image"], {name: "course.png"}) : new AttachmentBuilder(racesettings["image"].buffer, {name: "course.png"});

    embed.setThumbnail("attachment://course.png");
    msgjson = { embeds: [embed], files: [attachment], components: []}
  }
    }
      
  }
  }
  return [results, racedetails, msgjson]
}
