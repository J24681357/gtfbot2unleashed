var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var gtfcars = require(gtf.LISTS).gtfcarlist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtfcars;
  }
  if (args == "makes") {
    results = Object.keys(gtfcars).map(function (x) {
    if (x == 'bac') {
        return "BAC"
      }
      if (x == 'bmw') {
        return "BMW"
      }
      if (x == "hks") {
        return "HKS"
      }
      if (x == "ktm") {
        return "KTM"
      }
      if (x == "tvr") {
        return "TVR"
      }
      if (x == "ruf") {
        return "RUF"
      }
      if (x == "seat") {
        return "SEAT"
      }
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    }).sort();
    return results;
  }

  if (args == "countries") {
    results = []

    for (var i = 0; i < Object.keys(gtfcars).length; i++) {
        var make = gtfcars[Object.keys(gtfcars)[i]]
        if ((make[0]["country"] in results)) {
        } else {
        results.push(make[0]["country"])
        }
    }
    results = gtftools.unique(results)
  }

  if (args == "drivetrains") {
    results = ["FF", "FR", "4WD", "4WD-MR", "MR", "RR"];
  }

  return results.sort();
};

module.exports.stats = function (embed) {
  var results = ""
      var list = require(gtf.CARS).list("all")
      var countries = {}
      var types = {}
      var total = 0
      var maketotal = 0
      for (var i = 0; i < Object.keys(list).length; i++) {
        var make = list[Object.keys(list)[i]]
        maketotal++
        for (var j = 0; j < make.length; j++) {
          total++
          var car = make[j]
        if (car["country"] in countries) {
          countries[car["country"]]++
        } else {
          countries[car["country"]] = 1
        }
          if (car["type"] in types) {
          types[car["type"]]++
        } else {
          types[car["type"]] = 1
        }
        }
      }
      countries = Object.keys(countries).sort().reduce(
  (obj, key) => {
    obj[key] = countries[key];
    return obj;
  },
  {}
);
      types = Object.keys(types).sort().reduce(
  (obj, key) => {
    obj[key] = types[key];
    return obj;
  },
  {}
);
      var fcountries = []
      var ftypes = []
      for (var key = 0; key < Object.keys(countries).length; key++) {
        fcountries.push("**" + Object.keys(countries)[key] + ":** " + countries[Object.keys(countries)[key]] )
      }
      var racecar = false
      var rallycar = false
      var totalr = 0
      for (var key = 0; key < Object.keys(types).length; key++) {
        if (Object.keys(types)[key].includes("Race Car")) {
          if (racecar) {
            continue;
          }
          racecar = true
          totalr = Object.entries(types).filter(([key]) => key.includes('Race')).map(x=> x[1]).reduce((a,b)=>a+b)
          ftypes.push("**Race Car:** " + totalr)
        } else if (Object.keys(types)[key].includes("Rally Car")) {
          if (rallycar) {
            continue;
          }
          rallycar = true
          totalr = Object.entries(types).filter(([key]) => key.includes('Rally')).map(x=> x[1]).reduce((a,b)=>a+b)
          ftypes.push("**Rally Car:** " + totalr)
        } else {
        ftypes.push("**" + Object.keys(types)[key] + ":** " + types[Object.keys(types)[key]])
        }
      }

      results =
        "**Total Manufacturers:** " +
        maketotal +
        "\n" +
        "**Total Cars:** " +
        total
      embed.setDescription(results);
      embed.addFields([{name:"__Type__", value: ftypes.join("\n"), inline: true}, {name:"__Country__", value: fcountries.join("\n"), inline: true}])
}

module.exports.find = function (args) {
  var gtfcars = require(gtf.LISTS).gtfcarlist

  if (args === undefined) {
    return "";
  }

  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var final = [];
  var makes = Object.keys(gtfcars);

  for (var key = 0; key < makes.length; key++) {
    var makekey = gtfcars[makes[key]];
    for (var i = 0; i < makekey.length; i++) {
      var count = 0;
      if (args["makes"] !== undefined) {
        if (args["makes"].length == 0) {
          count++;
        } else {
          var make = args["makes"];
          var x = makekey[i]["make"];
          for (var makei = 0; makei < make.length; makei++) {
            if (x.toLowerCase().replace(/-/,"_").replace(/ /g, "_") === make[makei].toLowerCase().replace(/-/,"_").replace(/ /g, "_")) {
              count++;
              break;
            }
          }
        }
      }

      if (args["name"] !== undefined) {
        if (args["name"].length == 0) {
          count++;
        } else {
          var names = args["name"];
          for (var iname = 0; iname < names.length; iname++) {
            if (makekey[i]["name"].includes(names[iname])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["fullname"] !== undefined) {
        if (args["fullname"].length == 0) {
          count++;
        } else {
          var fullnames = args["fullname"];
          for (var ifname = 0; ifname < fullnames.length; ifname++) {
            var text = makekey[i]["name"].toLowerCase() + " " + makekey[i]["year"];
            if (text.includes(fullnames[ifname].toLowerCase())) {
              count++;
              break;
            }
          }
        }
      }

      if (args["drivetrains"] !== undefined) {
        if (args["drivetrains"].length == 0) {
          count++;
        } else {
          var drivetrains = args["drivetrains"];
          for (var idt = 0; idt < drivetrains.length; idt++) {
            if (makekey[i]["drivetrain"].includes(drivetrains[idt])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["engines"] !== undefined) {
        if (args["engines"].length == 0) {
          count++;
        } else {
          var engines = args["engines"];
          for (var enginet = 0; enginet < engines.length; enginet++) {
            if (makekey[i]["engine"].includes(engines[enginet])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["year"] !== undefined) {
        if (args["year"].length == 0) {
          count++;
        } else {
          var years = args["year"];
          for (var iyear = 0; iyear < years.length; iyear++) {
            if (years[iyear].includes(makekey[i]["year"])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["upperyear"] !== undefined) {
        if (args["upperyear"].length == 0) {
          count++;
        } else {
          var upperyear = args["upperyear"];
          var x = parseInt(makekey[i]["year"])
          if (upperyear >= x) {
            count++
          }
        }
      }

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            if (makekey[i]["type"].includes(types[itype])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["countries"] !== undefined) {
        if (args["countries"].length == 0) {
          count++;
        } else {
          var countries = args["countries"];
          for (var icountry = 0; icountry < countries.length; icountry++) {
            if (makekey[i]["country"] == countries[icountry]) {
              count++;
              break;
            }
          }
        }
      }
      if (args["uppercostm"] !== undefined) {
        if (args["uppercostm"].length == 0) {
          count++;
        } else {
          var uppercostm = args["uppercostm"];
          var x = makekey[i]["carcostm"]
          if (x <= uppercostm) {
            count++;
          }
        }
      }

      if (args["upperfpp"] !== undefined) {
        if (args["upperfpp"].length == 0) {
          count++;
        } else {
          var upperfpp = args["upperfpp"];
          var x = require(gtf.PERF).perf(makekey[i], "DEALERSHIP")["fpp"];
          if (x <= upperfpp) {
            count++;
          }
        }
      }

      if (args["upperpower"] !== undefined) {
        if (args["upperpower"].length == 0) {
          count++;
        } else {
          var upperpower = args["upperpower"];
          var x = makekey[i]["power"];
          if (x <= upperpower) {
            count++;
          }
        }
      }

      if (args["upperweight"] !== undefined) {
        if (args["upperweight"].length == 0) {
          count++;
        } else {
          var upperweight = args["upperweight"];
          var x = makekey[i]["weight"];
          if (x <= upperweight) {
            count++;
          }
        }
      }

      if (args["lowerfpp"] !== undefined) {
        if (args["lowerfpp"].length == 0) {
          count++;
        } else {
          var lowerfpp = args["lowerfpp"];
          var x = require(gtf.PERF).perf(makekey[i], "DEALERSHIP")["fpp"];
          if (x >= lowerfpp) {
            count++;
          }
        }
      }

      if (args["lowerpower"] !== undefined) {
        if (args["lowerpower"].length == 0) {
          count++;
        } else {
          var lowerpower = args["lowerpower"];
          var x = makekey[i]["power"];
          if (x >= lowerpower) {
            count++;
          }
        }
      }

      if (args["lowerweight"] !== undefined) {
        if (args["lowerweight"].length == 0) {
          count++;
        } else {
          var lowerweight = args["lowerweight"];
          var x = makekey[i]["weight"];
          if (x >= lowerweight) {
            count++;
          }
        }
      }

      if (args["special"] !== undefined) {
        if (args["special"].length == 0) {
          count++;
        } else {
          var specials = args["special"];
          for (var ispecial = 0; ispecial < specials.length; ispecial++) {
            if (makekey[i]["special"].includes(specials[ispecial])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["prohibited"] !== undefined) {
        if (args["prohibited"].length == 0) {
          count++;
        } else {
          var prohibiteds = args["prohibited"];
          for (var iprohibited = 0; iprohibited < prohibiteds.length; iprohibited++) {
            if (!makekey[i]["special"].includes(prohibiteds[iprohibited])) {
              count++;
              break;
            } else {
              break;
            }
          }
        }
      }

      if (count == total) {
        final.unshift(makekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  var id = 1;
  final.sort(function (a, b) {
    if (sort !== undefined) {
      if (sort == "alphabet" || sort == "Alphabetical Order") {
    return a["name"].toString().localeCompare(b["name"].toString());
  }
      if (sort == "hpasc" || sort == "Lowest Power") {
        return require(gtf.PERF).perf(a, "DEALERSHIP")["power"] - require(gtf.PERF).perf(b, "DEALERSHIP")["power"];
      } else if (sort == "hpdesc" || sort == "Highest Power") {
        return require(gtf.PERF).perf(b, "DEALERSHIP")["power"] - require(gtf.PERF).perf(a, "DEALERSHIP")["power"];
      } else if (sort == "weightasc" || sort == "Lowest Weight") {
        return require(gtf.PERF).perf(a, "DEALERSHIP")["weight"] - require(gtf.PERF).perf(b, "DEALERSHIP")["weight"];
      } else if (sort == "weightdesc" || sort == "Highest Weight") {
        return require(gtf.PERF).perf(b, "DEALERSHIP")["weight"] - require(gtf.PERF).perf(a, "DEALERSHIP")["weight"];
      } else if (sort == "fppasc" || sort == "Lowest FPP") {
        return require(gtf.PERF).perf(a, "DEALERSHIP")["fpp"] - require(gtf.PERF).perf(b, "DEALERSHIP")["fpp"];
      } else if (sort == "fppdesc"|| sort == "Highest FPP") {
        return require(gtf.PERF).perf(b, "DEALERSHIP")["fpp"] - require(gtf.PERF).perf(a, "DEALERSHIP")["fpp"];
      } else if (sort == "costasc"|| sort == "Lowest Price") {
        a = require(gtf.CARS).costcalc(a, require(gtf.PERF).perf(a, "DEALERSHIP")["fpp"]);
        b = require(gtf.CARS).costcalc(b, require(gtf.PERF).perf(b, "DEALERSHIP")["fpp"]);
        return a - b;
      } else if (sort == "costdesc"|| sort == "Highest Price") {
        a = require(gtf.CARS).costcalc(a, require(gtf.PERF).perf(a, "DEALERSHIP")["fpp"]);
        b = require(gtf.CARS).costcalc(b, require(gtf.PERF).perf(b, "DEALERSHIP")["fpp"]);
        return b - a;
      } else {
        return a["name"].toString().localeCompare(b["name"]);
      }
    } else {
      return a["name"].toString().localeCompare(b["name"]);
    }
  });
  final.map(function (x) {
    x["id"] = id;
    id++;
  });

  return final;
};

module.exports.get = function (args) {
  var make = args["make"][0].toLowerCase().replace(/ /g, "-")
  var makelist = require(gtf.LISTS).gtfcarlist[make]
  var car = makelist.find(function(x) {
    var name = x["name"] + " " + x["year"]
    return name.includes(args["fullname"][0])
  })
  return car
};

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.CARS).find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};


module.exports.shortname = function (fullname) {
  fullname = fullname.split(" ")
  var year = fullname.pop()
  if (fullname.join(" ").length <= 45) {
    return fullname.join(" ") + " " + year
  } else {
  fullname = fullname.join(" ").substring(0,41) + "... " + year
  return fullname
  }
}

module.exports.checkcar = function (carname, userdata) {
  if (userdata["garage"].some(x => x["name"] === carname)) {
    return " ✅";
  } else {
    return "";
  }
};

module.exports.addcar = function (car, arg, userdata) {
  var fullname = car["name"] + " " + car["year"];

  if (arg != "LOAN") {
    if (stats.garage(userdata).length == 0) {
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

module.exports.costcalc = function (car, fpp) {
  if (car["carcostm"] <= 0.25) {
    return (10000 * car["carcostm"]) - ((10000 * car["carcostm"]) * (car["discount"]/100))
  }
  var cost = car["carcostm"] * 10000;

  if (fpp == undefined) {

  } else {
    var offset = fpp - 250;
    if (offset < 0) {
      cost = -((-offset) ** 1.8) + cost;
    } else {
      cost = offset ** 1.8 + cost;
    }
  }
  cost = cost - (cost * (car["discount"]/100))

  return Math.round(cost / 100) * 100;
};

module.exports.audit = async function () {
  var gtfcars = require(gtf.LISTS).gtfcarlist;
  var fs = require("fs");
  var newcars = [];
  var fppupdate = [];

  var index = 0;
  var makes = Object.keys(gtfcars);

  for (var make = 0; make < makes.length; make++) {
    var group = [];
    for (var i = 0; i < gtfcars[makes[make]].length; i++) {
      var car = gtfcars[makes[make]][i];
      var perf = require(gtf.PERF).perf(car, "DEALERSHIP");

      var totalimages = car["image"].length;
      var makee = car["make"].replace(/ /gi, "").toLowerCase();
      var name = car["name"].replace(/ /gi, "").toLowerCase();

      for (var j = 0; j < totalimages; j++) {
        if (!car["image"][j].includes("raw.githubusercontent.com") && !car["image"][j].includes("github.com")) {
          if (j >= 1) {
            newcars.push(car["name"] + " " + car["year"] + " - " + j);
          } else {
            newcars.push(car["name"] + " " + car["year"]);
          }
          var oldcar = JSON.parse(JSON.stringify(car));
          await downloadimage2(oldcar, oldcar["image"][j], j);
          if (j >= 1) {
            var extra = "-" + j.toString();
          } else {
            var extra = "";
          }
          var urll = "https://raw.githubusercontent.com/J24681357/gtfbot/master/" + "images/cars/" + makee + "/" + name + "" + car["year"] + extra + ".png";
          car["image"][j] = urll;
        }
        delete car["id"];
      }
      group.push(car);
    }
    group = group.sort((a, b) => a["name"].toString().localeCompare(b["name"]));
    gtfcars[makes[make]] = group;
  }
  fs.writeFile("./jsonfiles/gtfcarlist.json", JSON.stringify(gtfcars), function (err) {
    if (err) {
      console.log(err);
    }
  });
  if (newcars.length == 0) {
    console.log("No new cars.");
  }
  fs.writeFile("./jsonfiles/newcars.json", JSON.stringify(newcars), function (err) {
    if (err) {
      console.log(err);
    }
  });

  /*
  function downloadimage(oldcar, imagelink, j) {
    var type = "error";

    var download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        if (res === undefined) {
          console.log("The image may not be available for " + uri);
          return;
        }
        if (res.headers["content-type"] === undefined) {
          console.log("The image may not be available for " + uri);
          return;
        }
        var type = res.headers["content-type"].toLowerCase();
        var file = filename.split("/");
        file.pop();
        if (j >= 1) {
          var extra = (filename = filename + "-" + j.toString() + ".png");
        } else {
          filename = filename + ".png";
        }

        var shell = require("shelljs");
        shell.mkdir("-p", file.join("/"));
        console.log(filename + " " + "image saved.");
        if (!type.includes("image")) {
          console.log("The image may not be available for " + uri);
        }

        setTimeout(function () {
          request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
        }, 2500);
      });
    };
    var name = oldcar["name"].replace(/ /gi, "").toLowerCase();
    var make = oldcar["make"].replace(/ /gi, "").toLowerCase();
    download(imagelink, "./images/cars/" + make + "/" + name + "" + oldcar["year"], function () {});
  }
  */
  async function downloadimage2(oldcar, imagelink, j) {
    var { request } = require("undici");
    var type = "error";
    var name = oldcar["name"].replace(/ /gi, "").toLowerCase();
    var make = oldcar["make"].replace(/ /gi, "").toLowerCase();
    var download2 = async function (uri, filename, callback) {
      try {
        var { statusCode, headers, trailers, body } = await request(uri);
        body = await body.arrayBuffer();
      } catch (error) {
        console.log("The image may not be available for " + uri);
        return;
      }

      if (headers === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }
      if (headers["content-type"] === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }

      var type = headers["content-type"].toLowerCase();
      var file = filename.split("/");
      file.pop();
      if (j >= 1) {
        var extra = (filename = filename + "-" + j.toString() + ".png");
      } else {
        filename = filename + ".png";
      }

      var shell = require("shelljs");
      shell.mkdir("-p", file.join("/"));
      console.log(filename + " " + "image saved.");
      if (!type.includes("image")) {
        console.log("The image may not be available for " + uri);
      }
      fs.writeFileSync(filename, body);
    };

    await download2(imagelink, "./images/cars/" + make + "/" + name + "" + oldcar["year"], function () {});

    //download2(imagelink, "", function () {});
  }
};
