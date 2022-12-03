var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "wheels",
  title: "🛞 GTF Auto - Wheels",
  cooldown: 3,
  level: 0,
  channels: ["testing", "gtf-mode"],

  delete: false,
  availinmaint: false,
  requirecar: true,
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
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
   
    var results2 = "";
    var select = "";
    var car = stats.currentcar(userdata);
    var ocar = require(gtf.CARS).get({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })

       if (ocar["type"] == "Redbull X" || ocar["type"] == "Kart" || ocar["type"].includes("Kart")) {
      require(gtf.EMBED).alert({ name: "❌ Unavailable", description: "This car cannot have custom wheels.", embed: "", seconds: 3 }, msg, userdata);
      return
    }
    if (typeof query["number"] !== 'undefined') {
      wheels("")
      return
    }
    stats.loadcarimage(car, embed, userdata, wheels)
    function wheels(attachment) {
    pageargs["image"].push(attachment)
      
    if (query["make"] == "list" || query["options"] == "list") {
      delete query["number"]
      
      var list = require(gtf.WHEELS).list("makes").map(function(i) {
        return i + " `🛞" + require(gtf.WHEELS).find({ make: i }).length + "`";
      })
      embed.setTitle("🛞 __GTF Auto - Wheels (" + list.length + " Makes)__")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Choose a wheel manufacturer from the list above with the buttons.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["rows"] = 10;
      pageargs["selector"] = "make"
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    
    var make = query["make"];
    select = require(gtf.WHEELS).find({ make: make });
    if (select.length != 0 && query["number"] === undefined) {
       delete query["number"]

       var select = select.map(function (x) {
      var cond = require(gtf.WHEELS).checkwheelsavail(x, car);
      if (cond[0].includes("✅")) {
        return cond[0] + " " + x["make"] + " " + x["name"];
      } else if (cond[0].includes("📦")) {
        return cond[0] + " " + x["make"] + " " + x["name"];
      } else {
      return "**" + gtftools.numFormat(x["cost"]) + "**" + emote.credits + " " + x["make"] + " " + x["name"];
      }
    });
    embed.setTitle("🛞" + " __" + make + " (" + select.length + " Items)__");
    
    select.unshift("Default")
    
    pageargs["list"] = select;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Select rims corresponding with the numbers above with the buttons.\nYou can apply custom wheels to your cars for visual purposes.**"
      }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["numbers"] = true
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    gtftools.formpages(pageargs, embed, msg, userdata);
    return;
    }

    var number = query["number"];
    if (number == 1) {
      number = "S"
    }
    
    if (number != "S") {
        if (!gtftools.betweenInt(number, 1, select.length + 1)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
            return
          }
    }
    if (number == "S") {
        var wheel = { name: "Default", type: select[0]["make"], cost: 0 };
      } else {
        var wheel = select[number - 2];
      }
        var cond = require(gtf.WHEELS).checkwheelsavail(wheel, car);
        if (cond.includes("❌")) {
          require(gtf.EMBED).alert({ name: "❌ Wheels Unavailable", description: "**" + wheel["make"] + " " + wheel["name"] + "** is unavailable for **" + car["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
        if (cond.includes("✅")) {
          require(gtf.EMBED).alert({ name: "❌ Same Rims", description: "**" + wheel["make"] + " " + wheel["name"] + "** is already applied for **" + car["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      require(gtf.MARKETPLACE).purchase(msg.member, wheel, "WHEEL", embed, msg, userdata);
      return;
      }
}
}