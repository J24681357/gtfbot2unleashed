var dir = "./";
var emote = require(dir + "index");
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({
  partials: [Partials.Channel],
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var fs = require("fs");
var gtfbot = JSON.parse(fs.readFileSync(dir + "jsonfiles/_botconfig.json", "utf8"));
var extra = require(dir + "functions/misc/f_extras");
/////
var data = {};
var checklogin = false;
var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const prefix = "!";
var announcer = JSON.parse(fs.readFileSync(dir + "jsonfiles/announcer.json", "utf8"));
var gtfmessages = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfmessages.json", "utf8"));
var gtfcareerraces = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfcareerraces.json", "utf8"));
var gtfsponsors = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfsponsors.json", "utf8"));
var gtfcars = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfcarlist.json", "utf8"));
var gtftracks = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtftracklist.json", "utf8"));
var gtfparts = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfpartlist.json", "utf8"));
var gtfpaints = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfpaints.json", "utf8"));
var gtfwheels = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfwheels.json", "utf8"));
var gtfexp = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfexp.json", "utf8"));
var gtfweather = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtfweather.json", "utf8"));
var gtftime = JSON.parse(fs.readFileSync(dir + "jsonfiles/gtftime.json", "utf8"));

module.exports.announcer = announcer;
module.exports.messages = gtfmessages;
module.exports.gtfcareerraces = gtfcareerraces;
module.exports.gtfsponsors = gtfsponsors;
module.exports.gtfcarlist = gtfcars;
module.exports.gtftracklist = gtftracks;
module.exports.gtfweather = gtfweather;
module.exports.gtftime = gtftime;
module.exports.gtfpartlist = gtfparts;
module.exports.gtfpaintlist = gtfpaints;
module.exports.gtfwheellist = gtfwheels;
module.exports.gtfexp = gtfexp;
module.exports.embedcounts = {};
module.exports.bot = gtfbot;
module.exports.emote = emote;

//gtftools.updateallsaves("GTF2SAVES", {})

var listinmaint = [];
client.commands = {};
const commandFiles = fs.readdirSync(dir + "commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(dir + "commands/" + file);
  if (command.availinmaint) {
    listinmaint.push(command.name);
  }
  client.commands[command.name] = command;
}

var datebot = new Date().getTime();
var date = new Date();
var timeelapsed = 0;

const express = require("express");
const server = express();

var app = express();
const port = process.env.PORT || 3000;
server.all("/", (re, res) => {
  res.send("GT Fitness is now online!");
});

server.listen(3000, () => {});

console.log("Loading...");

setTimeout(function () {
  if (!checklogin) {
    restartbot()
  }
}, 10000);

client.on("ready", () => {
  loademojis();
  timeelapsed = parseInt(new Date().getTime()) - parseInt(datebot);
  if (timeelapsed >= 10000) {
    console.log("Ping too long, restarting...");
    console.log(keep);
  }
  
  console.log("Time elapsed: " + timeelapsed + " " + "ms");
});

/*client.on('messageCreate', msg => {
   if (msg.channel.type == 'DM') {
      console.log('Dm recieved!')
    if(msg.attachments.size) {
      var fileurl = msg.attachments.first().url;

  var file = ""

      var download = function(url, dest, cb) {
        file = fs.createWriteStream(dest);
  var request = require("https").get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
   };
   download(fileurl, "./", function() {
      var userdata = file.extract("userdata.txt", {encoding: "utf8", password:process.env.USERDATAPASSWORD})
   })

}
   }
})*/

require(gtf.SLASHCOMMANDS).createslashcommands();

try {
  client.on("interactionCreate", async interaction => {
    if (interaction.type != 2) {
      return;
    }

    interaction.channel = client.channels.cache.get(interaction.channelid);
    interaction.author = interaction.user;

    const args = interaction.options._hoistedOptions;
    const commandName = interaction.commandName;

    if (args.length == 0) {
      interaction.content = commandName;
    } else {
      interaction.content = args.map(function (x) {
        if (x["type"] == 11) {
          return x["name"] + "=" + x.attachment["url"];
        } else {
          return x["name"] + "=" + x["value"];
        }
      });
      interaction.content.unshift(commandName.toLowerCase());
      interaction.content = interaction.content.join("***");
    }
    var embed = new EmbedBuilder();
    embed.setColor(0x0151b0);

    var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    try {
      var warn = "";
      if (timeelapsed >= 2300) {
        warn = "(Some loading issues may occur)";
      }
      interaction.reply({ content: "**✅ Success** " + warn, ephemeral: true });
    } catch (error) {
      if (error) {
        require(gtf.EMBED).alert({ name: "❌ Interaction Error", description: "An interaction error has occurred. Please try again.\n" + "**" + error + "**", embed: "", seconds: 0 }, interaction, { id: interaction.author.id });
        console.error(error);
      } else {
        console.error(error);
      }
    }
    try {
      load_msg(interaction);
    } catch (error) {
      embed = new EmbedBuilder();
      require(gtf.EMBED).alert({ name: "Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, interaction, { id: interaction.author.id });
      console.error(error);
    }
    return;
    ////////////////////////////////////////////

    function load_msg(msg) {
      ///////
      if (userdata === undefined) {
        userdata = require(gtf.GTF).defaultuserdata(msg.author.id);
      }
      var next = function () {
        var args = msg.content.split(/\*\*\*+/);
        var commandName = args.shift().toLowerCase();

        var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName)[0]);

        if (!command) return;

        // Profile
        if (gtfbot["maintenance"]) {
          if (msg.author.id != "237450759233339393" && !command.availinmaint) {
            userdata = require(gtf.GTF).defaultuserdata(msg.author.id);
            require(gtf.EMBED).alert({ name: "⚠️ Maintenance", description: "This bot is currently in maintenance. Come back later!", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if (command.channels.length >= 1) {
          if (msg.channel.type == 11) {
            if (!command.channels.some(name => msg.channel.parent.name.includes(name))) {
              userdata = require(gtf.GTF).defaultuserdata(msg.author.id);
              require(gtf.EMBED).alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          } else {
            if (!command.channels.some(name => msg.channel.name.includes(name))) {
              userdata = require(gtf.GTF).defaultuserdata(msg.author.id);
              require(gtf.EMBED).alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
        }
        var check = require(dir + "functions/misc/f_start").intro(userdata, command.name, msg);
        if (check == "COMMAND") {
          userdata = require(gtf.GTF).defaultuserdata(msg.author.id);
          executecommand(command, args, msg, userdata);
          return;
        }
        if (check != "SUCCESS") {
          return;
        }

        if (userdata["credits"] == 0 && userdata["exp"] == 0 && userdata["garage"].length == 0) {
          stats.addcredits(15000, userdata);
        }

        // Updates

        if (command.name != "update") {
          if (userdata["version"] === undefined || userdata["version"] < gtfbot["version"]) {
            require(gtf.EMBED).alert({ name: "❌ Version Incompatible", description: "Your save data needs to be updated in order to use current features. Use **/update** to update your save to the latest version.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }

        // Roles
        var roles = command.roles;

        //Checks if in a race
        if (!command.usedduringrace) {
          if (userdata["raceinprogress"]["expire"] < new Date()) {
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: undefined };
          }
          if (userdata["raceinprogress"]["active"]) {
            require(dir + "commands/status").execute(msg, { options: "view" }, userdata);
            return;
          }
        }
        if (!command.usedinlobby) {
          if (userdata["inlobby"]["active"]) {
            if (typeof msg.channel.threads === "undefined") {
              require(gtf.EMBED).alert({ name: "⚠️ Lobby In Session", description: "You are unable to use `/" + commandName + "` until you have left from your current lobby.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
            if (msg.channel.threads.cache.find(channel => channel.id == userdata["inlobby"]["active"])) {
              require(gtf.EMBED).alert({ name: "⚠️ Lobby In Session", description: "You are unable to use `/" + commandName + "` until you have left from your current lobby.", embed: "", seconds: 0 }, msg, userdata);
              return;
            } else {
              userdata["inlobby"] = { active: false, host: "", channelid: "" };
            }
          } else {
            userdata["inlobby"] = { active: false, host: "", channelid: "" };
          }
        }

        if (!require(gtf.EXP).checklevel(command.level, embed, msg, userdata)) {
          return;
        }

        if (command.requirecar) {
          if (stats.garagecount(userdata) == 0) {
            require(gtf.EMBED).alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }

        if (command.requireuserdata) {
          if (Object.keys(userdata).length <= 5) {
            require(gtf.EMBED).alert({ name: "❌ Userdata Required", description: "You do not have a save data.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }

        if (msg.channel.type != 11) {
          msg.channel.threads.fetchArchived({}).then(channels => {
            channels.threads.forEach(function (channel) {
              channel.delete();
            });
          });
        }

        if (msg.author.username == "everyone" || msg.author.username == "here") {
          require(gtf.EMBED).alert({ name: "❌ Username Not Allowed", description: "Your username is not allowed from this bot. Please choose another username.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        try {
          //stats.checkachievements(msg.member, userdata);
          stats.checkmessages(command, execute, msg, userdata)
          function execute() {
          executecommand(command, args, msg, userdata);
          }
        } catch (error) {
          require(gtf.EMBED).alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, msg, userdata);
          console.error(error);
        }
      };
      var userdata;
      MongoClient.connect(function (err, db) {
        if (err) {
          require(gtf.EMBED).alert({ name: "❌ Save Data Failed", description: "Oops, save data has failed to load. Try again next time.\n" + "**" + err + "**", embed: "", seconds: 0 }, msg, userdata);
          restartbot()
        }
        var dbo = db.db("GTFitness");
        dbo
          .collection("GTF2SAVES")
          .find({ id: msg.author.id })
          .forEach(row => {
            if (typeof row["id"] === undefined) {
              return {};
            } else {
              userdata = row;
            }
          })
          .then(async () => {
            stats.save(userdata);
            db.close();
            next();
          });
      });
    }
  });
} catch (error) {
  if (error) {
    require(gtf.EMBED).alert({ name: "Interaction Error", description: "An interaction error has occurred. Please try again.\n" + "**" + error + "**", embed: "", seconds: 0 }, interaction, { id: interaction.author.id });
    console.error(error);
  } else {
    console.error(error);
  }
}

client.login(process.env.SECRET).then(function () {
  require("replit-dis-uniter")(client)
  checklogin = true;
  var keys = [];
  client.rest.on("rateLimited", info => {
    gtfbot["msgtimeout"] = info["timeout"];
    console.log(info)
    /*
    if (info["path"].includes("messages")) {
      var channelid = info["path"].split("/channels/")[1].split("/")[0];
      var messageid = info["path"].split("/messages/")[1].split("/")[0];
    } 
    else {
      channelid = "";
      messageid = "";
    }
    if (typeof client.guilds.cache.get(gtf.SERVERID).members.cache.get("237450759233339393") == "undefined") {
    } 
    else {
      client.guilds.cache
        .get(gtf.SERVERID)
        .members.cache.get("237450759233339393")
        .send({ content: "**RATE LIMIT DETECTED**" + "\n\n" + "**Timeout:** " + require(gtf.DATETIME).getFormattedTime(info["timeout"]) + "\n" + "**Message:** " + "https://discord.com/channels/" + gtf.SERVERID + "/" + channelid + "/" + messageid + "\n\n" + JSON.stringify(info) });
    }
    */
  });

  MongoClient.connect(function (err, db) {
    if (err) {
      restartbot()
      console.log("Failed to load races.")
      return
    }
    var dbo = db.db("GTFitness");
    dbo
      .collection("GTF2SAVES")
      .find({})
      .forEach(row => {
        if (typeof row["id"] === undefined) {
          return;
        } else {
          
          if (row["racedetails"] === undefined) {
            return;
          }

          if (row["racedetails"].length == 0) {
            return;
          }
          
          if (!row["raceinprogress"]["active"] || row["raceinprogress"]["channelid"] === undefined || row["raceinprogress"]["messageid"] === undefined) {
            return;
          }
          keys.push(row);
        }
      });

    var index1 = 0;
  
    setTimeout(function () {
      //gtftools.checkcarlist(gtfcars);
      //gtftools.checktracklist(gtftracks);
    
  //gtftools.checksponsorslist(gtfcars,gtfwheels,gtfpaints);
      updatebotstatus();
      require(gtf.SEASONAL).changeseasonals(false);
      require(gtf.TIMETRIAL).changetimetrials(false);
      gtftools.interval(
        function () {
          stats.resumerace(keys[index1], client);
          index1++;
        },
        1000,
        keys.length
      );

      //require(gtf.EXTRA).checkerrors(client)
      db.close();
    }, 5000);
  
  });
  
});

var executecommand = function (command, args, msg, userdata) {
  try {
    var saved = userdata["id"] + ": " + args;
    args = gtftools.querymap(args);
    command.execute(msg, args, userdata);
  } catch (error) {
    require(gtf.EMBED).alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, msg, userdata);
    console.error(error);
  }
};

///FUNCTIONS
function loademojis() {
  module.exports.update = "<:update:419605168510992394>";
  module.exports.gtflogo = "<:gtfitness:912928750851752016>";
  module.exports.flag = "<:flag:646244286635180033>";
  module.exports.transparent = "<:t_:666878765552369684>";

  
  module.exports.aero = "<:aerowing:917615553852620850>";
  module.exports.paint = "<:gtfpaint:934686343416643584>";
  module.exports.livery = "<:livery:1032388666082983946>";

  module.exports.redlightb = "<:shadedredlight:638944391112818718>";
  module.exports.yellowlightb = "<:shadedyellowlight:638944449971617822>";
  module.exports.greenlightb = "<:shadedgreenlight:638944423056506880>";
  module.exports.redlight = "<:redlight:638944403964035072>";
  module.exports.yellowlight = "<:yellowlight:638944464853008404>";
  module.exports.greenlight = "<:greenlight:638944437996617728>";

  module.exports.leftarrow = "<:leftarrow:973817070351417415>";
  module.exports.rightarrow = "<:rightarrow:973817070301118465>";
  module.exports.uparrow = "<:uparrow:973817070070427689>";
  module.exports.downarrow = "<:downarrow:973817070267539496>";
  module.exports.yes = "<:Yes:973817070418554881>";
  module.exports.exit = "<:exit:670134165806514206>";
  module.exports.google = "<:google:923485130490785802>";
  
  module.exports.upvote = "<:upvote:1011755439668613230>";
  module.exports.middlevote = "<:middlevote:1011753293455835277>";
  module.exports.downvote = "<:downvote:1011753294760251503>";

    
  module.exports.goldmedal = "<:gold:683881057589657650>";
  module.exports.silvermedal = "<:silver:672660378047741982>";
  module.exports.bronzemedal = "<:bronze:672715512937054208>";
  module.exports.diamondmedal = "<:diamond:683880404855291918>";
  
  module.exports.driftflag = "<:driftflag:701499692877611139>";
  module.exports.loading = "<a:gtfloading:695112393021325392>";
  module.exports.bop = "<:bop:908564536989200417>";
  module.exports.weather = "<:dynamicweather:991956491479298092>";
  module.exports.tracklogo = "<:trackgtfitness:647254741990244372>";
  module.exports.cargrid = "<:gtfcargrid:906447596632014859>";
  
  module.exports.carexcellent = "<:car_condition_excellent:1048864552038699008>"
  module.exports.carnormal = "<:car_condition_normal:1048864550461648956>"
  module.exports.carworn = "<:car_condition_worn:1048864548997845002>"
  module.exports.carbad = "<:car_condition_bad:1048864547047481356>"
  module.exports.cardead = "<:car_condition_dead:1048864545826951208>"
  
  module.exports.gtauto = "<:gtauto:1050304598780428329>"

  module.exports.slowdown1 = "<:slow_down_1:816068685717438485>";
  module.exports.slowdown2 = "<:slow_down_2:816068685688209419>";
 

  module.exports.credits = "<:credits:902359514492329984>";
  module.exports.exp = "<:experience:470270715900329985>";
  module.exports.mileage = "<:mileage:470270715682226178>";
  module.exports.fpp = "<:fpp:1030148104680382494>";
  module.exports.dailyworkout = "<:dailyworkout:895858086697390241>";
  module.exports.dailyworkoutman = "<a:dailyworkout_running:1048879274175774770>";
  module.exports.tire = "<:tire:805367277482409994>";

  module.exports.blicense = "<:blicense:1057907828184064081>"
  module.exports.alicense = "<:alicense:1057907826565054514>"
  module.exports.iclicense = "<:iclicense:1057907837696737282>"
  module.exports.iblicense = "<:iblicense:1057907835566035065>"
  module.exports.ialicense = "<:ialicense:1057907831191371836>"
  module.exports.slicense = "<:slicense:1057907840452399166>"

  module.exports.jimmyb = "<:jimmybroadbent:902648416490909767>";
  module.exports.igorf = "<:igorfraga:975236447709827092>";
  module.exports.lewish = "<:lewis_hamilton:1039971967660462150>";

  module.exports.gtlogowhite = "<:gtlogowhite:682139679919046667>";
  module.exports.gtlogoblue = "<a:gtflogoa:485339455339888640>";
  module.exports.lobby = "<:lobby:919657582149402684>";

  module.exports.brake = "<:brake:887861123158794281>";

  module.exports.gt6progressbar = "<:gt6loading:905512462542045235>";
  module.exports.gt6progressbarblack = "<:gt6loadingblack:905512462319775755>";
  module.exports.gt7 = "<:gt7:733154449715101776>";
}

function updatebotstatus() {
  console.log("Maintenance: " + gtfbot["maintenance"]);
  if (gtfbot["maintenance"] && typeof gtfbot["maintenance"] === "boolean") {
    client.user.setPresence({ activities: [{ name: "The bot is under maintenance." }], status: "dnd" });
    client.guilds.cache.get(gtf.SERVERID).members.cache.get(gtf.USERID).setNickname("In Maintenance");
  } else if (gtfbot["maintenance"] == "PARTIAL") {
    client.user.setPresence({ activities: [{ name: "Available commands: " + listinmaint.map(x => "/" + x).join(" ") }], status: "idle" });
    client.guilds.cache.get(gtf.SERVERID).members.cache.get(gtf.USERID).setNickname("Partial Maintenance");
  } else {
    client.user.setPresence({ activities: [{ name: "GT Fitness 2: Unleashed (PS5)" }], status: "purple" });
    client.guilds.cache.get(gtf.SERVERID).members.cache.get(gtf.USERID).setNickname("/ | GT Fitness");
  }
}

function restartbot() {
  console.log("Restarting bot...");
    const { exec } = require("child_process");

    exec("kill 1", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
}

//client.on("debug", console.log).on("warn", console.log)