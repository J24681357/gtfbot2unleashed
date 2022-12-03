var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require("../../files/directories");
////////////////////////////////////////////////////

module.exports.changeseasonals = function (force) {
  var fs = require("fs")
  var seasonals = {};
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
 setInterval(function () {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection("SEASONALS")
        .find({ id: "1234567" })
        .forEach(row => {
          if (seasonalcheck(row["races"]) || force) {
                  var date = new Date();
      var month = date.getMonth();
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      var year = date.getFullYear();
      var currentdate = month + day + year;
            if (!row["count"].includes(currentdate)) {
                  row["count"].push(currentdate)
            }
             if (row["count"].length >= 4 || force) {
            console.log("Seasonals has been changed.");
            var seasonals = require(gtf.SEASONAL).randomseasonalb(1, 400, 250);
            var seasonals2 = require(gtf.SEASONAL).randomseasonalb(2, 500, 350);
            var seasonals3 = require(gtf.SEASONAL).randomseasonalb(3, 750, 500);

            var extra = JSON.parse(fs.readFileSync("./jsonfiles/gtfseasonalsextra.json", "utf8"));
               
  if (Object.keys(extra).length == 0) {
    
            row = {
              id: "1234567",
              races: { seasonals, seasonals2, seasonals3 },
              count: [currentdate]
            };
  } else {
    extra["date"] = currentdate
    seasonals = extra
    row = {
              id: "1234567",
              races: { seasonals, seasonals2, seasonals3 },
              count: [currentdate]
            };
    fs.writeFile("./jsonfiles/gtfseasonalsextra.json", JSON.stringify({}), function (err) {
    if (err) {
      console.log(err);
    }
  });
  }
               
          }
          dbo.collection("SEASONALS").replaceOne({ id: "1234567" }, row);
        }
        })
        .then(() => {
          db.close();
        });
    });

    function seasonalcheck(seasonal) {
      seasonal = seasonal["seasonals"];
      var date = new Date();
      var month = date.getMonth();
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      var year = date.getFullYear();
      var currentdate = month + day + year;
      if (typeof seasonal === 'undefined') {
        return true;
      }
      if (typeof seasonal["date"] === 'undefined') {
        return true;
      }
      return currentdate != seasonal["date"];
    }
 }, 1000 * 60 * 5);
};

module.exports.randomseasonalb = function (number, fpplimit, lowerfpp) {

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var types = []
  var countries = []

  var cartypes = [
    ["Production", "Aftermarket"], 
["Production", "Aftermarket"], 
["Production", "Aftermarket"], 
["Production", "Aftermarket"], 
["Production", "Aftermarket"], 
["Production", "Aftermarket"], 
["Production", "Aftermarket"],
["Race Car: GT4"],
["Race Car: GT3", "Race Car: GTE", "Race Car: Group 5", "Race Car: GT2","Race Car: GT1"],
["Race Car: GT500", "Race Car: GT300"],
["Race Car: LMP", "Race Car: Historic", "Race Car: Group C"]] 
  

  var cartype = cartypes[Math.floor(Math.random() * cartypes.length)]

  var creditsmulti = 1
  var rmake = []
  var rcountry = []
  var finalfpp = 9999
  var bop = false

  if (cartype[0].includes("Production")) {
  finalfpp = Math.ceil(gtftools.randomInt(lowerfpp, fpplimit) / 10) * 10;
  var makes = require(gtf.CARS).list("makes");
  var countries = require(gtf.CARS).list("countries");
  if (gtftools.randomInt(1,4) <= 2) {   
  var makesfilter = makes.filter(function(x) {
    var list = require(gtf.CARS).find({ make: [x], types: types })
    return list.length >= 3 && list.some(y => require(gtf.PERF).perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })

  if (makesfilter.length == 0 || gtftools.randomInt(1,3) == 1) {
    rmake = []
  } else {
    rmake = [makesfilter[Math.floor(Math.random() * makesfilter.length)]]
  }
  lowerfpp = finalfpp - 100
  } else {
  var countriesfilter = countries.filter(function(x) {
    var list = require(gtf.CARS).find({ countries: [x] })
    return list.length >= 3 && list.some(y => require(gtf.PERF).perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })
    console.log(countriesfilter)

  if (countriesfilter.length == 0 || gtftools.randomInt(1,3) == 1) {
  } else {
    rcountry = [countriesfilter[Math.floor(Math.random() * countriesfilter.length)]]
  }
  lowerfpp = finalfpp - 100
  }
    
  }

  if (cartype[0].includes("Race Car")) {
    creditsmulti = 3
    lowerfpp = 0
    bop = true
  }

  var tracks = [];
  var difficulty
  if (number == 1) {
    var eventid = "seasonal" + "-" + number;
    var grid = gtftools.randomInt(6, 11);
    var startingprize = 3000;
    var tracksnum = gtftools.randomInt(3,5);
    var limit = 8.0;
    difficulty = 70
  }
  if (number == 2) {
    var eventid = "seasonal" + "-" + number;
    var grid = gtftools.randomInt(12, 16);
    var startingprize = 5000;
    var tracksnum = gtftools.randomInt(3,5);
    var limit = 13.0;
    difficulty = 50
  }
  if (number == 3) {
    var eventid = "seasonal" + "-" + number;
    var grid = gtftools.randomInt(16, 20);
    var startingprize = 10000;
    var tracksnum = gtftools.randomInt(3,5);
    var limit = 20.0;
    difficulty = 30
  }
  for (var x = 0; x < tracksnum; x++) {
    var track = require(gtf.TRACKS).random({types:["Tarmac"]}, 1)[0];
    var km = track.length;
    var distance = require(gtf.RACE).lapcalc(km, limit);
    tracks.push([x + 1, track.name, distance[0]]);
  }

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  for (var x = 0; x < grid; x++) {
    if (x % 10 == 0 && x + 1 != 11) {
      positions.push({place: (x + 1) + "st", credits:prize});
    } else if (x % 10 == 1 && x + 1 != 12) {
      positions.push({place: (x + 1) + "nd", credits:prize});
    } else if (x % 10 == 2 && x + 1 != 13) {
      positions.push({place:(x + 1) + "rd", credits:prize});
    } else {
      positions.push({place:(x + 1) + "th", credits:prize});
    }
    prize = Math.ceil((prize - (prize / (grid/ 5))) / 100) * 100;
  }
  date = month + day + year;
if (cartype[0].includes("Production")) {
  if (gtftools.randomInt(0, 1) == 1) {
  var prizec = ["CREDITS", { id: -1, name: " ", item: positions[0]["credits"] * tracksnum }];
  } else {
    var c = require(gtf.CARS).random({ upperfpp: finalfpp + 100, lowerfpp: finalfpp - 150 }, 1)[0];
    var prizec = ["RANDOMCAR", { id: -1, make: [c["make"]], fullname: [c["name"] + " " + c["year"]] }];
  }
} else {
   if (gtftools.randomInt(0, 1) == 1) {
  var prizec = ["CREDITS", { id: -1, name: " ", item: positions[0]["credits"] * tracksnum }];
  } else {
    var prizec = ["RANDOMCAR", { id: -1, types: [cartype[0]]}];
  }
}
  var rtimeint = gtftools.randomInt(0, 1);
  if (rtimeint == 0) {
    time = "Day";
  } else {
    time = "Night";
  }
  var rweather = ["Clear", "Partly Cloudy", "Overcast"][gtftools.randomInt(0, 2)]
 

  var event = {
    title: "Seasonal Event " + number,
    eventid: eventid,
    date: date,
    positions: positions,
    tracks: tracks,
    time: [time],
    timeprogression: 1,
    type: "LAPS",
    weather: [rweather],
    weatherchange: 0,
    tires: "Racing",
    bop: bop,
    championship: false,
    grid: grid,
    difficulty: difficulty,
    
    fpplimit: finalfpp,
    upperfpp: finalfpp,
    lowerfpp: lowerfpp,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0,
    countries: rcountry,
    makes: rmake,
    models: [],
    drivetrains: [],
    engines: [],
    special: [],
    prohibited: [],
    types: cartype,
    prize: prizec,
  };

  return event;
};
