var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var gtflobby = require(dir + "index");

module.exports = {
  name: "lobby",
  level: 8,
  channels: ["testing"],

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

    var lobbies;
    /*
    var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    query["options"] = typeof query["options"] === 'undefined' ? "list" : query["options"]

    MongoClient.connect(process.env.MONGOURL, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection("LOBBIES")
        .find({})
        .forEach(row => {
          lobbies = row;
        })
        .then(() => {
          lobby();
        });
    });
    */
    function lobby() {
      var embed = new EmbedBuilder()
      var server = msg.guild;
      var mode = "ONLINE";
      
      var currentlobby = { numberid: "", channelname: "" };
      var list = Object.keys(lobbies["lobbies"]);
      for (var i = 0; i < list.length; i++) {
        if (lobbies["lobbies"][list[i]]["channelid"] == msg.channel.id) {
          currentlobby = lobbies["lobbies"][list[i]];
          break;
        }
      }
      if (msg.channel.type != 11) {
        var thread = msg.channel.threads.cache.find(channel => channel.id === currentlobby["channelid"]) 
        if (typeof thread !== 'undefined') {
          thread.delete();
        }
          userdata["inlobby"] = {active:false, host:"", channelid: ""};
          delete lobbies["lobbies"][userdata["id"]];
          require(gtf.LOBBY).save(lobbies, userdata);
      }
      
      if (msg.channel.type == 11) {
      msg.channel.members.cache.forEach(user => {
        if (!currentlobby["players"].slice().map(i => i["id"]).includes(user.id) && user.id != gtf.USERID) {
          msg.channel.members.remove(user.id);
        }
      })
      }

      if (query["options"] != "join") {
        if (msg.channel.type != 11) {
          userdata["inlobby"] = {active:false, host:"", channelid: ""};
        }
      }
      var playerfound = false;
      if (currentlobby["numberid"] != "") {
        for (var i = 0; i < currentlobby["players"].length; i++) {
          if (currentlobby["players"][i]["id"] == userdata["id"]) {
            playerfound = true;
          }
        }
      }

      if (!playerfound) {
        userdata["inlobby"] = {active:false, host:"", channelid: ""};
      }

      if (query.length == 0) {
        query["options"] = "info";
      }
      if (query["options"] == "list" && userdata["inlobby"]["active"]) {
        query["options"] = "info"
      }
      if (query["options"] == "create" || query["options"] == "host") {
              if (userdata["id"] != "237450759233339393") {
        require(gtf.EMBED).alert({ name: "❌ Demo Only", description: "Lobby creation is not released to the public.", embed: embed, seconds: 0 }, msg, userdata);
        return
      }
        if (userdata["inlobby"]["active"]) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "You are already in a lobby" + "." + " Exit from your current lobby before joining a new one.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }


            var numberid = Object.keys(lobbies["lobbies"]).length + 1;
            var raceprep = {
            mode: "ONLINE",
            modearg: "ONLINE",
            trackselect: "RANDOM",
            track: {types:["Tarmac"]},
            players: [],
            other: [],
          };
          var car = userdata["garage"][stats.currentcarnum(userdata) - 1]
            lobbies["lobbies"][userdata["id"]] = {
              channelid: "",
              channelname: msg.guild.members.cache.get(userdata["id"]).user.username + " " + "Lobby",
              numberid: numberid,
              mode: "RACE",
              host: msg.author.id,
              maxplayers: 8,
              players: [{ 
                id: userdata["id"], 
              place: 1,
              position: 1,
              car: car, 
              user: true, 
              ready: false,
              drivername:msg.guild.members.cache.get(userdata["id"]).user.username,
              level: stats.level(userdata),
              points:0}],
              isready: 0,
              racesettings: require(gtf.RACE).setracesettings(raceprep),
            };
            var regulations = {models: [],
    makes: [],
    types: [],
    tires: "Racing",
    drivetrains: [],
    fpplimit: 9999,
    upperfpp: 9999,
    lowerfpp: 0,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0
    }
    lobbies["lobbies"][userdata["id"]]["racesettings"] = {...lobbies["lobbies"][userdata["id"]]["racesettings"], ...regulations}

            var currentlobby = lobbies["lobbies"][userdata["id"]];
            
             msg.channel.threads.create({
	            name: "🌐" + currentlobby["channelname"],
              description: "You must join this lobby via /lobby join or you will be in spectator mode.",
	            autoArchiveDuration: 60 * 24,
          	reason: 'Test',
          }).then(function(thread) {
            currentlobby["channelid"] = thread.id

           userdata["inlobby"] = {active:true, host:currentlobby["host"],channelid: currentlobby["channelid"]}
            require(gtf.LOBBY).save(lobbies, userdata);
            stats.save(userdata);
              var embed = new EmbedBuilder();
                results = "ℹ️ **" + msg.author.username + "** has joined the room." + "\n\n";
                var embed = new EmbedBuilder()  
               embed.setColor(0x808080);
                embed.setDescription(results);
                var thread = msg.channel.threads.cache.find(x => x.id === currentlobby["channelid"])
                thread.send({content:"<@" + msg.author.id + ">", embeds:[embed]});
                //require(dir + "commands/lobby").execute(msg, {options:"info"}, userdata);
                return;
  })

            


      } else if (query["options"] == "garage") {
        
      embed.setTitle(emote.lobby + " __My Garage__" + " (LOBBY)");
        if (!userdata["inlobby"]["active"]) {
          require(gtf.EMBED).alert({ name: "❌ Not In Lobby", description: "You are not in a lobby. Find a lobby from the list in **/lobby list**.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (msg.channel.id !== currentlobby["channelid"] && msg.channel.type != 11) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby command can only be used in your current lobby.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var garagepage = 0;
        var gmenulist = []
        var gmenulistselect = []
        var gemojilist = [];
        var emojilist = [
  { emoji: emote.tire, 
  emoji_name: 'tire', 
  name: 'Change Tires', 
  extra: "",
  button_id: 0 }
          ]
        var namex = ""
        var menu = []
       var hundredpage = 0
  var totallength = userdata["garage"].length
        var functionlist2 = []
        var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
        var func = function() {}
        var racesettings = currentlobby["racesettings"]
        
        //////
        var [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = require(gtf.GTF).garagemenu(  
        racesettings, func, {carselectmessage: false}, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons,hundredpage, totallength], msg, embed, userdata)
        //////  
        embed.setFields([{name:stats.main(userdata), value:  stats.currentcarmain(userdata)}]);
        var makes = racesettings["makes"].length == 0 ? "Open" : racesettings["makes"].join(", ")
        var drivetrains = racesettings["drivetrains"].length == 0 ? "Open" : racesettings["drivetrains"].join(", ")
        results = "__Regulations__" + "\n" + 
        "**Limit: " + racesettings["fpplimit"].toString().replace("9999", "Any") + emote.fpp + " | " + racesettings["upperpower"].toString().replace("9999", "Any") + " HP" + " | " + racesettings["upperweight"].toString().replace("9999", "Any") + " Ibs" + "**\n" + 
        "**Maximum Tire Grade:** " + racesettings["tires"] + "\n" +
        "**Makes:** " + makes + "\n" + 
        "**Drivetrains:** " + drivetrains
        embed.setDescription(results)
        
        require(gtf.DISCORD).send(msg, { embeds:[embed], components: buttons}, garagefunc)
        
        function garagefunc(msg) {
          var functionlist = [changetires]
          [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = require(gtf.GTF).garagemenufunctions(  
                racesettings, func, {carselectmessage: false}, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata)

          function changetires() {
            if (!racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow")) {
              var car = userdata["garage"][stats.currentcarnum(userdata) - 1]
  var tireslist = car["tires"]["list"].filter(function(tire) {
      if (racesettings["tires"].includes("Comfort")) {
    if (tire.includes("Comfort")) {
        return true
      } else {
        return false
    }
  }
  if (racesettings["tires"].includes("Sports")) {
    if (tire.includes("Sports") || tire.includes("Comfort")) {
        return true
      } else {
        return false
    }
  }

  if (racesettings["tires"].includes("Racing")) {
    if (tire.includes("Sports") || tire.includes("Comfort") || tire.includes("Racing")) {
        return true
      } else {
        return false
    }
  }

  if (racesettings["track"]["type"].includes("Dirt")) {
    if (tire.includes("Dirt")) {
      return true
    } else {
      return false
    }
  }
  if (racesettings["track"]["type"].includes("Snow")) {
    if (tire.includes("Snow")) {
      return true
    } else {
      return false
    }
  }
    return true
  }).sort()
  var tmenulist = tireslist.map(function (tire, index) {
          return {
            emoji: "",
            name: tire,
            description: "",
            menu_id: (index)
            }
  })
  var temojilist = []
  menu = gtftools.preparemenu("Change Tires " + "(" + car["tires"]["current"] + ")" , tmenulist, temojilist, msg, userdata);
buttons = [menu]
  }
  
  embed.setFields([{name:stats.main(userdata), value:  stats.currentcarmain(userdata)}]);
   require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons}, nnn)

   function nnn(msg) {

     var functionlist2 = []
     if (!racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow")) {

        for (var j = 0; j < tmenulist.length; j++) {
      functionlist2.push(function(int) {
        for (var k = 0; k < currentlobby["players"].length; k++) {
          if (currentlobby["players"][k]["id"] == userdata["id"]) {
          lobbies["lobbies"][userdata["inlobby"]["host"]]["players"][k]["car"]["tires"]["current"] = tireslist[int]
          }
        } 
        require(gtf.LOBBY).save(lobbies, userdata);
      })
      }  
    gtftools.createbuttons(buttons, emojilist, functionlist2, msg, userdata)
     }
}  
  
          } 
          var functionlist = [changetires]
          emojilist = emojilist.concat(gemojilist);
          functionlist = functionlist.concat(functionlist2);
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }                       
 
        return
        
      } else if (query["options"] == "join") {
        if (userdata["inlobby"]["active"]) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "You are already in a lobby" + "." + " Exit from your current lobby before joining a new one.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        var number = query["number"];
        
        var currentlobby = null;
        var list = Object.keys(lobbies["lobbies"]);
        for (var i = 0; i < list.length; i++) {
          if (lobbies["lobbies"][list[i]]["numberid"] == parseInt(number)) {
            currentlobby = lobbies["lobbies"][list[i]];
            break;
          }
        }
 if (currentlobby == null) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This ID does not exist in GTF lobbies.", embed: "", seconds: 0 }, msg, userdata);
          return;
    }
        if (stats.currentcar(userdata) == "No car.") {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "You do not have a current car.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (currentlobby["players"].length + 1 > currentlobby["maxplayers"]) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby is full.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        userdata["inlobby"] = {active:true, host:currentlobby["host"], channelid:  currentlobby["channelid"]}
        stats.save(userdata);

        gtftools.interval(
          function () {
          var car = userdata["garage"][stats.currentcarnum(userdata) - 1]
            currentlobby["players"].push({ id: userdata["id"], 
            car: car,
            user: true,
            ready:false,
            drivername:msg.guild.members.cache.get(userdata["id"]).user.username, 
            level: stats.level(userdata),
            points:0  });
            results = "☑️ You have joined a lobby: " + currentlobby["channelname"] + "." + "\n" + "Travel to the channel in order to continue on.";
            require(gtf.LOBBY).save(lobbies, userdata);

            embed.setColor(0x216c2a);
            embed.setDescription(results);
            embed.setFields([{name:stats.main(userdata), value:  stats.currentcarmain(userdata)}]);
            require(gtf.DISCORD).send(msg, {embeds:[embed]});
          },
          2000,
          1
        );

        gtftools.interval(
          function () {
            var embed = new EmbedBuilder();

            embed.setColor(0x808080);
            results = "ℹ️ **" + msg.author.username + "** has joined the room.";
            embed.setDescription(results);
            msg.channel.threads.cache.find(channel => channel.id === currentlobby["channelid"]).send({content: "<@" + msg.author.id + ">", embeds:[embed]});
            return;
          },
          5000,
          1
        );
      } else if (query["options"] == "aijoin") {

        var number = query["number"];
    
        var currentlobby = {numberid: ""};
        var list = Object.keys(lobbies["lobbies"]);
        for (var i = 0; i < list.length; i++) {
          if (lobbies["lobbies"][list[i]]["numberid"] == parseInt(number)) {
            currentlobby = lobbies["lobbies"][list[i]];
            break;
          }
        }
 if (currentlobby["numberid"].length == 0) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This ID does not exist in GTF lobbies.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (currentlobby["players"].length + 1 > currentlobby["maxplayers"]) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby is full.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        
        
        var username = require(gtf.GTF).randomdriver()
        gtftools.interval(
          function () {
           var car = stats.addcar(require(gtf.CARS).random({}, 1)[0], "LOAN")
            currentlobby["players"].push({ id: "AI", 
            car: car,
            user: false,
            ready:true,
            drivername:username, 
            level: 10,
            points:0  });
            
            require(gtf.LOBBY).save(lobbies, userdata);

          },
          2000,
          1
        );

            var embed = new EmbedBuilder();
            results = "ℹ️ **" + username + "** has joined the room.";
            embed.setDescription(results);
            require(gtf.DISCORD).send(msg, {content:"<@" + msg.author.id + ">", embeds:[embed]});
            return;
        
        } else if (query["options"] == "list") {
        if (Object.keys(lobbies["lobbies"]).length == 0) {
          require(gtf.EMBED).alert({ name: "❌ Empty", description: "There are no GTF lobbies online. You can create a lobby using **/lobby - Host Lobby**.", embed: "", seconds: 0 }, msg, userdata);
          return;
        } else {
          var list = [];

          for (var key in lobbies["lobbies"]) {
            list.unshift("`🌐ID:" + lobbies["lobbies"][key]["numberid"] + "` " + lobbies["lobbies"][key]["channelname"] + " `"+ lobbies["lobbies"][key]["players"].length + "/" + lobbies["lobbies"][key]["maxplayers"] + "`");
          }
        }

        
      embed.setTitle(emote.lobby + " __GTF Lobbies - List__");
        pageargs["list"] = list;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      } else if (query["options"] == "exit" || query["options"] == "delete" || query["options"] == "quit") {
        if (!userdata["inlobby"]["active"]) {
          require(gtf.EMBED).alert({ name: "❌ Not In Lobby", description: "You are not in a lobby. Find a lobby from the list in **/lobby list**.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (msg.channel.id !== currentlobby["channelid"] && msg.channel.type != 11) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby command can only be used in your current lobby.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        var isHost = currentlobby["host"] == userdata["id"];

        embed.setColor(0xffff00);
        var results = "⚠ Leave from the lobby?" + "\n\n" + "❓ **This is a fixed host room, so if the host leaves then all players will be booted from this lobby.**";

        embed.setDescription(results);
        
          var emojilist = [
  { emoji: emote.yes, 
  emoji_name: 'Yes', 
  name: '', 
  extra: "Once",
  button_id: 0 }
          ]
 var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
        require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, lobbyfunc)
        
        function lobbyfunc(msg) {

          function exit() {
            lobbies["lobbies"][currentlobby["host"]]["players"] = lobbies["lobbies"][currentlobby["host"]]["players"].filter(x => x["id"] != userdata["id"]);

            userdata["inlobby"] = {active:false, host:"", channelid: ""};
            if (isHost) {
              var channel = msg.channel
              if (typeof channel !== 'undefined') {
               channel.delete();
             }
              delete lobbies["lobbies"][userdata["id"]];
            } else {
              var embed = new EmbedBuilder();
              embed.setColor(0x808080);
              results = "ℹ️ **" + msg.author.username + "** has left the room.";
              embed.setDescription(results);
              var thread = msg.channel
              thread.send({embeds:[embed]});
              thread.members.remove(userdata["id"]);

              setTimeout(() => msg.delete(),1000 );
            }
            require(gtf.LOBBY).save(lobbies, userdata);
            stats.save(userdata);
          } 
          var functionlist = [exit]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      } else if (query["options"] == "settings" || query["options"] == "set" || query["options"] == "regulations") {
       query["options"] = "set"
      pageargs["carselectmessage"] = false
        if (currentlobby["host"] != userdata["id"]) {
          require(gtf.EMBED).alert({ name: "❌ Not The Host", description: "Only the host can change lobby settings.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (msg.channel.id !== currentlobby["channelid"] && msg.channel.type != 11) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby command can only be used in your current lobby.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        var changes = [];
        var setting = query["settings"];
        if (typeof query["regulations"] !== 'undefined') {
          var setting = query["regulations"]
        }
    function list(msg) {
    delete query["number"]
    delete query["settings"]
    delete query["regulations"]
    delete query["name"]
  embed.setTitle(emote.lobby + " __" + currentlobby["channelname"] + " (" + "Room Settings"  + ")__");
   var racesettings = currentlobby["racesettings"]
        pageargs["list"] = [
           "__**Track:**__ " + "`" + racesettings["track"]["name"] + "`", 
        "__**Laps:**__ " + "`" + racesettings["laps"] + "`",
        "__**Time Limit:**__ " + "`" + racesettings["laps"] + "`",
         "__**Time:**__ " + "`" + racesettings["time"]["emoji"] + " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] + "`", 
         "__**Weather:**__ " + "`" + racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + "`", 
         "__**Wet Surface %:**__ " + "`" + "💧" + racesettings["weather"]["wetsurface"] + "%" + "`", 
             "📜 __**Edit Regulations**__","🆓 __**Clear Regulations**__","💾 __ **Save Event**__"]
        pageargs["selector"] = "settings"
        pageargs["query"] = query
          if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **Select a room setting that you want to change in your lobby.**" + "\n" +
        "**Certain settings that require additional arguments (room name, FPP) must be set in the slash command menu.**"
        }
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
}
        if (setting === undefined) {
          list(msg)
          return;
        }
        var s = ["track", "lap", "endurance", "time", "weather", "wet", "v", "w", "x"]
        if (typeof (s[parseInt(setting)]) !== 'undefined') {
          setting = s[parseInt(setting)]
        }
        
        require(gtf.LOBBY).settingsnregulations(setting, changes, lobbies["lobbies"][userdata["inlobby"]["host"]], pageargs, embed, msg, userdata);

        if (changes[0] == "ERROR" || changes[0] == "LIST") {
          return;
        }
        if (changes[0] == "SUCCESS") {

        }
        if (changes.length == 0) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "Invalid arguments.", embed: "", seconds: 0 }, msg, userdata);
          return;
        } else {
          var pings = ["@everyone"]
           for (var i = 0; i < currentlobby["players"].length; i++) {          
               var car = currentlobby["players"][i]["car"]
            if (!require(gtf.GTF).checkregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0] || !require(gtf.GTF).checktireregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0]) {
              pings.push("<@" + currentlobby["players"][i]["id"] + ">")
         }
    }
    
          var embed = new EmbedBuilder();
          results = "ℹ️ **" + msg.author.username + "** has changed lobby settings." + "\n\n" + changes.join("\n");
          embed.setDescription(results)
          var msgjson = pings.length == 1 ? {embeds:[embed]} : {content:  pings.join(" ") + "\n" + "⚠ Your current cars does not meet the regulations. Please change your cars.", embeds:[embed]}
          require(gtf.LOBBY).save(lobbies, userdata);
          
          require(gtf.DISCORD).send(msg, msgjson, list);
          return;
        }
      } else if (query["options"] == "info") {
        if (!userdata["inlobby"]["active"]) {
          require(gtf.EMBED).alert({ name: "❌ Not In Lobby", description: "You are not in a lobby. Find a lobby from the list in **/lobby list**.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        if (msg.channel.id !== currentlobby["channelid"] && msg.channel.type != 11) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby command can only be used in your current lobby.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        embed.setTitle(emote.lobby + " __" + currentlobby["channelname"] + "__");
        var racesettings = currentlobby["racesettings"];
        var playerlist = currentlobby["players"].map(x => x["drivername"]).join("\n");
        results = "";

        var racedetails =
          "`👥 " +
          currentlobby["players"].length +
          "/" +
          currentlobby["maxplayers"] +
          " Players`" +
          "\n" +
"**Limit: " + currentlobby["racesettings"]["fpplimit"].toString().replace("9999", "Any") + emote.fpp + " | " + currentlobby["racesettings"]["upperpower"].toString().replace("9999", "Any") + " HP" + " | " + currentlobby["racesettings"]["upperweight"].toString().replace("9999", "Any") + " Ibs" + "**" +
          "\n" +
          playerlist +
          "\n\n" +
          "__Track Settings__" +
          "\n" +
          "**Track:** " +
          racesettings["track"]["name"] +
          "\n" +
          "**Time/Weather:** " +
          racesettings["time"]["emoji"] + " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] +
          " | " +
         racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + " 💧" + racesettings["weather"]["wetsurface"] + "%" +
          "\n\n" +
          "**Lap(s):** " +
          racesettings["laps"] +
          "\n" +
          "**Total Distance:** " +
          racesettings["km"] +
          " km" +
          " | " +
          racesettings["mi"] +
          " mi" +
          "\n";

        embed.setDescription(results + "\n\n" + racedetails);
        if (currentlobby["host"] == userdata["id"]) {
         var emojilist = [
  { emoji: emote.flag, 
  emoji_name: 'flag', 
  name: 'Start', 
  extra: "Once",
  button_id: 0 },
    { emoji: "⚙", 
  emoji_name: '⚙', 
  name: 'Room Settings', 
  extra: "Once",
  button_id: 1 },
  {
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Lobby Details',
    extra: "",
    button_id: 2
  },
  {
    emoji: emote.cargrid,
    emoji_name: "gtfcargrid",
    name: 'Member List',
    extra: "",
    button_id: 3
  }
]
        } else {
        var emojilist = [
  {
    emoji: emote.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Lobby Details',
    extra: "",
    button_id: 0
  },
  {
    emoji: emote.cargrid,
    emoji_name: "gtfcargrid",
    name: 'Starting Grid',
    extra: "",
    button_id: 1
  }
]
        }
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

     embed.setFields([{name:stats.main(userdata), value:  stats.currentcarmain(userdata)}]);

      var pings = []
           for (var i = 0; i < currentlobby["players"].length; i++) {          
               var car = currentlobby["players"][i]["car"]
            if (!require(gtf.GTF).checkregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0] || !require(gtf.GTF).checktireregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0]) {
              pings.push("<@" + currentlobby["players"][i]["id"] + ">")
         }
    }
    var msgjson = pings.length == 0 ? {embeds:[embed], components: buttons} : {content:  pings.join(" ") + "\n⚠ Your current cars does not meet the regulations. Please change your cars.", embeds:[embed], components:buttons}

        require(gtf.DISCORD).send(msg, msgjson, lobbystartrace)
        
        function lobbystartrace(msg) {
          function flagstartrace() {
            if (currentlobby["host"] != userdata["id"]) {
          return;
           } else {
            require(dir + "commands/lobby").execute(msg, {options:"race"}, userdata);
            return
           }
          }
          function flagroomsettings() {
            if (currentlobby["host"] != userdata["id"]) {
          return;
           } else {
            require(dir + "commands/lobby").execute(msg, {options:"set"}, userdata);
            return
           }
          }
          function trackdetails() {
            embed.setDescription(results + "\n\n" + racedetails);
            msg.edit({embeds: [embed]});
          }
          function cargrid() {
            var results2 = "__Players List__" + "\n" + currentlobby["players"].map(function (x) {
              var bot = x["user"] ? "" : " `🤖`"

              return ["`" + x["drivername"] + "`" + bot, x["car"]["name"] + " " + "**" + x["car"]["fpp"] + "**" + emote.fpp + "**" + emote.tire +
        x["car"]["tires"]["current"].split(" ").map(x => x[0]).join("") +
        "**"].join(" ");
            }).join("\n");
            embed.setDescription(results2);
            msg.edit({embeds: [embed]});
          }
          if (currentlobby["host"] == userdata["id"]) { 
            var functionlist = [flagstartrace, flagroomsettings, trackdetails, cargrid]
          } else {
            var functionlist = [trackdetails, cargrid]
          }
         gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      } else if (query["options"] == "race" || query["options"] == "start") {
        if (currentlobby["host"] != userdata["id"]) {
          require(gtf.EMBED).alert({ name: "❌ Not The Host", description: "Only the host can start a race.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (msg.channel.id !== currentlobby["channelid"] && msg.channel.type != 11) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "This lobby command can only be used in your current lobby.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        if (new Date().getTime() > currentlobby["isready"]) {
          currentlobby["isready"] = 0
        }

        if (currentlobby["isready"] > 0) {
          require(gtf.EMBED).alert({ name: "❌ Race Starting", description: "The race is already starting.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        currentlobby["isready"] = new Date().getTime() + 30 * 1000;
        require(gtf.LOBBY).save(lobbies, userdata);
        results = "❗ **The race is starting! You have 30 seconds to join the race by reacting to the 🏁 emote below.**";
        embed.setColor(0xFFFFFF)
        embed.setDescription(results);
        var pings = []
      for (var i = 0; i < currentlobby["players"].length; i++) {          
               var car = currentlobby["players"][i]["car"]
            if (!require(gtf.GTF).checkregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0] || !require(gtf.GTF).checktireregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0]) {
              pings.push("<@" + currentlobby["players"][i]["id"] + ">")
         }
    }
    pings = pings.length == 0 ? "" : "\n" + pings.join(" ") + "\n" + "⚠ Your current cars does not meet the regulations for this race. Please meet regulations before entering."

        server.channels.cache
          .find(channel => channel.id === currentlobby["channelid"])
          .send({content:" **RACE IS STARTING** " + "@everyone" + pings, embeds:[embed]})
          .then(msg => {
            msg.react("🏁")
            
            setTimeout(() => msg.delete(), 26 * 1000);
            setTimeout(function () {
              MongoClient.connect(process.env.MONGOURL, { useUnifiedTopology: true }, function (err, db) {
              if (err) throw err;
                var dbo = db.db("GTFitness");
                dbo
                  .collection("LOBBIES")
                  .find({})
                  .forEach(row => {
                    lobbies = row;
                  })
                  .then(() => {
                    startrace();
                  });
              }); 
              function startrace() {
              currentlobby = lobbies["lobbies"][userdata["inlobby"]["host"]];
              currentlobby["isready"] = 0
              var reactions = msg.reactions.cache.find(emoji => emoji.emoji.name == "🏁");
              var keys = reactions.users.cache.keys();
              var size = reactions.users.cache.size;
              var index = 0;
              var pings = []
              while (index < size) {
                var id = keys.next().value;
                var oscore = 0
                lobbies["lobbies"][currentlobby["host"]]["players"] = lobbies["lobbies"][currentlobby["host"]]["players"].map(function (x, i) {
                  ////         
            var car = x["car"]
            if (!require(gtf.GTF).checkregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0] || !require(gtf.GTF).checktireregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0]) {
              pings.push("<@" + x["id"] + ">")
               x["ready"] = false
         }
                  ////
                  x["fpp"] = x["car"]["fpp"]
                  x["name"] = x["car"]["name"]
                  x["tires"] = x["car"]["tires"]["current"]
                  x["oscore"] = oscore
                  x["score"] = oscore
                  x["place"] = i + 1
                  x["position"] = i + 1
                  if (x["id"].toString() == id.toString()) {
                    x["ready"] = true;
                  }
                  oscore = oscore + 1000
                  return x;
                });
                index++;
              }
              pings = gtftools.removeDups(pings)
              if (pings.length >= 1) {
                 require(gtf.DISCORD).send(msg, {content:  pings.join(" ") + "\n" + "⚠ Your current cars does not meet the regulations for this race."})
              }
              setTimeout(function () {
                lobbies["lobbies"][currentlobby["host"]]["racesettings"]["players"] = lobbies["lobbies"][currentlobby["host"]]["players"].filter(x => x["ready"] && require(gtf.GTF).checkregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0] && require(gtf.GTF).checktireregulations(car, currentlobby["racesettings"], function() {}, "silent", msg, embed,userdata)[0]);
                if (lobbies["lobbies"][currentlobby["host"]]["racesettings"]["players"].length == 0) {
                  require(gtf.EMBED).alert({ name: "❌ Race Aborted", description: "No players were on the track.", embed: "", seconds: 0 }, msg, userdata);
                  currentlobby["isready"] = false;
                  require(gtf.LOBBY).save(lobbies, userdata);
                  return;
                }
      
                
                var finalgrid = lobbies["lobbies"][currentlobby["host"]]["racesettings"]["players"]
                var raceprep = {
                  mode: "ONLINE",
                  modearg: "",
                  carselect: "ONLINE",
                  car: {},
                  trackselect: "RANDOM",
                  track: {},
                  players: finalgrid,
                  racesettings: lobbies["lobbies"][currentlobby["host"]]["racesettings"],
                  other: [],
                };
                require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
                currentlobby["isready"] = false;
                require(gtf.LOBBY).save(lobbies, userdata);
              }, 3000);
              }
            }, 25 * 1000);
          });
      } else {
        require(gtf.EMBED).alert({ name: "❌ Error", description: "Invalid arguments.", embed: "", seconds: 0 }, msg, userdata);
      }
    }
  },
};
