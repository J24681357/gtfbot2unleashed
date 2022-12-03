var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var race2ex = require(dir + "functions/races/f_races_2ex");

module.exports.readysetgob = function (user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata) {
  var results2 = "";
  var index = 0;
  var showcar = "";
  var racelength = 0;
  var startracetime = 2000;
  var racetime = ""
  var raceweather = ""
  var racetires = ""
  var resumerace = "";
  var message = ""
  var progressbarblackarcolor = userdata["settings"]["PROGRESSBAR"][0];
  var progressbarblack = userdata["settings"]["PROGRESSBAR"][1];

    embed.image = ""
  embed.thumbnail = ""

  embed.setTitle("__" + racesettings["title"] + "__")
  embed.setColor(userdata["settings"]["PROGRESSBAR"][2])
  embed.setAuthor({name: msg.guild.members.cache.get(userdata["id"]).user.username, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});
  
  msg.removeAttachments()
  //stats.updatefpp(racesettings["misc"]["car"])
  //racesettings["misc"]["car"] = stats.currentcar(userdata)

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

  if (racesettings["mode"] == "CAREER") {
      if (racesettings["championship"][0]) {
        if (userdata["raceinprogress"]["championshipnum"] >= 1) {
          setTimeout(function() {readysetgo()}, 10 * 1000)
        } else {
          readysetgo()
        }
      } else {
        readysetgo()
      }
} else {
  readysetgo()
}
  function readysetgo() {

  if (!checkpoint[0]) {
  userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(racesettings["weather"])))
  var weatheri = racesettings["weather"]
  for (var i = 0; i < 20; i++) {
    weatheri = require(gtf.WEATHER).advanceweather(weatheri, racesettings["km"]) 
    userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(weatheri)))
  }
  }
    
  if (racesettings["mode"] == "SSRX") {
    let ssrx1 = race2ex.ssrxracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    var speedkph = ssrx1[0];
    var speedmph = ssrx1[1];
    showcar = ssrx1[2];
    racelength = ssrx1[3];
  } 
  else if (racesettings["mode"] == "DUEL") {
    let duel1 = race2ex.duelracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    showcar = duel1[0];
    racelength = duel1[1];
  } 
  else if (racesettings["mode"] == "CAREER") {
    if (racesettings["type"] == "TIMETRIAL") {
      let tt1 = race2ex.timetrialracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
      showcar = tt1[0];
      racelength = tt1[1];
    } else {
    let career1 = race2ex.careerracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    showcar = career1[0];
   racelength = career1[1];
    }
  } 
  else if (racesettings["mode"] == "ARCADE") {
    let arcade1 = race2ex.arcaderacelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    showcar = arcade1[0];
    racelength = arcade1[1];
  } 
  else if (racesettings["mode"] == "ONLINE") {
    let online1 = race2ex.onlineracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    showcar = online1[0];
    racelength = online1[1];
  } 
  else if (racesettings["mode"] == "DRIFT") {
    racesettings["sectors"] = racesettings["originalsectors"];
    racesettings["points"] = 0;
    let drift1 = race2ex.driftracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    showcar = drift1[0];
    racelength = drift1[1];
  } /*(else if (racesettings["mode"] == "TIMETRIAL") {
    let tt1 = race2ex.timetrialracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
    var showcar = tt1[0];
    racelength = tt1[1];
    if (typeof finalgrid[0]["laps"] === 'undefined') {
        finalgrid[0]["laps"] = []
     }
  }
  */
  if (racesettings["type"] == "TIME") {
    racelength = parseInt(racesettings["laps"].split("m")[0]) * (60*1000)
  }
  if (!checkpoint[0]) {

    var currenttime = new Date().getTime();
    var totaltime = new Date().getTime() + racelength + 2000;
    ///check for raceinprogress
    if (racesettings["mode"] == "CAREER") {
      if (racesettings["championship"][0]) {
        if (typeof userdata["raceinprogress"]["championshipnum"] === 'undefined') {
          userdata["raceinprogress"] = {active:true, channelid: msg.channel.id, messageid:msg.id, expire:totaltime, tirehistory: [], gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
    msghistory: [], raceid: racesettings["raceid"],championshipnum:0};       
          } else {
          userdata["raceinprogress"]["messageid"] = msg.id
          userdata["raceinprogress"]["expire"] = totaltime
        }
      } else if (racesettings["mode"] == "ONLINE") {
        require(gtf.LOBBY).updateusersraceinprogress(finalgrid, totaltime, msg)
      } else {
        userdata["raceinprogress"] = {active:true, channelid: msg.channel.id, messageid:msg.id, expire:totaltime, tirehistory: [], gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
    msghistory: []};
      }
    } else {
      
      userdata["raceinprogress"] = {active:true, channelid: msg.channel.id, messageid:msg.id, expire:totaltime,     gridhistory: [], tirehistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
    msghistory: []};
    }
    ///////
    
    stats.addracedetails(racesettings, racedetails, finalgrid, args, userdata);
    userdata["raceinprogress"]["start"] = currenttime

  var timeinterval = racelength / 20
  if (timeinterval <= 2000) {
    timeinterval = 2000
  } 
  userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
  userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(racesettings["time"])))
    if (typeof racesettings["misc"]["car"] === 'undefined') {
      userdata["raceinprogress"]["tirehistory"].push("Sports: Hard")
    } else {
  userdata["raceinprogress"]["tirehistory"].push(racesettings["misc"]["car"]["tires"]["current"].slice())
    }
    
  for (var i = 0; i < 20; i++) {
    userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
    message = race2ex.updategrid(user, racedetails, racesettings, userdata["raceinprogress"]["weatherhistory"][i], finalgrid, embed, msg, args, checkpoint, userdata, timeinterval, message)

    timei = require(gtf.TIME).increasetime(racesettings["time"], timeinterval)
    userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(timei)))
    userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
    if (typeof racesettings["misc"]["car"] === 'undefined') {
      userdata["raceinprogress"]["tirehistory"].push("Sports: Hard")
    } else {
  userdata["raceinprogress"]["tirehistory"].push(racesettings["misc"]["car"]["tires"]["current"].slice())
    }
  } 
  finalgrid = userdata["raceinprogress"]["gridhistory"][0]
  } else {
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
    if (racesettings["type"] != "TIMETRIAL") {
     racelength = totaltime - new Date().getTime() - 2000;
    }
    if (racesettings["type"] == "TIMETRIAL") {

      userdata["raceinprogress"]["msghistory"] = []
  for (var i = 0; i < 20; i++) {
    //message = race2ex.updategrid(user, racedetails, racesettings, racesettings["weather"], finalgrid, embed, msg, args, checkpoint, userdata, timeinterval, message)
    //userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
   // userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
  }
  //finalgrid = userdata["raceinprogress"]["gridhistory"][0]
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
    2000,
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
         if (typeof finalgrid[0]["laps"] == 'undefined') {
            userdata["raceinprogress"]["gridhistory"].map(finalgrid => {
              finalgrid[0]["laps"] = []
              return finalgrid
            })
         }
         var laprecords = Object.assign([], userdata["raceinprogress"]["gridhistory"][0][0]["laps"])
         var newlap = {userid: userdata["id"],
                       eventid: parseInt(racesettings["title"].split(" - ")[0].split(" ")[2]), 
                       time:racelength,
                       lapnum: laprecords.length + 1,
                       date:new Date(), best:false, medal:"NONE"}
        finalgrid = userdata["raceinprogress"]["gridhistory"][userdata["raceinprogress"]["gridhistory"].length-1]

         newlap["medal"] = "NONE"
         newlap["medalemote"] = "⬛"
         
         var medals = ["GOLD", "SILVER", "BRONZE"]
         var medalemotes = [emote.goldmedal, emote.silvermedal, emote.bronzemedal]
         for (var x = 0; x < medals.length; x++) {
           if (newlap["time"] <= (racesettings["positions"][x]["time"]) * 1000) {
             newlap["medal"] = medals[x]
             newlap["medalemote"] = medalemotes[x]
             break;
         }
         }
         laprecords.push(newlap)
         
         var besttimeindex = laprecords.indexOf(laprecords.slice().sort(function (a, b) {return a.time - b.time})[0])
          laprecords.map(function(x, index) {
            if (index == besttimeindex) {
              x["best"] = true
            } else {
              x["best"] = false
            }
            return x
          })
          userdata["raceinprogress"]["gridhistory"].map(finalgrid => {
            finalgrid[0]["laps"] = laprecords
            return finalgrid
          })
          currenttime = new Date().getTime()
        if (laprecords.length < 5) {
          if (newlap["medal"] != "GOLD") {
          return require(gtf.DISCORD).send(msg, {content: "<@" + userdata["id"] + "> **" + newlap["medal"] + " " + require(gtf.DATETIME).getFormattedLapTime(racelength) + " | " + "LAP " + laprecords.length + "**", embeds: [embed]}, repeat)
          }
      }
         userdata["raceinprogress"]["expire"] = "EXIT"
          
          function repeat(msg) {

            let tt1 = race2ex.timetrialracelength(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
          racelength = tt1[1];
          setTimeout(function() {
          userdata["raceinprogress"] = {active:true, messageid: msg.id, channelid: msg.channel.id, start: currenttime, expire: (currenttime + racelength),  gridhistory: userdata["raceinprogress"]["gridhistory"], tirehistory: userdata["raceinprogress"]["tirehistory"], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: []}
            require(dir + "functions/races/f_races_2").readysetgob(user, racedetails, racesettings, finalgrid, embed, msg, args, [true], userdata);
          }, 2000)
          }
        }
        //////ending race
           if (racesettings["mode"] == "CAREER") {
      if (racesettings["championship"][0]) {
      } else {
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:0, gridhistory: [], tirehistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: []}
      }
    } else {
      userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:0, gridhistory: [], tirehistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: []}
    } 
    /////
        
        setTimeout(() => msg.delete(),2000 );

        stats.removeracedetails(userdata);

        if (racesettings["mode"] == "SSRX") {
          let ssrx2 = race2ex.ssrxmiandresults([speedkph, speedmph], user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata);
          var results2 = ssrx2;
        } else if (racesettings["mode"] == "DRIFT") {
          let drift2 = race2ex.driftresults(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata, racesettings["points"]);
          var results2 = drift2;
        } else if (racesettings["mode"] == "ONLINE") {
           results2 = require(gtf.RACE).startonline(racesettings, racedetails, finalgrid, user, userdata);
        } else if (racesettings["type"] == "TIMETRIAL") {
          results2 = race2ex.timetrialresults(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata)
          embed.setDescription(results2)
          //require(gtf.DISCORD).send(msg, {embeds: [embed]})
          //stats.save(userdata);
          //return
        } else {
          results2 = require(gtf.RACE).start(racesettings, racedetails, finalgrid, user, userdata);
        }

        if ( (racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") && racesettings["type"] != "TIMETRIAL") {
       
          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0] + "\n\n" + require(gtf.ANNOUNCER).emote(racesettings["title"]) + " `" + require(gtf.ANNOUNCER).say({name1:"race-results-winner", name2:[finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["name"].split(" ").slice(0,-1).join(" "), 
          finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["drivername"]][userdata["settings"]["GRIDNAME"]], "racesettings":racesettings}) + "`");
        } else {
          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
        }
        if (racesettings["misc"]["car"] == "") {
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
        if (racesettings["mode"] == "DUEL") {
    emojilist.push({
      emoji: emote.exit,
      emoji_name: "gtfexit",
      name: "Return to free run",
      extra: "Once",
      button_id: count
    })
    count++
  } else {
    if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"][0]) {
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
  }
  }
  if (userdata["numreplays"] >= require(gtf.GTF).replaylimit) {
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

    emojilist.push({
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
    button_id: count
  })
  count++
  }
  
  if (racesettings["mode"] == "CAREER") {
    emojilist.push({
      emoji: emote.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once",
      button_id: count
    });
    count++
  }
  buttons = gtftools.preparebuttons(emojilist, msg, userdata);
require(gtf.DISCORD).send(msg, {content:ping + " **FINISH**",embeds: [embed], components:buttons}, race2func) 

function race2func(msg) {
          race2ex.createfinalbuttons(user, racedetails, racesettings, finalgrid,  results2, embed, msg, args, checkpoint, buttons, emojilist, userdata);
  
          if (racesettings["mode"] == "CAREER") {
                var achieve = stats.isracescomplete(racesettings["raceid"].split("-").splice(0, 2).join("-"), racesettings["eventlength"], 1, userdata);
                if (achieve) {
                  stats.eventcomplete(racesettings["raceid"].split("-").splice(0, 2).join("-"), userdata);
                  stats.gift(emote.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + emote.goldmedal, racesettings["prize"], embed, msg, userdata);
                }
          }
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
      check();
      
      if (userdata["raceinprogress"]["expire"] <= new Date().getTime() || !userdata["raceinprogress"]["active"]) { 
        clearInterval(progress);
        return
      }
      var indexv = Math.floor(((new Date().getTime()-userdata["raceinprogress"]["start"])/(totaltime-userdata["raceinprogress"]["start"])) * userdata["raceinprogress"]["gridhistory"].length)
        if (racesettings["type"] !== "TIMETRIAL") {
      message = userdata["raceinprogress"]["msghistory"][indexv]
      finalgrid = userdata["raceinprogress"]["gridhistory"][indexv]
      racetime = userdata["raceinprogress"]["timehistory"][indexv]
      raceweather = userdata["raceinprogress"]["weatherhistory"][indexv]
      racetires = userdata["raceinprogress"]["tirehistory"][indexv]
   
      embed.setDescription(results3 + "\n" + finalgrid.slice(0,8).map(function(x){
        var gap = "`" + "+" + x["gap"] + "`"
        if (x["gap"] == 0) {
          gap = ""
        }
        var name = [x["name"], x["drivername"]][userdata["settings"]["GRIDNAME"]]
      
        if ( racesettings["mode"] == "ONLINE") {
          name = x["name"] + " `" + x["drivername"] + "`"
          return x["position"] + ". " + name + " " + gap
        }
        if (x["user"]) {
        return "**" + x["position"] + ". " + name + "**" + " " + gap
        } else {
        return x["position"] + ". " + name + " " + gap
        }
      }).join("\n") + message + "\n\n" + racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" +  require(gtf.DATETIME).getFormattedTime(totaltime - new Date().getTime()) + " minutes" + showcar + emote.tire + "**" + racetires.split(" ").map(x => x[0]).join("") + "**" + resumerace)
      } else {
          finalgrid = userdata["raceinprogress"]["gridhistory"][0]
      }

      if (racesettings["mode"] == "DRIFT") {
        let drift1 = race2ex.driftsection(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata, false);
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
        if (typeof finalgrid[0]["laps"] !== 'undefined') {
          
        if (finalgrid[0]["laps"].filter(function(x) {return x["best"] == true}).length >= 1) { 
        var bestlapobject = finalgrid[0]["laps"].filter(function(x) {return x["best"] == true})[0]
      bestlap = emote.tracklogo + "__**Best:**__ " + bestlapobject["medalemote"] + " "+ require(gtf.DATETIME).getFormattedLapTime(bestlapobject["time"]) + " `Lap " + bestlapobject["lapnum"] + "`"
        var laps = finalgrid[0]["laps"].map(function(x,index) {
          if (x["best"]) {
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
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], tirehistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: []}
        /*
        if (racesettings["type"] == "TIMETRIAL") {
          results2 = race2ex.timetrialresults(user, racedetails, racesettings, finalgrid, embed, msg, args, checkpoint, userdata)
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