var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "settings",
  title: "GTF Settings",
  cooldown: 5,
  license: "N", level: 0,
  channels: ["testing", "gtf-mode","gtf-demo"],

  availinmaint: false,
  delete: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  description: [],
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
      buttons: true,
      carselectmessage: false,
      image: [],
      footer: "❓ **For each setting, select an item (or number) corresponding from a setting's list.**",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    embed.setTitle("⚙ __GTF Settings__");



    if (query["options"] == "list") {
      delete query["number"]
        var units = ["Kilometers", "Miles"];
        var enabled = ["Enabled", "Disabled"]
        var menutype = ["Arrows", "Numbers"]
        var gridname = ["Car", "Driver"]
      var list = [
         "__**Embed Color**__ " + "`" + userdata["settings"]["COLOR"] + "`",
        "__**Dealership Catalog Sort**__ " + "`" + userdata["settings"]["DEALERSORT"] + "`",
        "__**Garage Sort**__ " + "`" + userdata["settings"]["GARAGESORT"] + "`",
        "__**Grid Display Names**__ " + "`" + gridname[userdata["settings"]["GRIDNAME"]] + "`",
        "__**Menu Icons**__ " + userdata["settings"]["ICONS"]["select"] + " " + userdata["settings"]["ICONS"]["bar"].join(" "),
        "__**Menu Selector**__ " + 
 "`" + menutype[userdata["settings"]["MENUSELECT"]] + "`",
        "__**Metric Units**__ " + "`" + units[userdata["settings"]["UNITS"]] + "`",
        "__**Daily Workout - Time Zone Offset**__ " + "`"+ userdata["settings"]["TIMEOFFSET"] + "`",
        "__**Menu Tips**__ " + 
"`" + enabled[userdata["settings"]["TIPS"]] + "`",
        "🔁 __**Reset To Default Settings**__ ",
        "⭕ __**Delete Save Data**__ ",
      ];

      pageargs["list"] = list;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "options"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    if (!isNaN(query["options"])) {
  query["options"] = ["color", "dealersort", "garagesort", "displaygrid", "icons", "menuselect", "units", "time", "tips", "reset", "deletesavedata"][parseInt(query["options"]) - 1]
    }

    var results = require(gtf.SETTINGS).settingsmenu(query, pageargs, embed, msg, userdata)

      if (results == "PAGES" || results == "SUCCESS" || results == "INVALID" || results == "ERROR") {
        return;
      }

    require(gtf.EMBED).alert({ name: "❌ Error", description: "Invalid arguments.", embed: embed, seconds: 3 }, msg, userdata);
  },
};
