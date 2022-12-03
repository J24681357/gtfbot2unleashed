var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "sponsors",
  title: "GTF Sponsors",
  cooldown: 3,
  level: 5,
  channels: ["testing"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: [
    "",
  ],
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
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    /* Setup */
    var results2 = "";
    var select = "";
    var type = ""

    if (parseInt(query["type"]) == 1) {  
      type = "Cars";
    }

    if (parseInt(query["type"]) == 2) {
      type = "Rims";     
    }

   if (parseInt(query["type"]) == 3) {  
      type = "Paints";
    }

    if (query["options"] == "list") {
      delete query["number"]
      delete query["type"]
      embed.setTitle("🏳 __GTF Sponsors__");
      var list = ["**__Cars__**", "**__Rims__**", "**__Paints__**"]
      pageargs["rows"] = 10;
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Sponsors**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      stats.addcount(userdata);
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "type"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    
    if (query["options"] == "type") {
      delete query["number"]
      delete query["type"]
      embed.setTitle("🏳 __GTF Sponsors - " + type + "__");
      var list = require(gtf.SPONSORS).find({"types":[type]}).map(x => x["name"] + " " + emote.exp + " `Lv." + x["level"] + "`")
      pageargs["rows"] = 10;
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Select a sponsor to view.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      stats.addcount(userdata);
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "view"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

     if (query["options"] == "view") {
      var sponsor = require(gtf.SPONSORS).find({name:[query["name"]]})[0]
      if (!require(gtf.EXP).checklevel(sponsor["level"], embed, msg, userdata)) {
          return
      }
      embed.setTitle("🏳 " + "__**" + sponsor["name"] + "**__")
      results = "__**Requirements**__" + "\n" + 
      "⭐"+ "Race with any **" + sponsor["name"] + "** " + sponsor["type"] + " in Career/Arcade mode" +
      "\n\n" +
      emote.credits + " **Credit Bonus: **" + sponsor["percent"] + "%"
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "\n" + "**❓ This contains detailed information about the sponsor.**"
      }
      embed.setDescription(results + pageargs["footer"]);
      if (stats.sponsor(userdata)["name"] == sponsor["name"]) {
       var emojilist = [
  { emoji: "❌", 
  emoji_name: "In Sponsorship", 
  name: '', 
  extra: "",
  button_id: 0 }
]
      } else {
        var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Accept Offer', 
  extra: "",
  button_id: 0 }
]
      }
var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
       require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, func)
       
       function func(msg) {
        function accept() {
         stats.addsponsor(sponsor, userdata)
         require(gtf.EMBED).alert({ name: "✅ Success", description: "You have signed a new sponsorship: **" + sponsor["name"] + "**", embed: embed, seconds: 0 }, msg, userdata);
        }
    
        var functionlist = [accept]

        gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    } 

        if (query["options"] == "accept") {
      var sponsor = require(gtf.SPONSORS).find({name:[query["name"]]})[0]
      results = "Accept **" + sponsor["name"] + "** sponsorship?"
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "\n" + "**❓ This contains detailed information about the sponsor.**"
      }
      embed.setDescription(results + pageargs["footer"]);
       var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Yes', 
  extra: "",
  button_id: 0 }
]
var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
       require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, func)
       
       function func(msg) {
        function yes() {
          
        }
    
        var functionlist = [yes]

        gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    }
    

  }
};
