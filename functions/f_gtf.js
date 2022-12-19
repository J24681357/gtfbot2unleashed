var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

/////////////////////VARIABLES/////////////////
module.exports.garagelimit = 300;
module.exports.favoritelimit = 100;
module.exports.replaylimit = 10;
module.exports.courselimit = 5;
module.exports.eventlimit = 5;
module.exports.giftlimit = 20;
module.exports.creditslimit = 9999999;
module.exports.explimit = 1000000;
module.exports.commandlist = [['career', "Career Mode", "🏁"],
['arcade', "Arcade Mode", "🎮"], 
['lobby', "Lobby Matchmaking | Lv.8", "👥"], 
['seasonal', "Seasonal Events | Lv.13", "🎉"], 
['customrace', "Custom Race | Lv.35", "♾"], 
['car', "GTF Car Dealerships", "🏢"],
['tune', "GTF Auto: Tuning & Maintenance", "🔧"],
['paint', "GTF Auto: Paints", "🎨"],
['wheels', "GTF Auto: Wheels", "🛞"],
['setup', "Car Setups", "🛠"], 
['garage', "Garage", "🚘"], 
["profile", "Profile", "👤"],
["gifts", "Items", "🎁"],
["daily", "Daily Workout | Lv.4", "🎽"],
["course", "Course Maker | Lv.11", "🛣"],
["replay", "Replay Theater", "🎞"],
["database", "GTF Database", "🗃"],
["settings", "Settings", "⚙"],
["manual", "Manual", "📝"]]
module.exports.defaultsettings = {
            MODE: "Simulation",
            GARAGESORT: "Oldest Added",
            DEALERSORT: "Lowest Price",
            RACEDM: 0,
            UNITS: 0,
            TIMEOFFSET: 0,
            TIPS: 0,
            ICONS: {"select": "⬜", "bar": ["⬜", "⬛"]},
            COLOR: "#0151b0",
            COMPACTMODE: 0,
            HOMELAYOUT: 0,
            MENUSELECT: 0,
            GRIDNAME: 0
}
module.exports.invitationlist = ["Ferrari", "Lamborghini"]

module.exports.defaultuserdata = function(id) {
  return { id: id, 
          settings: require(gtf.GTF).defaultsettings 
         }
}
////////////////////////////


module.exports.checkregulations = function (gtfcar, regulations, func, embed, msg, userdata) {
  var car = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]]});

  
  var perf = require(gtf.PERF).perf(gtfcar, "GARAGE")

  var fpplimit = regulations["fpplimit"];
  var powerlimit = regulations["upperpower"];
  var weightlimit = regulations["upperweight"];
  var yearlimit = regulations["upperyear"];
  
  var makes = regulations["makes"];
  var models = regulations["models"];
  var types = regulations["types"];
  var countries = regulations["countries"];
  var drivetrains = regulations["drivetrains"];
  var engines = regulations["engines"];
  var specials = regulations["special"]
  var prohibiteds = regulations["prohibited"];

  var favorite = regulations["favorite"]

  if (typeof makes === 'undefined') makes = []
  if (typeof models === 'undefined') models = []
  if (typeof types === 'undefined') types = []
  if (typeof countries === 'undefined') countries = []
  if (typeof drivetrains === 'undefined') drivetrains = []
  if (typeof engines === 'undefined') engines = []
  if (typeof specials === 'undefined') specials = []
  if (typeof prohibiteds === 'undefined') prohibiteds = []

  if (typeof favorite === 'undefined') favorite = false
  
  var fppexist = fpplimit != "";
  var powerexist = powerlimit != "";
  var weightexist = weightlimit != "";
  var yearexist = yearlimit != "";
  
  var makeexist = makes.length > 0;
  var modelexist = models.length > 0;
  var typeexist = types.length > 0;
  var countryexist = countries.length > 0;
  var dtexist = drivetrains.length > 0;
  var engineexist = engines.length > 0;
  var specialexist = specials.length > 0;
  var prohibitexist = prohibiteds.length > 0;
  
  var favoriteexist = favorite

  var errors = [];

  var fppsuccess = false;
  if (fppexist) {
    var fpp = gtfcar["fpp"];
    if (fpp <= fpplimit) {
      fppsuccess = true;
    }
    if (!fppsuccess) {
    errors.push("**FPP Limit:** " + "**" + fpp + "**" + emote.fpp + " -> " + "**" + fpplimit + "**" + emote.fpp);
  }
  }

  var powersuccess = false;
  if (powerexist) {
    var power = perf["power"];
    if (power <= powerlimit) {
      powersuccess = true;
    }
    if (!powersuccess) {
    errors.push("**Power Limit:** " + "**" + power + " HP**"+ " -> " + "**" + powerlimit + " HP**");
  }
  }
 
  var weightsuccess = false;
  if (weightexist) {
    var weight = perf["weight"];
    if (weight <= weightlimit) {
      weightsuccess = true;
    }
    if (!weightsuccess) {
    errors.push("**Weight Limit:** " + "**" + weight + " Ibs**"+ " -> " + "**" + weightlimit + " Ibs**");
  }
  }

  var yearsuccess = false;
  if (yearexist) {
    var year = car["year"];
    if (year <= yearlimit) {
      yearsuccess = true;
    }
    if (!yearsuccess) {
    errors.push("**Model Year:** " + "**" + year + "**"+ " -> " + "**" + yearlimit + "**");
  }
  }

  var makesuccess = false;
  if (makeexist) {
    var index = 0;
    while (index < makes.length) {
      if (makes[index].includes(car["make"])) {
        makesuccess = true;
        break;
      }
      index++;
    }
    if (!makesuccess) {
      errors.push("**Makes:** " + car["make"] + " -> " + gtftools.removeDups(makes).join(", "));
    }
  }

  var modelsuccess = false;
  if (modelexist) {
    var index = 0;
    while (index < models.length) {
      if (car["name"].includes(models[index])) {
        modelsuccess = true;
        break;
      }
      index++;
    }
    if (!modelsuccess) {
      errors.push("**Model:** " + car["name"] + " -> " + models.join(", "));
    }
  }

  var typesuccess = false;
  if (typeexist) {
    var index = 0;
    while (index < types.length) {
      if (car["type"].includes(types[index])) {
        typesuccess = true;
        break;
      }
      index++;
    }
    if (!typesuccess) {
      errors.push("**Type:** " + car["type"] + " -> " + types.join(", "));
    }
  }

  var countrysuccess = false;
  if (countryexist) {
    var index = 0;
    while (index < countries.length) {
      if (car["country"] == countries[index]) {
        countrysuccess = true;
        break;
      }
      index++;
    }
    if (!countrysuccess) {
      errors.push("**Country:** " + car["country"] + " -> " + countries.join(", "));
    }
  }

  var enginesuccess = false;
  if (engineexist) {
    var index = 0;
    while (index < engines.length) {
      if (car["engine"].includes(engines[index])) {
        enginesuccess = true;
        break;
      }
      index++;
    }
    if (!enginesuccess) {
      errors.push("**Engine Aspiration:** " + car["engine"] + " -> " + engines.join(", "));
    }
  }
 
  var dtsuccess = false;
  if (dtexist) {
    var index = 0;
    while (index < drivetrains.length) {
      if (car["drivetrain"].includes(drivetrains[index])) {
        dtsuccess = true;
        break;
      }
      index++;
    }
    if (!dtsuccess) {
      errors.push("**Drivetrain:** " + car["drivetrain"] + " -> " + drivetrains.join(", "));
    }
  }
  
  var specialsuccess = false;
  if (specialexist) {
    var index = 0;
    while (index < specials.length) {
      if (car["special"].includes(specials[index])) {
        specialsuccess = true;
        break;
      }
      index++;
    }
    if (!specialsuccess) {
      errors.push("**Special:** " + specials.join(", "));
    }
  }
  
  var prohibitsuccess = true;
  if (prohibitexist) {
    var index = 0;
    while (index < prohibiteds.length) {
      if (car["special"].includes(prohibiteds[index])) {
        prohibitsuccess = false;
        break;
      }
      index++;
    }
    if (!prohibitsuccess) {
      errors.push("**Prohibited:** " + prohibiteds.join(", "));
    }
  }

  
  var favoritesuccess = false;
  if (favoriteexist) {
      if (gtfcar["favorite"]) {
        favoritesuccess = true;
    }
    if (!favoritesuccess) {
      errors.push("**Favorite:** False");
    }
  }

  var conditionsuccess = false;
  if (require(gtf.CONDITION).condition(gtfcar)["health"] <= 5) {
        errors.push(emote.cardead + " The car condition is **Wreaked** and must be repaired at GTF Auto.");
  }

  if (typeof func == "string") {
  if (errors.length == 0) {
    return [true, ""]
  } else {
    return [false, errors]
}
}
  
  if (errors.length == 0) {
    func()
    return true
  } else {
    
  var garagepage = 0;
  var hundredpage = 0
    
  var totallength = stats.garage(userdata).length
  var gmenulist = []
  var gmenulistselect = []
  var gemojilist = [];
  var emojilist = []
  var namex = ""
  var menu = []
  var functionlist2 = []
  var buttons = []
  var args = {carselectmessage: false}
    
  
  //////
  var [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = require(gtf.GTF).garagemenu(regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata)
  //////
  
if (gmenulist.length == 0) {
  embed.setColor(0x460000)
embed.setTitle("❌ Regulations Breached")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the tire regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ None of your garage cars are eligible.**")
require(gtf.DISCORD).send(msg, {embeds:[embed]})
return
}     
embed.setColor(0x460000)
embed.setTitle("❌ Regulations Breached")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ See the menu below for eligible cars in your garage.**")

 require(gtf.DISCORD).send(msg, { embeds:[embed], components: [menu]}, garagefunc)
 
 function garagefunc(msg) {
    [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = require(gtf.GTF).garagemenufunctions(regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata)
    gtftools.createbuttons(menu, emojilist, functionlist2, msg, userdata)
 }
    return false
}
}

module.exports.randomdriver = function() {
  var random_name = require('node-random-name');
var name = random_name({ random: Math.random, gender: "male" }) 
name = name.split(" ").map(function(x, index) {
  if (index == 0) {
    return x[0] + ". "
  } else {
    return x
  }
})
return name.join("")
}

module.exports.checktireregulations = function (gtfcar, regulations, func, embed, msg, userdata) {
  
  var tires = regulations["tires"]
  if (tires == "") {
    tires = "Racing: Soft"
  }

  var tireranking = {
    "Comfort: Hard": 1,
    "Comfort: Medium": 2,
    "Comfort: Soft": 3,
    "Sports: Hard": 4,
    "Sports: Medium": 5,
    "Sports: Soft": 6,
    "Racing: Hard": 7,
    "Racing: Intermediate": 7,
    "Racing: Heavy Wet": 7,
    "Racing: Medium": 8,
    "Racing: Soft": 9,
    "Rally: Snow": 10,
    "Rally: Dirt": 11
  }
  
 var uppertire = tireranking[tires]
  
var errors = [];

  var tiresuccess = false
  if (tires == "Rally: Dirt") {
        tiresuccess = gtfcar["perf"]["tires"]["current"].includes("Dirt")
    } else if (tires == "Rally: Snow") {
        tiresuccess = gtfcar["perf"]["tires"]["current"].includes("Snow")
    } else {
      tiresuccess = tireranking[gtfcar["perf"]["tires"]["current"]] <= uppertire
    }
    if (!tiresuccess) {
      errors.push("**Maximum Tire Grade:** " + gtfcar["perf"]["tires"]["current"] + " -> " + tires);
    }

if (typeof func === 'string') {
  if (errors.length == 0) {
    return [true, ""]
  } else {
    return [false, errors]
}
}
  if (errors.length == 0) {
    func()
    return true
  } else {
  var tireslist = gtfcar["perf"]["tires"]["list"].filter(function(tire) {
    return require(gtf.GTF).checktireregulations({
      perf: {
      tires: {current: tire}
      }
    }, regulations, "", embed, msg, userdata)[0]
  }).sort()
  var tmenulist = tireslist.map(function (tire, index) {
          return {
            emoji: "",
            name: tire,
            description: "",
            menu_id: (index)
            }
  })
  var temojilist = []
var menu = gtftools.preparemenu("Change Tires " + "(" + gtfcar["perf"]["tires"]["current"] + ")" , tmenulist, temojilist, msg, userdata);

if (tmenulist.length == 0) {
  embed.setColor(0x460000)
embed.setTitle("❌ Tires Prohibited")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ None of your tires are eligible.**")
require(gtf.DISCORD).send(msg, {embeds:[embed]})
return
}
embed.setColor(0x460000)
embed.setTitle("❌ Tires Prohibited")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ See the menu below to change tires.**")

require(gtf.DISCORD).send(msg, {embeds:[embed], components: [menu]}, regfunc)

function regfunc(msg) {
    var functionlist = []
       for (var j = 0; j < tmenulist.length; j++) {
      functionlist.push(function(int) {
        gtfcar["perf"]["tires"]["current"] = tireslist[int]
        func() 
        setTimeout(() => msg.delete(),2000);
      })
      }
      gtftools.createbuttons(menu, temojilist, functionlist, msg, userdata)
 }
    return false;
  }
}

module.exports.loadingscreen = function (title, carname) {
  if (carname === undefined) {
    carname = "";
  } else if (carname != "") {
    carname = "\n\n🚘 " + "**" + carname + "**";
  }

  return title + "\n" + emote.loading + " **Loading** " + emote.loading + carname;
};

module.exports.garagemenu = function (regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata) {
  var sorting = userdata["settings"]["GARAGESORT"]
  var filterlist = []
  filterlist = setfilter(filterlist, regulations, false)
  function setfilter(filterlist, regulations, favorite) {
    filterlist = []
    if (favorite) {
        filterlist.push(function (x) {return x["favorite"]})
    } 
    if (typeof regulations !== 'string') {
      filterlist.push(function(x) {return require(gtf.GTF).checkregulations(x, regulations, "", embed, msg, userdata)[0]})
    }
    return filterlist
  }
  var value = require(gtf.GTF).garagemenucars(0, 100, regulations, filterlist, sorting, totallength, userdata)
  gmenulist = value[0]
  totallength = value[1]
 
  
  gmenulistselect = gmenulist.slice(22 * garagepage, 22 + 23 * garagepage);
  gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
    gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
  gmenulistselect.push({
    emoji: "↪",
    name: "Next Page",
    description: "",
    menu_id: "NEXTPAGE",
  });
  namex = totallength + " Cars | " + "Car Select " + "(" + sorting + ")";
  if (args["carselectmessage"]) {
    namex = totallength + " Cars | " + "Car Select (Opens New Message)";
  }
  menu = gtftools.preparemenu(namex, gmenulistselect, gemojilist, msg, userdata);
  if (gmenulist.length != 0) {
    buttons.unshift(menu);
  }
  return [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength]
}

module.exports.garagemenufunctions = function (regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata) {
    var sorting = userdata["settings"]["GARAGESORT"]
    var fav = false
    var filterlist = []
    
  filterlist = setfilter(filterlist, regulations, fav)
  function setfilter(filterlist, regulations, favorite) {
    filterlist = []
    if (favorite) {
        filterlist.push(function (x) {return x["favorite"]})
    } 
    if (typeof regulations !== "string") {
     filterlist.push(function(x) {return require(gtf.GTF).checkregulations(x, regulations, "", embed, msg, userdata)[0]})
    }
    return filterlist
  }

    
    for (var j = 0; j < gmenulist.length; j++) {
      functionlist2.push(function (int) {
        if (typeof args["nochange"] !== "undefined") {
          return
        }
        if (int == "FAVORITES") {
          if (!fav) {
            fav = true
          } else {
            fav = false
        }
          garagepage = 0
          hundredpage = 0
        filterlist = setfilter(filterlist, regulations, fav)
          
      var sig = require(gtf.GTF).garagemenucars(100 * hundredpage, 100 * (hundredpage + 1), [], filterlist, sorting, totallength, userdata)
    gmenulist = sig[0]
    totallength = sig[1]
          
          if (gmenulist.length <= 0 + (23 * garagepage) - 1) {
            garagepage = 0;
          }


          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
            gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
  gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
          
          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          menu = gtftools.preparemenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});
          return
        } else if (int == "NEXTPAGE") {
           garagepage++;
          filterlist = setfilter(filterlist, regulations, fav)
        if (22 * (garagepage) > totallength) {
          garagepage = 0
  }
          /*
          if (gmenulist.length <= (0 + (23 * garagepage) - 1)) {
            garagepage = 0;            
          }
*/
          
          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
            gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
            gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          menu = gtftools.preparemenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});
          
          return;
        } else if (int == "PREVPAGE") {
          filterlist = setfilter(filterlist, regulations, fav)
          garagepage--;
          /* 
gmenulist = []
while (gmenulist.length <= 0)
          */
          if (garagepage <= -1) {
            garagepage = Math.ceil(gmenulist.length / 22) - 1
          }


          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
                      gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
            gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          var menu = gtftools.preparemenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});
          return;
        }
        if (args["carselectmessage"]) {
          gmenulist = []
          var number = parseInt(int);
          
          filterlist = setfilter(filterlist, regulations, fav)
          stats.setcurrentcar(
            number + 1 + (100 * hundredpage),filterlist,
            userdata
          );

          
          stats.save(userdata);
          setTimeout(() => {
            require(dir + "commands/" + args["command"]).execute(msg, args["oldquery"], userdata);
          }, 1000);
          return;
        } else {
          select = 0;
          index = 0;
          filterlist = setfilter(filterlist, regulations, fav)
          require(dir + "commands/garage").execute(msg, { options: "select", number: int + 1 + (100 * hundredpage), filter: filterlist, extra: "silent" }, userdata);
          if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
          gmenulist.some((item, index) => item["menu_id"] == (int) && 
  gmenulist.unshift( 
    gmenulist.splice(index,1)[0] 
  )
  )
  gmenulist = gmenulist.map(function(x, index) {
    x["description"] = "🚘" + (index + 1) + " " + x["description"].split(" ").slice(1).join(" ")
    x["menu_id"] = index
    return x
  })
  
  gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage)
    gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
              gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
  gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
    });
          menu = gtftools.preparemenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
        }
          embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata) }])
          msg.edit({embeds:[embed], components: buttons})
        }
        if (regulations.length == 0) {
        } else {
          func()
        }
      });
    }
    return [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength]
  }

module.exports.garagemenucars = function (min, max, regulations, filterlist, sorting, totallength, userdata) {

  var garage = userdata["garage"].filter(x => filterlist.map(f => f(x)).every(p => p === true))
  totallength = garage.length
  /*
  if (regulations.length == 0) {
     var garage = userdata["garage"].filter(x => filterlist.map(f => f(x)).every(p => p === true)))
    totallength = userdata["garage"].length
  } else {
  var garage = userdata["garage"].filter(x => filterlist.map(f => f(x)).every(p => p === true))
  totallength = garage.length
  }
  */
  
  return [garage.map(function (car, index) {
    var ocar = require(gtf.PERF).perf(car, "GARAGE")
    var health = require(gtf.CONDITION).condition(car)["health"]
    var favorite = car["favorite"] ? " ⭐" : ""
    
    var desc = "🚘" + (index+min+1) + " | " + health + "% " + ocar["fpp"] + "FPP" + " " + gtftools.numFormat(ocar["power"]) + "hp" + " " + gtftools.numFormat(ocar["weight"]) + "lbs" + favorite
    if (sorting.includes("Power")) {
      desc = "🚘" + (index + min + 1) + " | " + gtftools.numFormat(ocar["power"]) + "hp" + " " + ocar["fpp"] + "FPP" + " " + gtftools.numFormat(ocar["weight"]) + "lbs" + favorite
    }
    return {
      emoji: "",
      name: car["name"],
      description: desc,
      menu_id: index,
    }
  
}), totallength]
}