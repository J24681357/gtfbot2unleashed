var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

//SSRX//

module.exports.ssrxracelength = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];

  var carspeed = require(gtf.PERF).speedcalc(gtftools.lengthalpha(fpp, racesettings["weather"], racesettings["track"]), racesettings["misc"]["car"]);
  
  if (racesettings["title"].includes("400m")) {
    carspeed[0] = Math.round(carspeed[0] / 1.6)
    carspeed[1] = Math.round(carspeed[0] / 1.609)
  }
  if (racesettings["title"].includes("1000m")) {
    carspeed[0] = Math.round(carspeed[0] / 1.28)
    carspeed[1] = Math.round(carspeed[0] / 1.609)
  }
  var showcar =
    "\n**🚘 " +
    racesettings["misc"]["car"]["name"] +
    " " +
    racesettings["misc"]["car"]["fpp"] +
    emote.fpp + "**"
  var racelength = (racesettings["km"] / gtftools.lengthalpha(fpp, "0%", racesettings["track"])) * 3600 * 1000;
  return [carspeed[0], carspeed[1], showcar, racelength];
};

module.exports.ssrxmiandresults = function ([speedkmh, speedmph], user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  stats.updatecurrentcarclean(0, userdata)
  stats.addmileage(racesettings["km"], racesettings["mi"], userdata);
  //stats.addplaytime(racelength, userdata);
  stats.addtotalmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileagecar(racesettings["km"], racesettings["mi"], userdata);
  var speeduser = [speedkmh + " kmh", speedmph + " mph"]
  speeduser = speeduser[userdata["settings"]["MILEAGE"]]
  
  var results2 = "**Top Speed:** " + speeduser+ "\n" + "**Car:** " + racesettings["misc"]["car"]["name"] + " **" + racesettings["misc"]["car"]["fpp"] + emote.fpp + "**";
  return results2;
};
///CAREER///
module.exports.careerracelength = function (user, racedetails, racesettings, finalgrid,  embed, msg, args, checkpoint, userdata) {
  var showcar =
    "\n**🚘 " +
    racesettings["misc"]["car"]["name"] +
    " " +
    racesettings["misc"]["car"]["fpp"] +
    emote.fpp +
    "**";
  var fppavg = 0;
  finalgrid.forEach(function (x) {
    fppavg = fppavg + x["fpp"];
  });
  fppavg = fppavg / finalgrid.length;
  var racelength = 0
  
  for (var i = 0; i < 20; i++) {
     var speed = gtftools.lengthalpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
   racelength = racelength + ((racesettings["km"] / speed) * 3600 * 1000)/20
  }
 
  /*if (racesettings["championship"][0]) {
    racelength = racelength + (10*1000)
  }*/
  return [showcar, racelength];
};
///DUEL///

module.exports.duelracelength = function (user, racedetails, racesettings,finalgrid, embed, msg, args, checkpoint, userdata) {
  var showcar =
    "\n**🚘 " +
    racesettings["misc"]["car"]["name"] +
    " " +
    racesettings["misc"]["car"]["fpp"] +
    emote.fpp +
    "**";
    var speed = gtftools.lengthalpha(racesettings["upperfpp"], racesettings["weather"], racesettings["track"]);

  var racelength = (racesettings["km"] / speed) * 3600 * 1000;
  return [showcar, racelength];
};
////ARCADE/////

module.exports.arcaderacelength = function (user, racedetails, racesettings, finalgrid,  embed, msg, args, checkpoint, userdata) {
  var showcar = "";
  if (racesettings["misc"]["car"].length != 0) {
    var showcar =
      "\n**🚘 " +
      racesettings["misc"]["car"]["name"] +
      " " +
      racesettings["misc"]["car"]["fpp"] +
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
  var speed = gtftools.lengthalpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"], racesettings["track"]);
   racelength = racelength + ((racesettings["km"] / speed) * 3600 * 1000)/20
  }
  return [showcar, racelength];
};

//////DRIFT

module.exports.driftracelength = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  var showcar = "";
  if (racesettings["misc"]["car"].length != 0) {
    var showcar =
      "\n**🚘 " +
      racesettings["misc"]["car"]["name"] +
      " " +
      racesettings["misc"]["car"]["fpp"] +
      emote.fpp + "**"

    var fpp = require(gtf.PERF).perf(racesettings["misc"]["car"], "GARAGE")["fpp"];
    var speed = gtftools.lengthalpha(fpp, racesettings["weather"], racesettings["track"]);
  }

  var racelength = 0
  for (var i = 0; i < 20; i++) {
     var speed = gtftools.lengthalpha(fpp, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"], racesettings["track"]);
   racelength = racelength + ((racesettings["km"] / speed) * 3600 * 1000)/20
  }
  
  var racelength = Math.round(racelength / 2);
  return [showcar, racelength];
};

module.exports.driftsection = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata, last) {
  var difficulty = 60; // low numbers - more difficult
  var score = gtftools.randomInt(0, 99);
((racesettings["km"] * 666) * racesettings["originalsectors"])
  var maxpoints = Math.ceil( ((racesettings["km"] * 666) * racesettings["originalsectors"]) / 1000) * 1000;
  var gold = Math.ceil(((racesettings["km"] * 666 * 0.95) * racesettings["originalsectors"]) / 100) * 100;
  var silver = Math.ceil(((racesettings["km"] * 666 * 0.75) * racesettings["originalsectors"]) / 100) * 100;
  var bronze = Math.ceil(((racesettings["km"] * 666 * 0.5) * racesettings["originalsectors"]) / 100) * 100;

  var tire = require(gtf.PARTS).find({ name: racesettings["misc"]["car"]["tires"]["current"], type: "tires" })[0]["name"];
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

module.exports.driftresults = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  var medal = "COMPLETE";
  var racemultibonus = ""
  var place = 3
  let final = require(dir + "functions/races/f_races_2ex").driftsection(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata, true);
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
  prize = Math.round(parseFloat(prize * (racesettings["km"] / 10)));

  if (stats.racemulti(userdata) > 1) {
    prize = Math.round(prize * stats.racemulti(userdata))
    racemultibonus = " `x" + stats.racemulti(userdata).toString() + "`"
  }

  //var garage = "**Car:** " + racesettings["misc"]["car"]["name"] + " **" + racesettings["misc"]["car"]["fpp"] + emote.fpp + "**";
  stats.addcredits(prize, userdata);
  stats.addmileage(racesettings["km"], racesettings["mi"], userdata);
  stats.addtotalmileage(racesettings["km"], racesettings["mi"], userdata);

  var results2 = "**" + medal + "**" + " " + "**+" + prize + emote.credits + racemultibonus + "**" + "\n" + "**Points:** " + racesettings["points"] + " pts";

  return results2;
}

///ONLINE

module.exports.onlineracelength = function (user, racedetails, racesettings, finalgrid,  embed, msg, args, checkpoint, userdata) {
  var showcar = "";
  var fppavg = 0;
  racesettings["players"].forEach(function (x) {
    fppavg = fppavg + x["car"]["fpp"];
  });
  fppavg = fppavg / racesettings["players"].length;
  
  var racelength = 0
  for (var i = 0; i < 20; i++) {
     var speed = gtftools.lengthalpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"], racesettings["track"]);
   racelength = racelength + ((racesettings["km"] / speed) * 3600 * 1000)/20
  }
  return [showcar, racelength];
};

///////TIMETRIAL///////

module.exports.timetrialracelength = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  var showcar =
    "\n**🚘 " +
    racesettings["misc"]["car"]["name"] +
    " " +
    finalgrid[0]["fpp"] +
    emote.fpp +
    "**";
  var fppavg = finalgrid[0]["fpp"];

  var speed = gtftools.lengthalpha(fppavg, racesettings["weather"], racesettings["track"]);

  var racelength = ((racesettings["km"] / speed) * 3600 * 1000) * 0.8;
  var rnorm = require('random-normal')
  var meanextra = 3000 * (stats.level(userdata)/50)
  var sdextra = 1 - (0.8 * (stats.level(userdata)/50))
  /// 0.5
  var levels = [5,10,15,20,25,30,35,40,45,50]
  levels.map(level => {
   var total = 0
  for (var i = 0; i < 200; i++) {
  total = total + rnorm({mean:racelength - (3000 * (level/50)), dev: 3000 * (1 - (0.8 * (level/50)) )})
  var average = total/200
  }
    
  console.log("Level " + level + " Avg: " + require(gtf.DATETIME).getFormattedLapTime(average))
  })
 
  racelength = rnorm({mean:racelength - meanextra, dev: 3000 * (sdextra)})
  return [showcar, racelength];
};

module.exports.timetriallap = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata, time) {
};


module.exports.timetrialresults = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  if (finalgrid[0]["laps"].filter(function(x) {return x["best"] == true}).length == 0) {
    return
  }
  var bestlap = finalgrid[0]["laps"].filter(function(x) {return x["best"] == true})[0]
  var place = "4th"
  var places = ["3rd", "2nd", "1st"]
  var prize = 0
  var racemultibonus = ""
  var oldraceplace = 0 
  
  var raceid = racesettings["raceid"].split("-");
  var racenum = raceid.pop();
  raceid = raceid.join("-").toLowerCase();
  var currentnumber = userdata["careerraces"][raceid][racenum - 1];


  if (currentnumber == 1) {
     oldraceplace = "1st"
  } else if (currentnumber == 2) {
     oldraceplace = "2nd"
  } else if (currentnumber == 3) {
    oldraceplace = "3rd"
  } else {
    oldraceplace = "4th"
  }
  oldraceplace = parseInt(oldraceplace.split(/[A-Z]/gi)[0])

  if (bestlap["medal"] == "BRONZE") {
    place = "3rd"
  } else if (bestlap["medal"] == "SILVER") {
    place = "2nd"
  } else if (bestlap["medal"] == "GOLD") {
    place = "1st"
  }
  for (var i = 0; i < places.length; i++) {
    if (parseInt(places[i].split(/[A-Z]/gi)[0]) < oldraceplace && oldraceplace != 4) {
      console.log("ok")
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
  
  var exp = Math.round(prize / 10);
  if (racesettings["mode"] == "CAREER") {
    exp = Math.round(Math.round(prize / 10) * 1.1);
  }

  //stats.addcredits(prize, userdata);
  var mileage = [racesettings["km"] * finalgrid[0]["laps"].length, racesettings["mi"] * finalgrid[0]["laps"].length]
  stats.addmileage(mileage[0], mileage[1], userdata);
  stats.addtotalmileage(mileage[0], mileage[1], userdata);
  stats.addexp(exp, userdata);
  if (racesettings["mode"] == "CAREER") {
    if (!racesettings["championship"][0]) {
    stats.updatecareerrace(racesettings["raceid"], place, userdata);
    }
  }

  var results2 = "**Best Lap:** " + require(gtf.DATETIME).getFormattedLapTime(bestlap["time"]) + " **" + mileage[userdata["settings"]["MILEAGE"]] + ["km", "mi"][userdata["settings"]["MILEAGE"]] + emote.mileage + "\n" + 
   require(gtf.DATETIME).getFormattedLapTime(bestlap["medalemote"]) + " " + require(gtf.DATETIME).getFormattedLapTime(bestlap["medal"]) + " +" + gtftools.numFormat(prize) + emote.credits + " +" + gtftools.numFormat(exp) + emote.exp + "**"
  

/* else {
  var results2 = "**Best Lap In Session: **" + require(gtf.DATETIME).getFormattedLapTime(bestlap["time"]) +  " **+" + mileage[userdata["settings"]["MILEAGE"]] + " " + ["km", "mi"][userdata["settings"]["MILEAGE"]] + emote.mileage + "**"
}(/)
*/
  
  return results2;
}



module.exports.createfinalbuttons = function (user, racedetails, racesettings, finalgrid, results2, embed, msg, args, checkpoint, buttons, emojilist, userdata) {
  var screen = true
  function func() {
    if (userdata["numreplays"] >= require(gtf.GTF).replaylimit) {
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
                if ( racesettings["mode"] == "ONLINE") {
          var name = x["name"] + " `" + x["drivername"] + "`"
          return x["position"] + ". " + "`" + x["gap"] + "`" + " " + name
        }
                  if (x["user"]) {
                    return "**" + x["position"] + ". " + "`" + x["gap"] + "`" + " " + x["name"] + "**"
                  } else {
                    return x["position"] + ". " + "`" + x["gap"] + "`" + " " + x["name"];
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
       return x
    })
    ////nexttrack
    var race = require(gtf.LISTS).gtfcareerraces[racesettings["raceid"].split("-").slice(0,2).join("").toLowerCase()]
    var trackname = race["tracks"][championshipnum][1]
    var laps = race["tracks"][championshipnum][2]
    if (typeof trackname !== 'string') {
        var t = require(gtf.COURSEMAKER).trackparams(trackname);
        racesettings["track"] = require(gtf.COURSEMAKER).drawtrack(t, bcallback)
        function bcallback(track) {  
        racesettings["track"] = track 
        racesettings["image"] = track["image"]  
        racesettings["mi"] = track["length"]
        racesettings["km"] = track["lengthkm"]
        racesettings["track"]["name"] = "Stage Route " + (championshipnum+1) 
        racesettings["track"]["options"] = ["Drift"];
        racesettings["track"]["author"] = "GTFITNESS"; 

      continuenextrace()
        }
    } else {
    racesettings["track"] = require(gtf.TRACKS).find({
      name: [trackname]
      })[0]
    racesettings["laps"] = laps
    racesettings["mi"] = Math.round((racesettings["track"]["length"] * laps) * 100) / 100;
    racesettings["km"] = Math.round( ((racesettings["track"]["length"] * laps)/1.609) * 100) / 100;
      continuenextrace()
    }
    ////
    function continuenextrace() {
    racesettings["title"] = racesettings["title"].split(" - ")[0] + " - " + "Race "+ (championshipnum+1)
    racesettings["time"] =  require(gtf.TIME).random({ name: race["time"] }, 1)[0];
    racesettings["weather"] = require(gtf.WEATHER).random({ name: race["weather"] }, 1)[0];
    racesettings["raceid"] = racesettings["raceid"].split("-").slice(0,2).join("-") + "-" + (championshipnum+1)

    var prerace = require(gtf.RACE).preracedetails(racesettings, embed, msg, userdata)
    results = prerace[0]
    racedetails = prerace[1]
    var msgjson = prerace[2]

    embed.setDescription(results2.join("\n") + "\n\n" +
     racedetails + "\n" + 
     emote.loading + " Loading " + emote.loading)
    msg.edit(msgjson).then(msg => {
    require(dir + "functions/races/f_races_2").readysetgob(user, racedetails, racesettings, finalgrid, embed, msg, args, [false, null], userdata);
    })
    }
  }

  function restart() {
    embed.setColor(0x0151b0);
    embed.spliceFields(0, 1);
    finalgrid = finalgrid.map(function(x) {
      x["score"] = x["oscore"]
       return x
    })
    require(dir + "functions/races/f_races_2").readysetgob(user, racedetails, racesettings, finalgrid, embed, msg, args, [false, null], userdata);
    }

  
  function goback() {
    userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], msghistory: []}
    var e = racesettings["raceid"].split("-");
    msg.channel.messages.fetch().then(messages => {
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf.USERID).first();
      setTimeout(() => m.delete(), 2000) 
    });
    if (racesettings["title"].includes("Seasonal Event")) {
      var btevent = require(dir + "commands/seasonal");
      btevent.execute(msg, {number:e[1]}, userdata);
    } else {
      var btevent = require(dir + "commands/career");
      btevent.execute(msg, {options:e[0], number:e[1]}, userdata);
    }
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

  if (racesettings["mode"] == "DUEL") {
    var functionlist = [goback_freeroam, func]
  } else {
    if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"][0]) {
        var functionlist = [continuechampionship, func, sessiondetails]
    } else {
      var functionlist = [restart, func, sessiondetails]
    }
    } else {
      var functionlist = [restart, func, sessiondetails]
    }
  }
     if (racesettings["mode"] == "ONLINE") {
    var functionlist = [func, sessiondetails]
  }

   if (racesettings["mode"] == "CAREER") {
    functionlist.push(goback)
  }
   gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
};

module.exports.updategrid = function (user, racedetails, racesettings, weather, finalgrid, embed, msg, args, checkpoint, userdata, timeinterval, message) {
  var playerpos = 0
  var difficulty = racesettings["difficulty"]
  var boost = 0
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
    x["gap"] = ((Math.ceil(gap * 1000) / 1000) * 1.15).toFixed(3); 
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
    return x
  })
  var xx = finalgrid.filter(x => x["user"] == true)[0]
  

  return message

}