var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require("../../files/directories");
////////////////////////////////////////////////////

module.exports.changetimetrials = function (force) {
  var timetrials = {};
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  setInterval(function () {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection("TIMETRIALS")
        .find({ id: "1234567" })
        .forEach(row => {
          if (timetrialcheck(row) || force) {
            if (row["count"].length >= 3) {
              
            console.log("Time Trials has been changed.");
            var timetrials = require(gtf.TIMETRIAL).randomtimetrial(1);
            var timetrials2 = require(gtf.TIMETRIAL).randomtimetrial(2);
            var timetrials3 = require(gtf.TIMETRIAL).randomtimetrial(3);
            var races = {
              id: "1234567",
              count: [],
              races: { timetrials, timetrials2, timetrials3 },
            };
            } else {
              var races = row
            }
            dbo.collection("TIMETRIALS").replaceOne({ id: "1234567" }, races);
          }
        })
        .then(() => {
          db.close();
        });
    });

    function timetrialcheck(timetrial) {
      var date = new Date();
      var month = date.getMonth();
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      var year = date.getFullYear();
      var currentdate = month + day + year;
      if (!timetrial["count"].includes(currentdate)) {
        timetrial["count"].push(currentdate)
      }
      if (typeof timetrial["races"]["timetrials"]["date"] === undefined) {
        return true;
      }
      return currentdate !=  timetrial["races"]["timetrials"]["date"];
    }
  }, 1000 * 60);
};

module.exports.randomtimetrial = function (number) {
  
var rcar = require(gtf.CARS).random({ types: ["Production"] }, 1)[0];
var track = require(gtf.TRACKS).random({ types: ["Tarmac"] }, 1)[0]
var raceprep = {
        mode: "TIMETRIAL",
        modearg: number,
        carselect: "LOANER",
        car: rcar,
        trackselect: "SELECT",
        track: track,
        players: [{ place: 1, 
        position: 1, 
        name: rcar["name"] + " " + rcar["year"], 
        drivername: "Player",
        user: true,
        fpp: require(gtf.PERF).perf(rcar, "DEALERSHIP")["fpp"], 
        oscore: 0,
        score: 0,
        points: 0 }],
        leaderboard: [],
        other: [],
      };
  return raceprep;
};

module.exports.savebestlap = function (lap, userdata) {
  var timetrialdata = "";
  var found = false;
  var newrecord = false

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");

    dbo
      .collection("TIMETRIALS")
      .find({ id: "1234567" })
      .forEach(row => {
        timetrialdata = row;
        delete timetrialdata["_id"];
        add();
        dbo.collection("TIMETRIALS").replaceOne({ id: "1234567" }, timetrialdata);
        found = true;
      });
  });

  function add() {
    var number = lap["eventid"]
    var tkeys = Object.keys(timetrialdata["races"])
    for (var i = 0; i < tkeys.length; i++) {
      var x = timetrialdata["races"][tkeys[i]]
      if (x["modearg"] == lap["eventid"]) {
        if (x["leaderboard"].filter(y => y["userid"] == lap["userid"]).length == 0) {
        x["leaderboard"].push(lap)
        x["leaderboard"] = x["leaderboard"].sort((a, b) => a.time - b.time)
        } else {
          var prevtime = x["leaderboard"].filter(y => y["userid"] == lap["userid"])
          if (lap["time"] < prevtime["time"]) {
            x["leaderboard"] = x["leaderboard"].filter(y => y["userid"] != lap["userid"])
            x["leaderboard"].push(lap)
          }
        }
      }
    }
  }
};

module.exports.formleaderboard = function (list, full, msg, userdata) {
  var player = ""

  list = list.map(function(x, index) {
    if (index == 0) {
      var place = emote.goldmedal
    } 
    if (index == 1) {
      var place = emote.silvermedal
    } 
    if (index == 2) {
      var place = emote.bronzemedal
    } else {
      var place = index + 1
    }
    var username = msg.guild.members.cache.get(x["userid"]).user.username
    if (x["userid"] == userdata["id"]) {
      player = place + "." + " `" + require(gtf.DATETIME).getFormattedLapTime(x["time"]) + "` " + username 
    }
    return place + "." +" `" + require(gtf.DATETIME).getFormattedLapTime(x["time"]) + "` " + username
  })
  if (!full) {
    list = list.slice(0,10)
  }
  return list
}