var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "profile",
  title: "My Profile",
  cooldown: 3,
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: false,
  description: [],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
        text: "",
        list: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 4,
        page: 0,
        numbers: false,
        buttons: true,
        carselectmessage: false,
        image: [],
        footer: "",
        special: "",
        other: "",
      }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    //////////EXP//////////
    var progress = userdata["settings"]["PROGRESSBAR"][0];
    var progressb = userdata["settings"]["PROGRESSBAR"][1];
    var expbar = [progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb];
    
    var nextlevel = stats.level(userdata) + 1;
    if (nextlevel >= 50) {
      nextlevel = 50;
    }
    var nextlevelexp = require(gtf.LISTS).gtfexp[nextlevel.toString()]["exp"];

    var curr = stats.level(userdata)
    var currexp = stats.exp(userdata);
    var currlevelexp = require(gtf.LISTS).gtfexp[curr.toString()]["exp"];

    for (var i = 0; i < expbar.length; i++) {
      if (currlevelexp <= currexp) {
        currlevelexp += nextlevelexp / 10
        expbar[i] = progress;
      }
    }

    //////////////////////

    embed.setTitle("👤 " + "__My Profile__");

    results =
      "__**Credits**__" +
      "\n" +
      "**" +
      gtftools.numFormat(stats.credits(userdata))+
      emote.credits +
      "**\n" +
      "__**Experience Points**__ " +
      "\n" +
      "**" +
      gtftools.numFormat(stats.exp(userdata)) +
      emote.exp +
      "**\n" +
      "Lv." +
      stats.level(userdata) +
      " " +
      expbar.join("") +
      " " +
      "Lv." +
      nextlevel +
      "\n" +
      "__**Total Distance Driven**__ " +
      "\n" +
      "**" + gtftools.numFormat(stats.totalmileage("KM", undefined, userdata))+
      "** km | " +
      "**" + gtftools.numFormat(stats.totalmileage("MI", undefined, userdata)) +
      "** mi " +
      emote.mileage +
      "\n" +
     "__**Total Play Time**__ " +
      "\n" + stats.totalplaytime(userdata) +
      "\n"
    

    embed.setDescription(results);
    if (userdata["id"] == "237450759233339393") {
      next("")
      //stats.loadavatarimage(embed, userdata, next)
    } else {    
      next("")
    }
  function next(image) {
    if (image.length == 0) {
      var attachment = []
embed.setThumbnail(msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL({format: 'jpg', size: 1024}));
    } else {
      var attachment = [image]
      embed.setThumbnail("attachment://image.png")
    }
     embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
    var emojilist = [
  { emoji: "👤", 
  emoji_name: "👤", 
  name: 'Profile', 
  extra: "",
  button_id: 0 },
  { emoji: "🚘", 
  emoji_name: "🚘", 
  name: 'Garage', 
  extra: "",
  button_id: 1 },
  { emoji: "🏆", 
  emoji_name: "🏆", 
  name: 'Career Progress', 
  extra: "",
  button_id: 2 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   
    require(gtf.DISCORD).send(msg, {embeds:[embed], components: buttons, files: attachment}, profilefunc)
    
    function profilefunc(msg) {
      function careerprofile() {
        embed.setTitle("__Career Progress__");
        var list1 = [
          ["__Beginner__", require(gtf.CAREERRACES).find({types: ["b"] })],
          ["__Amateur__", require(gtf.CAREERRACES).find({types: ["a"] })],
          ["__IC League__", require(gtf.CAREERRACES).find({types: ["ic"] })],
          ["__IB League__", require(gtf.CAREERRACES).find({types: ["ib"] })],
          ["__IA League__",require(gtf.CAREERRACES).find({types: ["ia"] })],
          ["__S League__", require(gtf.CAREERRACES).find({types: ["s"] })],
          ["__Kart__", require(gtf.CAREERRACES).find({types: ["kart"] })],
          ["__Rally__", require(gtf.CAREERRACES).find({types: ["rally"] })],  ["__Formula__", require(gtf.CAREERRACES).find({types: ["formula"] })]
        ];
        
        results2 = "";
        for (var level = 0; level < list1.length; level++) {
          var results2 = results2 + list1[level][0] + "\n";
          var certainraces = list1[level][1];
          var array = Object.keys(certainraces);
          for (var i = 0; i < array.length; i++) {
            results2 = results2 + certainraces[array[i]]["eventid"] + " " + stats.eventstatus(certainraces[array[i]]["eventid"], userdata) + " ";
          }
          results2 = results2 + "\n";
        }

        embed.setDescription(results2);
        msg.edit({embeds:[embed], components: buttons})
      }
      function profile() {
        embed.setTitle("👤 " + "__My Profile__");
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      function garageprofile() {
        embed.setTitle("👤 " + "__My Profile__");
        var favcar = userdata["garage"].sort((x, y) => parseInt(y["totalmileage"]) - parseInt(x["totalmileage"]))[0]
        var garagevalue = 0
        userdata["garage"].forEach(car => {
          var value = require(gtf.PERF).perf(car, "GARAGE")["value"]
    garagevalue += value;
})
        var results = "**Garage Count:** " +
      stats.garagecount(userdata) +
      " Cars" + "\n" + 
      "**Favorite Car:** " + favcar["name"] + " " + "**" + favcar["totalmileage"][userdata["settings"]["MILEAGE"]] + ["km", "mi"][userdata["settings"]["MILEAGE"]] + "**" + emote.mileage + "\n" + 
        "**Total Garage Value:** " + "**" + gtftools.numFormat(garagevalue) + "**" + emote.credits
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      var functionlist = [profile, garageprofile, careerprofile]
      
       gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    }
    return;
  }
  }
  
};
