var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require("../../files/directories");
////////////////////////////////////////////////////

module.exports.intro = function (userdata, command, msg) {
  if (["dw", "dw4", "rcar", "rtrack", "rcourse", "gtf", "sr"].indexOf(command) + 1) {
    return "COMMAND";
  }

  if (typeof userdata["tutorial"] !== undefined) {
    if (userdata["tutorial"] == "Complete") {
      return "SUCCESS";
    } else {
      return doit();
    }
  } else {
    return doit();
  }

  function doit() {
    var embed = new EmbedBuilder();
    var author = msg.author;
    var userid = msg.author.id;
    var user = msg.author.username;
    var avatar = msg.author.displayAvatarURL();

    embed.setColor(0x800080);
    embed.setAuthor({name: user, iconURL: avatar});

    embed.setTitle("⚠ __**" + "Before You Start" + "**__ ⚠");
    embed.setThumbnail("https://github.com/J24681357/gtfbot/raw/master/images/logo/gtfgamelogo.png");
    embed.setDescription("Welcome to the world of GT Fitness! This is the second release codenamed Unleashed!\n\nYou may start on your career and find other cool features by using **/home** or looking through the slash commands for the GTF bot." + "\n\n" + 
    "You will be given your first car; you can check it out in your garage (**/garage**)! You can participate in many other events such as Career (**/career**) & Arcade (**/arcade**). You can unlock modes along the way as a GTF driver." + "\n\n" + 
    "There is a manual for the GTF game (**/manual**) if you need any additional help & tips." +
    "\n\n**❗ Click the " + emote.yes + " button to complete the setup.**");

    
     var emojilist = [{ emoji: emote.yes, 
  emoji_name: "Yes", 
  name: '', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
  require(gtf.DISCORD).send(msg, {embeds:[embed], components: buttons}, startfunc)
  
    
    function startfunc(msg){
      var i = 0;
      function complete() {
        var types = ["n", "b", "a", "ic", "ib", "ia", "s", "seasonal"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 21; j++) {
            career[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }

        var types = ["b", "a", "ic", "ib", "ia", "s"]
        var licenses = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            licenses[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }
        
        userdata = {
          id: userid,
          credits: 15000,
          exp: 0,
          level: 1,
          license: "N",
          mileage: 0,
          totalmileage: 0,
          totaldriftpoints: 0,
          totalplaytime: 0,
          garage: [],
          currentcar: 0,
          dailyworkout: {status:false},       
          racemulti: 1,

          
          count: 0,
          stats: {
            numcarpurchases: 0,
            numgifts: 0,
            numreplays: 0,
            numcourses: 0,
            numraces: 0,
            numwins: 0,
            numparts: 0,
          },
          items: [],
          gifts: [],
          messages: {},
          achievements: [],
          lastonline: "START",
          seasonalcheck: "",
          driver: {
            helmettype: 0,
            helmetcolor: "White",
            visorcolor: "Black",
            helmetlogo1: "",
            helmetlogo2: "",
            helmetlogo3: ""
          },
          sponsor: {
            name: "None",
            level: 0,
            exp: 0,
           },
          
          raceinprogress: {active:false, messageid: "",channelid: "", expire:0, gridhistory:[], msghistory:[]},
          racedetails: [],
          careerraces: career,
          licenses: licenses,
          inlobby: {active:false, host:"", channelid: ""},
          settings: require(gtf.GTF).defaultsettings,
          
          commandhistory: [],
          tutorial: "N/A",
          version: 1,
        };
        
        userdata["tutorial"] = "Complete";
        /*
        var car = require(gtf.CARS).random({lowerfpp: 280, upperfpp: 300}, 1)[0]
        stats.addcar(car, "SORT", userdata);
        */

        var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        MongoClient.connect(function (err, db) {
          if (err) throw err;
          var dbo = db.db("GTFitness");
          var users = dbo.collection("GTF2SAVES");
          users.insertOne(userdata, (err, result) => {});
          dbo.collection("REPLAYS").insertOne(
            {
              id: userdata["id"],
              replays: [],
            },
            (err, result) => {}
          );
          dbo.collection("CUSTOMCOURSES").insertOne(
            {
              id: userdata["id"],
              courses: [],
            },
            (err, result) => {}
          );
        dbo.collection("EVENTSETTINGS").insertOne(
            {
              id: userdata["id"],
              events: [],
            },
            (err, result) => {}
          );
       });
        embed.setTitle("__**Setup Complete**__");
        embed.setColor(0x216c2a);
        embed.setImage("https://github.com/J24681357/gtfbot/raw/master/images/logo/gtfgamelogo.png")
        embed.setDescription("**✅ Join The Fitness Race!**");
        msg.edit({embeds:[embed]}).then(function(msg) {
          setTimeout(function() {msg.delete()}, 3000)
        })
        return
      }
     

      embed.setTitle("__**Tutorial**__");
      var functionlist = [complete]
      gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    }
    return;
  }
};
