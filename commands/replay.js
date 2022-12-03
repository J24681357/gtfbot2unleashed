var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "replay",
  title: "Replay Theater",
  cooldown: 3,
  level: 0,
  aliases: ["r", "replays"],
  channels: ["gtf-mode", "testing", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: true,
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
      numbers: true,
      buttons: true,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    stats.load("REPLAYS", userdata, replay)
    
    function replay(replaystats) {
      replaystats = replaystats["replays"]
      if (replaystats.length == 0) {
        require(gtf.EMBED).alert({ name: "❌ No Replays", description: "There are no replays saved.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }

      if (query["options"] == "list" || query["options"] == "info") {
        delete query["number"]
        
      embed.setTitle("🎥 __Replay Theater (" + replaystats.length + " / " + require(gtf.GTF).replaylimit + " Replays)__");

      var list = replaystats.map(function (replay, index) {
          return "`🕛ID:"+ (index + 1) + "` " + replay["title"] + " `" + replay["date"] + "`";
        });
        pageargs["list"] = list;
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "**❓ Choose a number that corresponds to the replays above. Replays can be saved from any session (Arcade races, career races, time trials, etc).**"
        }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        pageargs["selector"] = "number"
        pageargs["query"] = query
        gtftools.formpages(pageargs, embed, msg, userdata);
        return

      }
      if (query["options"] == "clear") {
        var emojilist = [
  { emoji: emote.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        embed.setDescription("⚠ Clear all of your saved replays? This is permanent.");
        embed.setColor(0xffff00);
        require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, replayfunc)
        
        function replayfunc(msg){
          function clearreplay() {
            require(gtf.REPLAY).clear(userdata);
            require(gtf.EMBED).alert({ name: "✅ Success", description: "Replay data cleared.", embed: embed, seconds: 3 }, msg, userdata);
          }
          var functionlist = [clearreplay]

          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "delete") {
        var number = query["number"];
        if (!gtftools.betweenInt(number, 1, replaystats.length + 1)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your replay theater.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = replaystats[number-1]["title"]
        embed.setDescription("⚠ Delete " + "`🕛ID:" + number + "` " + "**" + name + "**? This may take a while.");
          var emojilist = [
  { emoji: emote.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, replayfunc1)
        
        function replayfunc1(msg) {
          function deletereplay() {
            require(gtf.REPLAY).delete(number-1, replaystats, userdata);
             setTimeout(function() {require(dir + "commands/" + pageargs["command"]).execute(msg, {options:"list", extra:"Deleted " + "`🕛ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletereplay]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "load") {
        var number = query["number"];
        if (!gtftools.betweenInt(number, 1, replaystats.length + 1)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your replay theater.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var replaydetails = replaystats[number-1];
        
          embed.setTitle("🎥 __" + replaydetails["title"] + "__");
          embed.setDescription(replaydetails["results"] + "\n\n" + replaydetails["racedetails"]);
        var emojilist = [{
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Session Details',
    extra: "",
    button_id: 0
  },
  {
    emoji: emote.cargrid,
    emoji_name: "gtfcargrid",
    name: 'Grid Results',
    extra: "",
    button_id: 1
  },
    { emoji: "🗑️", 
  emoji_name: "🗑️", 
  name: 'Remove Replay', 
  extra: "",
  button_id: 2 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
  embed.setFooter({text: "Replay | " + replaydetails["date"]})

  require(gtf.DISCORD).send(msg, {embeds: [embed], components:buttons}, replayfunc2)
  function replayfunc2(msg) {

              function grid() {
                embed.setDescription(replaydetails["grid"]);
                msg.edit({ embeds: [embed], components:buttons});
              }
              function trackdetails() {
                embed.setDescription(replaydetails["results"] + "\n\n" + replaydetails["racedetails"]);
                msg.edit({ embeds: [embed], components:buttons});
              }
                 function deletereplay() {
         require(dir + "commands/replay").execute(msg, {options:"delete", number:parseInt(query["number"])}, userdata);
        }
              var functionlist = [trackdetails, grid, deletereplay]
            gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
            }
      }
    }
  }
};
