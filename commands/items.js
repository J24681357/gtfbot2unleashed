var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "items",
  level: 0,
  aliases: ["inv", "inventory", "gifts"],
  channels: ["testing", "gtf-mode","gtf-demo"],

  availinmaint: false,
  requirecar: true,
  requireuserdata: true,
  usedduringrace: false,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 5,
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

    if (stats.gifts(userdata).length == 0) {
      require(gtf.EMBED).alert({ name: "❌ No Items", description: "You do not have any items available.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }

    if (!isNaN(query["options"])) {
      query["options"] = "redeem"
      query["number"] = parseInt(query["number"]);
    }
    if (query["options"] == "latest") {
      query["options"] = "redeem"
      query["number"] = 1;
    }

    if (query["options"] == "accept" || query["options"] == "redeem") {
      var number = query["number"];
      if (!gtftools.betweenInt(query["number"], 1, stats.gifts(userdata).length)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid Number", description: "This number does not exist in your inventory.", embed: "", seconds: 3 }, msg, userdata);
      return
      }
      
      var gift = stats.gifts(userdata)[number - 1];
      if (gift[0] == "CAR") {
          if (require(gtf.EMBED).checkgarageerror(embed, msg, userdata)) {
      return;
        }
      }
      results = "🎁 Do you want to redeem **" + gift[1]["name"] + "**?";
      embed.setDescription(results);
      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
              var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: " ",
  button_id: 0 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, itemsfunc)
   
   function itemsfunc(msg) {
        function accept() {
          stats.gift("✅ " + gift[1]["name"] + " redeemed!", gift, embed, msg, userdata);
          return;
        }

    var functionlist = [accept];
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    }

    if (query["options"] == "delete" || query["options"] == "remove") {
      var number = query["number"];
      if (!gtftools.betweenInt(query["number"], 1, stats.gifts(userdata).length)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid Number", description: "This number does not exist in your inventory.", embed: "", seconds: 3 }, msg, userdata);
      return
      }
      
      var gift = stats.gifts(userdata)[number - 1];
      results = "⚠ Do you want to remove **" + gift[1]["name"] + "** from your inventory? This is permanent.";
      embed.setDescription(results);
      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
              var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: " ",
  button_id: 0 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, itemsfunc)
   
   function itemsfunc(msg) {
        function deleted() {
          stats.removegift(number, userdata)
          require(gtf.EMBED).alert({ name: "✅ Success", description: gift[1]["name"] + " removed!", embed: embed, seconds: 3 }, msg, userdata);
          return;
        }
         var functionlist = [deleted];
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
   }    
      return;
    }

       if (query["options"] == "clear") {
      results = "⚠ Do you want to clear all items? This is permanent and you will not redeem any rewards from them.";
      embed.setDescription(results);
      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
  var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: " ",
  button_id: 0 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, itemsfunc2)
   
   function itemsfunc2(msg) {
        function clear() {   
          stats.cleargifts(userdata)
          require(gtf.EMBED).alert({ name: "✅ Success", description: "All items removed.", embed: embed, seconds: 3 }, msg, userdata);
          return;
        }
  var functionlist = [clear];
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
   }
    
      return;
    }

    if (query["options"] == "list") {
      delete query["number"]
    embed.setTitle("🎁 __My Items: " + stats.gifts(userdata).length + " / " + require(gtf.GTF).giftlimit + " Items__");
      var list = stats.gifts(userdata).map(function (item) {
        var emoji = ""
        if (item[0] == "CAR") {
          emoji = "🚘"
        }
        return "__**" + item[1]["author"] + "**__" + "/n" + item[1]["name"] + " " + emoji
      });
    pageargs["list"] = list;
    if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "**❓ Select an item to redeem from the list associated below with the buttons.**"
    }
    if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
    }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    gtftools.formpages(pageargs, embed, msg, userdata);
    }
    }
};
