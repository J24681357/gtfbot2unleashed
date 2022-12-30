var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "setup",
  title: "🛠 Car Setup",
  cooldown: 3,
  license: "N", level: 6,
  channels: ["testing", "gtf-mode", "gtf-test-mode"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: true,
  description: ["!setup - Displays the list of tunable parts out of the parts in your current car.", "!setup ['type'] - Opens the settings of [\"type\"] for your current car. \n⚠ Stock parts are not tunable."],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 7,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    var gtfcar = stats.currentcar(userdata);
    var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]], year: [gtfcar["year"]] })
    embed.setThumbnail(ocar["image"][stats.carimage(gtfcar)])

    embed.setTitle("🛠 __Car Setup__");

    var selectedtype = false;
    var list = [];

    var engine = require(gtf.PARTS).find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" });
    var transmission = require(gtf.PARTS).find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" });
    var turbo = require(gtf.PARTS).find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" });
    var suspension = require(gtf.PARTS).find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" });
    var aerokit = require(gtf.PARTS).find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" });

    /*if (engine.length != 0) {
      list.push("__**Engine**__ - !tuning [engine|eng|e]")
    }*/
    if (transmission.length != 0) {
      list.push("__**Transmission**__");
    }
    if (suspension.length != 0) {
      list.push("__**Suspension**__");
    }
    if (aerokit.length != 0) {
      list.push("__**Aerodynamics**__");
    }
    /*
    if (turbo.length != 0) {
      list.push("__**Turbo**__ - !tuning [turbo|tu]")
    }*/

    if (list.length == 0) {
      require(gtf.EMBED).alert({ name: "❌ No Tunable Parts", description: "There are no custom parts to tune for the **" + gtfcar["name"] + "**.", embed: "", seconds: 0 }, msg, userdata);
      return;
    }
    var part = [];

  
    if (query["type"] == "list") {
    delete query["number"]
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **Select a type (or number) corresponding from the list above.\nYou can edit setups for some custom parts in your current car.**";
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["selector"] = "type";
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    } 

      if (query["type"] == "transmission" || query["type"] == "Transmission" || query["type"] == "trans" || query["type"] == "tr") {
          part = transmission[0];
    }

    if (query["type"] == "suspension" || query["type"] == "Suspension" || query["type"] == "susp" || query["type"] == "su") {
          part = suspension[0];
    }

    if (query["type"] == "Aero Kit" || query["type"] == "Aero Kits" || query["type"] == "Aero" || query["type"] == "aero") {
          part = aerokit[0];
    }
      
      if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ Use the left and right arrows to adjust the setups for each part.\n To apply changes, click the " + emote.yes + " emote.**"
      }
      embed.setTitle("🛠 __Car Setup (" + part["type"] + ")__");

      var select = 0;
      var reset = true;
      var index = 0;

      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);

      stats.addcount(userdata);
      var emojilist = [
        { emoji: emote.yes, emoji_name: "Yes", name: "", extra: "", button_id: 0 },
        {
          emoji: emote.leftarrow,
          emoji_name: "leftarrow",
          name: "",
          extra: "",
          button_id: 1,
        },
        {
          emoji: emote.rightarrow,
          emoji_name: "rightarrow",
          name: "",
          extra: "",
          button_id: 2,
        },
        {
          emoji: emote.uparrow,
          emoji_name: "uparrow",
          name: "",
          extra: "",
          button_id: 3,
        },
        {
          emoji: emote.downarrow,
          emoji_name: "downarrow",
          name: "",
          extra: "",
          button_id: 4,
        }, 
        {
          emoji: "🔄",
          emoji_name: "🔄",
          name: "Reset",
          extra: "",
          button_id: 5,
        }
      ];
      var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

  if (part.length == 0) {
      require(gtf.EMBED).alert({ name: "❌ Default Part", description: "This default part can not be tuned on **" + gtfcar["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }

      var list = require(gtf.PARTS).tuninglist(part, gtfcar, embed, msg, userdata);
    list[list.length - 1] = list[list.length - 1] + "/n**Calculation: " + require(gtf.PARTS).previewpart(part, gtfcar, "GARAGE")["fpp"] + emote.fpp + "**";
      //list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);

      require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons }, tuningf)
      
      function tuningf(msg) {
        function back() {
          gtfcar["perf"][part["type"].toLowerCase()]["tuning"][select]--;
          var list = require(gtf.PARTS).tuninglist(part, gtfcar, embed, msg, userdata);
          part["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"]

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select]
list[list.length - 1] = list[list.length - 1] + "/n**Calculation: " + require(gtf.PARTS).previewpart(part, gtfcar, "GARAGE")["fpp"] + emote.fpp + "**";
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }
        function selectoption() {
          stats.currentcar(userdata)[part["type"].toLowerCase()]["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"];
          stats.updatefpp(stats.currentcar(userdata), userdata)
          require(dir + "commands/setup").execute(msg, {type:"list", extra: "**" + part["type"] + "** settings saved for **" + gtfcar["name"] + "**."}, userdata);
          stats.save(userdata)
        }

        function next() {
          gtfcar["perf"][part["type"].toLowerCase()]["tuning"][select]++;
          var list = require(gtf.PARTS).tuninglist(part, gtfcar, embed, msg, userdata);
          part["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"]

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select] 
   list[list.length - 1] = list[list.length - 1] + "/n**Calculation: " + require(gtf.PARTS).previewpart(part, gtfcar, "GARAGE")["fpp"] + emote.fpp + "**";
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function up() {
          var list = require(gtf.PARTS).tuninglist(part, gtfcar, embed, msg, userdata);

          select--;
          if (select <= -1) {
            select = list.length - 1;
          }

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function down() {
          var index = 0;

          var list = require(gtf.PARTS).tuninglist(part, gtfcar, embed, msg, userdata);
          select++;
          if (select >= list.length) {
            select = 0;
          }

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function reset() {
          var index = 0;
          select = 0;

          gtfcar["perf"][part["type"].toLowerCase()]["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"].map(function(x) {
            if (part["type"].toLowerCase() == "aero kits") {
              return 3
            } else {
            return 0
            }
          })

          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        var functionlist = [selectoption, back, next, up, down, reset];
        gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
      };

      return;
  },
};
