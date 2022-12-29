var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

//SSRX//

module.exports.speedtestracelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
   return require(gtf.RACEEX).arcaderacelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
};

module.exports.speedtestresults = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
    var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];

  var carspeed = require(gtf.PERF).speedcalc(gtftools.lengthalpha(fpp, racesettings["weather"], racesettings["track"]), racesettings["driver"]["car"]);
  
  if (racesettings["title"].includes("400m")) {
    var speedkmh = Math.round(carspeed[0] / 1.6)
    var speedmph = Math.round(speedkmh / 1.609)
  }
  if (racesettings["title"].includes("1000m")) {
   var speedkmh = Math.round(carspeed[0] / 1.28)
   var speedmph = Math.round(speedkmh / 1.609)
  }
  
  stats.updatecurrentcarclean(0, userdata)
  stats.addmileage(racesettings["distance"]["km"], userdata);
  stats.addplaytime(racelength, userdata);
  stats.addtotalmileage(racesettings["distance"]["km"], userdata);
  stats.addtotalmileagecar(racesettings["distance"]["km"], userdata);
  var speeduser = [speedkmh + " kmh", speedmph + " mph"]
  speeduser = speeduser[userdata["settings"]["UNITS"]]
  
  var results2 = "**Top Speed:** " + speeduser + "\n" + "**Car:** " + racesettings["driver"]["car"]["name"] + " **" + racesettings["driver"]["car"]["fpp"] + emote.fpp + "**";
  return results2;
};
///CAREER///
module.exports.careerracelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  return require(gtf.RACEEX).arcaderacelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
};

////ARCADE/////

module.exports.arcaderacelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var showcar = "";
  if (racesettings["driver"]["car"].length != 0) {
    var showcar =
      "\n**🚘 " +
      racesettings["driver"]["car"]["name"] +
      " " +
      racesettings["driver"]["car"]["fpp"] +
      emote.fpp +
      "**";
  } 
  var fppavg = 0;
  finalgrid.forEach(function (x) {
    fppavg = fppavg + x["fpp"];
  });
  fppavg = fppavg / finalgrid.length;  
  var racelength = 0
  for (var i = 0; i < 20; i++) {
  var speed = gtftools.lengthalpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
   racelength = racelength + ((racesettings["distance"]["km"] / speed) * 3600 * 1000)/20
  }
  return [showcar, racelength];
};

///DUEL///

module.exports.duelracelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var showcar =
    "\n**🚘 " +
    racesettings["driver"]["car"]["name"] +
    " " +
    racesettings["driver"]["car"]["fpp"] +
    emote.fpp +
    "**";
    var speed = gtftools.lengthalpha(racesettings["upperfpp"], racesettings["weather"], racesettings["track"]);

  var racelength = (racesettings["distance"]["km"] / speed) * 3600 * 1000;
  return [showcar, racelength];
};

//////DRIFT

module.exports.driftracelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var showcar = "";
  if (racesettings["driver"]["car"].length != 0) {
    var showcar =
      "\n**🚘 " +
      racesettings["driver"]["car"]["name"] +
      " " +
      racesettings["driver"]["car"]["fpp"] +
      emote.fpp + "**"

    var fpp = require(gtf.PERF).perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
    var speed = gtftools.lengthalpha(fpp, racesettings["weather"], racesettings["track"]);
  }

  var racelength = 0
  for (var i = 0; i < 20; i++) {
     var speed = gtftools.lengthalpha(fpp, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
   racelength = racelength + ((racesettings["distance"]["km"] / speed) * 3600 * 1000)/20
  }
  
  var racelength = Math.round(racelength / 2);
  return [showcar, racelength];
};

module.exports.driftsection = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, last) {
  var difficulty = 60; // low numbers = more difficult
  var score = gtftools.randomInt(0, 99);
((racesettings["distance"]["km"] * 666) * racesettings["originalsectors"])
  var maxpoints = Math.ceil( ((racesettings["distance"]["km"] * 666) * racesettings["originalsectors"]) / 1000) * 1000;
  var gold = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.95) * racesettings["originalsectors"]) / 100) * 100;
  var silver = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.75) * racesettings["originalsectors"]) / 100) * 100;
  var bronze = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.5) * racesettings["originalsectors"]) / 100) * 100;

  var tire = require(gtf.PARTS).find({ name: racesettings["driver"]["car"]["perf"]["tires"]["current"], type: "tires" })[0]["name"];
  var points = gtftools.randomInt(Math.round(maxpoints / 10), Math.round(maxpoints / 4));
  if (tire.includes("Racing")) {
    points = Math.round(points * 0.2);
  }
  if (tire.includes("Comfort")) {
    points = Math.round(points * 1.3);
  }
  if (last && racesettings["sectors"] >= 1) {
    racesettings["sectors"]--;
    return [points, gold, silver, bronze];
  }

  if (racesettings["sectors"] <= 0) {
    points = 0;
  }

  if (score >= difficulty) {
    points = 0;
  } else {
    racesettings["sectors"]--;
  }
  return [points, gold, silver, bronze];
};

module.exports.driftresults = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var medal = "COMPLETE";
  var racemultibonus = ""
  var place = 3
  let final = require(dir + "functions/races/f_races_2ex").driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, true);
  racesettings["points"] += final[0];
  if (racesettings["points"] >= final[3]) {
    medal = emote.bronzemedal + " BRONZE";
    place = 2
  }
  if (racesettings["points"] >= final[2]) {
    medal = emote.silvermedal + " SILVER";
    place = 1
  }
  if (racesettings["points"] >= final[1]) {
    medal = emote.goldmedal + " GOLD";
    place = 0
  }
  var prize = racesettings["positions"][place]["credits"]
  prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 10)));

  if (stats.racemulti(userdata) > 1) {
    prize = Math.round(prize * stats.racemulti(userdata))
    racemultibonus = " `x" + stats.racemulti(userdata).toString() + "`"
  }

  stats.addcredits(prize, userdata);
  stats.addmileage(racesettings["distance"]["km"], userdata);
  stats.addtotalmileage(racesettings["distance"]["km"], userdata);

  var results2 = "**" + medal + "**" + " " + "**+" + prize + emote.credits + racemultibonus + "**" + "\n" + "**Points:** " + racesettings["points"] + " pts";

  return results2;
}

///ONLINE

module.exports.onlineracelength = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var showcar = "";
  var fppavg = 0;
  racesettings["players"].forEach(function (x) {
    fppavg = fppavg + x["car"]["fpp"];
  });
  fppavg = fppavg / racesettings["players"].length;
  
  var racelength = 0
  for (var i = 0; i < 20; i++) {
     var speed = gtftools.lengthalpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
   racelength = racelength + ((racesettings["distance"]["km"] / speed) * 3600 * 1000)/20
  }
  return [showcar, racelength];
};

///////TIMETRIAL///////
module.exports.licensecheck = function (racesettings, racedetails, finalgrid, embed, msg, userdata) {
  var embed = new EmbedBuilder()
  var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]

  var licenses = [...require(gtf.CAREERRACES).find({types: [ "LICENSE" + option] })]
  var ids = Object.keys(licenses)
         var bronzecomplete = stats.checklicensetests(option, "3rd", userdata);
         var goldcomplete = stats.checklicensetests(option, "1st", userdata);
        if (bronzecomplete && !stats.checklicense(option, "", msg, userdata)) {
          stats.completelicense(option.toUpperCase(), userdata);
          var option = option.toLowerCase()
            var total = 6
            if (option.includes("ic")) {
              total = 4
            }
          var prize = licenses[ids[total-1]]["prize"]
          stats.redeemgift("🎉 License " + option.toUpperCase() + " Achieved 🎉", prize, embed, msg, userdata);
        }
        if (goldcomplete) {
          var option = option.toLowerCase()
            var total = 6
            if (option.includes("ic")) {
              total = 4
            }
          var args = licenses[ids[total]]["prize"]["item"]
          var car = require(gtf.CARS).random(args, 1)[0];
          stats.addgift({
      id: -1, type:"CAR", name: "License " + option.toUpperCase() + ": All Gold Reward", item: car, author: "GT FITNESS", inventory: true }, userdata)
  
        }
  }




////

module.exports.timetrialracelength = function (racesettings, racedetails, finalgrid, checkpoint, difficulty, embed, msg, userdata) {
  var showcar =
    "\n**🚘 " +
    racesettings["driver"]["car"]["name"] +
    " " +
    finalgrid[0]["fpp"] +
    emote.fpp +
    "**";
  var fppavg = finalgrid[0]["fpp"];

  var speed = gtftools.lengthalpha(fppavg, racesettings["weather"], racesettings["track"]);

  var racelength = ((racesettings["distance"]["km"] / speed) * 3600 * 1000) * 0.8;
  var jstat = require("jstat");
  /*
  var levels = [1,5,10,15,20,25,30,35,40,45,50]
  levels.map(level => {
   var list = []

  for (var i = 0; i < 1; i++) {
     var beta = 0.5 - (0.2 * ((level/50)))
var value = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.mean(11, beta)/10))
  list.push(value)
}
   
  console.log("Level " + level + " Expected: " + require(gtf.DATETIME).getFormattedLapTime(require(gtf.MATH).median(list)))
  
  })
  */
 var beta = 0.5 - (0.2 * ((difficulty/50)))
var gold = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.mean(11, beta)/10))
  gold = parseFloat((gold/1000).toFixed(1))
  racesettings["positions"][0]["time"] = gold
  racesettings["positions"][1]["time"] = parseFloat((gold * 1.04).toFixed(1))
  racesettings["positions"][2]["time"] = parseFloat((gold * 1.12).toFixed(1))
  
 var beta = 0.5 - (0.2 * ((stats.level(userdata)/50)))
racelength = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.sample(11, beta)/10))
  if (racelength < racesettings["positions"][0]["time"]) {
    racelength = racelength * (1+(racelength/racesettings["positions"][0]["time"]))
  }
  return [showcar, racelength];
};

module.exports.timetriallap = function (racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata) {
  var rfail = 5 + (35 * 
                   ((100-racesettings["difficulty"])/100)
                  ) - (35 * 
                                                              ((50-stats.level(userdata))/100)
                                                             )
  if (rfail <= 5) {
    rfail = 5
  } else if (rfail >= 40) {
    rfail = 40
  }
  var time = parseFloat(racelength)
  if (gtftools.randomInt(1,100) <= rfail) {
    time = 3600000
  }

      finalgrid[0]["laps"] = Object.assign([], userdata["raceinprogress"]["gridhistory"][0][0]["laps"])
         var newlap = {userid: userdata["id"],
                       eventid: parseInt(racesettings["title"].split(" - ")[0].split(" ")[2]), 
                       time: time,
                       lapnum: finalgrid[0]["laps"].length + 1,
                       date:new Date(), best:false, medal:"NONE"}
        finalgrid = userdata["raceinprogress"]["gridhistory"][userdata["raceinprogress"]["gridhistory"].length-1]

         newlap["medal"] = "NONE"
         newlap["medalemote"] = "⬛"
         
         var medals = ["GOLD", "SILVER", "BRONZE"]
         var medalemotes = [emote.goldmedal, emote.silvermedal, emote.bronzemedal]
         for (var x = 0; x < medals.length; x++) {
            if (newlap["time"] == 3600000) {
              newlap["medal"] = "FAIL"
              newlap["medalemote"] = "❌"
              break;
  }
           if (newlap["time"] <= (racesettings["positions"][x]["time"]) * 1000) {
             newlap["medal"] = medals[x]
             newlap["medalemote"] = medalemotes[x]
             break;
         }
         }
         finalgrid[0]["laps"].push(newlap)
         
         var besttimeindex = finalgrid[0]["laps"].indexOf(finalgrid[0]["laps"].slice().sort(function (a, b) {return a.time - b.time}).filter(x=> x["medal"] != "FAIL" || x["medal"] != "NONE")[0])
          finalgrid[0]["laps"].map(function(x, index) {
            if (index == besttimeindex) {
              x["best"] = true
            } else {
              x["best"] = false
            }
            return x
          })
      userdata["raceinprogress"]["gridhistory"].map(finalgrids => {
            finalgrids[0]["laps"] = finalgrid[0]["laps"]
            return finalgrids
          })
  return [newlap]
  
};


module.exports.timetrialresults = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  if (finalgrid[0]["laps"].filter(function(x) {return x["best"] == true}).length == 0) {
    return "NONE"
  }
  var bestlap = finalgrid[0]["laps"].filter(function(x) {return x["best"] == true && x["medal"] != "FAIL"})[0]
  if (typeof bestlap === 'undefined') {
    bestlap = {time:0, medal: "NONE", medalemote: "⬛"}
  }
  
  var place = "4th"
  var places = ["3rd", "2nd", "1st"]
  var prize = 0
  var racemultibonus = ""
  
  var eventid = racesettings["eventid"].replace("LICENSE", "").toLowerCase()
  if (typeof userdata["licenses"][eventid] === 'undefined') {
    var current = "2nd"
  } else {
    var current = userdata["licenses"][eventid][0];
  }
  

  if (current == 0) {
    current = "4th"
  } else if (current == "✅") {
    current = "1st"
  }

  if (bestlap["medal"] == "BRONZE") {
    place = "3rd"
  } else if (bestlap["medal"] == "SILVER") {
    place = "2nd"
  } else if (bestlap["medal"] == "GOLD") {
    place = "1st"
  }
  
  for (var i = 0; i < places.length; i++) {
    if (parseInt(places[i].split(/[A-Z]/gi)[0]) < parseInt(current.split(/[A-Z]/gi)[0]) && place != "4th") {
      prize = prize + racesettings["positions"][(places.length-1)-i]["credits"]
    }
    if (places[i] == place) {
      break;
    }
  }
  
  if (stats.racemulti(userdata) > 1) {
    prize = Math.round(prize * stats.racemulti(userdata))
    racemultibonus = " `x" + stats.racemulti(userdata).toString() + "`"
  }
  
  if (prize == 0) {
    racemultibonus = ""
  }
  
  var exp = Math.round(prize / 40);

  stats.addcredits(prize, userdata);
  var mileage = [racesettings["distance"]["km"] * finalgrid[0]["laps"].length, racesettings["distance"]["mi"] * finalgrid[0]["laps"].length]
  stats.addmileage(mileage[0], userdata);
  stats.addtotalmileage(mileage[0], userdata);
  stats.addexp(exp, userdata);
  if (racesettings["mode"] == "LICENSE") {
    var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
    if (option == "b" || option == "a" ||option == "ic" || option == "ib" || option == "ia" || option == "s") {
    stats.updatelicensetest(racesettings, place, userdata);
    } else {
      if (place == "1st") {
        setTimeout(function() {
        stats.redeemgift("🎉 Completed " + racesettings["title"] + " 🎉", racesettings["prize"], embed, msg, userdata);
        }, 2000)
      }
      
    }
  }
  

  var results2 = "**Best Lap:** " + require(gtf.DATETIME).getFormattedLapTime(bestlap["time"]) + " **" + mileage[userdata["settings"]["UNITS"]] + ["km", "mi"][userdata["settings"]["UNITS"]] + emote.mileage + "\n" + 
   require(gtf.DATETIME).getFormattedLapTime(bestlap["medalemote"]) + " " + require(gtf.DATETIME).getFormattedLapTime(bestlap["medal"]) + " +" + gtftools.numFormat(prize) + emote.credits + " +" + gtftools.numFormat(exp) + emote.exp + "**"
  
/* else {
  var results2 = "**Best Lap In Session: **" + require(gtf.DATETIME).getFormattedLapTime(bestlap["time"]) +  " **+" + mileage[userdata["settings"]["UNITS"]] + " " + ["km", "mi"][userdata["settings"]["UNITS"]] + emote.mileage + "**"
}(/)
*/
  
  return results2;
}

module.exports.createfinalbuttons = function (racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata) {
  var screen = true
  function goback() {
    userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], msghistory: []}
    msg.channel.messages.fetch().then(messages => {
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf.USERID).first();
      setTimeout(() => m.delete(), 2000) 
    });
    if (racesettings["mode"] == "LICENSE") { 
      var e = racesettings["eventid"].replace("LICENSE","").split("-");
      var command = require(dir + "commands/license");
      command.execute(msg, {options:e[0]}, userdata);
    } else if (racesettings["mode"] == "CAREER") { 
      var e = racesettings["eventid"].split("-");
      if (racesettings["title"].includes("Seasonal Event")) {
        var command = require(dir + "commands/seasonal");
        btevent.execute(msg, {number:e[1]}, userdata);
      } else {
        var command = require(dir + "commands/career");
      command.execute(msg, {options:e[0], number:e[1]}, userdata);
    }
    }
    else if (racesettings["mode"] == "ARCADE" || racesettings["mode"] == "DRIFT" || racesettings["mode"] == "SSRX" ) {
      var command = require(dir + "commands/arcade");
      command.execute(msg, {options:racesettings["mode"]}, userdata);
    }
  }
  function savereplay() {
    if (userdata["stats"]["numreplays"] >= require(gtf.GTF).replaylimit) {
      return
    } else {
    require(gtf.REPLAY).savereplay({title:racesettings["title"], results:results2, racedetails:racedetails, grid:"__Grid Results | " + racesettings["grid"] + " cars" + "__" + "\n" + finalgrid.map(x => x["position"] + ". " + "`" + x["gap"] + "`" + " " + x["drivername"]).join("\n") + "\n"}, userdata);
    embed.setDescription("✅ Replay saved.");
    msg.edit({embeds: [embed]});
    }
  }
  function sessiondetails() {
    if (screen) {
      screen = false
      var griddd = finalgrid.slice().map(function (x) {
        var gap = x["position"] == 1 ? "" : "`+" + x["gap"] + '`'
                if (racesettings["mode"] == "ONLINE") {
          var name = x["name"] + " `" + x["drivername"] + "`"
          return x["position"] + ". " + gap + " " + name
        }
                if (x["user"]) {
                    return "**" + x["position"] + ". " + gap + " " + require(gtf.CARS).shortname(x["name"]) + "**"
                  } else {
                    return x["position"] + ". " + gap + " " + require(gtf.CARS).shortname(x["name"]);
                  }
            })
          if (griddd.length >= 10) {
            griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
          }

          embed.setDescription(griddd.join("\n"));
          msg.edit({embeds: [embed], components:buttons});
    } else {
      screen = true
    embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0])
    msg.edit({embeds: [embed]});
    }
  }
  function continuechampionship() {
    
    var championshipnum = userdata["raceinprogress"]["championshipnum"]
    if (userdata["raceinprogress"]["championshipnum"] == "DONE") {
      goback()
      return
    }

    embed.setTitle("__Points Standings__")
    var griddd = finalgrid.sort(function (a, b) {return b.points - a.points}).map(function (x, index) {
                  if (x["user"]) {
                    return "**" + (index+1) + ". " + "`" + x["points"] + "pts`" + " " + x["name"] + "**"
                  } else {
                    return (index+1) + ". " + "`" + x["points"] + "pts`" + " " + x["name"];
                  }
            }).slice(0,10)
    results2 = griddd
    finalgrid = finalgrid.reverse().map(function(x) {
      x["score"] = x["oscore"]
      x["laps"] = []
       return x
    })
    ////nexttrack
    
    racesettings ={...require(gtf.LISTS).gtfcareerraces[racesettings["eventid"].toLowerCase().replace("-", "")]}
    
    var carselect = stats.currentcar(userdata)
    racesettings["driver"] = {name: msg.guild.members.cache.get(userdata["id"]).user.username, car: carselect, otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true}
    var trackname = racesettings["tracks"][championshipnum][1]
    var laps = racesettings["tracks"][championshipnum][2]
    racesettings["mode"] = "CAREER"
    racesettings["eventlength"] = racesettings["tracks"].length
    
    if (typeof trackname !== 'string') {
        var t = require(gtf.COURSEMAKER).trackparams(trackname);
        racesettings["track"] = require(gtf.COURSEMAKER).drawtrack(t, bcallback)
        function bcallback(track) {  
        racesettings["track"] = track 
        racesettings["image"] = track["image"]  
        racesettings["distance"]["mi"] = track["length"]
        racesettings["distance"]["km"] = track["lengthkm"]
        racesettings["track"]["name"] = "Stage Route " + (championshipnum+1) 
        racesettings["track"]["options"] = ["Drift"];
        racesettings["track"]["author"] = "GTFITNESS"; 

      continuenextrace()
        }
    } else {
    racesettings["track"] = require(gtf.TRACKS).find({
      name: [trackname]
      })[0]

      racesettings["image"] = racesettings["track"]["image"]
    racesettings["laps"] = laps
    racesettings["distance"] = {mi: Math.round((racesettings["track"]["length"] * laps) * 100) / 100, km: Math.round( ((racesettings["track"]["length"] * laps)/1.609) * 100) / 100}
      continuenextrace()
    }
    ////
    function continuenextrace() {
    racesettings["title"] = racesettings["title"].split(" - ")[0] + " - " + "Race "+ (championshipnum+1)
      racesettings["time"] = require(gtf.TIME).random({ name: racesettings["time"], timeprogression: racesettings["timeprogression"] }, 1)[0];
    racesettings["weather"] = require(gtf.WEATHER).random({ name: racesettings["weather"], weatherchange: racesettings["weatherchange"]}, 1)[0];
    racesettings["raceid"] = (championshipnum+1)

    var prerace = require(gtf.RACE).preracedetails(racesettings, embed, msg, userdata)
    results = prerace[0]
    racedetails = prerace[1]
    var msgjson = prerace[2]

    embed.setDescription(results2.join("\n") + "\n\n" +
     racedetails + "\n" + 
     emote.loading + " Loading " + emote.loading)
    msg.edit(msgjson).then(msg => { 
    require(dir + "functions/races/f_races_2").startsession(racesettings, racedetails, finalgrid, false, embed, msg, userdata);
    })
    }
  }
  function continuelicense() {
    userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], msghistory: []}
    msg.channel.messages.fetch().then(messages => {
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf.USERID).first();
      setTimeout(() => m.delete(), 2000) 
    }); 
      var e = racesettings["eventid"].replace("LICENSE","").split("-");
      var command = require(dir + "commands/license");
      command.execute(msg, {options:e[0], number:(parseInt(e[1])+1)}, userdata);
  }
  function restart() {
    embed.setColor(0x0151b0);
    embed.spliceFields(0, 1);
    finalgrid = finalgrid.map(function(x) {
      x["score"] = x["oscore"]
      x["laps"] = []
       return x
    })
    require(dir + "functions/races/f_races_2").startsession(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
    }
  function goback_freeroam() {
    userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:""}
    var num = racesettings["locationid"]
    msg.channel.messages.fetch().then(messages => {
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf.USERID).first();
      setTimeout(() => m.delete(), 2000) 
    });
  var btevent = require(dir + "commands/freeroam");
    btevent.execute(msg, {number:num}, userdata);
  }

  if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"]) {
        var functionlist = [continuechampionship, savereplay, sessiondetails]
    if (userdata["raceinprogress"]["championshipnum"] != "DONE") {
      setTimeout(function() {
        continuechampionship()
      }, 1000 *10)
    }

    
    } else {
      var functionlist = [restart, savereplay, sessiondetails, goback]
    }
  } else if (racesettings["mode"] == "LICENSE") {
    var functionlist = [restart, continuelicense, savereplay, sessiondetails, goback]
  } else {
      var functionlist = [restart, savereplay, sessiondetails, goback]
    }
     if (racesettings["mode"] == "ONLINE") {
    var functionlist = [savereplay, sessiondetails]
  }
   gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
};

module.exports.updategrid = function (racesettings, racedetails, finalgrid, checkpoint, timeinterval, number, message, embed, msg, userdata) {
  
  var playerpos = 0
  var difficulty = racesettings["difficulty"]
  var boost = 0
  var weather = userdata["raceinprogress"]["weatherhistory"][number]
  
  if (racesettings["mode"] == "CAREER") {
    difficulty = require(gtf.PERF).careerdifficultycalc(difficulty, weather, racesettings)[0]
  }
  var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
  for (var i = 0; i < finalgrid.length; i++) {
    finalgrid[i]["overtakes"] = 0
    finalgrid[i]["prevposition"] = finalgrid[i]["position"]
  if (racesettings["mode"] == "ONLINE") {
    boost = 0.5 * (finalgrid[i]["level"]/50)
    boost = boost + (0.2 * require(gtf.PERF).onlinedifficultycalc(finalgrid[i], racesettings)[0])
  }
    var rnorm = require("random-normal")
    if (finalgrid[i]["user"]) {
    var rnum = gtftools.randomInt(0, 99);
    }
    
    if (difficulty <= -1 && finalgrid[i]["user"]) {
      playerpos = finalgrid[i]["position"]
    var score = ((Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (0.90 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000 ) 
    } else if (rnum < difficulty && finalgrid[i]["user"]) {
      playerpos = finalgrid[i]["position"]
    var score = ((Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1.25 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000 ) 
    } else if (finalgrid[i]["user"]) {     
      playerpos = finalgrid[i]["position"]
      if (finalgrid[i]["position"] > 5) {
        var score = (Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1.05 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000
      } else {
        var score = (Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000
      }
    } else {
if (finalgrid[i]["position"] == 1) {
        var score = 
          ((Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000) / 1.15
    } else if (playerpos == 1) {
        var score = (Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1.15 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000
      } else {
    var score = (Math.abs(rnorm({ mean: ((finalgrid[i]["fpp"] * (1 + boost)) - minfpp), dev: 35 })) * timeinterval) / 1000
      }
    }
    finalgrid[i]["score"] = finalgrid[i]["score"] + Math.ceil( (score/2.2) * 100) / 100;
  }
  
  finalgrid = finalgrid.sort((x, y) => y["score"] - x["score"])
  finalgrid = finalgrid.map(function(x,index) {
    x["position"] = index + 1
    if (x["position"] == 1) {
      x["gap"] = (0.000).toString()
    } else {
      var gap = ((finalgrid[0]["score"] - x["score"]) / 1000)
    x["gap"] = ((Math.ceil(gap * 1000) / 1000) * 1.16).toFixed(3); 
      if (parseFloat(x["gap"]) >= 60) {
        x["gap"] = require(gtf.DATETIME).getFormattedTime(parseInt(x["gap"]) * 1000)
      }
    }
    if (x["user"]) {
      playerpos = x["position"]
    }
    x["overtakes"] = x["prevposition"] - x["position"]
    
    if (x["prevposition"] > x["position"] && x["position"] == 1) {
    if (racesettings["mode"] == "CAREER") {
      var name = [x["name"].split(" ").slice(0,-1).join(" "), x["drivername"]][userdata["settings"]["GRIDNAME"]]
  message = "\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-overtake-1st", name2: name}) + "`"
    }
  }
  if (x["prevposition"] > x["position"] && x["position"] <= 8 && x["overtakes"] >= 2) {
    if (racesettings["mode"] == "CAREER") {
      var name = [x["name"].split(" ").slice(0,-1).join(" ") + " " + "(#" + x["position"] + ")", x["drivername"]][userdata["settings"]["GRIDNAME"]]
  message = "\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-overtake-fast", name2: name}) + "`"
    }
  }
  if (x["prevposition"] < x["position"] && x["position"] <= 8 && x["overtakes"] <= -2) {
    if (racesettings["mode"] == "CAREER") {
      var name = [x["name"].split(" ").slice(0,-1).join(" ") + " " + "(#" + x["position"] + ")", x["drivername"]][userdata["settings"]["GRIDNAME"]]
  message = "\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-overtake-bad", name2: name}) + "`"
    }
  }
    
if (gtftools.randomInt(1,10) <= 2) {
  var alpha = 2.5 * (timeinterval/15000)
  console.log("a" + alpha)
  x["damage"] = x["damage"] + alpha
}
    return x
  })
  var xx = finalgrid.filter(x => x["user"] == true)[0]

  return message

}