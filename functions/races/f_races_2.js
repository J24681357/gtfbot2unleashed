var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.startsession = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
   
  var index = 0;
  var showcar = "";
  var racelength = 0;
  var startracetime = 2000;
  var racetime = ""
  var raceweather = ""
  var racetires = ""
  var resumerace = "";
  var message = ""
  var progressbarblackarcolor = userdata["settings"]["ICONS"]["bar"][0];
  var progressbarblack = userdata["settings"]["ICONS"]["bar"][1];

  embed.image = ""
  embed.thumbnail = ""

  embed.setTitle("__" + racesettings["title"] + "__")
  embed.setColor(userdata["settings"]["COLOR"])
  embed.setAuthor({name: msg.guild.members.cache.get(userdata["id"]).user.username, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});
  
  msg.removeAttachments()
  //stats.updatefpp(racesettings["driver"]["car"])
  //racesettings["driver"]["car"] = stats.currentcar(userdata)

  var emojilist = [{
      emoji: emote.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once",
      button_id: 0
    }]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

  //var buttons = []

  var lights = [
    [emote.redlightb, emote.redlightb, emote.redlightb, emote.redlightb],
    [emote.redlightb, emote.redlightb, emote.redlightb, emote.redlightb],
    [emote.greenlight, emote.greenlight, emote.greenlight, emote.greenlight],
  ];
  var ready = ["**READY**\n", emote.transparent + "**3,2,1...**" + emote.transparent, emote.transparent + "**START**" + emote.transparent];
  var start = [progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, "🏁"];
  var results3 = start.join("");

  if (racesettings["championship"]) {
        if (userdata["raceinprogress"]["championshipnum"] >= 1) {
          setTimeout(function() {readysetgo()}, 10 * 1000)
        } else {
          readysetgo()
    }
} else {
  readysetgo()
}
  function readysetgo() {

//RACELENGTH//
  if (!checkpoint[0]) {
  userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(racesettings["weather"])))
  var weatheri = racesettings["weather"]
  for (var i = 0; i < 20; i++) {
    weatheri = require(gtf.WEATHER).advanceweather(weatheri, racesettings["distance"]["km"]) 
    userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(weatheri)))
  }
  if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE") {
      let career1 = require(gtf.RACEEX).careerracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = career1[0];
   racelength = career1[1];
    //racelength = 10 * 1000
    } else if (racesettings["mode"] == "ARCADE") {
    let arcade1 = require(gtf.RACEEX).arcaderacelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = arcade1[0];
    racelength = arcade1[1];
} 
  else if (racesettings["mode"] == "DRIFT") {
    racesettings["sectors"] = racesettings["originalsectors"];
    racesettings["points"] = 0;
    let drift1 = require(gtf.RACEEX).driftracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = drift1[0];
    racelength = drift1[1];
  } 
  else if (racesettings["mode"] == "SSRX") {
    let ssrx1 = require(gtf.RACEEX).speedtestracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = ssrx1[0];
    racelength = ssrx1[1];
  } 
  else if (racesettings["mode"] == "DUEL") {
    let duel1 = require(gtf.RACEEX).duelracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = duel1[0];
    racelength = duel1[1];
  } 
  else if (racesettings["mode"] == "ONLINE") {
    let online1 = require(gtf.RACEEX).onlineracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = online1[0];
    racelength = online1[1];
  }
    
  if (racesettings["type"] == "TIME") {
    racelength = parseInt(racesettings["laps"].split("m")[0]) * (60*1000)
  } 
}
if (racesettings["type"] == "TIMETRIAL") {
      let tt1 = require(gtf.RACEEX).timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, stats.level(userdata), embed, msg, userdata);
      showcar = tt1[0];
      racelength = tt1[1];
}
/////////////
    
  ///RACEINPROGRESS
  if (!checkpoint[0]) {
    var currenttime = new Date().getTime();
    var totaltime = new Date().getTime() + racelength + 2000;
    if (racesettings["championship"] && userdata["raceinprogress"]["championshipnum"] >= 1) {
      userdata["raceinprogress"]["active"] = true
      userdata["raceinprogress"]["messageid"] = msg.id
      userdata["raceinprogress"]["channelid"] = msg.channel.id
      userdata["raceinprogress"]["expire"] = totaltime      
      } else {
    userdata["raceinprogress"] = {active:true, channelid: msg.channel.id, messageid:msg.id, expire:totaltime, tirehistory: [], gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
    msghistory: [],championshipnum:0}; 
    }
    if (racesettings["mode"] == "ONLINE") {
        require(gtf.LOBBY).updateusersraceinprogress(finalgrid, totaltime, msg)
    }
    stats.addracedetails(racesettings, racedetails, finalgrid, userdata);
  userdata["raceinprogress"]["start"] = currenttime

   var timeinterval = racelength / 20
  if (timeinterval <= 2000) {
    timeinterval = 2000
  } 


  stats.createracehistory(racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata)
    
  } 
  else {
    function flagstartrace() {
          if (userdata["raceinprogress"]["active"]) {
          require(dir + "commands/status").execute(msg, {options:"exit"}, userdata);
          }
    }
    var functionlist = [flagstartrace]
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    
    var totaltime = userdata["raceinprogress"]["expire"];
    var currenttime = userdata["raceinprogress"]["start"];
    resumerace = "";
    startracetime = 0;
    index = 4
    if (racesettings["type"] == "TIMETRIAL") {
      userdata["raceinprogress"]["msghistory"] = []
      /*
  for (var i = 0; i < 20; i++) {
    //message = require(gtf.RACEEX).updategrid(user, racedetails, racesettings, racesettings["weather"], finalgrid, embed, msg, args, checkpoint, userdata, timeinterval, message)
    //userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
   // userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
  }
  */
  //finalgrid = userdata["raceinprogress"]["gridhistory"][0]
    } else {
     racelength = totaltime - new Date().getTime() - 2000;
    }
  }

  stats.save(userdata);
    
  var results = function (index) {
    return lights[index][0] + lights[index][1] + lights[index][2] + lights[index][3] + ready[index] + lights[index][3] + lights[index][2] + lights[index][1] + lights[index][0] 
  };
  index++;
  
  if (!checkpoint[0]) {
  gtftools.interval(
    function () {
      var starttime = "";
        if (racesettings["mode"] == "CAREER") {
  message = "\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-start"}) + "`"
    }
     if (index == 3) {
        starttime = message + "\n" + userdata["raceinprogress"]["timehistory"][0]["hour"] + ":" + userdata["raceinprogress"]["timehistory"][0]["minutes"] + " " + racesettings["weather"]["emoji"] + "💧" + racesettings["weather"]["wetsurface"] + "%" + " | " + "⏳" +  require(gtf.DATETIME).getFormattedTime(racelength) + " minutes" + emote.tire + "**" + userdata["raceinprogress"]["tirehistory"][0].split(" ").map(x => x[0]).join("") + "**" +  resumerace;
    if (racesettings["type"] == "TIMETRIAL") {
              starttime = ""
    } else {
    }
        return
      }
     if (index == 2) {
       
        if (racesettings["type"] == "TIMETRIAL") {
              starttime = ""
       } else {
        starttime = message + "\n" + userdata["raceinprogress"]["timehistory"][0]["hour"] + ":" + userdata["raceinprogress"]["timehistory"][0]["minutes"] + " " + racesettings["weather"]["emoji"] + "💧" + racesettings["weather"]["wetsurface"] + "%" + " | " + "⏳" +  require(gtf.DATETIME).getFormattedTime(racelength) + " minutes" + emote.tire + "**" + userdata["raceinprogress"]["tirehistory"][0].split(" ").map(x => x[0]).join("") + "**" + resumerace;
          
       }
      }
      embed.setDescription(results(index) + starttime);
      
      require(gtf.DISCORD).edit(msg, {content: "ㅤ", embeds: [embed], components:buttons })

      index++;
    },
    1500,
    2
  );
    }
    
  var timeleft = totaltime - currenttime;
  var timedivide = racelength / (start.length - 1);
  var timeinterval = racelength / 20
  if (timeinterval <= 2000) {
    timeinterval = 2000
  }

  setTimeout(function () {
    var check = function () {
      timeleft = totaltime - userdata["raceinprogress"]["start"];

      if (userdata["raceinprogress"]["expire"] <= new Date().getTime()) {
       clearInterval(progress);
       stats.addplaytime(racelength, userdata);
       if (racesettings["type"] == "TIMETRIAL") {
         let tt2 = require(gtf.RACEEX).timetriallap(racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata);
      var newlap = tt2[0];
        currenttime = new Date().getTime()
        if (finalgrid[0]["laps"].length % 5 != 0) {
          if (newlap["medal"] != "GOLD") {
          return require(gtf.DISCORD).send(msg, {content: "<@" + userdata["id"] + "> **" + newlap["medal"] + " " + require(gtf.DATETIME).getFormattedLapTime(newlap["time"]) + " | " + "LAP " + finalgrid[0]["laps"].length + "**", embeds: [embed]}, repeat)
          }
      }
         userdata["raceinprogress"]["expire"] = "EXIT"
          
          function repeat(msg) {

            let tt1 = require(gtf.RACEEX).timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, stats.level(userdata), embed, msg, userdata);
          racelength = tt1[1];
          setTimeout(function() {
          userdata["raceinprogress"] = {active:true, messageid: msg.id, channelid: msg.channel.id, start: currenttime, expire: (currenttime + racelength),  gridhistory: userdata["raceinprogress"]["gridhistory"], tirehistory: userdata["raceinprogress"]["tirehistory"], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum:0}
            require(dir + "functions/races/f_races_2").startsession(racesettings, racedetails, finalgrid, true, embed, msg, userdata);
          }, 2000)
          }

        }
        
        //////ending race
    if (racesettings["championship"]) {
        userdata["raceinprogress"]["active"] = false
      } else {
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:0, gridhistory: [], tirehistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [],  championshipnum:0}
    }
    /////
        
        setTimeout(() => msg.delete(),2000 );

        stats.removeracedetails(userdata);

        if (racesettings["mode"] == "SSRX") {
          let ssrx2 = require(gtf.RACEEX).speedtestresults( racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
          var results2 = ssrx2;
        } else if (racesettings["mode"] == "DRIFT") {
          let drift2 = require(gtf.RACEEX).driftresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, racesettings["points"]);
          var results2 = drift2;
        } else if (racesettings["mode"] == "ONLINE") {
           var results2 = require(gtf.RACE).startonline(racesettings, racedetails, finalgrid, user, userdata);
        } else if (racesettings["type"] == "TIMETRIAL") {
          console.log(finalgrid[0]["laps"])
          var results2 = require(gtf.RACEEX).timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          //var results2 = "Test"
          console.log(results2)
          embed.setDescription(results2)
          //require(gtf.DISCORD).send(msg, {embeds: [embed]})
          //stats.save(userdata);
          //return
        } else {
          var results2 = require(gtf.RACE).start(racesettings, racedetails, finalgrid, userdata);
        }

        if ( (racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE" || racesettings["mode"] == "ONLINE") && racesettings["type"] != "TIMETRIAL") {
       
          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0] + "\n\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-results-winner", name2:[finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["name"].split(" ").slice(0,-1).join(" "), 
          finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["drivername"]][userdata["settings"]["GRIDNAME"]], "racesettings":racesettings}) + "`");
        } else {
          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
        }
        if (racesettings["driver"]["car"] == "") {
          var field2 = emote.transparent;
        } else {
          var field2 = stats.currentcarmain(userdata);
        }
        var ping = "<@" + userdata["id"] + ">";
        if (racesettings["mode"] == "ONLINE") {
          ping = "@everyone";
        } else {
          embed.setFields([{name:stats.main(userdata), value: field2}]);
        }

    var emojilist = [];
    var count = 0
    if (racesettings["mode"] != "ONLINE") {
      if (racesettings["championship"]) {
              emojilist.push({
      emoji: "⏭",
      emoji_name: "⏭",
      name: "Continue",
      extra: "Once",
      button_id: count
    });
    count++
    } else {
        emojilist.push({
      emoji: "🔁",
      emoji_name: "🔁",
      name: "Restart",
      extra: "Once",
      button_id: count
    });
    count++
    }
  if (racesettings["mode"] == 'LICENSE') {
    emojilist.push({
      emoji: "⏭",
      emoji_name: "⏭",
      name: "Next",
      extra: "Once",
      button_id: count
    });
    count++
      }
  }

////REPLAYS
  if (userdata["stats"]["numreplays"] >= require(gtf.GTF).replaylimit){
    emojilist.push({
      emoji: "❌",
      emoji_name: "❌",
      name: "Replays Full",
      extra: "",
      button_id: count
    });
    count++
  } else {
    emojilist.push({
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: "",
      button_id: count
    });
    count++
  }
//////// 

emojilist.push({
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
    button_id: count
  })
  count++
    emojilist.push({
      emoji: emote.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once",
      button_id: count
    });
    count++
        
  buttons = gtftools.preparebuttons(emojilist, msg, userdata);
        
    console.log(racesettings["distance"])
require(gtf.DISCORD).send(msg, {content:ping + " **FINISH**",embeds: [embed], components:buttons}, race2func) 

function race2func(msg) {
          require(gtf.RACEEX).createfinalbuttons(racesettings, racedetails, finalgrid,  checkpoint, results2, buttons, emojilist, embed, msg, userdata);
  
          if (racesettings["mode"] == "CAREER") {
         var complete = stats.checkcareerevent(racesettings, "1st", userdata);
                if (complete) {
            stats.completeevent(racesettings, userdata);
              stats.redeemgift(emote.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + emote.goldmedal, racesettings["prize"], embed, msg, userdata);
                }
          }
/*
  if (racesettings["mode"] == "LICENSE") {
         var complete = stats.checklicenseevent(racesettings, "1st", userdata);
                if (complete) {
            stats.completeevent(racesettings, userdata);
                  */
  /*
              stats.redeemgift(emote.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + emote.goldmedal, racesettings["prize"], embed, msg, userdata);
              
                }
              
  }
  */
          if (racesettings["mode"] != "ONLINE") {
          stats.save(userdata);
          }
        }
    return;
  } else {
        var maxprogress = Math.floor(((new Date().getTime()-userdata["raceinprogress"]["start"])/(totaltime-userdata["raceinprogress"]["start"])) * start.length)
        for (var t = 0; t < start.length; t++) {
          start[t] = progressbarblack;
          if (t < maxprogress) {
             start[t] = progressbarblackarcolor;
          }
        }
        results3 = start.join("");
      }
    };

    var progress = setInterval(function () {
      
    console.log(racesettings["distance"])
      check();
      if (userdata["raceinprogress"]["expire"] <= new Date().getTime() || !userdata["raceinprogress"]["active"]) { 
        clearInterval(progress);
        return
      }
      var indexv = Math.floor(((new Date().getTime() -userdata["raceinprogress"]["start"])/(totaltime-userdata["raceinprogress"]["start"])) * userdata["raceinprogress"]["gridhistory"].length)
      
        if (racesettings["type"] != "TIMETRIAL") {
      message = userdata["raceinprogress"]["msghistory"][indexv]
      finalgrid = userdata["raceinprogress"]["gridhistory"][indexv]
      racetime = userdata["raceinprogress"]["timehistory"][indexv]
      raceweather = userdata["raceinprogress"]["weatherhistory"][indexv]
      racetires = userdata["raceinprogress"]["tirehistory"][indexv]
      if (isNaN(racelength)) {
        require(gtf.EMBED).alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred. Race Aborted.", embed: "", seconds: 0 }, msg, userdata);
        console.log(userdata["id"] + ": Race Aborted ERROR");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        stats.save(userdata);
        clearInterval(progress);
        return;
      }
      embed.setDescription(results3 + "\n" + finalgrid.slice(0,10).map(function(x){
        var gap = "`" + "+" + x["gap"] + "`"
        if (x["gap"] == 0) {
          gap = ""
        }
        var name = [require(gtf.CARS).shortname(x["name"]), x["drivername"]][userdata["settings"]["GRIDNAME"]]
      
        if ( racesettings["mode"] == "ONLINE") {
          name = require(gtf.CARS).shortname(x["name"]) + " `" + x["drivername"] + "`"
          return x["position"] + ". " + gap + name
        }
        if (x["user"]) {
        return "**" + x["position"] + ".** " + gap + " **" + name + "**"
        } else {
        return x["position"] + ". " + gap + " " + name
        }
      }).join("\n") + message + "\n\n" + racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" +  require(gtf.DATETIME).getFormattedTime(totaltime - new Date().getTime()) + " minutes" + showcar + emote.tire + "**" + racetires.split(" ").map(x => x[0]).join("") + "**" + resumerace)
      } else {
          finalgrid = userdata["raceinprogress"]["gridhistory"][0]
      }

      if (racesettings["mode"] == "DRIFT") {
        let drift1 = require(gtf.RACEEX).driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, false);
        var icon = emote.transparent;
        if (drift1[0] > 0) {
          icon = emote.driftflag;
        }
        racesettings["points"] += drift1[0];
        embed.setDescription(results3 + "\n" + icon + " **" + gtftools.numFormat(racesettings["points"]) + "pts**" + "\n\n" + + racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" +  require(gtf.DATETIME).getFormattedTime(totaltime - new Date().getTime()) + " minutes" + showcar + emote.tire + "**" + racetires.split(" ").map(x => x[0]).join("") + "**" + resumerace);
      } 
      if (racesettings["type"] == "TIMETRIAL" && userdata["raceinprogress"]["expire"] != "EXIT") {
        var lap = ""
        var bestlap = ""
        if (finalgrid[0]["laps"].length >= 1) {
          
        if (finalgrid[0]["laps"].filter(function(x) {return x["best"] == true && x["medal"] != "FAIL"}).length >= 1) { 
        var bestlapobject = finalgrid[0]["laps"].filter(function(x) {return x["best"] == true && x["medal"] != "FAIL"})[0]
      bestlap = emote.tracklogo + "__**Best:**__ " + bestlapobject["medalemote"] + " "+ require(gtf.DATETIME).getFormattedLapTime(bestlapobject["time"]) + " `Lap " + bestlapobject["lapnum"] + "`"
        var laps = finalgrid[0]["laps"].map(function(x,index) {
          if (x["best"] && x["medal"] != "FAIL") {
            return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + require(gtf.DATETIME).getFormattedLapTime(x["time"]) + " ⭐"
          }
          return  "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + require(gtf.DATETIME).getFormattedLapTime(x["time"]) 
          }).reverse().slice(0,5).join("\n")
        } else {
          var laps = "__**Lap 1:**__ "
        } 
        } else {
        var laps = "__**Lap 1:**__ "
        }
        var timeprizes = ["**" + emote.goldmedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][0]["time"] * 1000), emote.silvermedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][1]["time"] * 1000) + " ", 
                          emote.bronzemedal + " " + require(gtf.DATETIME).getFormattedLapTime(racesettings["positions"][2]["time"] * 1000) + "**"]
        embed.setDescription(results3 + "\n" + timeprizes.join(" ") + "\n" + bestlap + "\n\n" + laps + "\n" + showcar + emote.tire + "**" + userdata["raceinprogress"]["tirehistory"][0].split(" ").map(x => x[0]).join("") + "**" + resumerace);
      }
      stats.save(userdata);
      
   
      msg.edit({embeds: [embed], components:buttons}).catch(function () {
        clearInterval(progress);
        console.log("Session has ended. (Message is not there.)");
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], tirehistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum:0}
        /*
        if (racesettings["type"] == "TIMETRIAL") {
          results2 = require(gtf.RACEEX).timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          embed.setDescription(results2)
          require(gtf.DISCORD).send(msg, {embeds: [embed]})
        }
        */
        return;
      });
      if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") {
      if (typeof message === 'undefined') {
          message = ""
        } else if (message.length != 0) {
          message = ""
        }
      }

    }, timeinterval);
    
  }, startracetime);
  }
};


