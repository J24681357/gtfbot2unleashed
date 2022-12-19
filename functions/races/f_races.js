var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.setracesettings = function (raceprep, gtfcar, embed, msg, userdata) {

    var carselect = raceprep["car"] == "GARAGE" ? gtfcar : stats.addcar(require(gtf.CARS).find({fullname: [raceprep["car"]] })[0], "LOAN")

  if (typeof raceprep["track"] == "string") {
    var track = require(gtf.TRACKS).find({ name: [raceprep["track"]] })[0];
    var km = track["length"]
  } else {
    if (typeof raceprep["track"]["layout"] === 'undefined') {
    var track = require(gtf.TRACKS).random(raceprep["track"], 1)[0];
    var km = track["length"];
    } else {
      var track = raceprep["track"]
      var km = track["lengthkm"]
    }
  }

  if (Object.keys(raceprep["racesettings"]).length != 0) {
    racesettings = raceprep["racesettings"];
    racesettings["time"] = require(gtf.TIME).random({ name: racesettings["time"], timeprogression: racesettings["timeprogression"] }, 1)[0];
    racesettings["weather"] = require(gtf.WEATHER).random({ name: racesettings["weather"], weatherchange: racesettings["weatherchange"]}, 1)[0];
    racesettings["track"] = track
    racesettings["image"] = track["image"]
    racesettings["driver"] = {name: msg.guild.members.cache.get(userdata["id"]).user.username, car: carselect, otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true}
      if (racesettings["type"] == "TIME") {
      racesettings["distance"] = {km: "N/A", mi: "N/A"}
      } 
      else if (racesettings["type"] == "TIMETRIAL") {
          var km = require(gtf.MATH).round(track.length * (parseFloat(racesettings["laps"].split("%")[0]) / 100), 3)
      racesettings["distance"] = {km: km, mi: require(gtf.MATH).round(km / 1.609, 2)}
        } else {    
      racesettings["distance"] = {km: Math.round(1000 * (racesettings["laps"] * km)) / 1000, mi: Math.round(100 * ((racesettings["laps"] * km) / 1.609)) / 100}
      }
    return racesettings
  } else {
  var racesettings = {
    title: "",
    eventid: "",
    raceid: 1,
    image: track["image"],
    mode: raceprep["mode"],
    type: "",
    
    bop: false,
    championship: false,
    damage: false,
    
    grid: 1,
    gridstart: "STANDING",
    startposition: 1,
    positions: [],
    car: raceprep["car"],
    driver: {name: msg.guild.members.cache.get(userdata["id"]).user.username, 
             car: carselect, 
             otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true},
    
    time: {},
    timeprogression: 1,
    weather: {},
    weatherchange: 0,
    track: track,
    laps: 0,
    distance: {km:0, mi: 0},
    
    regulations: {
      "tires": "",
      "fpplimit": 9999,
      "upperfpp": 9999,
      "lowerfpp": 0,
      "upperpower": 9999,
      "lowerpower": 0,
      "upperweight": 9999,
      "lowerweight": 0,
      "upperyear": 9999,
      "loweryear": 0,
      "countries": [],
      "makes": [],
      "models": [],
      "engines": [],
      "drivetrains": [],
      "types": [],
      "special": [],
      "prohibited": []
    },
    difficulty: 100
  }
  }
  
  
  if (raceprep["mode"] == "ARCADE") {
    if (raceprep["modearg"] == "beginner") {
      var limit = 8.0;
      racesettings["title"] = "Single Race - Beginner";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtftools.randomInt(8, 12)
      racesettings["difficulty"] = 90;
    } 
    else if (raceprep["modearg"] == "amateur") {
      var limit = 15.0;
      racesettings["title"] = "Single Race - Amateur";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtftools.randomInt(10, 16)
      racesettings["difficulty"] = 70;
    } 
    else if (raceprep["modearg"] == "professional" || raceprep["modearg"] == "pro")    {
      var limit = 25.0;
      racesettings["title"] = "Single Race - Professional";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtftools.randomInt(14, 20)
      racesettings["difficulty"] = 50;
    }
    else if (raceprep["modearg"] == "endurance") {
      var limit = ["30m", "45m", "60m", "90m", "120m"];
      limit = limit[Math.floor(Math.random() * limit.length)];
      racesettings["type"] = "TIME";
      racesettings["grid"] = 24
      racesettings["difficulty"] = 40;
      racesettings["title"] = "Single Race - " + limit + " of " + track["name"];
  }
    else if (raceprep["modearg"].includes("custom")) {
      var difficulty = parseInt(raceprep["modearg"].split("_")[1])
      raceprep["racesettings"]["difficulty"] = difficulty
      return raceprep["racesettings"]
    }
    
  } 
  else if (raceprep["mode"] == "DRIFT") {
    if (raceprep["modearg"] == "driftbeginner") {

      var limit = 1.0;
      racesettings["title"] = "Drift Trial - Beginner";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = 1
      racesettings["difficulty"] = 50;
      
    racesettings["originalsectors"] = 3;
    racesettings["sectors"] = 3;
    racesettings["current"] = 0;
    racesettings["points"] = 0;
    }
    if (raceprep["modearg"] == "driftprofessional") {
      var limit = 2.0;
      racesettings["title"] = "Drift Trial - Professional";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = 1
      racesettings["difficulty"] = 50;
      
    racesettings["originalsectors"] = 6;
    racesettings["sectors"] = 6;
    racesettings["current"] = 0;
    racesettings["points"] = 0;
    }
  }
  else if (raceprep["mode"] == "SSRX") {
    var limit = 0.01;
    racesettings["title"] ="Special Stage Route X - " + gtftools.numFormat(raceprep["modearg"]) + "m Top Speed Run";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = 1
  racesettings["difficulty"] = 100;
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


  if (track["options"].includes("sprint")) {
      limit = 0.01
  }

  if (!isNaN(limit)) {
    var distance = require(gtf.RACE).lapcalc(km, limit);
  } else {
    distance = [limit, "N/A", "N/A"];
  }

  racesettings["laps"] = distance[0]
  racesettings["distance"] = {km:distance[1], mi:distance[2]}
  racesettings["time"] = require(gtf.TIME).random({}, 1)[0];
  racesettings["weather"] = require(gtf.WEATHER).random({}, 1)[0];

  if (racesettings["mode"] == "SSRX") {
    
    
    racesettings["distance"] = {
      km:parseInt(raceprep["modearg"]) / 1000,
      mi:Math.round(100 * ((parseInt(raceprep["modearg"]) / 1000)/ 1.609)) / 100}
  }


racesettings["regulations"]["types"] = [require(gtf.CARS).find({ makes: [carselect["make"]], fullname: [carselect["name"]] })[0]["type"].split(":")[0]]
racesettings["regulations"]["upperfpp"] = carselect["fpp"] + 30
racesettings["regulations"]["lowerfpp"] = carselect["fpp"] -50
 
  racesettings["positions"] = require(gtf.RACE).calculatecredits(racesettings, raceprep)
  return racesettings;
};

module.exports.raceprep = function (raceprep, gtfcar, embed, msg, userdata) {
  var embed = new EmbedBuilder();
  raceprep["modearg"] = raceprep["modearg"].toString();
  var racesettings = require(gtf.RACE).setracesettings(raceprep, gtfcar, embed, msg, userdata);
  
  var carname = racesettings["driver"]["car"]["name"]
 
 if (raceprep["mode"] == "CAREER") {
    embed.fields = [];
  } 
 else if (raceprep["mode"] == "ONLINE") {
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
    racesettings["driver"] = { loading: racesettings["title"] };
  }

  var finalgrid = require(gtf.RACE).creategrid(racesettings, "");

  if (raceprep["mode"] == "DUEL") {
    var finalgrid = raceprep["players"]
    racesettings["fpplimit"] = raceprep["fpplimit"]
    racesettings["upperfpp"] = raceprep["fpplimit"]
    racesettings["locationid"] = raceprep["locationid"]
  } else if (raceprep["mode"] == "ONLINE") {
    var finalgrid = raceprep["players"]
  }
  
  var prerace = require(gtf.RACE).preracedetails(racesettings, embed, msg, userdata)

  var results = prerace[0]
  var racedetails = prerace[1]
  var msgjson = prerace[2]

  if (racesettings["type"] == "TIMETRIAL") {

require(gtf.RACEEX).timetrialracelength(racesettings, racedetails, finalgrid, true, 50 - (racesettings["difficulty"]/2), embed, msg, userdata);
    
    var prizemoney = [emote.goldmedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][0]["time"] * 1000) ,emote.silvermedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][1]["time"] * 1000), emote.bronzemedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][2]["time"] * 1000)]
  } else {
  var prizemoney = racesettings["positions"].slice(0, 3).map(function (x) {
    var credits = gtftools.numFormat(x["credits"])
    return x["place"] + " " + credits + emote.credits;
  });
  }
  
  loading = require(gtf.GTF).loadingscreen("__**" + racesettings["title"] + "**__" + "\n" + 
"**" + racesettings["track"]["name"] + "\n" + prizemoney.join(" ") + "**", carname);
  
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
  var tireslist = racesettings["driver"]["car"]["perf"]["tires"]["list"].filter(function(tire) {
  return require(gtf.GTF).checktireregulations(racesettings["driver"]["car"], {tires:tire}, "", embed, msg, userdata)[0]
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
var menu = gtftools.preparemenu("Change Tires " + "(" + racesettings["driver"]["car"]["perf"]["tires"]["current"] + ")" , tmenulist, temojilist, msg, userdata);
buttons.unshift(menu)
  }
  embed.setColor(userdata["settings"]["COLOR"])
  var user = msg.guild.members.cache.get(userdata["id"]).user.username;
 embed.setAuthor({name: user, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});

  ////DEBUG
  ////DEBUG
  
require(gtf.DISCORD).send(msg, msgjson, preracefunc)
  function preracefunc(msg) {
    var results2 = ""
    setTimeout(function () {
      embed.setDescription(results + racedetails);
      if (racesettings["mode"] != "ONLINE") {
        embed.setFields([{
          name:stats.main(userdata),
          value: require(gtf.CARS).shortname(racesettings["driver"]["car"]["name"]) + 
" " + "**" + racesettings["driver"]["car"]["fpp"] + emote.fpp + "**"}]);
      }

      msg.edit({embeds: [embed],  components: buttons}).then(msg => {
        userdata["raceinprogress"] = {active:false, 
                                      messageid: "", 
                                      channelid: "", 
                                      expire: undefined, 
                                      gridhistory:[], 
                                      msghistory:[], 
                                      tirehistory: [], 
                                      timehistory:[], weatherhistory:[], championshipnum:0}

        function flagstartrace() {
          if (userdata["raceinprogress"]["active"]) {
          require(dir + "commands/status").execute(msg, {options:"exit"}, userdata);
          } else {      
          embed.spliceFields(0, 1);
            try {
          require(dir + "functions/races/f_races_2").startsession(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
            } catch (error) {
              embed = new EmbedBuilder();
      require(gtf.EMBED).alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, msg, userdata);
      console.error(error);
            }
          return
        }
        }
        function trackdetails() {
          if (screen == true) {
            screen = false
             var griddd = finalgrid.slice().map(function (x) {
                  if (x["user"]) {
                    return "**" + x["position"] + ". " + require(gtf.CARS).shortname(x["name"]) + "**" + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + require(gtf.CARS).shortname(x["name"])  + " `" + x["drivername"] + "`";
                  }
            })
          if (griddd.length >= 10) {
            griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
          }
          var bop = ""
          if (racesettings["bop"]) {
            bop = " " + emote.bop
          }
            results2 =
              "__**Starting Grid" +
              " | " +
              racesettings["grid"] +
              " Cars" +
              "**__" + bop +
              "\n" +
              griddd.join("\n");

          embed.setDescription(results2);
          msg.edit({embeds: [embed], components:buttons});
          } else {
            screen = true
          embed.setDescription(results + racedetails);
          msg.edit({embeds: [embed], components: buttons});
          }
        }
        function tirechangen() {
          if (racesettings["driver"]["tirechange"]) {
          racesettings["driver"]["tirechange"] = false
          emojilist[2]["name"] = "Optimal Tire Usage | Off"
          buttons = gtftools.preparebuttons(emojilist.filter(x=> typeof x["menu_id"] === "undefined"), msg, userdata);
          buttons.unshift(menu)
          msg.edit({embeds: [embed], components:buttons});
          } else {
          racesettings["driver"]["tirechange"] = true
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
        racesettings["driver"]["car"]["perf"]["tires"]["current"] = tireslist[int] 
        racesettings["driver"]["otires"] = tireslist[int] 
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

module.exports.creategrid = function (racesettings, special) {
  var amount = racesettings["grid"]
  var car = racesettings["driver"]["car"]
  var username =racesettings["driver"]["name"]
  var bop = racesettings["bop"]
  var regulations = racesettings["regulations"]
  var mode = racesettings["mode"]
  
  var makes = regulations["makes"];
  var models = regulations["models"];
  var types = regulations["types"];
  var countries = regulations["countries"];
  var drivetrains = regulations["drivetrains"];
  var engines = regulations["engines"];
  var upperfpp = regulations["upperfpp"];
  var lowerfpp = regulations["lowerfpp"];
  var upperpower = regulations["upperpower"];
  var lowerpower = regulations["lowerpower"];
  var upperweight = regulations["upperweight"];
  var lowerweight = regulations["lowerweight"];
  
  var special = regulations["special"]
  var prohibited = regulations["prohibited"]
  var grid = [];
  
  if (amount == 1) {
    fpp = require(gtf.PERF).perf(car, "GARAGE")["fpp"]
    var finalgrid = [{ place: 1, position: 1, drivername: username, name: car["name"], damage: 0, user: true, fpp: fpp, oscore: 0, score: 0, points: 0, laps: [] }];
  
    return finalgrid;
  }

 
    if (racesettings["mode"] == "ARCADE") {
      var test = require(gtf.CARS).find({ makes: makes, name: models, drivetrains: drivetrains, engines: engines, types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight, special: special, prohibited:prohibited})
      while (lowerfpp >= 0) {
        if (test.length == 1 || test.length == 0) {
        upperfpp = upperfpp + 30
        lowerfpp = lowerfpp - 50
        test = require(gtf.CARS).find({ makes: makes, name: models, drivetrains: drivetrains,engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
        }
        if (test.length >= 2) {
          break;
        }
      }
    }
    if (racesettings["mode"] == "CAREER") {
      var test = require(gtf.CARS).find({ makes: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
      while (lowerfpp >= 0) {
        if (test.length >= 1) {
          break;
        }
        if (test.length == 0) {
        lowerfpp = lowerfpp - 50
        test = require(gtf.CARS).find({ makes: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight,  special: special, prohibited:prohibited })
        }
      }
    }
    
    var randomcars = require(gtf.CARS).random({ makes: makes, name: models, drivetrains: drivetrains, engines: engines,types: types, countries: countries, upperfpp: upperfpp, lowerfpp: lowerfpp, upperpower: upperpower, lowerpower: lowerpower, upperweight: upperweight, lowerweight: lowerweight, special: special, prohibited:prohibited }, amount);

    var finalgrid = [];
    var index = 0;
  if (racesettings["startposition"] == 0) {
    var position = gtftools.randomInt(2, amount - 1);
  } else {
    var position = racesettings["startposition"]
  }
    var fpp = 0
  if (racesettings["gridstart"] == "ROLLINGSTART") {
    var score = randomcars.length * 800
  } else {
    var score = randomcars.length * 400
  }
    while (index < randomcars.length) {
      if (position == amount && special != "AI") {
        fpp = require(gtf.PERF).perf(car, "GARAGE")["fpp"]
        finalgrid.push({ place: index + 1, 
                        position: index + 1,
                        drivername: username, 
                        name: car["name"], 
                        user: true, 
                        fpp: fpp, 
                        damage: 0,
                        oscore: score, 
                        score: score, 
                        points: 0,
                       laps: []});
        index++;
      }
      fpp = require(gtf.PERF).perf(randomcars[index], "DEALERSHIP")["fpp"];
      finalgrid.push({ place: index + 1,
                      position: index + 1,
                      drivername: require(gtf.GTF).randomdriver(), 
                      name: randomcars[index]["name"] + " " + randomcars[index]["year"], 
                      user: false,
                      fpp: fpp, 
                      damage: 0,
                      oscore: score, 
                      score: score, 
                      points: 0, 
                     laps: []});
      amount--;
      score = score - 400
      index++;
    }
    if (bop) {
      var fppmed = require(gtf.MATH).median(finalgrid.slice().map(x => x["fpp"]))

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

module.exports.calculatecredits = function (racesettings, raceprep) {
  var positions = racesettings["positions"]

  if (racesettings["mode"] == "CAREER") {
    var startcredits = parseInt(positions[0]["credits"])
    var positions = []
    var percentagecut = 1
    for (var x = 0; x < 30; x++) {
    var temp = {}
    if (x % 10 == 0 && x + 1 != 11) {
      temp["place"] = (x + 1) + "st"
    } else if (x % 10 == 1 && x + 1 != 12) {
      temp["place"] = (x + 1) + "nd"
      percentagecut = percentagecut * (0.65)
    } else if (x % 10 == 2 && x + 1 != 13) {
      temp["place"] = (x + 1) + "rd"
      percentagecut = percentagecut * (0.77)
    } else {
      temp["place"] = (x + 1) + "th"
      percentagecut = percentagecut * (0.90)
    }
    temp["credits"] = startcredits * percentagecut
    temp["credits"] = Math.ceil(temp["credits"] / 10) * 10;
      positions.push(temp)
    }
  } else if (racesettings["mode"] == "ARCADE") {
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
      return
    }
    for (var x = 0; x < positions.length; x++) {
    if (racesettings["type"] == "TIME") {
      var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["driver"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  var km = Math.round((parseInt(racesettings["laps"].split("m")[0])/60) * speed111[1])
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (km / 120)));
    } else {
      if (racesettings["laps"] <= 1) {
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["distance"]["km"] / 10)));
      } else {
  
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] + positions[x]["credits"] * (racesettings["distance"]["km"] / 50)));
        
        
      }
    }
  }
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
      positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["distance"]["km"] / 2)));
    }
} 
  else if (racesettings["mode"] == "SSRX") {
    var positions = [{place:"1st", credits: 0}];
  }
  
return positions
  //216,000 - (216,000 * 0.30)
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
      var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["driver"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[1])
      temp["credits"] = Math.round(parseFloat(credits * (km / 80)));
    } else {
      if (racesettings["laps"] <= 1) {

      temp["credits"] = Math.round(parseFloat(credits * (racesettings["distance"]["km"] / 10)));
      } else {
    var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];

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
      temp["credits"] = Math.round(parseFloat(credits + credits * (racesettings["distance"]["km"] / 60)) * percentage);
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

/*  stats.updatecurrentcarclean(userdata)
*/
  stats.addmileage(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  stats.addtotalmileage(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  stats.addtotalmileagecar(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  
  var speeduser = [speedkmh + "kmh", speedmph + "mph"]
  speeduser = speeduser[userdata["settings"]["UNITS"]]
  
  var results2 = "**Top Speed:** " + speeduser + "\n" + "**Car:** " + racesettings["driver"]["car"]["name"] + " **" + racesettings["driver"]["car"]["fpp"] + emote.fpp + "**";
  return results2;
};

module.exports.start = function (racesettings, racedetails, finalgrid, userdata) {
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
  if (racesettings["championship"]) {
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
  if (racesettings["championship"]) {
  championship = "\n" + "__Total Points__" + "\n" + 
  "**" + championshippos[1] + " Place: **" + "`" + user["points"] + "pts`"

  userdata["raceinprogress"]["championshipnum"]++

  if (userdata["raceinprogress"]["championshipnum"] >= racesettings["eventlength"]) {
    userdata["raceinprogress"]["championshipnum"] = "DONE"
    stats.updatecareerrace(racesettings, championshippos[1], userdata);
    if (typeof positions[championshippos[0]] == "undefined") {
      prize = 0
    } else {
    prize = positions[championshippos[0]]["credits"];
    }
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


  var exp = Math.round(prize / 20);
  //////CAREER/////
  if (racesettings["mode"] == "CAREER") {
    exp = Math.round(Math.round(prize / 20) * 1.6);
  }

  if (stats.racemulti(userdata) > 1) {
    prize = Math.round(prize * stats.racemulti(userdata))
    racemultibonus = " `x" + stats.racemulti(userdata).toString() + "`"
  }

  if (prize == 0) {
    racemultibonus = ""
  }

  sprize = require(gtf.SPONSORS).creditbonus(prize, racesettings["driver"]["car"], userdata)
  if (sprize > 0) {
    sponsorbonus = "\n" + "`" + userdata["sponsor"]["name"] + " Sponsor Bonus:` " + "**" + gtftools.numFormat(sprize) + "**" + emote.credits
  }
  if (racesettings["damage"]) {
  stats.updatedamage(racesettings, user, userdata)
  }

   if (position == 0) {
    userdata["stats"]["numwins"]++
  }
  userdata["stats"]["numraces"]++
  
  stats.addcredits(prize + sprize, userdata);
  stats.addmileage(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  stats.addtotalmileage(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  stats.addtotalmileagecar(racesettings["distance"]["km"], racesettings["distance"]["mi"], userdata);
  stats.addexp(exp, userdata);

  if (racesettings["mode"] == "CAREER") {
    if (!racesettings["championship"]) {
    stats.updatecareerrace(racesettings, positionlist[position-1], userdata);
    }
  }
  return [emote.goldmedal + " __**1st", emote.silvermedal + " __**2nd", emote.bronzemedal + " __**3rd", "__**4th", "__**5th", "__**6th", "__**7th", "__**8th", "__**9th", "__**10th", "__**11th", "__**12th", "__**13th", "__**14th", "__**15th", "__**16th", "__**17th", "__**18th", "__**19th", "__**20th","21st", "__**22nd", "__**23rd", "__**24th", "__**25th", "__**26th", "__**27th", "__**28th", "__**29th", "__**30th"][position-1] + " Place**__ " + "**+" + gtftools.numFormat(prize) + emote.credits + racemultibonus + " +" + gtftools.numFormat(exp)+ emote.exp + "**" + sponsorbonus + championship;
};
///////////////CAREER/////////////////

module.exports.careerraceselect = function (event, query, callback, embed, msg, userdata) {

  var screen = false
  var gtfcar = stats.currentcar(userdata);

  if (event["car"] != "GARAGE") {
    continuee()
    return
  } else {
  require(gtf.GTF).checkregulations(gtfcar, event["regulations"], checktires, embed, msg, userdata);
  }

  function checktires() {
    gtfcar = stats.currentcar(userdata);

    embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}])
    require(gtf.GTF).checktireregulations(gtfcar, event["regulations"], continuee, embed, msg, userdata);  
  }
  function continuee() {
  embed.setColor(userdata["settings"]["COLOR"]);
  var results = "";
  
  var tracks = event["tracks"];
  var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var title = event["type"] != "TIMETRIAL" ? stats.eventstatus(event["eventid"], userdata) + " __" + event["title"] + " (" + tracks.length + " Races)" + "__" : stats.eventstatus(event["eventid"], userdata) + " __" + event["title"] + " (" + tracks.length + " Events)" + "__"
  embed.setTitle(title);
  
  if (typeof query["track"] !== 'undefined') {
      func(parseInt(query["track"]) - 1)
      return
  }
    
  event["mode"] = "CAREER"
  event["positions"] = require(gtf.RACE).calculatecredits(event)
  for (var j = 0; j < tracks.length; j++) {
    var raceid = j + 1
    var lapsx = tracks[j][2] + " Laps"
    if (typeof tracks[j][2] === 'string') {
      lapsx = tracks[j][2].replace("m", " Minutes")
    }
    var trackname = Object.assign({}, tracks[j][1]);
    if (typeof tracks[j][1] !== 'string') {
      if (event["eventid"].match(/rally/ig)) {
      trackname = "Stage Route " + (j+1)
      }
    } else {
      trackname = tracks[j][1]
    }
    results = results + numberlist[j] + " " + trackname + " **" + lapsx + "** " + stats.getraceprogress(event, raceid, userdata) + "\n";
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
    
  if (event["prize"]["type"] == "RANDOMCAR") {
    var prizename = "Mystery Car";
  }
  if (event["prize"]["type"] == "CREDITS") {
    var prizename = "||" + "**" + gtftools.numFormat(event["prize"]["item"]) + "**" + emote.credits + "||";
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
  if (event["championship"]){
    championship = "\n" + "🏆" + " **This championship must be fully completed in order to reward credits. Due to bot limitations, do not stay in the race results too long or you will lose your progress.**"
  }
  if (event["type"] == "TIMETRIAL") {
    timetrial = "\n" + "⌛ **Multiple laps will be recorded in real time. The time trial ends after a certain amount of laps or the lap time succeed with a gold medal.**"
    var limits = "🚘 **" + event["car"] + "**"
  } else {
  var limits = "**" +
            event["regulations"]["fpplimit"].toString().replace("9999", "--") + emote.fpp + " " + 
            event["regulations"]["upperpower"].toString().replace("9999", "--") + " hp" + " " +     gtftools.numFormat(event["regulations"]["upperweight"].toString().replace("9999", "--")) + " Lbs" + " " +
            emote.tire  + event["regulations"]["tires"] +
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
      if (event["championship"]) {
      emojilist.push({
        emoji: numberlist[index], 
        emoji_name: numberlist[index],
        name: "Start Championship",
        extra: "",
        button_id: index
      })
    index++
      break;
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
      gtfcar = stats.currentcar(userdata)
      if (typeof trackname !== 'string') {
        var t = require(gtf.COURSEMAKER).trackparams(trackname);
        var track = require(gtf.COURSEMAKER).drawtrack(t, bcallback)
        function bcallback(track) {    
        track["name"] = "Route " + (index + 1) 
        track["options"] = ["Drift"];
        track["author"] = "GTFITNESS";
        //var racesettings = require(gtf.RACE).setcareerrace(event, track, gtfcar, index);
          /*
      racesettings["driver"]["loading"] =
        "__**Race " +
        (index + 1) +
        " - " +
        track["name"] +
        "**__\n" +
        prizemoney.join(" ") +
        "\n\n" +
        "🚘 " +
        "**" +
        gtfcar["name"] +
        " " +
        gtfcar["fpp"] +
        emote.fpp +
        emote.tire +
        gtfcar["perf"]["tires"]["current"]
          .split(" ")
          .map(x => x[0])
          .join("") +
        "**";*/

      event["title"] = event["name"] + " - Race " + (index + 1)
    event["raceid"] = event["tracks"][index][0]
    event["eventlength"] = event["tracks"].length
         callback(event);
        }
      } else {
    event["laps"] = tracks[index][2]
    event["title"] = event["title"] + " - Race " + (index + 1)
    event["raceid"] = event["tracks"][index][0]
    event["eventlength"] = event["tracks"].length
   /*
      racesettings["driver"]["loading"] =
        "__**Race " +
        (index + 1) +
        " - " +
        track["name"] +
        "**__\n" +
        prizemoney.join(" ") +
        "\n\n" +
        "🚘 " +
        "**" +
        gtfcar["name"] +
        " " +
        gtfcar["fpp"] +
        emote.fpp +
        emote.tire +
        gtfcar["perf"]["tires"]["current"]
          .split(" ")
          .map(x => x[0])
          .join("") +
        "**";
        */
        event["track"] = trackname
         callback(event);
      }
    }


var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

  require(gtf.DISCORD).send(msg, { embeds: [embed], components: buttons }, nextfunc)
  function nextfunc(msg) {
     setTimeout(function() {
       var complete = stats.checkcareerevent(event, "1st", userdata);
                if (complete) {
            stats.completeevent(event, userdata);
              stats.redeemgift(emote.goldmedal + " Congrats! Completed " + event["title"] + " " + emote.goldmedal, event["prize"], embed, msg, userdata);
                }
     }, 3000)
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
      if (event["championship"]) {
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
 
};


module.exports.startonline = function (racesettings, racedetails, finalgrid, user, userdata) {

  var positions = [];
  var position;
  var prize = 1000;
  var winners = [];
  var finalgridwinners = racesettings["players"];

  if (racesettings["type"] == "TIME") {
      prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 120))) 
  } else {
      if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 60)));
    } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 60)));
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
      prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 10)));
      } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 10)));
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
    var lapntime = "**Lap(s):** " + laps + "\n" + "**Total Distance:** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n"
  } 

  if (racesettings["type"] == "TIME") {
     var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
  var numx = gtftools.lengthalpha(fpp, "0%", racesettings["track"]);
  var speed111 = require(gtf.PERF).speedcalc(numx, racesettings["driver"]["car"]);
  speed111[1] = Math.round(speed111[0] / 1.4)
  speed111[0] = Math.round(speed111[0] * 1.609)
    racesettings["distance"]["km"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[1])
    racesettings["distance"]["mi"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) /60) * speed111[0])
    var lapntime = "**Time:** " + laps.replace("m", " Minutes") + "\n" + "**Total Distance (Estimated):** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n";
  }

  if (racesettings["type"] == "TIMETRIAL") {
    console.log(racesettings["distance"]["km"])
    var lapntime = "**Distance:** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n"
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
 
   if (racesettings["image"].length != 0) {
    if (typeof racesettings["track"]["location"] === 'undefined') {
      embed.setThumbnail(racesettings["image"]);
    } else {
    var attachment = Buffer.isBuffer(racesettings["image"]) ? new AttachmentBuilder(racesettings["image"], {name: "course.png"}) : new AttachmentBuilder(racesettings["image"].buffer, {name: "course.png"});

    embed.setThumbnail("attachment://course.png");
    msgjson = { embeds: [embed], files: [attachment], components: []}
  }
  }
  return [results, racedetails, msgjson]
}