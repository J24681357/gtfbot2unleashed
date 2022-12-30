var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "driver",
  title: "🎨 GTF Auto - Driving Gear",
  license: "N", level: 0,
  channels: ["testing"],

  availinmaint: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
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

    var results2 = "";
    var select = require(gtf.PAINTS).find({ type: "Gloss" });

    if (typeof query["number"] !== 'undefined') {
      driverpaint("")
      return
    }
    stats.loadavatarimage(embed, userdata, driverpaint)
    function driverpaint(attachment) {
    pageargs["image"].push(attachment)

     if (query["type"] == "visor" || parseInt(query["type"]) == 1) {
      var type = "Visor";
    }
    if (query["type"] == "helmet" || parseInt(query["type"]) == 2) {
      var type = "Helmet";
    }
      

    if (query["type"] == "list") {
      delete query["number"]
      
      embed.setTitle("🎨 __GTF Auto - Driving Gear__")
      console.log(userdata["driver"]["helmetlogo1"])
      var list = ["__**Visor Paint**__", 
      "__**Helmet Paint**__" + "/n" +
        `[Top Logo URL](${userdata["driver"]["helmetlogo1"]} 'optional hovertext')` + "/n" + 
                  `[Middle Logo URL](${userdata["driver"]["helmetlogo2"]} 'optional hovertext')` + "/n" + 
                  `[Bottom Logo URL](${userdata["driver"]["helmetlogo3"]} 'optional hovertext')` + "/n"]

      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ ****"
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

    if (query["type"] == "top_logo_url") {
      userdata["driver"]["helmetlogo1"] = query["link"]
      require(dir + "commands/driver").execute(msg, {type:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
    if (query["type"] == "top_logo") {
      userdata["driver"]["helmetlogo1"] = query["image"]
      require(dir + "commands/driver").execute(msg, {type:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
      if (query["type"] == "middle_logo_url") {
      userdata["driver"]["helmetlogo2"] = query["link"]
      require(dir + "commands/driver").execute(msg, {type:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
    if (query["type"] == "middle_logo") {
      userdata["driver"]["helmetlogo2"] = query["image"]
      require(dir + "commands/driver").execute(msg, {type:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
      
    if (select.length != 0 && query["number"] === undefined) {
       delete query["number"]

     var select2 = select.map(function (x, i) {
       if (type == "Visor") {
         var cond = userdata["driver"]["visorcolor"] == x["name"] ? "✅" : ""
       } else if (type == 'Helmet') {
         var cond = userdata["driver"]["helmetcolor"] == x["name"] ? "✅" : ""
       } 
      return x["name"] + " " + cond;
    });
    embed.setTitle("🎨 " + "__" + type + " Paints (" + select2.length + " Items)__");
        
    pageargs["list"] = select2;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ ****"
      }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    gtftools.formpages(pageargs, embed, msg, userdata);
    return;
    }
    var paint = select[query["number"] - 1];
    paint["type"] = type
    paint["cost"] = 0
      /*
        var cond = require(gtf.PAINTS).checkpaintsavail(paint, car);
      */
      
  /*
     if (cond.includes("✅")) {
          require(gtf.EMBED).alert({ name: "❌ Same Paint", description: "**" + paint["type"] + " " + paint["name"] + "** is already applied." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        
    */
      require(gtf.MARKETPLACE).purchase(msg.member, paint, "DRIVER", embed, msg, userdata);
      return;
      }
  }
}
