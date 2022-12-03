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

  if (typeof userdata["t"] !== undefined) {
    if (userdata["t"] == "Complete") {
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
    embed.setDescription("Welcome to the world of GT Fitness (The Game)!\n\nYou may start on your career and find other cool features by using **/home** or looking through the slash commands for the GTF bot." + "\n\n" + 
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
          var types = ["b", "a", "ic", "ib", "ia", "s", "seasonal"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            career[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }
        
        userdata = {
          id: userid,
          raceinprogress: {active:false, messageid: "",channelid: "", expire:0, gridhistory:[], msghistory:[]},
          racedetails: [],
          careerraces: career,
          inlobby: {active:false, host:"", channelid: ""},
          dailyworkout: false,

          credits: 15000,
          exp: 0,
          level: 1,
          mileage: [0, 0],
          totalmileage: [0, 0],
          totalplaytime: 0,
          version: 251,
          commandhistory: [],

          garage: [],
          numcarpurchase: 0,
          numgiftearned: 0,
          numreplays: 0,
          numcourses: 0,
          currentcar: 0,

          items: [],
          gifts: [],
          messages: [],
          count: 0,
          achievements: {},
          t: "N/A",
          lastonline: "START",
          racemulti: 1,
          seasonalcheck: "",
          sponsor: {
    "name": "None",
    "level": 0,
    "exp": 0,
  },
          driver: {
            helmettype: 0,
            helmetcolor: "White",
            visorcolor: "Black",
            helmetlogo1: "",
            helmetlogo2: "",
            helmetlogo3: ""
          },
          settings: require(gtf.GTF).defaultsettings,
        };
        
        userdata["t"] = "Complete";
        var car = require(gtf.CARS).random({lowerfpp: 280, upperfpp: 300}, 1)[0]
        stats.addcar(car, "SORT", userdata);

        var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        MongoClient.connect(function (err, db) {
          if (err) throw err;
          var dbo = db.db("GTFitness");
          var users = dbo.collection("USERS");
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
      function nexttask(i) {
        if (i != tasks.length - 1) {
          embed.setDescription(tasks[i][0] + "\n\n" + "⏲ **You have 2 minutes to answer this question correctly.**");
          author.send({embeds:[embed]}).then(msg => {
            const filter = m => m.content.toLowerCase() == tasks[i][1].toLowerCase();
            const filter2 = m => m.content.toLowerCase() != tasks[i][1].toLowerCase();
            const collector = msg.channel.createMessageCollector( { filter,time: 1000 * 120 });
            const collector2 = msg.channel.createMessageCollector( { filter2,time: 1000 * 120 });

            var correct = false;

            collector.on("collect", m => {
              correct = true;
              collector.stop();
              collector2.stop();
              i++;
              if (i == tasks.length - 1) {
                complete();
              } else {
                nexttask(i);
              }
            });

            collector2.on("collect", m => {
              if (embed.color == 16711680) {
              } else {
                embed.setColor(0xff0000);
                msg.edit({embeds: [embed]});
                setTimeout(function () {
                  embed.setColor(0x800080);
                  msg.edit({embeds: [embed]});
                }, 2500);
              }
            });

            collector.on("end", collected => {
              if (!correct) {
                author.send("⚠ Time is up! You may start this tutorial over by typing **!home**.");
              }
              collector.stop();
              collector2.stop();
            });
          });
        }
      }
      var functionlist = [complete]
      gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    }
    return;
  }
};
