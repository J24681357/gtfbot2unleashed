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

    var expbar = require(gtf.EXP).createexpbar(userdata)
    var nextlevel = (stats.level(userdata) + 1) >= 50 ? 50 : (stats.level(userdata) + 1)
  
    embed.setTitle("👤 " + "__My Profile__");

    results =
      "__**License:**__ " + gtftools.toEmoji(userdata["license"]) + "\n" +
      "__**Current Credits:**__ "
      "**" +
      gtftools.numFormat(stats.credits(userdata))+
      emote.credits +
      "**" + "\n" +
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
      "Lv." + nextlevel +
      "\n" +
      "__**Total Distance Driven**__" +
      "**" + stats.totalmileageuser(userdata) +
      " " + stats.mileageunits(userdata) + "** " + 
      emote.mileage +
      "\n" +
     "__**Total Play Time**__ " +
      "\n" + stats.totalplaytime(userdata) +
      "\n\n" +
      "**Total Races:** " + userdata["stats"]["numraces"] + "\n" + 
      "**# of Wins:** " + userdata["stats"]["numwins"]

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
        var favcar = userdata["garage"].sort((x, y) => parseFloat(y["totalmileage"]) - parseFloat(x["totalmileage"]))[0]
        var garagevalue = 0
        userdata["garage"].forEach(car => {
          var value = require(gtf.PERF).perf(car, "GARAGE")["value"]
    garagevalue += value;
})
        var numparts = userdata["stats"]["numwins"]
        var results = "**Garage Count:** " +
      stats.garagecount(userdata) +
      " Cars" + "\n" + 
      "**Favorite Car:** " + favcar["name"] + " " + "**" + stats.mileagecaruser(favcar, userdata) + stats.mileageunits(userdata) + "**" + emote.mileage + "\n" + 
        "**Total Garage Value:** " + "**" + gtftools.numFormat(garagevalue) + "**" + emote.credits + "\n" + 
        "**# of Parts Purchased:** " + "**" + gtftools.numFormat(numparts) + "**" + emote.credits
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
