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
  level: 0,
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

    embed.setTitle("⚙ __GTF Settings (7 Options)__");
    if (query["options"] == 1) {
      query["options"] = "progressbar";
    } else if (query["options"] == 2) {
      query["options"] = "dealersort";
    } else if (query["options"] == 3) {
      query["options"] = "garagesort";
    } else if (query["options"] == 4) {
      query["options"] = "displaygrid";
    } else if (query["options"] == 5) {
      query["options"] = "menuselect";
    } else if (query["options"] == 6) {
      query["options"] = "units";
    } else if (query["options"] == 7) {
      query["options"] = "time";
    } else if (query["options"] == 8) {
      query["options"] = "tips";
    } else if (query["options"] == 9) {
      query["options"] = "reset";
    }

    if (query["options"] == "list") {
      delete query["number"]
        var m = ["Kilometers", "Miles"];
        var n = ["Enabled", "Disabled"]
        var o = ["Arrows", "Numbers"]
        var grid = ["Car", "Driver"]
      var list = [
         "__**Accent Color**__ " + userdata["settings"]["PROGRESSBAR"].join("  "),
        "__**Dealership Catalog Sort**__ " + userdata["settings"]["DEALERSORT"],
        "__**Garage Sort**__ " + userdata["settings"]["GARAGESORT"],
        "__**Grid Display Names**__ " + grid[userdata["settings"]["GRIDNAME"]],
        "__**Menu Selector**__ " + o[userdata["settings"]["MENUSELECT"]],
        "__**Metric Units**__ " + m[userdata["settings"]["MILEAGE"]],
        "__**Time Zone Offset**__ " + userdata["settings"]["TIME OFFSET"],
        "__**Tips**__ " + n[userdata["settings"]["TIPS"]],
        "🔁 __**Reset To Default Settings**__ ",
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
    var results = require(gtf.SETTINGS).settingsm(query, pageargs, embed, msg, userdata)

      if (results == "PAGES" || results == "SUCCESS" || results == "INVALID" || results == "ERROR") {
        return;
      }

    require(gtf.EMBED).alert({ name: "❌ Error", description: "Invalid arguments.", embed: embed, seconds: 3 }, msg, userdata);
  },
};
