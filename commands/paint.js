var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "paint",
  title: "🎨 GTF Auto - Paints",
  cooldown: 3,
  license: "N", level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: ["!paint"],
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
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    

    var select = "";
    var gtfcar = stats.currentcar(userdata);
    var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]] })

    if (ocar["type"] != "Production" && ocar["type"] != "Aftermarket") {
      if (ocar["type"].includes("Race Car")) {
        if (ocar["livery"].length <= 1) {
        require(gtf.EMBED).alert({ name: "❌ No Liveries Available", description: "This car's livery can not be changed.", embed: "", seconds: 3 }, msg, userdata);
      return;
        }
      } else {
      require(gtf.EMBED).alert({ name: "❌ Paint Unavailable", description: "This car cannot be painted.", embed: "", seconds: 3 }, msg, userdata);
      return;
      }
    }
    if (typeof query["number"] !== 'undefined') {
      paint("")
      return
    }
    stats.loadcarimage(gtfcar, embed, userdata, paint)
    function paint(attachment) {
    pageargs["image"].push(attachment)

     if (query["type"] == "gloss" || query["type"] == "g" || query["type"] == "Gloss" || parseInt(query["type"]) == 1) {
      var type = "gloss";
    }
    if (query["type"] == "metallic" || query["type"] == "m" || query["type"] == "Metallic" || parseInt(query["type"]) == 2) {
      var type = "metallic";
    }
    if (query["type"] == "pearl" || query["type"] == "p" || query["type"] == "Pearl" || parseInt(query["type"]) == 3) {
      var type = "pearl";
    }
    if (query["type"] == "matte" || query["type"] == "ma" || query["type"] == "mt" || query["type"] == "Matte" || parseInt(query["type"]) == 4) {
      var type = "matte";
    }
    if (query["type"] == "chrome" || query["type"] == "Chrome" || parseInt(query["type"]) == 5) {
      var type = "chrome";
    }
    if (query["type"] == "special" || query["type"] == "Special" || parseInt(query["type"]) == 6) {
      var type = "special";
    }
    if (query["type"] == "liveries" || query["type"] == "Liveries" || parseInt(query["type"]) == 7 || query["type"] == "livery") {
      var type = "livery";
      if (!ocar["type"].includes("Race Car")) {
        require(gtf.EMBED).alert({ name: "❌ No Liveries Available", description: "Liveries can only be applied to selected race cars.", embed: "", seconds: 0 }, msg, userdata);
        return
      }
    }

    if (query["type"] == "list") {
      delete query["number"]
      
      embed.setTitle("🎨 __GTF Auto - Paints__")
      var list = ["__**Gloss Paints**__", 
      "__**Metallic Paints**__",
       "__**Pearl Paints**__",
        "__**Matte Paints**__",
        "__**Chrome Paints**__",
      "__**Special Paints**__/n",
      "__**Liveries**__" + " `🎨" + ocar["livery"].length + "`"
            ]

      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Choose a type of paint from the list above with the buttons.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["selector"] = "type"
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    select = require(gtf.PAINTS).find({ type: type });

    var type = select[0]["type"];
    if (select.length != 0 && query["number"] === undefined) {
       delete query["number"]
    if (type == "Livery") {
      
      pageargs["image"] = []
    var select = select.map(function (x, i) {
      pageargs["image"].push(ocar["image"][i+1])
      var cond = require(gtf.PAINTS).checkpaintsavail(x, gtfcar);
      var name = typeof ocar["livery"][i+1] === 'undefined' ? x["type"] + " " + x["name"] : ocar["livery"][i+1]
      return name + " " + cond;
    });
    select.unshift(ocar["livery"][0])
    pageargs["image"].unshift(ocar["image"][0])
    } else {
      if (ocar["type"].includes("Race Car")) {
        require(gtf.EMBED).alert({ name: "❌ Paint Unavailable", description: "This car cannot have custom paint chips.", embed: "", seconds: 3 }, msg, userdata);
      }
      
      select.unshift({ name: "Default", type: "", cost: 0 });
      var select = select.map(function (x, i) {
      var cond = require(gtf.PAINTS).checkpaintsavail(x, gtfcar);
      var name = x["type"] + " " + x["name"] 
      return "**" + require(gtf.MATH).numFormat(Math.round(x["cost"])) + "**" + emote.credits + " " + name + " " + cond;
    });
    }
    embed.setTitle("🎨 " + "__" + type + " Paints (" + select.length + " Items)__");
        
    pageargs["list"] = select;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Select a paint corresponding with the numbers above with the buttons.\nYou can paint your cars for visual purposes.**"
      }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    gtftools.formpages(pageargs, embed, msg, userdata);
    return;
    }

    var number = query["number"];
    

   if (!require(gtf.MATH).betweenInt(number, 1, select.length + 1)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
            return
          }
  if (number == 1) {
    var paint = { name: "Default", type: select[0]["type"], cost: 0 }
  } else {
      var paint = select[number - 1];
  }
    var cond = require(gtf.PAINTS).checkpaintsavail(paint, gtfcar);
      
        if (cond.includes("❌")) {
          require(gtf.EMBED).alert({ name: "❌ Paint Unavailable", description: "**" + paint["type"] + " " + paint["name"] + "** is unavailable for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
  
        if (cond.includes("✅")) {
          require(gtf.EMBED).alert({ name: "❌ Same Paint", description: "**" + paint["type"] + " " + paint["name"] + "** is already applied for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      
      require(gtf.MARKETPLACE).purchase(paint, "PAINT", "", embed, msg, userdata);
      return;
      }
  }
}
