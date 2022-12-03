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

module.exports.numcarpurchase = function (userdata) {
  return userdata["numcarpurchase"];
};

module.exports.lastonline = function (userdata) {
  return userdata["lastonline"];
};

//units
module.exports.mileage = function (type, units, userdata) {
  var label = ["km", "mi"];
  if (units === undefined || units == false) {
    label = ["", ""];
  }
  if (type == "USER") {
    return userdata["mileage"][userdata["settings"]["MILEAGE"]] + label[userdata["settings"]["MILEAGE"]];
  }
  if (type == "KM") {
    return userdata["mileage"][0] + label[0];
  }
  if (type == "MI") {
    return userdata["mileage"][1] + label[1];
  }
};

module.exports.totalmileage = function (type, units, userdata) {
  var label = ["km", "mi"];
  if (units === undefined || units == false) {
    label = ["", ""];
  }
  if (type == "USER") {
    return userdata["totalmileage"][userdata["settings"]["MILEAGE"]] + label[userdata["settings"]["MILEAGE"]];
  }
  if (type == "KM") {
    return userdata["totalmileage"][0] + label[0];
  }
  if (type == "MI") {
    return userdata["totalmileage"][1] + label[1];
  }
};

module.exports.dailyworkout = function (bool, userdata) {
  if (bool === undefined) {
    return userdata["dailyworkout"];
  } else {
    userdata["dailyworkout"] = bool;
  }
};

module.exports.achievements = function (userdata) {
  return userdata["achievements"];
};

module.exports.garage = function (userdata) {
  if (userdata["garage"].length == 0) {
    return userdata["garage"];
  }
  return userdata["garage"];
};

module.exports.garagesort = function (userdata, sort) {
  if (userdata["garage"].length == 0) {
    return userdata["garage"];
  }
  if (typeof sort === "undefined") {
    sort = userdata["settings"]["GARAGESORT"];
  }
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"];

    if (sort == "Alphabetical Order") {
    userdata["garage"].sort((x, y) => x["name"].localeCompare(y["name"]));
  }

  if (sort == "Newest Added") {
    userdata["garage"].sort((x, y) => parseInt(y["ID"]) - parseInt(x["ID"]));
  }
  if (sort == "Oldest Added") {
    userdata["garage"].sort((x, y) => parseInt(x["ID"]) - parseInt(y["ID"]));
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
  id = userdata["garage"].findIndex(x => x["ID"] == id) + 1;
  userdata["currentcar"] = id;

  return userdata["garage"];
};

module.exports.gifts = function (userdata) {
  return userdata["gifts"];
};

module.exports.addgift = function (name, item, type, author, isgift, userdata) {
  var gift = [type, { id: userdata["numgiftearned"], name: name, item: item, author: author, isgift: isgift }];

  userdata["gifts"].unshift(gift);
  userdata["numgiftearned"]++;

  stats.save(userdata);
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
  
  console.log(userdata["totalplaytime"])
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

module.exports.addmileage = function (km, mi, userdata) {
  km = Math.round(km * 100) / 100;
  mi = Math.round(mi * 100) / 100;
  userdata["mileage"][0] += km;
  userdata["mileage"][1] += mi;
  userdata["mileage"][0] = Math.round(userdata["mileage"][0] * 100) / 100;
  userdata["mileage"][1] = Math.round(userdata["mileage"][1] * 100) / 100;
};

module.exports.addtotalmileagecar = function (km, mi, userdata) {
  km = Math.round(km * 100) / 100;
  mi = Math.round(mi * 100) / 100;

  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"];
  if (typeof userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"] === "undefined") {
    userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"] = [0, 0];
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"][0] += parseFloat(km);
  userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"][1] += parseFloat(mi);

  userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"] = [Math.round(userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"][0] * 100) / 100, Math.round(userdata["garage"][stats.currentcarnum(userdata) - 1]["totalmileage"][1] * 100) / 100];

  id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.addtotalmileage = function (km, mi, userdata) {
  userdata["totalmileage"][0] = parseFloat(userdata["totalmileage"][0]);
  userdata["totalmileage"][1] = parseFloat(userdata["totalmileage"][1]);
  km = Math.round(km * 100) / 100;
  mi = Math.round(mi * 100) / 100;
  userdata["totalmileage"][0] += parseFloat(km);
  userdata["totalmileage"][1] += parseFloat(mi);

  userdata["totalmileage"][0] = Math.round(userdata["totalmileage"][0] * 100) / 100;
  userdata["totalmileage"][1] = Math.round(userdata["totalmileage"][1] * 100) / 100;
};

module.exports.setmileage = function (km, mi, userdata) {
  userdata["mileage"][0] = parseFloat(km);
  userdata["mileage"][1] = parseFloat(mi);
};

module.exports.settotalmileage = function (km, mi, userdata) {
  userdata["totalmileage"][0] = parseFloat(km);
  userdata["totalmileage"][1] = parseFloat(mi);
};

///CURRENTCAR
module.exports.currentcar = function (userdata) {
  if (userdata["garage"].length == 0) {
    return {};
  }
  return stats.garage(userdata)[stats.currentcarnum(userdata) - 1];
};

module.exports.currentcarmain = function (userdata) {
  var currentcar = stats.currentcar(userdata);
  if (Object.keys(currentcar).length == 0) {
    return "No car.";
  } else {
    return (
      "`🚘" +
      userdata["currentcar"] +
      "` " +
      currentcar["name"] +
      " **" +
      currentcar["fpp"] +
      "**" +
      emote.fpp +
      emote.tire +
      "**" +
      currentcar["tires"]["current"]
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
    var id = car["ID"];
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["garage"].some((item, index) => item["ID"] == id && userdata["garage"].unshift(userdata["garage"].splice(index, 1)[0]));
    }
    id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1;
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
    var id = car["ID"];
    id = stats.garage(userdata).findIndex(x => x["ID"] == id);
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
  var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })
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
    gtfcar["clean"] +
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
    gtfcar["totalmileage"][userdata["settings"]["MILEAGE"]] +
    " " +
    ["km", "mi"][userdata["settings"]["MILEAGE"]] +
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
  //var carimagenumber = stats.carimage(gtfcar);
  //embed.setThumbnail(ocar["image"][carimagenumber]);

  return cardetails;
};

module.exports.view2 = function (gtfcar, userdata) {
  if (gtfcar["transmission"]["current"] == "Default") {
    var trans1 = "Default";
  } else {
    var trans1 = gtfcar["transmission"]["tuning"][0];
  }

  if (gtfcar["suspension"]["current"] == "Default") {
    var susp1 = "Default";
    var susp2 = "Default";
  } else {
    var susp1 = gtfcar["suspension"]["tuning"][0] + " in";
    var susp2 = gtfcar["suspension"]["tuning"][1] + " in";
  }

  if (gtfcar["aero kits"]["current"] == "Default") {
    var aero1 = "Default";
  } else {
    var aero1 = gtfcar["aero kits"]["tuning"][0] * 5;
  }

  var cardetails =
    "__**Aero:**__ " +
    gtfcar["aero kits"]["current"] +
    "\n" +
    "**Downforce Level:** " +
    aero1 +
    "\n" +
    "__**Engine:**__ " +
    gtfcar["engine"]["current"] +
    "\n" +
    "__**Transmission:**__ " +
    gtfcar["transmission"]["current"] +
    "\n" +
    "**Top Speed (Final Gear):** " +
    trans1 +
    " " +
    "\n" +
    "__**Suspension:**__ " +
    gtfcar["suspension"]["current"] +
    "\n" +
    "**Camber Angle:** " +
    susp1 +
    "\n" +
    "**Toe Angle:** " +
    susp2 +
    "\n" +
    "__**Tires:**__ " +
    gtfcar["tires"]["current"] +
    "\n" +
    "__**Weight Reduction:**__ " +
    gtfcar["weight reduction"]["current"] +
    "\n" +
    "__**Turbo Kit:**__ " +
    gtfcar["turbo"]["current"] +
    "\n" +
    "__**Brakes:**__ " +
    gtfcar["brakes"]["current"] +
    "\n";

  return cardetails;
};

module.exports.updatecurrentcarclean = function (length, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"];
  var rnumber = gtftools.randomInt(1, 5);
  var clean = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"]);
  clean = clean - rnumber;

  if (clean <= 0) {
    clean = 0;
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean;

  id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.updatecurrentcaroil = function (length, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"];
  var number = (length / 600) * 100;
  var oil = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["oil"]);
  oil = oil - number;

  if (oil <= 0) {
    oil = 0;
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean;

  id = stats.garage(userdata).findIndex(x => x["ID"] == id) + 1;
  userdata["currentcar"] = id;
};

module.exports.updatefpp = function (gtfcar, userdata) {
  var id = userdata["garage"][stats.currentcarnum(userdata) - 1]["ID"];
  userdata["garage"][stats.currentcarnum(userdata) - 1]["fpp"] = require(gtf.PERF).perf(gtfcar, "GARAGE")["fpp"];
}

module.exports.carimage = function (gtfcar) {
  if (gtfcar["livery"]["current"] != "Default") {
    return parseInt(gtfcar["livery"]["current"].split(" ").slice(-1)[0])
  }
  if (gtfcar["aero kits"]["current"] == "Default") {
    return 0;
  } else {
    return parseInt(gtfcar["aero kits"]["current"].split(" ")[1]);
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
 
var link = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })["image"][stats.carimage(gtfcar)]
  
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

  var tires = { current: car["tires"], list: [car["tires"]], tuning: [0, 0] };
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
  var trans = { current: "Default", list: [], tuning: [-999] };
  var susp = { current: "Default", list: [], tuning: [-999, -999] };
  var weight = { current: "Default", list: [], tuning: [-999, -999] };
  var turbo = { current: "Default", list: [], tuning: [-999, -999] };
  var brakes = { current: "Default", list: [], tuning: [-999, -999] };
  var aerokits = { current: "Default", list: [], tuning: [0, 0] };

  var condition = 100;
  var clean = 100;

  var fpp = require(gtf.PERF).perf(car, "DEALERSHIP")["fpp"];
  var sell = require(gtf.MARKETPLACE).sellcalc(car, "DEALERSHIP");
  if (arg != "LOAN") {
    userdata["numcarpurchase"]++;
    var id1 = userdata["numcarpurchase"];
  } else {
    var id1 = 0;
  }
  var newcar = {
    ID: id1,
    name: fullname,
    make: car["make"],
    year: car["year"],
    fpp: fpp,
    color: { current: "Default" },
    livery: { current: "Default"},
    engine: engine,
    transmission: trans,
    suspension: susp,
    tires: tires,
    "weight reduction": weight,
    turbo: turbo,
    "aero kits": aerokits,
    brakes: brakes,
    nitrous: { current: "Default", tuning: 0 },
    oil: 100,
    damage: 100,
    rims: { current: "Default", list: [], tuning: [-999, -999, -999] },
    condition: condition,
    clean: 100,
    totalmileage: [0, 0],
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
  var id = car["ID"]
  var
   var clean = parseInt(userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"])
   clean = clean - rnumber

  if (clean <= 0) {
    clean = 0
  }

  userdata["garage"][stats.currentcarnum(userdata) - 1]["clean"] = clean

}
*/

module.exports.updatecareerrace = function (raceid, place, userdata) {
  raceid = raceid.split("-");
  var racenum = raceid.pop();
  raceid = raceid.join("-").toLowerCase();

  if (place.includes(">")) {
    place = place.split(" ")[1];
  }
  var currentnumber = userdata["careerraces"][raceid][racenum - 1];
  if (currentnumber == 0) {
    userdata["careerraces"][raceid][racenum - 1] = place;
  } else {
    currentnumber = parseInt(currentnumber.split(/[A-Z]/gi)[0]);
    var placenumber = parseInt(place.split(/[A-Z]/gi)[0]);
    if (placenumber <= currentnumber) {
      userdata["careerraces"][raceid][racenum - 1] = place;
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
module.exports.checkcareerrace = function (raceid, userdata) {
  raceid = raceid.split("-");
  var racenum = raceid.pop();
  raceid = raceid.join("-").toLowerCase();
  stats.addcount(userdata);

  if (userdata["careerraces"][raceid][racenum - 1] == 0) {
    return "";
  } else {
    return "`" + userdata["careerraces"][raceid][racenum - 1] + "`";
  }
};

module.exports.isracescomplete = function (eventid, total, pnumber, userdata) {
  var count = 0;
  var i = 0;
  if (!eventid.includes("seasonal")) {
    eventid = eventid.toLowerCase();
  }
  events = userdata["careerraces"][eventid];

  while (i < events.length || i < count) {
    if (events[i] == "✅") {
      break;
    }
    if (parseInt(events[i]) == 0) {
      break;
    }
    if (events[i].split(/[A-Z]/gi)[0] <= pnumber) {
      count++;
    }
    i++;
  }

  if (count == total) {
    return true;
  } else {
    return false;
  }
};

module.exports.checkachievements = function (userdata, member) {
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

module.exports.gift = function (title, gift, embed, msg, userdata) {
  var type = gift[0];
  var description = "";
  if (type == "CREDITS") {
    stats.addcredits(parseInt(gift[1]["item"]), userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x[1]["id"] !== gift[1]["id"]);
    description = "**Credits: +" + gtftools.numFormat(gift[1]["item"]) + emote.credits + "**";
    require(gtf.EMBED).alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    stats.save(userdata);
  } else if (type == "RANDOMCAR") {
    userdata["gifts"] = userdata["gifts"].filter(x => x[1]["id"] !== gift[1]["id"]);
    delete gift[1]["id"];
    var prizes = require(gtf.CARS)
      .random(gift[1], 4)
      .map(x => ["RANDOMCAR", x]);
    require(gtf.MARKETPLACE).fourgifts(title, "**" + title + "**", prizes, embed, msg, userdata);
  } else if (type == "CAR") {
    var car = gift[1]["item"];
    var ocar = require(gtf.CARS).find({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })[0];
    stats.addcar(car, "SORT", userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x[1]["id"] !== gift[1]["id"]);
    stats.save(userdata);

    description = "**" + car["name"] + " " + car["year"] + " acquired.\nAdded to your garage.**";
    embed.setImage(ocar["image"][0]);
    require(gtf.EMBED).alert({ name: title, description: description, embed: embed, seconds: 0 }, msg, userdata);
  }
};

module.exports.eventcomplete = function (eventid, userdata) {
  eventid = eventid.toLowerCase();
  var events = userdata["careerraces"][eventid];

  for (var i = 0; i < events.length; i++) {
    userdata["careerraces"][eventid][i] = "✅";
  }
};

module.exports.eventstatus = function (eventid, userdata) {
  eventid = eventid.toLowerCase();
  events = userdata["careerraces"][eventid];

  if (userdata["careerraces"][eventid] === undefined) {
    userdata["careerraces"][eventid] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
};

module.exports.removecar = function (car, num, sell, userdata) {
  stats.addcredits(sell, userdata);

  var prevcarid = stats.currentcar(userdata)["ID"];
  var removedcarid = car["ID"];
  var pi;
  var ri;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (stats.garage(userdata)[i]["ID"] == removedcarid) {
      ri = i;
    }
  }

  var garage = stats.garage(userdata).filter(x => x["ID"] != num);
  userdata["garage"] = garage;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (userdata["garage"][i]["ID"] == prevcarid) {
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

    stats.removecar(car, car["ID"], require(gtf.PERF).perf(car, "GARAGE")["sell"], userdata);

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
  userdata["mileage"] = [Math.round(100 * userdata["mileage"][0]) / 100, Math.round(100 * userdata["mileage"][1]) / 100];

  var levelup = require(gtf.EXP).islevelup(userdata);
  var gifts = "";
  if (levelup[0]) {
    //levelup = "\n" + "**⬆ Level " + userdata["level"] + " Unlocks Include... " + levelup[2] + "**";
    levelup = "\n" + "**⬆ Level Up!**";
  } else {
    levelup = "";
  }

  if (stats.gifts(userdata).length > 0) {
    gifts = stats.gifts(userdata).length + "🎁 ";
  }

  if (userdata["settings"]["MILEAGE"] == 0) {
    var dwdistance = "km";
  } else {
    var dwdistance = "mi";
  }
  var currdate = require(gtf.DATETIME).getFormattedDate(new Date(), userdata);

  if (userdata["lastonline"] != currdate) {
    userdata["dailyworkout"] = false;
    if (userdata["mileage"][0] > 0) {
      stats.addracemulti(0.2, userdata);
    } else {
      stats.addracemulti(-100, userdata);
    }
    stats.setmileage(0, 0, userdata);
  }
  userdata["lastonline"] = currdate;

  return gifts + gtftools.numFormat(userdata["credits"]) + emote.credits + "  " + gtftools.numFormat(stats.mileage("USER", false, userdata).toString()) + dwdistance + emote.mileage + "  " + "Lv." + userdata["level"] + " " + emote.exp + " " + stats.racemulti(userdata) + emote.dailyworkout + levelup;
};

/////RACES//////

module.exports.addracedetails = function (racesettings, racedetails, finalgrid, args, userdata) {
  userdata["racedetails"] = [racesettings, racedetails, finalgrid, args];
};

module.exports.removeracedetails = function (userdata) {
  userdata["racedetails"] = [];
};

module.exports.resumerace = function (userdata, client) {
  if (userdata["racedetails"].length == 0) {
    return;
  }
  if (!userdata["raceinprogress"]["active"] || userdata["raceinprogress"]["channelid"] === "" || userdata["raceinprogress"]["messageid"] === "") {
    return;
  }
  var user = {};
  var server = client.guilds.cache.get("239493425131552778");
  var server2 = server.channels.cache.get(userdata["raceinprogress"]["channelid"]);
  var totmembers = server.members.fetch().then(totmembers => {
    user = totmembers.filter(member => member.user.id == userdata["id"]).get(userdata["id"]);
    continuee(user);
  });
  function continuee(user) {
    var userm = user;

    var racesettings = userdata["racedetails"][0];
    var racedetails = userdata["racedetails"][1];
    var finalgrid = userdata["racedetails"][2];
    var args = userdata["racedetails"][3];

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

      var user = msg.author;

      console.log(userdata["id"] + ": Race Resumed");
      require("../../functions/races/f_races_2").readysetgob(user, racedetails, racesettings, finalgrid, embed, msg, args, [true], userdata);
    });
    return true;
  }
};

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
        dbo.collection("USERS").deleteOne({ id: userdata["id"] });
        dbo.collection("REPLAYS").deleteOne({ id: userdata["id"] });
        dbo.collection("CUSTOMCOURSES").deleteOne({ id: userdata["id"] });
      } else {
        dbo
          .collection("USERS")
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
          results = row;
        })
        .then(() => {
          callback(results);
        });
    });
};