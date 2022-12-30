var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.speedcalc = function (number, gtfcar) {
  var rnorm = require("random-normal");
  total = 0
  for (var i = 0; i < 10; i++) {
    total = total + rnorm({ mean: number * 1.43, dev: 5 })
  }

  var topspeed = total/10
  var finalgear = gtfcar["perf"]["transmission"]["tuning"][0];
  if (finalgear == -999) {
    finalgear = 0
  }
  var aero = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]] })["aerom"]

  if (aero > 1) {
    var x = 5/(aero/5)
    topspeed = topspeed - (4/(1/x))
  }
  if (finalgear <= 0) {
    topspeed = topspeed * (1 - 0.04 * Math.abs(finalgear));
  } else {
    topspeed = topspeed * (1 + 0.01 * Math.abs(finalgear));
  }
  return [Math.round(topspeed * 1.60934), Math.round(topspeed)];
};
module.exports.perf = function (gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];

  if (condition == "DEALERSHIP") {
    var value = require(gtf.CARS).costcalc(gtfcar)
    var sell = require(gtf.MARKETPLACE).sellcalc(value);

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

   var fpp1 = 22 * Math.pow(power, (0.5 + ((gtfcar["aerom"]-1) * 0.008))) - 50
    var fpp2 = ( (3000 - gtfcar["weight"])/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((gtfcar["aerom"]-1) * 5)
    var fpp = fpp1 + (fpp2 /1200) * fpp3

    return { fpp: Math.round(fpp),
            opower: power,
            power: power,
            oweight: weight,
            weight: weight,
            osell: gtfcar["cost"],
            sell: sell };
  }

  if (condition == "GARAGE") {
    var car = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })

    power = car["power"];
    weight = car["weight"];
    aero = car["aerom"];
    drivetrain = car["drivetrain"];

    var value = require(gtf.CARS).costcalc(car)
    var sell = require(gtf.MARKETPLACE).sellcalc(require(gtf.CARS).costcalc(car));
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = require(gtf.PARTS).find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = require(gtf.PARTS).find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = require(gtf.PARTS).find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = require(gtf.PARTS).find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = require(gtf.PARTS).find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = require(gtf.PARTS).find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = require(gtf.PARTS).find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];

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
      if (aeropart["name"] != "Default") {
        if (gtfcar["perf"]["aerokits"]["tuning"][0] == 0 || gtfcar["perf"]["aerokits"]["tuning"][0] == -999) {
         aero = aero * aeropartp
        } else {
          aero = aero * (aeropartp + (0.1*(gtfcar["perf"]["aerokits"]["tuning"][0]-3)));
        }
      }
      value += aeropart["cost"]
      sell += require(gtf.MARKETPLACE).sellcalc(aeropart["cost"]);
    }
    ///////
    var oil = gtfcar["condition"]['oil']
    if (oil <= 60) {
      power = power - (power * (0.05 * ((60-oil)/60) ) )
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

  var speed = require(gtf.MATH).randomInt(lowest, highest);
  return [Math.round(speed * 1.60934), speed];
};
