var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
module.exports.settingsmenu = function (query, pageargs, embed, msg, userdata) {
  pageargs["rows"] = 10;

  if (query["options"] == "color") {
    pageargs["footer"] = "❓ **Select a color for embeds.**";
    pageargs["list"] = [
          "Default | #0151b0",
    "White | #F2F2F2",
    "Black | #383838",
    "Red | #E81224",
    "Orange | #F7630C",
    "Yellow | #FFF100",
    "Green | #16C60C",
    "Blue | #0078D7",
    "Purple | #886CE4",
    "Brown | #8E562E"
    ].map(function(x, i) {
      if (userdata["settings"]["COLOR"] == x.split(" | ")[1]) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Embed Color (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["COLOR"] = pageargs["list"][query["number"] - 1].split(" | ")[1]
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Embed Color** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
    
      return "SUCCESS";
    };
  }
  
  if (query["options"] == "dealersort") {
    pageargs["footer"] = "❓ **Select a global setting for sorting dealerships in the menus.**";
    pageargs["list"] = [
      "Alphabetical Order",
      "Lowest Price",
      "Highest Price",
      "Highest FPP",
      "Lowest FPP",
      "Highest Power",
      "Lowest Power"
    ].map(function(x, i) {
      if (userdata["settings"]["DEALERSORT"] == x) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Dealership Catalog Sort (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["DEALERSORT"] = pageargs["list"][query["number"] - 1]
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Dealership Sort** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
    
      return "SUCCESS";
    };
  }

  if (query["options"] == "garagesort") {
    pageargs["footer"] = "❓ **Select a global setting for sorting your garage in the menus.**";
    pageargs["list"] = [
      "Alphabetical Order",
      "Recently Used",
      "Oldest Added",
      "Newest Added",
      "Highest FPP",
      "Lowest FPP",
      "Highest Power",
      "Lowest Power"
    ].map(function(x, i) {
      if (userdata["settings"]["GARAGESORT"] == x) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Garage Catalog Sort (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["GARAGESORT"] = pageargs["list"][query["number"] - 1]
      stats.garagesort(userdata)    
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Garage Sort** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);

      return "SUCCESS";
    };
  } 
  
  if (query["options"] == "units") {
    pageargs["footer"] = "❓ **Select units corresponding from the list above.**";
    pageargs["list"] = [
      "Kilometers (KM)",
      "Miles (MI)"
    ].map(function(x, i) {
      if (userdata["settings"]["UNITS"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Metric Units (" + pageargs["list"].length + " Items)__");
    
    var applysetting = function () {
      userdata["settings"]["UNITS"] = query["number"] - 1;
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Metric Units** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "SUCCESS";
    };
  }
  
  if (query["options"] == "time") {
    var date = new Date();
    pageargs["footer"] = "❓ **What time is it? Select with the number corresponding to your current time zone (Military Time). This will reset the cycle your daily workout and race multiplier. You MUST not have completed a daily workout and 0 miles, before applying this setting.**";

    var minutes = date.getMinutes();
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    var applysetting = function () {
      if (userdata["dailyworkout"] || userdata["mileage"][0] == 0) {
        require(gtf.EMBED).alert({ name: "❌ Invalid", description: "You can only apply this setting when you have not completed a daily workout and have 0 mileage.", embed: "", seconds: 3 }, msg, userdata);
          return "ERROR"
        }
      userdata["settings"]["TIMEOFFSET"] = query["number"] - 1;
      stats.setmileage(0, 0, userdata);
      stats.addracemulti(-100, userdata)
      userdata["dailyworkout"] = true;
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Local time has been set to **" + pageargs["list"][query["number"] - 1] + "**." + "\n⚠ Daily workout and race multiplier have been reset."}, userdata);
    };
    pageargs["list"] = []
    for (var index = 0; index < 24; index++) {
      var localTime = date.getTime();
      var localOffset = date.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = index;
      var usertime = utc + 3600000 * offset;
      usertime = new Date(usertime);

      pageargs["list"].push(usertime.getHours() + ":" + minutes);
    }
    pageargs["list"] = pageargs["list"].map(function(x, i) {
      if (userdata["settings"]["TIMEOFFSET"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Time Zones (" + pageargs["list"].length + " Items)__");
    
  }

  if (query["options"] == "icons") {
    pageargs["footer"] = "❓ **Select the menu icons corresponding from the list above.**";
    pageargs["list"] = [
    "Default | ⬜ ⬛",
    "White | ⬜ ⬛",
    "Black | ⬛ ⬜",
    "Red | 🟥 ⬛",
    "Orange | 🟧 ⬛",
    "Yellow | 🟨 ⬛",
    "Green | 🟩 ⬛",
    "Blue | 🟦 ⬛",
    "Purple | 🟪 ⬛",
    "Brown | 🟫 ⬛"].map(function(x, i) {
      var bar = x.split(" | ")[1].split(" ")
      var select = bar[0]
      console.log(bar)
      console.log(select)
      if (userdata["settings"]["ICONS"]["select"] == select && userdata["settings"]["ICONS"]["bar"][0] == bar[0] && userdata["settings"]["ICONS"]["bar"][1] == bar[1]) {
        return x + " " + "✅"
      }
      return x
    })
  
  embed.setTitle("⚙ __GTF Settings - Menu Icons (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      /*
      if (pageargs["list"][query["number"] - 1].includes("Lv.10")) {
        if (!require(gtf.EXP).checklevel(10, embed, msg, userdata)) {
          return "ERROR"
        }
      }
      */
      var bar = pageargs["list"][query["number"] - 1].split(" | ")[1].split(" ")
      var select = bar[0]
      
      userdata["settings"]["ICONS"] = {select:select, bar: bar};
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Menu Icons** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "SUCCESS";
    };
  }

  if (query["options"] == "tips") {
   pageargs["footer"] = "❓ **Enable or disable information/tips from some commands.**";
    pageargs["list"] = [
      "Enabled",
      "Disabled"
    ].map(function(x, i) {
      if (userdata["settings"]["TIPS"] == i) {
        return x + " " + "✅"
      }
      return x
    })
     embed.setTitle("⚙ __GTF Settings - Tips (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["TIPS"] = query["number"] - 1;
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Tips has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "SUCCESS";
    };
  }
  
  if (query["options"] == "menuselect") {
   pageargs["footer"] = "❓ **Select a type of buttons to navigate through in most menus. Arrows is where you select up and down each selection; Numbers is where you select via the numbers associated with the current row.**";
    pageargs["list"] = [
      "Arrows",
      "Numbers"
    ].map(function(x, i) {
      if (userdata["settings"]["MENUSELECT"] == i) {
        return x + " " + "✅"
      }
      return x
    })
     embed.setTitle("⚙ __GTF Settings - Menu Selector (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["MENUSELECT"] = query["number"] - 1;
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Menu Selector has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "SUCCESS";
    };
  }

  if (query["options"] == "displaygrid") {
    pageargs["footer"] = "❓ **Select the type of names to display while racing with opponents.**";
    pageargs["list"] = [
      "Car",
      "Driver"
    ].map(function(x, i) {
      if (userdata["settings"]["GRIDNAME"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Grid Display Names (" + pageargs["list"].length + " Items)__");
    
    var applysetting = function () {
      userdata["settings"]["GRIDNAME"] = query["number"] - 1;
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Your **Grid Display Names** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "SUCCESS";
    };
  }
  if (query["options"] == "reset") {
      userdata["settings"] = require(gtf.GTF).defaultsettings
      require(dir + "commands/settings").execute(msg, {options:"list", extra:"Settings has been reset to default."}, userdata);
      return "SUCCESS";
  }
  
  if (!gtftools.betweenInt(query["number"], 1, pageargs["list"].length + 1)) {
    if (typeof query["number"] !== "undefined") {
      require(gtf.EMBED).alert({ name: "⚠ Invalid Number", description: "Invalid arguments.", embed: "", seconds: 3 }, msg, userdata);
      return
    }
  } else {
    if (pageargs["list"][query["number"] - 1].includes("✅")) {
      require(gtf.EMBED).alert({ name: "❌ Current Setting", description: "You already have this current setting.", embed: "", seconds: 3 }, msg, userdata);
      return
    }
    applysetting();
    return "SUCCESS";
  }

  pageargs["text"] = gtftools.formpage(pageargs, userdata);
  pageargs["selector"] = "number";
  gtftools.formpages(pageargs, embed, msg, userdata);
  return "PAGES";
};