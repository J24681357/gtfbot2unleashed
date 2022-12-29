var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var fs = require("fs");

module.exports = {
  name: "debug",
  title: "DEBUG",
  level: 0,
  channels: ["testing"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  description: ["!debug - (ADMIN ONLY) This command is only used for testing purposes."],
  execute(msg, query, userdata) {
   var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: false,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
      if (userdata["id"] != "237450759233339393") {
        require(gtf.EMBED).alert({ name: "❌ Error", description: "This command is for adminstrators only.", embed: embed, seconds: 0 }, msg, userdata);
        return
      }
    var deletee = false;

     var keys = [];

    var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    MongoClient.connect(function (err, db) {
      if (err) throw err;
       var dbo = db.db("GTFitness");
    dbo
      .collection("GTF2SAVES")
      .find({})
      .forEach(row => {
        if (typeof row["id"] === undefined) {
          return;
        } else {
          keys.push(row);
        }
      }).then(() => {
      userdata = keys.filter(x => x["id"] == query["user"])[0]
      if (userdata == undefined) {
        
        return
      }
      g(userdata);
      db.close();
      })
     
    });

    function g(userdata) {
      var extra = "";
      
      var success = false;
      var id = userdata["id"];

      if (query["args"] == "exportuserdata") {
        success = true
        /*
        var text = Buffer.from(JSON.stringify(userdata), 'utf8')
        var mz = new Minizip();
        mz.append("userdata.txt", text, {password: process.env.USERDATAPASSWORD});
        const attachment = new AttachmentBuilder( new Buffer(mz.zip()), {name: "GTFITNESSGAME-USERDATA.zip"});
        require(gtf.DISCORD).send(msg, {files:[attachment]})
        */
        return;
      }
      if (query["args"] == "updateallsaves") {
        success = true
        if (typeof query["object"] === 'undefined') {
          query["object"] = {}
        } else {
          query["object"] = JSON.parse(query["object"])
        }
        gtftools.updateallsaves(query["object"])
      }
      if (query["args"] == "importuserdata") {
        success = true
        /*
        var text = Buffer.from(JSON.stringify(userdata), 'utf8')
        var mz = new Minizip();
        mz.append("userdata.txt", text, {password: process.env.USERDATAPASSWORD});
        const attachment = new AttachmentBuilder( new Buffer(mz.zip()), {name: "GTFITNESSGAME-USERDATA.zip"});
        require(gtf.DISCORD).send(msg, {files:[attachment]})
        */
        return;
      }
      if (query["args"] == "updateseasonals" || query["args"] == "changeseasonals") {
        success = true;
        require(gtf.SEASONAL).changeseasonals(true);
      }
      if (query["args"] == "addseasonal" || query["args"] == "addseasonals") {
        success = true;
        require(gtf.SEASONAL).addseasonals(true);
      }

      if (query["args"] == "resetcareer") {
        success = true
        var types = ["n", "b", "a", "ic", "ib", "ia", "s", "seasonal"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 21; j++) {
            career[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }
    userdata["careerraces"] = career
}


if (query["args"] == "announce_update") {
        success = true
        setTimeout(function() {
          var string = query["string"]
          var embed = new EmbedBuilder()
          var channel = msg.guild.channels.cache.find(channel => channel.id === "687872420933271577");
          embed.setTitle("⚠ __Maintenance Notice__")
          embed.setColor(0xffff00)
          embed.setDescription("The GT Fitness game has a scheduled maintenance: **" + query["string"] + "**. During this time, all commands for the game will be unavailable. The discount page in **/car**, may immediately change after this maintenance." + "\n\n" + "**Additional Information:** " + query["string2"])
          require(gtf.DISCORD).send(channel, {type1: "CHANNEL", embeds: [embed]})
        } , 1000)
}

    if (query["args"] == "resetseasonals") {
        success = true
         var careeraceskeys = Object.keys(userdata["careerraces"])
         for (var i = 0; i < careeraceskeys.length; i++) {
  if (Object.keys(careeraceskeys)[i].match(/seasonal/ig)) {
    userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
  }
}
      }

     
      if (query["args"] == "maintenance") {
        success = true;
        if (require(gtf.MAIN).gtfbotconfig["maintenance"] == "YES") {
          require(gtf.MAIN).gtfbotconfig["maintenance"] = "NO";
        } else {
          require(gtf.MAIN).gtfbotconfig["maintenance"] = "YES";
        }
        setTimeout(function () {
          require(dir + "commands/restart").execute(msg, [""], userdata);
        }, 1000);
      }
      if (query["args"] == "partialmaintenance") {
        success = true;
        if (require(gtf.MAIN).gtfbotconfig["maintenance"] == "PARTIAL") {
          require(gtf.MAIN).gtfbotconfig["maintenance"] = "NO";
        } else {
          require(gtf.MAIN).gtfbotconfig["maintenance"] = "PARTIAL";
        }
        setTimeout(function () {
          require(dir + "commands/restart").execute(msg, [""], userdata);
        }, 1000);
      }

      //LICENSE
      if (query["args"] == "setlicense") {
        success = true;
        userdata["license"] = query["string"]
      }

      //CREDITS
      if (query["args"] == "addcredits") {
        success = true;
        stats.addcredits(parseInt(query["number"]), userdata);
      }
      if (query["args"] == "removecredits") {
        success = true;
        stats.addcredits(-parseInt(query["number"]), userdata);
      }
      if (query["args"] == "setcredits") {
        success = true;
        userdata["credits"] = parseInt(query["number"]);
      }
      
      ///GIFTS
      if (query["args"] == "giftcredits") {
        success = true;
        var gift = {
        "name": "DEBUG " + query["number"] + emote.credits,
        "type": "CREDITS",
        "item": 5000,
        "author": "GTF",
        "inventory": true
      }
        stats.addgift(gift, userdata);
      }
      if (query["args"] == "giftrandomcar") {
        success = true;
        var car = require(gtf.CARS).random({}, 1)[0];
        stats.addgift(car["name"], car, "CAR", "USERNAME", true, userdata);
        extra = "\n" + "Added new car to gifts.";
      }
      if (query["args"] == "cleargifts") {
        success = true;
        userdata["gifts"] = [];
      }

      //DAILYWORKOUT
      if (query["args"] == "dailyworkoutoff") {
        success = true;
        userdata["dailyworkout"] = false;
      }
      if (query["args"] == "dailyworkouton") {
        success = true;
        userdata["dailyworkout"] = true;
      }

      //RACES
      if (query["args"] == "forcecancel") {
        success = true;
        stats.clearraceinprogress(userdata)
      }
      if (query["args"] == "forcelobbycancel") {
        success = true;
        userdata["inlobby"] = [false, ""];
      }
      if (query["args"] == "deleteprofile") {
        success = true;
        deletee = true;
      }
      if (query["args"] == "createreplaydata") {
        success = true;
         var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        MongoClient.connect(function (err, db) {
          if (err) throw err;
          var dbo = db.db("GTFitness");
          var users = dbo.collection("GTF2SAVES");
          users.insertOne(userdata, (err, result) => {});
          dbo.collection("REPLAYS").insertOne(
            {
              id: userdata["id"],
              replays: [],
            },
            (err, result) => {}
          );
        });
      }
      if (query["args"] == "createcoursedata") {
        success = true;
        var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        MongoClient.connect(function (err, db) {
          if (err) throw err;
          var dbo = db.db("GTFitness");
          var users = dbo.collection("GTF2SAVES");
          users.insertOne(userdata, (err, result) => {});
          dbo.collection("CUSTOMCOURSES").insertOne(
            {
              id: userdata["id"],
              courses: [],
            },
            (err, result) => {}
          );
        });
      }

      ///GARAGE
      if (query["args"] == "cleargarage") {
        success = true;
        userdata["garage"] = [];
        userdata["currentcarnum"] = 0;
      }
      if (query["args"] == "addrandomcar" || query["args"] == "addrandomcars") {
        success = true;
        var cars = require(gtf.CARS).random({}, parseInt(query["number"]));
        for (var i = 0; i < cars.length; i++) {
          stats.addcar(cars[i], "SORT", userdata);
        }
        results = "`" + query["args"] + "` success to " + msg.guild.members.cache.get(userdata["id"]).user.username + "." + "\n" + "Added " + query["number"] + " random cars to garage.";
      }
      
       if (query["args"] == "addmileage") {
        success = true;
        stats.addmileage(query["number"], userdata);
      }
      if (query["args"] == "setmileage") {
        success = true;
        userdata["mileage"] = query["number"];
      }
      if (query["args"] == "setracemulti") {
        success = true;
        userdata["racemulti"] = parseFloat(query["number"])
      }

      //EXP & LEVEL
      if (query["args"] == "setexp") {
        success = true;
        userdata["exp"] = query["number"];
      }
      if (query["args"] == "addexp") {
        success = true;
        stats.addexp(parseInt(query["number"]), userdata);
      }
      if (query["args"] == "resetexp") {
        success = true;
        userdata["exp"] = 0;
        userdata["level"] = 0;
      }
      if (query["args"] == "setlevel") {
        success = true;
        userdata["level"] = parseInt(query["number"]);
      }
      if (query["args"] == "resetexplevel" || query["args"] == "resetlevel") {
        success = true;
        userdata["level"] = 0;
      }
      
      if (query["args"] == "careerracecomplete") {
         success = true;
        if (!query["number"].includes("-")) {
          return;
        }
 if (query["number"].split("-")[0].match(/b/g)) {
          var races = require(dir + "data/career/races").beginner();
        }
        if (query["number"].split("-")[0].match(/a/g)) {
          var races = require(dir + "data/career/races").amateur();
        }
        if (query[1].split("-")[0].match(/ic/g)) {
          var races = require(dir + "data/career/races").icleague();
        }
        if (query[1].split("-")[0].match(/ib/g)) {
          var races = require(dir + "data/career/races").ibleague();
        }
        if (query[1].split("-")[0].match(/ia/g)) {
          var races = require(dir + "data/career/races").ialeague();
        }
        if (query[1].split("-")[0].match(/s/g)) {
          var races = require(dir + "data/career/races").sleague();
        }

        var event = races[Object.keys(races)[parseInt(query[1].split("-")[1]) - 1]];
        var tracks = event["tracks"];
        var track = require(gtf.TRACKS).find({ name: tracks[parseInt(query[1].split("-")[2]) - 1]})[0];
        var racesettings = require(gtf.RACE).setcareerrace(event, track, stats.currentcar(userdata), parseInt(query[1].split("-")[2]) - 1);

        stats.updatecareerrace(racesettings["raceid"], "1st", userdata);

        ;
      }
      if (query["args"] == "careergift") {
        success = true;
        if (!query[1].includes("-")) {
          return;
        }
        if (query[1].split("-")[0].match(/b/g)) {
          var races = require(dir + "data/career/races").beginner();
        }
        if (query[1].split("-")[0].match(/a/g)) {
          var races = require(dir + "data/career/races").amateur();
        }
        if (query[1].split("-")[0].match(/ic/g)) {
          var races = require(dir + "data/career/races").icleague();
        }
        if (query[1].split("-")[0].match(/ib/g)) {
          var races = require(dir + "data/career/races").ibleague();
        }
        if (query[1].split("-")[0].match(/ia/g)) {
          var races = require(dir + "data/career/races").ialeague();
        }
        if (query[1].split("-")[0].match(/s/g)) {
          var races = require(dir + "data/career/races").sleague();
        }

        var event = races[Object.keys(races)[query[1].split("-")[1] - 1]];
        var tracks = event["tracks"];
        var track = require(gtf.TRACKS).find({ name: tracks[1] })[0];
        var racesettings = require(gtf.RACE).setcareerrace(event, track, stats.currentcar(userdata), 0);
        stats.redeemgift(racesettings["prize"], userdata)
        ;
      }

      if (success) {
        if (deletee) {
          stats.save(userdata, "DELETE");
        } else {
          stats.save(userdata);
        }
        results = "`" + query["args"] + "` success to " + msg.guild.members.cache.get(userdata["id"]).user.username + "." + extra
        require(gtf.EMBED).alert({ name: "✅ Success", description: results, embed: "", seconds: 0 }, msg, userdata);
        return
      } else {
        require(gtf.EMBED).alert({ name: "❌ Invalid", description: "Invalid command.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
    }
  },
};
