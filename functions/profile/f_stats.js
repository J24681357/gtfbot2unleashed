var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({
  partials: [Partials.Channel],
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]});
var gtf = require("../../files/directories");
////////////////////////////////////////////////////
var gtfuser = require("../../index");
var fs = require("fs");

module.exports.userid = function (userdata) {
  return userdata["id"];
};

module.exports.count = function (userdata) {
  var num = require(gtf.MAIN).embedcounts[userdata["id"]];
  if (isNaN(num)) {
    require(gtf.MAIN).embedcounts[userdata["id"]] = 0;
    return 0;
  } else {
    return num;
  }
};

module.exports.credits = function (userdata) {
  if (userdata["credits"] >= 9999999) {
    userdata["credits"] = 9999999;
  }
  userdata["credits"] = Math.round(userdata["credits"]);
  return userdata["credits"];
};

module.exports.totalplaytime = function (userdata, type) {
  if (type == "MILLISECONDS") {
    return userdata["totalplaytime"]
  } else {
  return require(gtf.DATETIME).getFormattedTime(userdata["totalplaytime"])
  }
};

module.exports.racemulti = function (userdata) {
  return userdata["racemulti"];
};

module.exports.exp = function (userdata) {
  if (userdata["exp"] >= 999999) {
    userdata["exp"] = 999999;
  }
  return userdata["exp"];
};

module.exports.level = function (userdata) {
  return userdata["level"];
};

module.exports.racedetails = function (userdata) {
  return gtfuser.allraces[id]["racedetails"];
};

/*
module.exports.numcarpurchase = function (userdata) {
  return userdata["numcarpurchase"];
};
*/

module.exports.lastonline = function (userdata) {
  return userdata["lastonline"];
};

//units
module.exports.mileage = function (userdata) {
    return userdata["mileage"]
};

module.exports.mileageuser = function (userdata) {
  var mileage = [userdata["mileage"], require(gtf.MATH).round(userdata["mileage"] * 0.62137119, 2)]
  return mileage[userdata["settings"]["UNITS"]]
};

module.exports.mileageunits = function (userdata) {
  return ["km", "mi"][userdata["settings"]["UNITS"]]
};

module.exports.totalmileage = function (userdata) {
    return userdata["totalmileage"]
};

module.exports.totalmileageuser = function (userdata) {
  var totalmileage = [userdata["totalmileage"], require(gtf.MATH).round(userdata["totalmileage"] * 0.62137119, 2)]
    return totaalmileage[userdata["settings"]["UNITS"]]
};

module.exports.messages = function (userdata) {
  return userdata["messages"]
}

module.exports.addmessage = function (name, message, userdata) {
  if (typeof userdata["messages"][name] == 'undefined') {
      userdata["messages"][name] = {"ids": []}
  }
  userdata["messages"][name]["ids"].push(message["id"])
}

module.exports.dailyworkout = function (userdata) {
  return userdata["dailyworkout"]
};

module.exports.setdailyworkout = function (bool, userdata) {
  userdata["dailyworkout"]["done"] = bool;
};

module.exports.achievements = function (userdata) {
  return userdata["achievements"];
};

module.exports.garage = function (userdata) {
  return userdata["garage"];
};

module.exports.garagesort = function (userdata, sort) {
  if (userdata["garage"].length == 0) {
    return userdata["garage"];
  }
  if (typeof sort === "undefined") {
    sort = userdata["settings"]["GARAGESORT"];
  }
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];

    if (sort == "Alphabetical Order") {
    userdata["garage"].sort((x, y) => x["name"].localeCompare(y["name"]));
  }

  if (sort == "Newest Added") {
    userdata["garage"].sort((x, y) => parseInt(y["id"]) - parseInt(x["id"]));
  }
  if (sort == "Oldest Added") {
    userdata["garage"].sort((x, y) => parseInt(x["id"]) - parseInt(y["id"]));
  }
  if (sort == "Highest FPP") {
    userdata["garage"].sort((x, y) => parseInt(y["fpp"]) - parseInt(x["fpp"]));
  }
  if (sort == "Lowest FPP") {
    userdata["garage"].sort((x, y) => parseInt(x["fpp"]) - parseInt(y["fpp"]));
  }
  if (sort == "Highest Power") {
    userdata["garage"].sort((x, y) => require(gtf.PERF).perf(y, "GARAGE")["power"] - require(gtf.PERF).perf(x, "GARAGE")["power"]);
  }
  if (sort == "Lowest Power") {
    userdata["garage"].sort((x, y) => require(gtf.PERF).perf(x, "GARAGE")["power"] - require(gtf.PERF).perf(y, "GARAGE")["power"]);
  }
  id = userdata["garage"].findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;

  return userdata["garage"];
};

module.exports.gifts = function (userdata) {
  return userdata["gifts"];
};

module.exports.addgift = function (gift, userdata) {
  userdata["stats"]["numgifts"]++;
  if (gift["inventory"]) {
   gift["id"] = userdata["stats"]["numgifts"]
   userdata["gifts"].unshift(gift);
   stats.save(userdata);
  } else {
     stats.redeemgift(gift["name"], gift, embed, msg, userdata)
  }
};

module.exports.cleargifts = function (userdata) {
  userdata["gifts"] = [];
};

module.exports.addcount = function (userdata) {
  require(gtf.MAIN).embedcounts[userdata["id"]]++;
};

module.exports.removecount = function (userdata) {
  require(gtf.MAIN).embedcounts[userdata["id"]]--;
};

module.exports.careerraces = function (userdata) {
  return userdata["careerraces"];
};

module.exports.sponsor = function (userdata) {
  return userdata["sponsor"];
};

module.exports.addsponsor = function (sponsor, userdata) {
  userdata["sponsor"] = {
    name: sponsor["name"],
    level: 0,
  };
};

module.exports.resetsponsor = function (userdata) {
  userdata["sponsor"] = {
    name: "None",
    level: 0,
  };
};

module.exports.garagecount = function (userdata) {
  return userdata["garage"].length;
};

module.exports.addcredits = function (number, userdata) {
  userdata["credits"] = parseInt(userdata["credits"]);
  userdata["credits"] += parseInt(number);
  if (userdata["credits"] >= 9999999) {
    userdata["credits"] = 9999999;
  }
};

module.exports.addplaytime = function (number, userdata) {
  userdata["totalplaytime"] = parseFloat(userdata["totalplaytime"]);
  
  userdata["totalplaytime"] = userdata["totalplaytime"] + parseFloat(number);
  
};

module.exports.addracemulti = function (number, userdata) {
  userdata["racemulti"] = userdata["racemulti"] + parseFloat(number);
  userdata["racemulti"] = Math.round(userdata["racemulti"] * 10) / 10;
  if (userdata["racemulti"] >= 2) {
    userdata["racemulti"] = 2;
  }
  if (userdata["racemulti"] <= 1) {
    userdata["racemulti"] = 1;
  }
};

module.exports.addmileage = function (km, userdata) {
  km = require(gtf.MATH).round(km, 2)
  userdata["mileage"] += km;
};

module.exports.setmileage = function (km, userdata) {
  userdata["mileage"] = parseFloat(km);
};

module.exports.addtotalmileagecar = function (km, userdata) {
  km = require(gtf.MATH).round(km, 2)
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];

  userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"] += km

  id = stats.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.addtotalmileage = function (km, userdata) {
  km = require(gtf.MATH).round(km, 2)
  userdata["totalmileage"] += km;
};



module.exports.settotalmileage = function (km, mi, userdata) {
  userdata["totalmileage"] = parseFloat(km);
};

///CURRENTCAR
module.exports.currentcar = function (userdata) {
  if (userdata["garage"].length == 0) {
    return {};
  }
  return stats.garage(userdata)[stats.currentcarnum(userdata) - 1];
};

module.exports.currentcarmain = function (userdata) {
  var gtfcar = stats.currentcar(userdata);
  if (Object.keys(gtfcar).length == 0) {
    return "No car.";
  } else {
    var carcondition = require(gtf.CONDITION).condition(gtfcar)
    return (
      "`" + userdata["currentcar"] + "` " + carcondition["emote"] + " `" + carcondition["health"] + "%`" + " " + require(gtf.CARS).shortname(gtfcar["name"]) + 
" " + "**" + gtfcar["fpp"] + emote.fpp +
      emote.tire +
      gtfcar["perf"]["tires"]["current"]
        .split(" ")
        .map(x => x[0])
        .join("") +
      "**"
    );
  }
};

module.exports.currentcarnum = function (userdata) {
  if (userdata["currentcar"] > userdata["garage"].length && userdata["garage"].length != 0) {
    userdata["currentcar"] = userdata["garage"].length;
  }
  return userdata["currentcar"];
};

//////
//Starts at 1

module.exports.setcurrentcar = function (number, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? stats.garage(userdata).filter(x => filter.map(f => f(x)).every(x => x === true))[number - 1] : stats.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["garage"].some((item, index) => item["id"] == id && userdata["garage"].unshift(userdata["garage"].splice(index, 1)[0]));
    }
    id = stats.garage(userdata).findIndex(x => x["id"] == id) + 1;
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["currentcar"] = 1;
    } else {
      userdata["currentcar"] = id;
    }
  }
};

module.exports.favoritecar = function (number, bool, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? stats.garage(userdata).filter(x => filter.map(f => f(x)).every(p => p === true))[number - 1] : stats.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    id = stats.garage(userdata).findIndex(x => x["id"] == id);
    userdata["garage"][id]["favorite"] = bool;
  }
};

module.exports.addexp = function (number, userdata) {
  userdata["exp"] = parseInt(userdata["exp"]);
  if (parseInt(number) < 0) {
  } else {
    userdata["exp"] += parseInt(number);
  }
};

module.exports.seasonalcheck = function (userdata) {
  return userdata["seasonalcheck"];
};

module.exports.view = function (gtfcar, embed, userdata) {
  var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]]  })
  var garage = stats.garage(userdata);
  var perf = require(gtf.PERF).perf(gtfcar, "GARAGE");
  var livery = gtfcar["livery"]["current"]
  if (ocar["type"].includes("Race Car")) {
    livery = ocar["livery"][stats.carimage(gtfcar)];
  }
  var cardetails =
    "**Car:** " +
    gtfcar["name"] +
    " `🚘ID:" +
    gtftools.index(garage, gtfcar) +
    "`" +
    " `💧" +
    gtfcar["condition"]["clean"] +
    "%`\n" +
    "**Livery: **" +
    livery +
    " | " +
    gtfcar["color"]["current"] +
    "\n" +
    "**Rims: **" +
    gtfcar["rims"]["current"] +
    "\n" +
    "**Type:** " +
    ocar["type"] +
    "\n" +
    "**Mileage Driven:** " +
    stats.mileageuser(userdata) +
    " " +
    stats.mileageunits(userdata) +
    "\n" +
    "**" +
    gtftools.numFormat(perf["fpp"]) +
    emote.fpp +
    " | " +
    gtftools.numFormat(perf["power"]) +
    " hp" +
    " | " +
    gtftools.numFormat(perf["weight"]) +
    " lbs" +
    " | " +
    ocar["drivetrain"] + 
    " | " + 
    ocar["engine"] +
    "**" +
    "\n";

  return cardetails;
};

module.exports.view2 = function (gtfcar, userdata) {
  if (gtfcar["perf"]["transmission"]["current"] == "Default") {
    var trans1 = "Default";
  } else {
    var trans1 = gtfcar["perf"]["transmission"]["tuning"][0];
  }

  if (gtfcar["perf"]["suspension"]["current"] == "Default") {
    var susp1 = "Default";
    var susp2 = "Default";
  } else {
    var susp1 = gtfcar["perf"]["suspension"]["tuning"][0] + " in";
    var susp2 = gtfcar["perf"]["suspension"]["tuning"][1] + " in";
  }

  if (gtfcar["perf"]["aerokits"]["current"] == "Default") {
    var aero1 = "Default";
  } else {
    var aero1 = gtfcar["perf"]["aerokits"]["tuning"][0] * 5;
  }

  var cardetails =
    "__**Aero:**__ " +
    gtfcar["perf"]["aerokits"]["current"] +
    "\n" +
    "**Downforce Level:** " +
    aero1 +
    "\n" +
    "__**Engine:**__ " +
    gtfcar["perf"]["engine"]["current"] +
    "\n" +
    "__**Transmission:**__ " +
    gtfcar["perf"]["transmission"]["current"] +
    "\n" +
    "**Top Speed (Final Gear):** " +
    trans1 +
    " " +
    "\n" +
    "__**Suspension:**__ " +
    gtfcar["perf"]["suspension"]["current"] +
    "\n" +
    "**Camber Angle:** " +
    susp1 +
    "\n" +
    "**Toe Angle:** " +
    susp2 +
    "\n" +
    "__**Tires:**__ " +
    gtfcar["perf"]["tires"]["current"] +
    "\n" +
    "__**Weight Reduction:**__ " +
    gtfcar["perf"]["weightreduction"]["current"] +
    "\n" +
    "__**Turbo Kit:**__ " +
    gtfcar["perf"]["turbo"]["current"] +
    "\n" +
    "__**Brakes:**__ " +
    gtfcar["perf"]["brakes"]["current"] +
    "\n";

  return cardetails;
};

module.exports.viewcarcondition = function (gtfcar, userdata) {
  var carcondition = require(gtf.CONDITION).condition(gtfcar)
  var cardetails =
    "__**Overall:**__ " + carcondition["health"] + "%" + "\n\n" +
    "**Body:** " + gtfcar["condition"]["body"] + "%" + "\n" +
    "**Oil:** " + gtfcar["condition"]["oil"] + "%" + "\n" +
    "**Engine:** " + gtfcar["condition"]["engine"] + "%" + "\n" +
    "**Transmission:** " + gtfcar["condition"]["transmission"] + "%" +
    "\n" +
    "**Suspension:** " + gtfcar["condition"]["suspension"] + "%" +
    "\n";

  return cardetails;
};

module.exports.updatecurrentcarclean = function (length, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  var rnumber = gtftools.randomInt(1, 5);
  var clean = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"]);
  clean = clean - rnumber;

  if (clean <= 0) {
    clean = 0;
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean;

  id = stats.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.updatecurrentcaroil = function (length, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  var number = (length / 600) * 100;
  var oil = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["oil"]);
  oil = oil - number;

  if (oil <= 0) {
    oil = 0;
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean;

  id = stats.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.updatedamage = function (racesettings, car, userdata) {
  console.log(car["damage"])
    var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  var length = racesettings["distance"]["km"]
  var damage = car["damage"]
  
 ///CLEAN
  var rclean = require(gtf.MATH).round(gtftools.randomInt(1, 5) * (length/45), 2);
  require(gtf.CONDITION).updatecondition(-rclean, "clean", userdata)

  ////OIL
  var roil = require(gtf.MATH).round(length/6, 2);

  require(gtf.CONDITION).updatecondition(-roil, "oil", userdata)

  while (damage >= 0) {
    var d = gtftools.randomInt(2,5)
    var select = ["engine", "transmission", "suspension", "body"][gtftools.randomInt(0,3)]
    require(gtf.CONDITION).updatecondition(-d, select, userdata)
    damage = damage - d
  }
}

module.exports.updatefpp = function (gtfcar, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["id"];
  userdata["garage"][stats.currentcarnum(userdata) - 1]["fpp"] = require(gtf.PERF).perf(gtfcar, "GARAGE")["fpp"];
}

module.exports.carimage = function (gtfcar) {
  if (gtfcar["livery"]["current"] != "Default") {
    return parseInt(gtfcar["livery"]["current"].split(" ").slice(-1)[0])
  }
  if (gtfcar["perf"]["aerokits"]["current"] == "Default") {
    return 0;
  } else {
    return parseInt(gtfcar["perf"]["aerokits"]["current"].split(" ")[1]);
  }
};

module.exports.loadcarimage = async function (gtfcar, embed, userdata, callback) {

var { request } = require('undici');
var Canvas = require("@napi-rs/canvas");
var color = ""
  
if (!gtfcar["color"]["current"].includes("Default")) {
  if (gtfcar["color"]["current"].includes("Special")) {
    color = "./images/gtauto/paint/special/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
  } else {
  color = "./images/gtauto/paint/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
  }
}


var wheel = ""
var rim = gtfcar["rims"]["current"]
if (!gtfcar["rims"]["current"].includes("Default")) {
   var wheel = require(gtf.WHEELS).find({fullname: gtfcar["rims"]["current"]})[0]["make"]
  wheel = "./images/gtauto/wheels/" + wheel + ".png"
  
}
 
var link = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]] })["image"][stats.carimage(gtfcar)]
  
  const { body } = await request(link);
	const image = await Canvas.loadImage(await body.arrayBuffer());
  
  var width = image.naturalWidth
  var height = image.naturalHeight
  if (width >= 2000) {
    var width = image.naturalWidth/3
    var height = image.naturalHeight/3
  }
  var canvas = await Canvas.createCanvas(width, height);
  var context = await canvas.getContext('2d');

  context.drawImage(image, 0, 0, width, height);
  context.strokeStyle= "#000000";
  if (color.length != 0) {
  var image2 = await Canvas.loadImage(color)
  var position1 = 0
  var position2 = height - (height/4)
    
  context.drawImage(image2, position1, position2, height/4, height/4);
  context.globalAlpha = 1;
  context.strokeRect(position1, position2, height/4, height/4);
  context.globalCompositeOperation = "source-over";
  }
  if (wheel.length != 0) {
  var image3 = await Canvas.loadImage(wheel)
  var position1 = height/4
  var position2 = height - (height/4)
  context.drawImage(image3, position1, position2, (height/4) * (4/3), height/4);
  context.strokeRect(position1, position2, (height/4) * (4/3), height/4);
  }
        
  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "image.png"})
  await callback(attachment)
}

module.exports.loadavatarimage = async function (embed, userdata, callback) {
var Canvas = require("@napi-rs/canvas");
var { request } = require('undici');
var visor = await Canvas.loadImage("./images/gtauto/driver/visor.png")
var helmet = await Canvas.loadImage("./images/gtauto/driver/helmet.png")
  
var helmetcolorimage = await Canvas.loadImage("./images/gtauto/paint/" + userdata["driver"]["helmetcolor"] + ".png")
var visorcolorimage = await Canvas.loadImage("./images/gtauto/paint/" + userdata["driver"]["visorcolor"] + ".png")

if (userdata["driver"]["helmetlogo1"].length == 0) {
  var logourl = ""
} else {
  var logourl = userdata["driver"]["helmetlogo1"]
  var { body } = await request(logourl);
	var logoimage = await Canvas.loadImage(await body.arrayBuffer());
  if (logoimage.naturalHeight > logoimage.naturalWidth) {
     var ratio = logoimage.naturalWidth / logoimage.naturalHeight
  } else {
  var ratio = logoimage.naturalHeight / logoimage.naturalWidth 
  }
}
  
if (userdata["driver"]["helmetlogo2"].length == 0) {
  var logourl2 = ""
} else {
  var logourl2 = userdata["driver"]["helmetlogo2"]
  var { body } = await request(logourl2);
	var logoimage2 = await Canvas.loadImage(await body.arrayBuffer());
  if (logoimage2.naturalHeight > logoimage2.naturalWidth) {
     var ratio = logoimage2.naturalWidth / logoimage2.naturalHeight
  } else {
  var ratio = logoimage2.naturalHeight / logoimage2.naturalWidth 
  }
}
  
var width = helmet.naturalWidth
var height = helmet.naturalHeight
var helmetcanvas = await Canvas.createCanvas(width, height)
var visorcanvas = await Canvas.createCanvas(width, height)
  
var helmetctx = helmetcanvas.getContext('2d');
var visorctx = visorcanvas.getContext('2d');
  
var canvas = await Canvas.createCanvas(width, height)
var ctx = canvas.getContext('2d');


visorctx.drawImage(visor, 0, 0, width, height);
visorctx.globalCompositeOperation = "source-in"
visorctx.drawImage(visorcolorimage, 0, 0, width, height);

helmetctx.drawImage(helmet, 0, 0, width, height);
helmetctx.globalCompositeOperation = "source-in"
helmetctx.drawImage(helmetcolorimage, 0, 0, width, height);

ctx.drawImage(helmetcanvas, 0, 0, width, height);
ctx.drawImage(visorcanvas, 0, 0, width, height);
  if (logourl.length != 0) {
    ctx.rotate(Math.PI/18);
ctx.drawImage(logoimage, 270, 20, width/5, (width/5) * ratio);
    ctx.rotate(-Math.PI/18);
  }
  if (logourl2.length != 0) {
ctx.drawImage(logoimage2, 640, 370, width/3.5, (width/3.5) * ratio);
  }
        
  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "image.png"})
  await callback(attachment)
}

module.exports.addcar = function (car, arg, userdata) {
  var fullname = car["name"] + " " + car["year"];

  if (arg != "LOAN") {
    if (stats.garagecount(userdata) == 0) {
      stats.setcurrentcar(1, undefined, userdata);
      userdata["currentcar"]++;
    }
  }
  car["condition"] = 100

  var tires = { current: car["tires"], list: [car["tires"]], tuning: [0, 0, 0] };
  if (car["tires"].includes("Racing")) {
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  if (car["tires"].includes("Dirt")) {
    tires["list"].push("Rally: Snow");
    tires["list"].push("Racing: Hard");
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  if (car["tires"].includes("Snow")) {
    tires["list"].push("Rally: Dirt");
    tires["list"].push("Racing: Hard");
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  var engine = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var trans = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var susp = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var weight = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var turbo = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var brakes = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var aerokits = { current: "Default", list: [], tuning: [-999, -999, -999] };

  var condition = {oil:car["condition"], clean:car["condition"], engine:car["condition"], transmission: car["condition"], suspension:car["condition"], body:car["condition"]}

  var fpp = require(gtf.PERF).perf(car, "DEALERSHIP")["fpp"];
  var sell = require(gtf.MARKETPLACE).sellcalc(car, "DEALERSHIP");
  if (arg != "LOAN") {
    userdata["stats"]["numcarpurchases"]++;
    var id1 = userdata["stats"]["numcarpurchases"];
  } else {
    var id1 = 0;
  }
  var newcar = {
    id: id1,
    name: fullname,
    make: car["make"],
    year: car["year"],
    color: { current: "Default" },
    livery: { current: "Default"},
    fpp: fpp,
    perf: {
      engine: engine,
      transmission: trans,
      suspension: susp,
      tires: tires,
      weightreduction: weight,
      turbo: turbo,
      aerokits: aerokits,
      brakes: brakes,
      nitrous: { current: "Default", tuning: [-999, -999, -999]},
      items: []
    },
    rims: { current: "Default", list: [], tuning: [-999, -999, -999] },
    condition: condition,
    totalmileage: 0
  };
  newcar["fpp"] = require(gtf.PERF).perf(newcar, "GARAGE")["fpp"];
  

  if (arg == "ITEM" || arg == "LOAN") {
    return newcar;
  } else {
    userdata["garage"].push(newcar);
    if (arg == "SORT") {
      userdata["garage"] = stats.garagesort(userdata);
    }
    stats.save(userdata);
    return;
  }
};

/*
module.exports.updatecurrentcarfpp(car, userdata) {
  var id = car["id"]
  var
   var clean = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"])
   clean = clean - rnumber

  if (clean <= 0) {
    clean = 0
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean

}
*/

module.exports.updatecareerrace = function (racesettings, place, userdata) {
 var eventid = racesettings['eventid'].toLowerCase();
  
  if (racesettings["championship"]) {
    var prevplace = userdata["careerraces"][eventid][0];
    var i = 1
    while (i < userdata["careerraces"][eventid].length) {
      var prevplace = userdata["careerraces"][eventid][i - 1];
      console.log(userdata["careerraces"][eventid][i - 1])
  if (prevplace == 0) {
     userdata["careerraces"][eventid][i - 1] = place
  } else {
    if (parseInt(place.split(/[A-Z]/gi)[0]) <= parseInt(prevplace.split(/[A-Z]/gi)[0])) {
      userdata["careerraces"][eventid][i - 1] = place;
    }
  }
      i++
    }
  } else {
  
  var prevplace = userdata["careerraces"][eventid][racesettings["raceid"] - 1];
  if (prevplace == 0) {
     userdata["careerraces"][eventid][racesettings["raceid"] - 1] = place
  } else {
    if (parseInt(place.split(/[A-Z]/gi)[0]) <= parseInt(prevplace.split(/[A-Z]/gi)[0])) {
      userdata["careerraces"][eventid][racesettings["raceid"] - 1] = place;
    }
  }

  }
};

module.exports.updatelicensetest = function (racesettings, place, userdata) {
 var eventid = racesettings['eventid'].replace("LICENSE", "").toLowerCase();
  
  var prevplace = userdata["licenses"][eventid][0];
  if (prevplace == 0) {
     userdata["licenses"][eventid][0] = place
  } else {
    if (parseInt(place.split(/[A-Z]/gi)[0]) <= parseInt(prevplace.split(/[A-Z]/gi)[0])) {
      userdata["licenses"][eventid][0] = place;
    }
  }
     
};

module.exports.checkcar = function (carname, userdata) {
  if (userdata["garage"].some(x => x["name"] === carname)) {
    return " ✅";
  } else {
    return "";
  }
};
module.exports.getraceprogress = function (racesettings, raceid, userdata) {
  eventid = racesettings["eventid"].toLowerCase();

  if (userdata["careerraces"][eventid][raceid - 1] == 0) {
    return "";
  } else {
    return "`" + userdata["careerraces"][eventid][raceid - 1] + "`";
  }
};

module.exports.checkcareerevent = function (event, place, userdata) {
  var total = event["eventlength"]
  var count = 0;
  var i = 0;
  var eventid = event["eventid"].toLowerCase();
  
  var count = userdata["careerraces"][eventid].filter(function(x) {
    if (x == 0) {
      return false
    } else if (x == "✅") {
      return false
    } else {
      return (x.split(/[A-Z]/gi)[0] <= place.split(/[A-Z]/gi)[0])
    }
  }).length
  console.log(count)

  if (count >= total) {
    return true;
  } else {
    return false;
  }
};

module.exports.checklicensetests = function (option, place, userdata) {
  option = option.toLowerCase()
  var total = 7
  if (option.includes("ic")) {
    total = 5
  }
  var count = 0;
  var i = 0;
  var licenses = Object.fromEntries(Object.entries(userdata["licenses"]).filter(([key]) => key.includes(option)))
  
  var count = Object.keys(licenses).filter(function(x) {
    if (licenses[x][0] == 0) {
      return false
    } else if (licenses[x][0] == "✅") {
      return false
    } else {
      return (licenses[x][0].split(/[A-Z]/gi)[0] <= place.split(/[A-Z]/gi)[0])
    }
  }).length
  console.log(count)

  if (count >= total) {
    return true;
  } else {
    return false;
  }
};

module.exports.license = function (userdata) {
  return userdata["license"]
}

module.exports.checklicense = function (license, embed, msg, userdata) {
  license = license.toLowerCase()
  var ranks = {"c": 0, "n": 0, "b":1, "a":2, "ic":3, "ib":4, "ia":5, "s": 6}
  if (ranks[license] <= ranks[stats.license(userdata).toLowerCase()]) {
    return true;
  } else {
    if (embed != "") {
    require(gtf.EMBED).alert({ name: "❌ " + "License " + license.toUpperCase() + " Required", description: "🔒 Your license does not meet the requirements." + "\n\n" + "**License "+ stats.license(userdata) +  " -> " + "License " + license.toUpperCase()  + "**", embed: "", seconds: 10 }, msg, userdata);
    }
    return false;
  }
};

module.exports.completelicense = function (option, userdata) {
  userdata["license"] = option.toUpperCase()
}

module.exports.checkachievements = function (member, userdata) {
  var roles = [
    ["B License", 20000],
    ["A License", 80000],
    ["IB License", 100000],
    ["IA License", 200000],
    ["S License", 500000],
  ];

  for (var i = 0; i < roles.length; i++) {
    if (member.roles.cache.find(role => role.name === roles[i][0])) {
      if (typeof stats.achievements(userdata)["GTF " + roles[i][0]] === "undefined") {
        userdata["achievements"]["GTF " + roles[i][0]] = { name: "GTF " + roles[i][0], complete: true };
        stats.addgift("GTF " + roles[i][0] + " Reward", roles[i][1], "CREDITS", "🎁 Prize", true, userdata);
      } else {
        if (stats.achievements(userdata)["GTF " + roles[i][0]]["complete"] == true) {
          continue;
        } else {
          userdata["achievements"]["GTF " + roles[i]]["complete"] = true;
        }
      }
    }
  }
};

module.exports.redeemgift = function (title, gift, embed, msg, userdata) {
  var description = "";
  if (gift["type"] == "CREDITS") {
    stats.addcredits(parseInt(gift["item"]), userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Credits: +" + gtftools.numFormat(gift["item"]) + emote.credits + "**";
    require(gtf.EMBED).alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    stats.save(userdata);
  } 
  else if (gift["type"] == "RANDOMCAR") {
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    delete gift["id"];
    var prizes = require(gtf.CARS).random(gift["item"], 4).map(function(x) {
      x = {id: -1, 
           type:"CAR", 
           name: x["name"] + " " + x["year"], 
           item: x, author: "GT FITNESS", inventory: false 
          }
      return x
    })
    require(gtf.MARKETPLACE).fourgifts(title, "**" + title + "**", prizes, embed, msg, userdata);
  } 
  else if (gift["type"] == "CAR") {
    var car = gift["item"];
    var ocar = require(gtf.CARS).find({ makes: [car["make"]], fullname: [car["name"] + " " + car["year"]] })[0];
    stats.addcar(car, "SORT", userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    stats.save(userdata);

    description = "**" + car["name"] + " " + car["year"] + " acquired.\nAdded to your garage.**";
    embed.setImage(ocar["image"][0]);
    require(gtf.EMBED).alert({ name: title, description: description, embed: embed, seconds: 0 }, msg, userdata);
  }
};

module.exports.completeevent = function (event, userdata) {
  var eventid = event["eventid"].toLowerCase();
  var events = userdata["careerraces"][eventid];

  for (var i = 0; i < events.length; i++) {
    userdata["careerraces"][eventid][i] = "✅";
  }
};

module.exports.eventstatus = function (eventid, userdata) {
  eventid = eventid.toLowerCase();

  if (eventid.includes("license")) {
    eventid = eventid.replace("license", "").toLowerCase();
    events = userdata["licenses"][eventid];

  if (events[0] == "✅") {
      return "✅";
    } else if (events[0] == "1st") {
      return emote.goldmedal
    } else if (events[0] == "2nd") {
      return emote.silvermedal
    } else if (events[0] == "3rd") {
      return emote.bronzemedal
    } else {
      return "⬛";
  }
  } else {
  events = userdata["careerraces"][eventid];

  if (userdata["careerraces"][eventid] === undefined) {
    userdata["careerraces"][eventid] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  events = userdata["careerraces"][eventid];

  if (events.length == 0) {
    return "⬛";
  } else {
    if (events[0] == "✅") {
      return "✅";
    }
    if (events.some(item => item !== 0)) {
      return "⏲";
    } else {
      return "⬛";
    }
  }
  }
  
};

module.exports.removecar = function (car, num, sell, userdata) {
  stats.addcredits(sell, userdata);

  var prevcarid = stats.currentcar(userdata)["id"];
  var removedcarid = car["id"];
  var pi;
  var ri;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (stats.garage(userdata)[i]["id"] == removedcarid) {
      ri = i;
    }
  }

  var garage = stats.garage(userdata).filter(x => x["id"] != num);
  userdata["garage"] = garage;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (userdata["garage"][i]["id"] == prevcarid) {
      pi = i;
    }
  }

  if (ri <= pi) {
    userdata["currentcar"]--;
  }
};

module.exports.removecars = function (start, end, userdata) {
  var count = end - start + 1;
  var total = 0;
  var car = "";

  var i = 0;
  while (i < count) {
    car = stats.garage(userdata)[start - 1];
    total += require(gtf.PERF).perf(car, "GARAGE")["sell"];

    stats.removecar(car, car["id"], require(gtf.PERF).perf(car, "GARAGE")["sell"], userdata);

    i++;
  }
  return total;
};

module.exports.updatecurrentcar = function (car, userdata) {
  var garage = stats.garage(userdata);
  garage[userdata["currentcar"]] = car;
  userdata["garage"] = garage;
};

module.exports.clearraceinprogress = function (userdata) {
  userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: 0, gridhistory: [], msghistory: [] };
};

module.exports.raceinprogressstat = function (userdata) {
  return userdata["raceinprogress"];
};

module.exports.inlobbystat = function (userdata) {
  return userdata["inlobby"];
};

module.exports.inlobby = function (bool, mid, userdata) {
  if (bool === "undefined") {
  } else {
    userdata["inlobby"][0] = bool;
  }
  if (mid === undefined) {
  } else {
    userdata["inlobby"][1] = mid;
  }
  return [bool, mid];
};
module.exports.levelup = function (number, userdata) {
  if (number == 0) {
    return;
  } else {
    userdata["level"] += number;
  }
};
module.exports.setlevel = function (number, userdata) {
  if (number == 0) {
    return;
  } else {
    userdata["level"] = number;
  }
};

module.exports.main = function (userdata) {
  userdata["count"]++;
  userdata["mileage"] = require(gtf.MATH).round(userdata["mileage"], 2)

  var levelup = require(gtf.EXP).islevelup(userdata);

  if (levelup[0]) {
    levelup = "\n" + "**⬆ Level Up!**";
  } else {
    levelup = "";
  }
  var gifts = stats.gifts(userdata).length >= 1 ? stats.gifts(userdata).length + " 🎁 " : "";
  var units = stats.mileageunits(userdata);
  var currdate = require(gtf.DATETIME).getFormattedDate(new Date(), userdata);

  if (userdata["lastonline"] != currdate) {
    userdata["dailyworkout"]["done"] = false;
    /*
    if (userdata["mileage"] > 0) {
      stats.addracemulti(0.2, userdata);
    } else {
      stats.addracemulti(-100, userdata);
    }
    */
    stats.setmileage(0, 0, userdata);
  }
  userdata["lastonline"] = currdate;
  stats.addracemulti(-100, userdata);
  //emote.dailyworkout + "x" + stats.racemulti(userdata) + " " 

  return gifts + gtftools.numFormat(userdata["credits"]) + " " + emote.credits + " " +  
    "Lv." + userdata["level"] + " " + emote.exp + " " + gtftools.numFormat(userdata["exp"]) + "  " + emote.dailyworkoutman + gtftools.numFormat(stats.mileageuser(userdata)) + units + levelup;
};

/////RACES//////

module.exports.addracedetails = function (racesettings, racedetails, finalgrid, userdata) {
  userdata["racedetails"] = [racesettings, racedetails, finalgrid];
};

module.exports.removeracedetails = function (userdata) {
  userdata["racedetails"] = [];
};

module.exports.createracehistory = function (racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata) {
  userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
  userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(racesettings["time"])))
    if (typeof racesettings["driver"]["car"] === 'undefined') {
      userdata["raceinprogress"]["tirehistory"].push("Sports: Hard")
    } else {
  userdata["raceinprogress"]["tirehistory"].push(racesettings["driver"]["car"]["perf"]["tires"]["current"].slice())
    }
    
  for (var i = 0; i < 20; i++) {
    userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
    message = require(gtf.RACEEX).updategrid(racesettings, racedetails, finalgrid, checkpoint, timeinterval, i, message, embed, msg, userdata)

    timei = require(gtf.TIME).increasetime(racesettings["time"], timeinterval)
    userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(timei)))
    userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
    if (typeof racesettings["driver"]["car"] === 'undefined') {
      userdata["raceinprogress"]["tirehistory"].push("Sports: Hard")
    } else {
  userdata["raceinprogress"]["tirehistory"].push(racesettings["driver"]["car"]["perf"]["tires"]["current"].slice())
    }
  } 
  finalgrid = userdata["raceinprogress"]["gridhistory"][0]
}
    


module.exports.resumerace = function (userdata, client) {
  if (userdata["racedetails"].length == 0) {
    return;
  }
  if (!userdata["raceinprogress"]["active"] || userdata["raceinprogress"]["channelid"] === "" || userdata["raceinprogress"]["messageid"] === "") {
    return;
  }
  var user = {};
  var server = client.guilds.cache.get(gtf.SERVERID);
  var server2 = server.channels.cache.get(userdata["raceinprogress"]["channelid"]);
  var totmembers = server.members.fetch().then(totmembers => {
    user = totmembers.filter(member => member.user.id == userdata["id"]).get(userdata["id"]);
    continuee(user);
  });
  function continuee(user) {

    var racesettings = userdata["racedetails"][0];
    var racedetails = userdata["racedetails"][1];
    var finalgrid = userdata["racedetails"][2];

    if (typeof server2 === "undefined") {
      return;
    }

    server2.messages.fetch({ around: userdata["raceinprogress"]["messageid"], limit: 1 }).then(messages => {
      var msg = messages.first();
      if (msg === undefined) {
        console.log(userdata["id"] + "Race Aborted (message error)");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        stats.save(userdata);
        return;
      }
      if (msg.content.includes("FINISH")) {
        console.log(userdata["id"] + ": Race Aborted");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        stats.save(userdata);
        return;
      }
      var embed = new EmbedBuilder(msg.embeds[0]);


      if (userdata["raceinprogress"]["championshipnum"] >= 1) {
 console.log(userdata["id"] + ": Championship Resumed");
      } else {
        
      console.log(userdata["id"] + ": Race Resumed");
      }
      
require("../../functions/races/f_races_2").startsession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
    });
    return true;
  }
};

module.exports.checkmessages = function(command, callback, msg, userdata) {
  if (["dw", "dw4", "rcar", "rtrack", "rcourse", "gtf", "sr"].indexOf(command) + 1) {
    return next()
  }

  userdata["tutorial"] == "Complete" ? next() : callback()
  
  function next() {
    var name = command.name
    var commandmessages = gtfuser.messages[name]
    if (typeof commandmessages === 'undefined') {
      callback()
      return
    } else {
    var embed = new EmbedBuilder();
    var user = msg.author.username;
    var avatar = msg.author.displayAvatarURL();

    //embed.setColor(0x800080);
    embed.setAuthor({name: user, iconURL: avatar});
    var message = {}
    for (var x = 0; x < commandmessages.length; x++) {
        if (stats.triggermessage(name, commandmessages[x], userdata)) {
        embed.setDescription(commandmessages[x]["messages"].join("\n\n")); 
        message = commandmessages[x]
        break;
        }
    }

  if (Object.keys(message).length == 0) {
    return callback()
  }
    
  var emojilist = [
  { emoji: "", 
  emoji_name: "", 
  name: 'OK', 
  extra: " ",
  button_id: 0,
  }]
   var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
      require(gtf.DISCORD).send(msg, {embeds: [embed], components:buttons}, acceptmessage)
   function acceptmessage(msg) {
    function accept() {
      stats.addmessage(name, message, userdata)
      stats.save(userdata)
      msg.delete({})
      callback()
    }
    
    var functionlist = [accept]
      gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
  }
    }
  }

 
 
}

module.exports.triggermessage = function(name, message, userdata) {
  if (typeof userdata["messages"][name] === 'undefined') {
    return true
  }
  if (userdata["messages"][name]["ids"].includes(message["id"])) {
    
    return false
  }
  if (message["required"][0].length == 0) {
    return true
  }
  
  if (message["required"].every(function(x) {
    var value = userdata[x[0]]
    if (value.constructor === Array) {
      value = value.length
    }
    var booleans = {
      ">": value > x[2],
      "<": value < x[2],
      "==": value == x[2],
      ">=": value >= x[2],
      "<=": value <= x[2]
    }
    return booleans[x[1]]
  })) {
    return true
  }
  
}

module.exports.save = function (userdata, condition) {
  if (userdata === undefined) {
    return;
  }
  if (Object.keys(userdata).length <= 6) {
    return;
  }
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  try {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      if (condition == "DELETE") {
        dbo.collection("GTF2SAVES").deleteOne({ id: userdata["id"] });
        dbo.collection("REPLAYS").deleteOne({ id: userdata["id"] });
        dbo.collection("CUSTOMCOURSES").deleteOne({ id: userdata["id"] });
      } else {
        dbo
          .collection("GTF2SAVES")
          .replaceOne({ id: userdata["id"] }, userdata)
          .then(() => {
            db.close();
          });
      }
      //delete data[row["id"]]["_id"]
    });
  } catch (error) {}
};

module.exports.load = function (collection, userdata, callback) {
  if (typeof callback === 'undefined') {
    callback = function () {}
  }
 var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
  var results = {}
  var find = collection == "SEASONALS" ? {} : { id: userdata["id"] }

    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection(collection)
        .find(find)
        .forEach(row => {
          results = row
          console.log(results)
          callback(results);
          db.close()
        })
    });
};