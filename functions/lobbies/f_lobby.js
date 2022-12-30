var dir = "../../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.settingsnregulations = function (setting, changes, lobby, pageargs, embed, msg, userdata) {
  var number = parseInt(pageargs["query"]["number"]);
  var name = pageargs["query"]["name"];
  var listapply;
  var apply;
  var title = "";
  pageargs["selector"] = "number";
  pageargs["rows"] = 10;

  if (setting == "roomname") {
    pageargs["selector"] = "name";
    pageargs["list"] = ["**❗ Use the __[name]__ argument in the desired command to input a new room name in the event settings. If using __/customrace__, it will be the event name.**"];
    listapply = function () {
      embed.setTitle("__Room/Event Name__");
      pageargs["footer"] = "**❓ Change the room name in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (name === undefined) {
        require(gtf.EMBED).alert({ name: "❌ Invalid Name", description: "The room name must be at least 1 character.", embed: "", seconds: 0 }, msg, userdata);
        changes.push("ERROR");
        return;
      }
      var newname = name.slice(0, 24);
      if (lobby["racesettings"]["mode"] == "ONLINE") {
        msg.channel.setName("🌐丨" + newname);
        lobby["channelname"] = newname;
      } else {
        lobby["racesettings"]["title"] = newname;
      }
      changes.push("**Room Title:** " + newname);
    };
  }

  if (setting.includes("track")) {
    pageargs["list"] = require(gtf.TRACKS)
      .find({})
      .map(x => x["name"] + " `" + x["type"] + "`");
    listapply = function () {
      embed.setTitle("__Tracks (" + pageargs["list"].length + " Tracks)__");
      pageargs["footer"] = "**❓ Change the track location & layout in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var trackname = pageargs["list"][number - 1].split(" `")[0];
      var track = require(gtf.TRACKS).find({ name: [trackname] })[0];
      lobby["racesettings"]["track"] = track;
      lobby["racesettings"]["km"] = track["length"] * lobby["racesettings"]["laps"];
      lobby["racesettings"]["km"] = Math.round(lobby["racesettings"]["km"] * 100) / 100;

      if (track["type"].includes("Dirt")) {
        lobby["racesettings"]["tires"] = "Rally: Dirt";
        lobby["racesettings"]["types"] = ["Production"];
        changes.push("**Maximum Tire Grade:** " + lobby["racesettings"]["tires"]);
      } else if (track["type"].includes("Snow")) {
        lobby["racesettings"]["tires"] = "Rally: Snow";
        lobby["racesettings"]["types"] = ["Production"];
        changes.push("**Maximum Tire Grade:** " + lobby["racesettings"]["tires"]);
      } else {
        lobby["racesettings"]["tires"] = "Racing";
        lobby["racesettings"]["types"] = [];
      }
      changes.push("**Track:** " + track["name"]);
    };
  }

  if (setting.includes("time")) {
    pageargs["list"] = [];
    for (var i = 1; i < 25; i++) {
      pageargs["list"].push(i - 1 + ":00");
    }
    listapply = function () {
      embed.setTitle("__Time (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Change the time of the event in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var time = require(gtf.TIME).find({ hours: [number - 1] })[0];
      lobby["racesettings"]["time"] = time;
      changes.push("**Time:** " + pageargs["list"][number - 1]);
    };
  }
  if (setting.includes("weather")) {
    pageargs["list"] = require(gtf.WEATHER).list("names");
    listapply = function () {
      embed.setTitle("__Weather__");
      pageargs["footer"] = "**❓ Change the weather of the track in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var weather = require(gtf.WEATHER).find({ name: [pageargs["list"][number - 1]] })[0];
      lobby["racesettings"]["weather"] = weather;

      changes.push("**Weather:** " + pageargs["list"][number - 1] + "\n" + "**Wet Surface:** " + lobby["racesettings"]["weather"]["wetsurface"] + "%");
    };
  }
  if (setting.includes("wet") || setting.includes("wetsurface") || setting.includes("wet surface %")) {
    pageargs["list"] = [];
    for (var i = 1; i < 12; i++) {
      pageargs["list"].push((i - 1) * 10 + "%");
    }
    listapply = function () {
      embed.setTitle("__Wet Surface Percentage__");
      pageargs["footer"] = "**❓ Change the wet surface percentage of the track in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var weather = require(gtf.WEATHER).find({ name: [pageargs["list"][number - 1]] })[0];
      lobby["racesettings"]["weather"]["wetsurface"] = (number - 1) * 10;

      changes.push("**Wet Surface:** " + pageargs["list"][number - 1]);
    };
  }
  if (setting.includes("lap") || setting.includes("laps")) {
    pageargs["numbers"] = false;
    pageargs["list"] = [...Array(10).keys()].map(function (x) {
      if (x + 1 == 1) {
        return x + 1 + " " + "Lap";
      } else {
        return x + 1 + " " + "Laps";
      }
    });
    listapply = function () {
      embed.setTitle("__Laps (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the number of laps in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 1, 10)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid Laps", description: "You can only set laps between 1 and 10 in a lobby.", embed: "", seconds: 0 }, msg, userdata);
        changes.push("ERROR");
      } else {
        var track = lobby["racesettings"]["track"];
        lobby["racesettings"]["type"] = "LAPS";
        lobby["racesettings"]["laps"] = number;
        lobby["racesettings"]["km"] = track["length"] * number;
        lobby["racesettings"]["km"] = Math.round(lobby["racesettings"]["km"] * 100) / 100;

        changes.push("**Laps:** " + number);
      }
    };
  }
  if (setting.includes("gridcount") || setting.includes("playercount")) {
    pageargs["numbers"] = false;
    pageargs["list"] = [...Array(16).keys()].slice(1).map(x => x + 1 + " " + "Cars");
    listapply = function () {
      embed.setTitle("__Number of Cars (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the number of cars in the grid in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 0, 15)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid Number", description: "You can only set a grid count between 2 and 16 in a lobby.", embed: "", seconds: 0 }, msg, userdata);
        changes.push("ERROR");
      } else {
        if (number >= 16) {
          number = 16;
        }
        lobby["racesettings"]["grid"] = number + 1;
        lobby["finalgrid"] = lobby["finalgrid"].slice(0, lobby["racesettings"]["grid"] - 1);
        var obj = userdata["customracetemp"]["racesettings"];
        var copy = Object.assign({}, obj);
        copy["condition"] = "AIONLY";
        while (lobby["finalgrid"].length < lobby["racesettings"]["grid"]) {
          var ai = require(gtf.RACE).creategrid(copy, stats.currentcar(userdata), 2)[1];
          lobby["finalgrid"].push(ai);
        }
        lobby["finalgrid"] = lobby["finalgrid"].map(function (x, i) {
          x["position"] = i + 1;
          x["place"] = i + 1;
          return x;
        });
        changes.push("**Grid Count:** " + lobby["racesettings"]["grid"]);
      }
    };
  }
  if (setting.includes("endurance")) {
    pageargs["list"] = [10, 15, 30, 45, 60, 90, 120, 240, 480, 720, 1440].map(function (x) {
      if (x >= 60) {
        return x / 60 + " " + "Hours";
      } else {
        return x + " " + "Minutes";
      }
    });
    listapply = function () {
      embed.setTitle("__Endurance Time Limit (" + pageargs["list"].length + " Times)__");
      pageargs["footer"] = "**❓ Set the time limit for the event.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var b = ["10m", "15m", "30m", "45m", "60m", "90m", "120m", "240m", "480m", "720m", "1440m"];
      lobby["racesettings"]["laps"] = b[number - 1];
      lobby["racesettings"]["type"] = "TIME";
      changes.push("**Time Limit:** " + pageargs["list"][number - 1]);
    };
  }
  if (setting.includes("difficulty")) {
    pageargs["list"] = ["Beginner", "Amateur", "Professional", "Expert", "Extreme"];
    listapply = function () {
      embed.setTitle("__Difficulty (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the difficulty of the AI drivers.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      var b = [90, 70, 50, 30, 10];
      lobby["racesettings"]["difficulty"] = b[number - 1];
      changes.push("**Difficulty:** " + pageargs["list"][number - 1]);
    };
  }

  if (setting == "fpplimit") {
    pageargs["list"] = { length: 9999 };
    listapply = function () {
      embed.setTitle("__FPP Limit__");
      pageargs["list"] = ["**❗ Use the __[number]__ argument in the desired command to input a FPP Limit in the event settings.**"];
      pageargs["footer"] = "**❓ Set a FPP Limit in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 1, 2000)) {
        if (number > 2000) {
          number = 9999;
        } else {
          require(gtf.EMBED).alert({ name: "❌ Invalid FPP", description: "You cannot set a FPP under 100.", embed: "", seconds: 0 }, msg, userdata);
          changes.push("ERROR");
        }
        return;
      } else {
        lobby["racesettings"]["fpplimit"] = number;
        lobby["racesettings"]["upperfpp"] = number;

        changes.push("**FPP Limit:** " + "**" + number + "**" + emote.fpp);
      }
    };
  }
  if (setting == "lowerfpp") {
    pageargs["list"] = { length: 9999 };
    listapply = function () {
      embed.setTitle("__Minimum FPP (AI)__");
      pageargs["list"] = ["**❗ Use the __[number]__ argument in the desired command to input the minimum FPP of the AI cars.**"];
      pageargs["footer"] = "**❓ Set the minimum FPP Limit of the AI in the event settings. This regulation do not apply for the user.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 1, 2000)) {
        if (number > 2000) {
          number = 9999;
        } else {
          require(gtf.EMBED).alert({ name: "❌ Invalid FPP", description: "You cannot set a FPP under 100.", embed: "", seconds: 0 }, msg, userdata);
          changes.push("ERROR");
          return;
        }
      }
      if (number > lobby["racesettings"]["fpplimit"]) {
        require(gtf.EMBED).alert({ name: "❌ Invalid FPP", description: "The minimum FPP must not be greater than the FPP limit.", embed: "", seconds: 0 }, msg, userdata);
        changes.push("ERROR");
        return;
      }
      lobby["racesettings"]["lowerfpp"] = number;

      changes.push("**Minimum FPP:** " + "**" + number + "**" + emote.fpp);
    };
  }
  if (setting == "powerlimit") {
    pageargs["list"] = ["**❗ Use the __[number]__ argument in the desired command to set a power Limit in the event settings.**"];
    pageargs["list"] = { length: 9999 };
    listapply = function () {
      embed.setTitle("__Power Limit__");
      pageargs["footer"] = "**❓ Set a Power limit in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 10, 2000)) {
        if (number > 2000) {
          number = 9999;
        } else {
          require(gtf.EMBED).alert({ name: "❌ Invalid Power", description: "You cannot set a FPP under 10.", embed: "", seconds: 0 }, msg, userdata);
          changes.push("ERROR");
        }
        return;
      } else {
        lobby["racesettings"]["upperpower"] = number;

        changes.push("**Power Limit:** " + "**" + number + " HP**");
      }
    };
  }
  if (setting.includes("weightlimit")) {
    pageargs["list"] = ["**❗ Use the __[number]__ argument in the desired command to input a weight limit in the event settings.**"];
    pageargs["list"] = { length: 9999 };
    listapply = function () {
      embed.setTitle("__Weight Limit__");
      pageargs["footer"] = "**❓ Set a weight limit in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (!require(gtf.MATH).betweenInt(number, 100, 9999)) {
        if (number > 9999) {
          number = 9999;
        } else {
          require(gtf.EMBED).alert({ name: "❌ Invalid Weight", description: "You cannot set a weight under 100.", embed: "", seconds: 0 }, msg, userdata);
          changes.push("ERROR");
        }
        return;
      } else {
        lobby["racesettings"]["upperweight"] = number;

        changes.push("**Weight Limit:** " + "**" + number + " Ibs**");
      }
    };
  }
  if (setting.includes("makes")) {
    pageargs["list"] = require(gtf.CARS)
      .list("makes")
      .map(x => x.replace(/,/, "-"));
    pageargs["list"].unshift("All");
    listapply = function () {
      embed.setTitle("__Makes (" + pageargs["list"].length + " Makes)__");
      pageargs["footer"] = "**❓ Select the make to filter by. Multiple options can be toggled. To remove this regulation, apply the None option.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "All") {
        lobby["racesettings"]["makes"] = [];
      } else {
        lobby["racesettings"]["makes"].push(pageargs["list"][number - 1]);
      }
      changes.push("**Makes:** " + lobby["racesettings"]["makes"].join(", "));
    };
  }
  if (setting.includes("types")) {
    if (lobby["racesettings"]["track"]["type"].includes("Dirt") || lobby["racesettings"]["track"]["type"].includes("Snow")) {
      require(gtf.EMBED).alert({ name: "❌ Invalid", description: "You cannot set the car types in dirt/snow tracks.", embed: "", seconds: 3 }, msg, userdata);
      changes.push("ERROR");
      return;
    }
    pageargs["list"] = ["All", "Production", "Aftermarket", "Race Car: GT4", "Race Car: GT3", "Race Car: GT500", "Race Car: GT300", "Race Car: LMP", "Race Car: Other", "Concept", "Vision Gran Turismo", "Rally Car", "Kart"];
    listapply = function () {
      embed.setTitle("__Car Types (" + pageargs["list"].length + " Types)__");
      pageargs["footer"] = "**❓ Set the car type requirements in the event settings. Multiple options can be toggled. To remove this regulation, apply the None option**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "All") {
        lobby["racesettings"]["types"] = [];
      } else {
        lobby["racesettings"]["types"].push(pageargs["list"][number - 1]);
      }
      changes.push("**Types:** " + lobby["racesettings"]["types"].join(", "));
    };
  }
  if (setting.includes("countries")) {
    pageargs["list"] = require(gtf.CARS).list("countries");
    pageargs["list"].unshift("All");
    listapply = function () {
      embed.setTitle("__Countries (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the car's country requirements in the event settings. Multiple options can be toggled. To remove this regulation, apply the None option.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "All") {
        lobby["racesettings"]["countries"] = [];
      } else {
        lobby["racesettings"]["countries"].push(pageargs["list"][number - 1]);
      }
      changes.push("**Countries:** " + lobby["racesettings"]["countries"].join(", "));
    };
  }
  if (setting.includes("drivetrains")) {
    pageargs["list"] = ["All", "FF", "FR", "MR", "RR", "4WD", "4WD-MR"];
    listapply = function () {
      embed.setTitle("__Drivetrains (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the car's drivetrain requirements in the event settings. Multiple options can be toggled. To remove this regulation, apply the None option.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "All") {
        lobby["racesettings"]["drivetrains"] = [];
      } else {
        lobby["racesettings"]["drivetrains"].push(pageargs["list"][number - 1]);
      }
      changes.push("**Drivetrains:** " + lobby["racesettings"]["drivetrains"].join(", "));
    };
  }
  if (setting.includes("engines")) {
    pageargs["list"] = ["All", "NA", "TB", "SC", "TB-SC", "EV"];
    listapply = function () {
      embed.setTitle("__Engine Aspirations (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the car's engine aspiration requirements in the event settings. Multiple options can be toggled. To remove this regulation, apply the None option.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "All") {
        lobby["racesettings"]["engines"] = [];
      } else {
        lobby["racesettings"]["engines"].push(pageargs["list"][number - 1]);
      }
      changes.push("**Engine Aspirations:** " + lobby["racesettings"]["engines"].join(", "));
    };
  }
  if (setting.includes("tires")) {
    if (lobby["racesettings"]["track"]["type"].includes("Dirt") || lobby["racesettings"]["track"]["type"].includes("Snow")) {
      require(gtf.EMBED).alert({ name: "❌ Invalid", description: "You cannot set the maximum tire grade in dirt/snow tracks.", embed: "", seconds: 3 }, msg, userdata);
      changes.push("ERROR");
      return;
    }
    pageargs["list"] = ["None", "Comfort", "Sports", "Racing"];
    listapply = function () {
      embed.setTitle("__Tire Limit (" + pageargs["list"].length + " Items)__");
      pageargs["footer"] = "**❓ Set the maximum tire grade in the event settings.**";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      changes.push("LIST");
    };
    apply = function () {
      if (pageargs["list"][number - 1] == "None") {
        lobby["racesettings"]["tires"] = "Racing";
      } else {
        lobby["racesettings"]["tires"] = pageargs["list"][number - 1];
      }
      changes.push("**Maximum Tire Grade:** " + lobby["racesettings"]["tires"]);
    };
  }
  if (setting.includes("limit")) {
    if (typeof number === "undefined") {
      listapply();
    } else {
      apply();
    }
    return;
  }
  if (!require(gtf.MATH).betweenInt(number, 1, pageargs["list"].length) || number == 0) {
    if (typeof name === "undefined") {
      listapply();
    } else {
      apply();
    }
  } else {
    apply();
  }
};

module.exports.save = function (lobby, userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo
      .collection("LOBBIES")
      .replaceOne({}, lobby)
      .then(() => {
        db.close();
      });
  });
};

module.exports.updateusercar = function (car, userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo
      .collection("LOBBIES")
      .find({})
      .forEach(row => {
        lobbies = row;
      })
      .then(() => {
        lobby(lobbies, userdata);
      });
  });
  function lobby(lobbies, userdata) {
    var currentlobby = lobbies["lobbies"][userdata["inlobby"]["host"]];
    for (var i = 0; i < currentlobby["players"].length; i++) {
      if (currentlobby["players"][i]["id"] == userdata["id"]) {
        currentlobby["players"][i]["car"] = car;
        currentlobby["players"][i]["fpp"] = require(gtf.PERF).perf(car, "GARAGE")["fpp"];
      }
    }
    require(gtf.LOBBY).save(lobbies);
  }
};

module.exports.saveuserdata = function (user, exp, prize, racesettings) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    var users = dbo.collection("GTF2SAVES");
    dbo
      .collection("GTF2SAVES")
      .find({ id: user["id"] })
      .forEach(userdata => {
        if (typeof userdata["id"] === undefined) {
          return {};
        } else {
          userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
          stats.addcredits(prize, userdata);
          stats.addmileage(racesettings["km"],userdata);
          stats.addtotalmileage(racesettings["km"],userdata);
          stats.addtotalmileagecar(racesettings["km"], userdata);
          //stats.addexp(exp, userdata);
          stats.save(userdata);
        }
      });
  });
};

module.exports.updateusersraceinprogress = function (finalgrid, totaltime, msg) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  for (var i = 0; i < finalgrid.length; i++) {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      var users = dbo.collection("GTF2SAVES");
      dbo
        .collection("GTF2SAVES")
        .find({ id: finalgrid[i]["id"] })
        .forEach(row => {
          if (typeof row["id"] === undefined) {
            return {};
          } else {
            row["raceinprogress"] = { active: true, channelid: msg.channel.id, messageid: msg.id, expire: totaltime };
            stats.save(row);
          }
        });
    });
  }
};

module.exports.savesettings = function (customrace, userdata) {
  var racedata = "";
  var found = false;

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");

    dbo
      .collection("EVENTSETTINGS")
      .find({ id: userdata["id"] })
      .forEach(row => {
        racedata = row;
        delete racedata["_id"];
        if (racedata["events"].length > 5) {
          return;
        }

        add();
        dbo.collection("EVENTSETTINGS").replaceOne({ id: userdata["id"] }, racedata);
        found = true;
      });

    function add() {
      customrace["date"] = stats.lastonline(userdata);
      if (typeof racedata["events"][customrace["eventid"] - 1] !== "undefined") {
        racedata["events"][customrace["eventid"] - 1] = customrace;
      } else {
        userdata["numevents"] = Object.keys(racedata["events"]).length + 1;
        racedata["events"].push(customrace);
      }
    }
  });
};

module.exports.delete = function (index, customraces, userdata) {
  delete customraces["events"][index];

  customraces["events"] = customraces["events"].filter(function (val) {
    return val !== null;
  });

  userdata["numevents"] = customraces.length;

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("EVENTSETTINGS").replaceOne({ id: userdata["id"] }, customraces);
  });
};
