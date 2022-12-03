var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require("../../files/directories");
////////////////////////////////////////////////////

module.exports.speedcalc = function (number, gtfcar) {
  var rnorm = require("random-normal");
  total = 0
  for (var i = 0; i < 10; i++) {
    total = total + rnorm({ mean: number * 1.43, dev: 5 })
  }
  var topspeed = total/10
  var value = gtfcar["transmission"]["tuning"];
  if (value == -999) {
    value = 0
  }
  var aero = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })["aerom"]
  if (aero > 1) {
    var x = 5/(aero/5)
    topspeed = topspeed - (4/(1/x))
  }
  if (value <= 0) {
    topspeed = topspeed * (1 - 0.04 * Math.abs(value));
  } else {
    topspeed = topspeed * (1 + 0.01 * Math.abs(value));
  }
  return [Math.round(topspeed * 1.609), Math.round(topspeed)];
};

module.exports.perf = function (gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];
  

  if (condition == "DEALERSHIP") {
    var value = require(gtf.MARKETPLACE).costcalc(gtfcar)
    var sell = require(gtf.MARKETPLACE).sellcalc(value);
    
    var newoffset = Math.round((3000 - weight) / 25);
    
    var offset = 3000 - weight;
    offset = Math.round(offset / 30);

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }
    var aero = (aero - 1) * 30;
    
   var fpp1 = 22 *Math.pow(power, (0.5 + ((gtfcar["aerom"]-1) * 0.008))) - 50
    var fpp2 = ( (3000 - gtfcar["weight"])/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((gtfcar["aerom"]-1) * 5)
    var newfpp = fpp1 + (fpp2 /1200) * fpp3

    var fpp = Math.round(((power - 50 + offset + 200) / 1200) * 900 * offset_dt + aero);
    power = gtfcar["power"];

    return { fpp: Math.round(newfpp), newfpp: Math.round(newfpp), opower: gtfcar["power"], power: power, oweight: gtfcar["weight"], weight: weight, osell: gtfcar["cost"], sell: sell };
  }

  if (condition == "GARAGE") {
    var car = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })


    power = car["power"];
    weight = car["weight"];
    aero = car["aerom"];
    drivetrain = car["drivetrain"];
    
    var value = require(gtf.MARKETPLACE).costcalc(car)
    var sell = require(gtf.MARKETPLACE).sellcalc(require(gtf.MARKETPLACE).costcalc(car));
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = require(gtf.PARTS).find({ name: gtfcar["engine"]["current"], type: "engine" })[0];
    var transmission = require(gtf.PARTS).find({ name: gtfcar["transmission"]["current"], type: "transmission" })[0];
    var suspension = require(gtf.PARTS).find({ name: gtfcar["suspension"]["current"], type: "suspension" })[0];
    var weightred = require(gtf.PARTS).find({ name: gtfcar["weight reduction"]["current"], type: "weight-reduction" })[0];
    var turbo = require(gtf.PARTS).find({ name: gtfcar["turbo"]["current"], type: "turbo" })[0];
    var brakes = require(gtf.PARTS).find({ name: gtfcar["brakes"]["current"], type: "brakes" })[0];
    var aeropart = require(gtf.PARTS).find({ name: gtfcar["aero kits"]["current"], type: "aero kits" })[0];

    if (engine !== undefined) {
      var enginep = (100 + engine["percent"]) / 100;
      power = power * enginep;
      value += engine["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(engine["cost"]);
    }
    if (suspension !== undefined) {
      var suspp = suspension["percent"] / 100;
      aero = aero * suspp;
      value += suspension["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(suspension["cost"]);
    }
    if (weightred !== undefined) {
      var weightredp = (100 - weightred["percent"]) / 100;
      weight = weight * weightredp;
      value += weightred["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(weightred["cost"]);
    }
    if (turbo !== undefined) {
      var turbop = (100 + turbo["percent"]) / 100;
      power = power * turbop;
      value += turbo["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(turbo["cost"]);
    }
    if (brakes !== undefined) {
      var brakesp = brakes["percent"] / 100;
      aero = aero * brakesp;
      value += brakes["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(brakes["cost"]);
    }
    if (aeropart !== undefined) {
      var aeropartp = (100 + aeropart["percent"]) / 100;
      if (aeropart["name"] == "Default" || gtfcar["aero kits"]["tuning"][0] == 0 || gtfcar["aero kits"]["tuning"][0] == -999)  {
         aero = aero * aeropartp 
      } else {
        aero = aero * (aeropartp + (0.1*(gtfcar["aero kits"]["tuning"][0]-3)));
      }
      value += aeropart["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(aeropart["cost"]);
    }
    ///////

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }

      var fpp1 = 22 *Math.pow(power, (0.5 + ((aero-1) * 0.008))) - 50
    var fpp2 = ( (3000 - weight)/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((aero-1) * 5)

    var newfpp = fpp1 + (fpp2 /1200) * fpp3

 
    return { fpp: Math.round(newfpp), 
            opower: car["power"],
            power: Math.round(power), 
            oweight: car["weight"], 
            weight: Math.round(weight),
            value: value,
            osell: Math.round(osell), 
            sell: Math.round(sell) };
  }
};

module.exports.topspeed = function (car) {
  var sellperf = require(gtf.PERF).sell(car);
  var lowest = Math.floor(100 + sellperf ** 0.475 - 30);
  var highest = Math.floor(100 + sellperf ** 0.475);

  var speed = gtftools.randomInt(lowest, highest);
  return [Math.round(speed * 1.609), speed];
};

module.exports.careerdifficultycalc = function (difficulty, weather, racesettings) {
  var num = difficulty
  var otires = racesettings["misc"]["car"]["tires"]["current"].slice()
  if (racesettings["misc"]["tirechange"] && racesettings["misc"]["otires"].includes("Racing")) {
    if (weather["wetsurface"] < 20 && (otires.includes("Wet") || otires.includes("Intermediate"))) {
         racesettings["misc"]["car"]["tires"]["current"] = racesettings["misc"]["car"]["tires"]["list"].filter(x=> x.includes("Hard") || x.includes("Medium") || x.includes("Soft"))[0]
    }
    if (weather["wetsurface"] >= 20) {
      racesettings["misc"]["car"]["tires"]["current"] = "Racing: Intermediate"
    }
    if (weather["wetsurface"] >= 50) {
      racesettings["misc"]["car"]["tires"]["current"] = "Racing: Heavy Wet"
    } 
  }
  if (racesettings["misc"]["car"]["tires"]["current"] !== otires) {
    return num
  }
  var car = racesettings["misc"]["car"]
  var fpp = require(gtf.PERF).perf(car, "GARAGE")["fpp"];
  
  var tires = require(gtf.PARTS).find({ name: car["tires"]["current"], type: "tires" })[0]

  if (racesettings["tires"] == "Sports") {
    if (tires["name"].includes("Comfort")) {
      num = num - 10
    } 
    if (tires["name"] == "Sports: Medium") {
      num = num + 3
    }
    if (tires["name"] == "Sports: Soft") {
      num = num + 7
    }
    
    if (tires["name"].includes("Racing")) {
      if (tires["name"].includes("Wet") || tires["name"].includes("Intermediate")) {
        num = num + 15
      } else {
        if (weather["wetsurface"] >= 20) {
          num = num + (20 * ( (50-weather["wetsurface"]) /100))
        } else {
          num = num + 20
      } 
      }
      
    } 
  }

  if (racesettings["tires"] == "Racing") {
    if (tires["name"].includes("Comfort")) {
      num = num - 20
    } 
    if (tires["name"].includes("Sports")) {
      num = num - 10
    }
    if (tires["name"] == "Racing: Medium") {
      num = num + 5
    } 
    if (tires["name"] == "Racing: Soft") {
      num = num + 8
    } 
    if (tires["name"] == "Racing: Super Soft") {
      num = num + 10
    }
    if (weather["wetsurface"] >= 20 && (tires["name"].includes("Wet") || tires["name"].includes("Intermediate"))) {
    } else {
      if (weather["wetsurface"] >= 20) {
        if (tires["name"].includes("Racing")) {
          num = num - (20 * ( 1 - ((100 - weather["wetsurface"]) /100)))
        } else {
        num = num - (10 * ( 1 - ((100 - weather["wetsurface"]) /100)))
        }
      }
    }
  }
  num = parseInt(num)

  return [num];
};

module.exports.onlinedifficultycalc = function (player, racesettings) {
  var num = 0
  var tires = require(gtf.PARTS).find({ name: player["tires"], type: "tires" })[0]

  if (tires["name"].includes("Comfort")) {
      num = num + 1
  } 
  if (tires["name"] == "Sports: Hard") {
      num = num + 5
    }
    if (tires["name"] == "Sports: Medium") {
      num = num + 7
    }
    if (tires["name"] == "Sports: Soft") {
      num = num + 9
    } 
   
    if (racesettings["weather"]["wetsurface"] >= 20 && (tires["name"].includes("Wet") || tires["name"].includes("Intermediate"))) { 
      num = num + 20 
    }
    else if (racesettings["weather"]["wetsurface"] >= 20 && tires["name"].includes("Racing")) {
        if (tires["name"].includes("Racing")) {
          num = num - (20 * ( 1 - ((100 - racesettings["weather"]["wetsurface"]) /100) ))
        } else {
        num = num - (10 * ( 1 - ((100 - racesettings["weather"]["wetsurface"]) /100) ))
        }
  } else {
    if (tires["name"] == "Racing: Hard") {
      num = num + 20
    } 
    else if (tires["name"] == "Racing: Medium") {
      num = num + 23
    } 
    else if (tires["name"] == "Racing: Soft") {
      num = num + 27
    } 
    else if (tires["name"] == "Racing: Super Soft") {
      num = num + 30
    }
  }
 
  return [parseInt(num)/30];
};

module.exports.partpreview = function (part, car, condition) {
  if (condition == "GARAGE") {
    var car5 = JSON.stringify(car);
    var car2 = JSON.parse(car5);
    car2[part["type"].toLowerCase()]["current"] = part["name"];
    if (typeof part["tuning"] !== 'undefined') {
      car2[part["type"].toLowerCase()]["tuning"] = part["tuning"];
    }
    return require(gtf.PERF).perf(car2, condition);
  }
};

module.exports.partinstall = function (part, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"]

  var installedpart = userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()];
  
  installedpart["current"] = part["name"];
  for (var i = 0; i < installedpart["tuning"].length; i++) {
    if (part["name"] == "Default") {
      installedpart["tuning"][i] = -999;
    } else {
      if (part["type"].toLowerCase() == "aero kits") {
        installedpart["tuning"][i] = 3;
      } else {
    installedpart["tuning"][i] = 0;
    }
  }
  }

  if (!installedpart["list"].includes(part["name"]) && part["name"] != "Default") {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push(part["name"]);
  }

  if (part["type"].toLowerCase() == "tires" && (part["name"].includes("Racing: Hard") || part["name"].includes("Racing: Medium") || part["name"].includes("Racing: Soft") || part["name"].includes("Racing: Super Soft")) ) {
     if (!installedpart["list"].includes("Racing: Intermediate")) {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push("Racing: Intermediate");
  }
  if (!installedpart["list"].includes("Racing: Heavy Wet")) {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push("Racing: Heavy Wet");
  }
  }

   if (part["type"].toLowerCase() == "tires" && (part["name"].includes("Racing: Intermediate") || part["name"].includes("Racing: Heavy Wet"))) {
     if (!installedpart["list"].includes("Racing: Hard")) {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push("Racing: Hard");
  }
  }

  if (part["type"].toLowerCase() == "tires" && part["name"].includes("Racing")) {
     if (!installedpart["list"].includes("Racing: Intermediate")) {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push("Racing: Intermediate");
  }
  if (!installedpart["list"].includes("Racing: Intermediate")) {
    userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()]["list"].push("Racing: Heavy Wet");
  }
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1][part["type"].toLowerCase()] = installedpart;

  userdata["garage"][stats.currentcarnum(userdata) - 1]["fpp"] = require(gtf.PERF).perf(userdata["garage"][stats.currentcarnum(userdata) - 1], "GARAGE")["fpp"];

  id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1
  userdata["currentcar"] = id;
};

module.exports.carclean = function (number, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"]

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = parseInt(number);

  id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1
  userdata["currentcar"] = id;
};

module.exports.rimsinstall = function(part, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"]

  var installedpart = userdata["garage"][stats.currentcarnum(userdata) - 1]["rims"];
  
  installedpart["current"] = part["make"] + " " + part["name"];
  if (part["name"] == "Default") {
      installedpart["current"] = part["name"];
      installedpart["list"] = []
  }
  for (var i = 0; i < installedpart["tuning"].length; i++) {
    if (part["name"] == "Default") {
      installedpart["tuning"][i] = -999;
    } else {
    installedpart["tuning"][i] = 0;
    }
  }

  if (!installedpart["list"].includes(part["make"] + " " + part["name"]) && part["name"] != "Default") {
    userdata["garage"][stats.currentcarnum(userdata) - 1]["rims"]["list"] = [part["make"] + " " + part["name"]]
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["rims"] = installedpart;
};

module.exports.paint = function (paint, userdata) {
  var installedpart = userdata["garage"][stats.currentcarnum(userdata) - 1]["color"];
  if (paint["name"] == "Default") {
    installedpart["current"] = paint["name"];
  } else {
  installedpart["current"] = paint["type"] + " " + paint["name"];
  }
  
  if (paint["type"] == "Livery") {
    if (paint["name"] == "Default") {
    userdata["garage"][stats.currentcarnum(userdata) - 1]["livery"]["current"] = paint["name"];
    } else {
      userdata["garage"][stats.currentcarnum(userdata) - 1]["livery"]["current"] = paint["type"] + " " + paint["name"];
    }
    userdata["garage"][stats.currentcarnum(userdata) - 1]["color"]["current"] = "Default"
  } else {
    userdata["garage"][stats.currentcarnum(userdata) - 1]["color"] = installedpart;
    userdata["garage"][stats.currentcarnum(userdata) - 1]["livery"] = {current: "Default"};
  }
  
};
