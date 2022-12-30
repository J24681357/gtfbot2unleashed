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
  name: "customrace",
  title: "GTF Custom Race",
  license: "N", level: 30,
  channels: ["gtf-mode", "testing"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 9,
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
    var setups
    stats.load("EVENTSETTINGS", userdata, setup)
    
    function setup(setups) {
      var mode = "ARCADE";
    if (Object.keys(userdata["customracetemp"]).length == 0 || query["options"] == "random"|| query["options"] == "random_free") {
          
      var car = stats.currentcar(userdata)
      if (query["options"] == "random_free") {
      var regulations = {models: [],
    makes: [],
    types: [],
    countries: [],
    tires: "Racing",
    drivetrains: [],
    engines: [],                     
    fpplimit: 9999,
    upperfpp: 9999,
    lowerfpp: 0,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0,
    special: [],
    prohibited: []                     
    }
      } else {
    var regulations = {models: [],
    makes: [],
    types: [require(gtf.CARS).get({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })["type"].split(":")[0]],
    countries: [],
    tires: "Racing",
    drivetrains: [],
    engines: [],                     
    fpplimit: car["fpp"] + 30,
    upperfpp: car["fpp"] + 30,
    lowerfpp: car["fpp"] - 50,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0,
    special: [],
    prohibited: []                     
    }
      }
        query["options"] = "list"
        var list = [];
          var raceprep = {
            mode: mode,
            modearg: "beginner",
            trackselect: "RANDOM",
            track: {types:["Tarmac"]},
            players: [],
            other: [],
        };
      
      var racesettings = require(gtf.RACE).setracesettings(raceprep)

      var finalgrid = require(gtf.RACE).creategrid(regulations, car, racesettings["grid"]);
      userdata["customracetemp"]  = {racesettings: {...racesettings, ...regulations}}
      userdata["customracetemp"]["finalgrid"] = finalgrid
      userdata["customracetemp"]["eventid"] = setups["events"].length + 1
      userdata["customracetemp"]["racesettings"]["title"] = "Custom Race #" + (setups["events"].length + 1)
      userdata["customracetemp"]["racesettings"]["misc"] = {car:car}
      
   } else {
    if (query["options"] == "load" && typeof query["number"] !== 'undefined') {

      
      userdata["customracetemp"] = setups["events"][parseInt(query["number"])-1]
      query = {options:"list"}
    }
      var userthere = false
     userdata["customracetemp"]["finalgrid"] = userdata["customracetemp"]["finalgrid"].map(function(x, i) {
       x["place"] = (i + 1)
       x["position"] = (i + 1)
       if (x["user"]) {
        userthere = true
        var user = require(gtf.RACE).creategrid(userdata["customracetemp"]["racesettings"], stats.currentcar(userdata), 1)[0]
       user["place"] = (i + 1)
       user["position"] = ( i + 1)
         return user
       } else {
         return x
       }
     })
    if (!userthere) {
      var user = require(gtf.RACE).creategrid(userdata["customracetemp"]["racesettings"], stats.currentcar(userdata), 1)[0]
       user["place"] = userdata["customracetemp"]["finalgrid"].length
       user["position"] = userdata["customracetemp"]["finalgrid"].length
       userdata["customracetemp"]["finalgrid"][userdata["customracetemp"]["finalgrid"].length - 1] = user
    }
       userdata["customracetemp"]["racesettings"]["misc"] = {car:stats.currentcar(userdata)}
      userdata["customracetemp"]["grid"] =  userdata["customracetemp"]["finalgrid"].length
   }
      
    if (query["options"] == "load") {
      if (setups["events"].length == 0) {
        require(gtf.EMBED).alert({ name: "❌ No Events", description: "There are no events saved.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
      
      delete query["number"]
        
      embed.setTitle("__**Custom Race: Setups (" + setups["events"].length + "/" + require(gtf.GTF).eventlimit + ")**__");

      var list = setups["events"].map(function (event) {
          return "`ID:"+ (event["eventid"]) + "` " + event["racesettings"]["title"] + " `" + event["date"] + "`";
        });
        pageargs["list"] = list;
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "**❓ Choose a number that corresponds to the saved events. Event setups can be used in custom races and lobbies.**"
        }
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      }

    if (query["options"] == "delete") {
      var number = query["number"];
        if (!require(gtf.MATH).betweenInt(number, 1, setups["events"].length + 1)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your event setups.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = setups["events"][number-1]["racesettings"]["title"]
        embed.setDescription("⚠ Delete " + "`ID:" + number + "` " + "**" + name + "**?");
          var emojilist = [
  { emoji: emote.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, delete1)
      function delete1(msg) {
          function deletesetup() {
            require(gtf.LOBBY).delete(number-1, setups, userdata)
             setTimeout(function() {require(dir + "commands/" + pageargs["command"]).execute(msg, {options:"load", extra:"Deleted " + "`🕛ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletesetup]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      
        return;
      }                                          
      
     if (query["settings"] == 1 || query["options"] == "start") {
        var raceprep = {
                  mode: "ARCADE",
                  modearg: "custom_" + userdata["customracetemp"]["racesettings"]["difficulty"],
                  carselect: "GARAGE",
                  car: stats.currentcar(userdata),
                  trackselect: "SELECT",
                  track: {},
                  players: userdata["customracetemp"]["finalgrid"],
                  racesettings: userdata["customracetemp"]["racesettings"],
                  other: [],
          };
       raceprep["racesettings"]["positions"] = require(gtf.RACE).calculatecredits(userdata["customracetemp"]["racesettings"], {modearg:"custom"}, userdata["customracetemp"]["finalgrid"])
              require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
       return
     }

     if (query["options"] == "grid") {
       query["options"] = "set"
       query["settings"] = 10
     }
      if (query["options"] == "regulations") {
       query["options"] = "set"
       query["settings"] = 11
      }
      if (query["options"] == "list") {
        pageargs["list"] = createmenu()
        if (!pageargs["list"]) {
          return
        }
        pageargs["selector"] = "settings"
        pageargs["query"] = query
          if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **This is the Custom Race menu where you can adjust event settings such as track, laps, environment, and difficulity. Regulations and grid can also be adjusted in the second page.**"
        }
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      }

      else if (query["options"] == "settings" || query["options"] == "set" || query["options"] == "regulations") {
      pageargs["carselectmessage"] = false
        

        var changes = [];
        var settings = ["track", "lap", "endurance", "time", "weather", "wet",  "gridcount", "difficulty", viewgrid, viewregulations, clearregulations, saveevent]
        
        var setting = query["settings"]
        if (query["settings"] == 11) {
          if (typeof query["number"] !== 'undefined') {
            if (query["number"] == 1) {
              require(dir + "commands/customrace").execute(msg, {options: "list"}, userdata);
              return
            }
          }
        }
        if (setting == 1) {
            require(dir + "commands/customrace").execute(msg, {options: "list"}, userdata);
            return
        }
          if (setting == 11) {
            if (typeof query["number"] !== 'undefined') {
              query["regulations"] = ["FPP", "tires", "makes", "countries", "types", "drivetrains", "engines"][query["number"]-1]
              delete query["number"]
              delete query["settings"]
            }
        }
        if (!isNaN(setting)) {
           setting = settings[parseInt(setting)-2]
        }
        
        if (typeof query["regulations"] !== 'undefined') {
          var setting = query["regulations"]
        }     
        if (typeof setting !== "string") {
          return setting()
        } else {
        require(gtf.LOBBY).settingsnregulations(setting, changes, userdata["customracetemp"], pageargs, embed, msg, userdata);
        
        racesettings = userdata["customracetemp"]["racesettings"]

        if (changes[0] == "ERROR" || changes[0] == "LIST") {
          pageargs["rows"] = 10
          return;
        }
        if (changes[0] == "SUCCESS") {
          pageargs["rows"] = 9
        }
        pageargs["rows"] = 9
        if (changes.length == 0) {
          require(gtf.EMBED).alert({ name: "❌ Error", description: "Invalid arguments.", embed: "", seconds: 0 }, msg, userdata);
          return;
        } else {
          delete query["number"]
          query["settings"] = 11
          
          if (typeof query["regulations"] !== 'undefined') {
          delete query["regulations"]
            query = {options: "set", settings:11, extra: changes.join(",")}
            viewregulations()
            return
          }
        query = {options: "list"}
        pageargs["list"] = createmenu()
          if (!pageargs["list"]) {
          return
        }
        pageargs["selector"] = "settings"
        pageargs["query"] = query
          if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **This is the Custom Race menu where you can adjust event settings such as track, laps, environment, and difficulty. Regulations and grid can be adjusted in the second page.**"
        }
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
          return;
        }
      } 
      }
      
      function createmenu() {
      stats.save(userdata)
    racesettings = userdata["customracetemp"]["racesettings"]
    var car = stats.currentcar(userdata)

    function checktires() {
       if (!require(gtf.GTF).checktireregulations(car, {tires:racesettings["tires"]}, cont, "", msg, embed, userdata)) {
        pageargs["footer"] = ""
        return false
      } else {
         return cont()
      }
    }

    if (!require(gtf.GTF).checkregulations(car, racesettings, checktires, "", msg, embed,userdata)) {
      pageargs["footer"] = ""
      return false
    } else {
      return checktires()
    }
        function cont() {
        embed.setTitle("__**Custom Race Menu:** " + racesettings["title"] + "__");
      var difficulty = {90:"Beginner", 70:"Amateur", 50: "Professional", 30: "Expert", 10:"Extreme"}[racesettings["difficulty"]]
      var laps = typeof racesettings["laps"] === "string" ? "N/A" : racesettings["laps"]
      var time = typeof racesettings["laps"] !== "string" ? "N/A" : racesettings["laps"]
      var credits = require(gtf.MATH).numFormat(require(gtf.RACE).calculatecredits(racesettings, {modearg:"custom"}, userdata["customracetemp"]["finalgrid"])[0]["credits"])
      return ["__**🏁 Go Race**__", 
           "__**Track:**__ " + "`" + racesettings["track"]["name"] + "`", 
        "__**Laps:**__ " + "`" + laps + "`",
        "__**Time Limit:**__ " + "`" + time + "`",
         "__**Time:**__ " + "`" + racesettings["time"]["emoji"] + " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] + "`", 
         "__**Weather:**__ " + "`" + racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + "`", 
         "__**Wet Surface %:**__ " + "`" + "💧" + racesettings["weather"]["wetsurface"] + "%" + "`", 
          "__**Number of Cars:**__ " + "`" + racesettings["grid"] + " Cars" + "`",
      "__**Difficulty:**__ " + "`" + difficulty + "`",
              emote.cargrid + " __**Edit Grid**__ ",
             "📜 __**Edit Regulations**__","🆓 __**Clear Regulations**__","💾 __ **Save Event**__\n**Highest Reward:** " + "**" + credits + emote.credits + "**"]
    }
      }

      function viewgrid() {
        embed.setTitle("__**Custom Race: Grid**__")
        finalgrid = userdata["customracetemp"]["finalgrid"]
        var list = finalgrid.slice().map(function (x) {
                  if (x["user"]) {
                    return + x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
            })
        list.unshift("↩ __**Go Back & Save**__")

             if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is where you can customize the grid in custom race. Selecting a car will highlight it and you can move it's position when you select a different place. You can also add/remove AI drivers.**"
      }

      var select = 0;
      var selected = -1
      var selectmove = true
      var reset = true;
      var index = 0;

      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);

      stats.addcount(userdata);
      var emojilist = [
        { emoji: emote.yes, emoji_name: "Yes", name: "", extra: "", button_id: 0 },
        {
          emoji: emote.uparrow,
          emoji_name: "uparrow",
          name: "",
          extra: "",
          button_id: 1,
        },
        {
          emoji: emote.downarrow,
          emoji_name: "downarrow",
          name: "",
          extra: "",
          button_id: 2,
        }, 
        {
          emoji: "🤖",
          emoji_name: "🤖",
          name: "Add AI Driver",
          extra: "",
          button_id: 3,
        },
        {
          emoji: "🤖",
          emoji_name: "🤖",
          name: "Remove AI Driver",
          extra: "",
          button_id: 4,
        }
      ];
      var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

      list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
  
        
      embed.setDescription(results + pageargs["footer"]);

      require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons }, tuningf)
      
      function tuningf(msg) {
        function selectoption() {
          if (select == 0) {
            userdata["customracetemp"]["finalgrid"] = finalgrid.map(function(x,i) {
              x["position"] = (i + 1)
              x["place"] = (i + 1)
              return x
            })
            userdata["customracetemp"]["racesettings"]["grid"] = finalgrid.length 
            stats.save(userdata)
            require(dir + "commands/customrace").execute(msg, {options: "list"}, userdata);
            return
        }
        if (selected == -1) {
            selected = select
            list[select] = "**" + list[select] + "**";
 
            results = list.join("\n").replace(/\/n/ig, "\n");
            embed.setDescription(results + pageargs["footer"]);
            
            msg.edit({ embeds: [embed], components: buttons });
            return
        } else {
          [finalgrid[selected-1], finalgrid[select-1]] = [finalgrid[select-1], finalgrid[selected-1]]
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })
        
      list.unshift("↩ __**Go Back & Save**__")
      select = 0
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return
  
        }
        
        }

        function addai() {

          if (finalgrid.length >= 16) {
            return
          }

        var obj = userdata["customracetemp"]["racesettings"]
        var copy = Object.assign({}, obj);
        copy["condition"] = "AIONLY"
          var car = require(gtf.RACE).creategrid(copy, stats.currentcar(userdata), 2)[1]
          finalgrid.splice(select+1, 0, car);
          select++
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })
       list.unshift("↩ __**Go Back & Save**__")
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return

        }

        
        function removeai() {
          if (finalgrid[select-1]["user"]) {
            return
          }
          finalgrid.splice(select-1, 1);
          select--
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })
        list.unshift("↩ __**Go Back & Save**__")
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return
        }

        function up() {
          list[select] = list[select].split(" ").slice(1).join(" ")
          select--;
          if (select <= -1) {
            select = list.length - 1;
          }

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
           if (selected > -1 && selectmove) {
          list[selected] = "**" + list[selected].split(" ").slice(0).join(" ")
          selectmove = false
          }
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function down() {
          list[select] = list[select].split(" ").slice(1).join(" ")
          var index = 0;
          select++;
          if (select >= list.length) {
            select = 0;
          }

          list[select] = userdata["settings"]["PROGRESSBAR"][0] + " " + list[select];
           if (selected > -1 && selectmove) {
          list[selected] = "**" + list[selected].split(" ").slice(0).join(" ")
          selectmove = false
          }
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function changeai() {
          
          var args = { make: userdata["customracetemp"]["racesettings"]["makes"],
                       types: userdata["customracetemp"]["racesettings"]["types"], drivetrains: userdata["customracetemp"]["racesettings"]["drivetrains"], engines: userdata["customracetemp"]["racesettings"]["engines"], countries: userdata["customracetemp"]["racesettings"]["countries"]}
          
          pageargs["list"] = require(gtf.CARS).find(args).map(i => {
          var fpp = require(gtf.PERF).perf(i, "DEALERSHIP")["fpp"];
      var cost = require(gtf.CARS).costcalc(i, fpp);
      var name = i["name"];
      var year = i["year"];
      var numbercost = (i["carcostm"] == 0) ? "❌" : require(gtf.MATH).numFormat(cost)
      return name + " " + year + " **" + fpp + emote.fpp + "**"
          })
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is where you can customize the grid in custom race. Selecting a car will highlight it and you can move it's position when you select a different place. You can also add/remove AI drivers.**"
      }
        pageargs["numbers"] = true
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        }

        var functionlist = [selectoption, up, down, addai, removeai];
        gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
      };
        
        return
      }

      function viewregulations() {
        embed.setTitle("__**Custom Race: Regulations**__")
        
        var racesettings =  userdata["customracetemp"]["racesettings"]
         var makes = racesettings["makes"].length == 0 ? "Open" : racesettings["makes"].join(", ")
         var countries = racesettings["countries"].length == 0 ? "Open" : racesettings["countries"].join(", ")
        var types = racesettings["types"].length == 0 ? "Open" : racesettings["types"].join(", ")
        var drivetrains = racesettings["drivetrains"].length == 0 ? "Open" : racesettings["drivetrains"].join(", ")
        var engines = racesettings["engines"].length == 0 ? "Open" : racesettings["engines"].join(", ")
        
        pageargs["list"] = ["↩ __**Go Back & Save**__" + "\n**Limit: " + racesettings["fpplimit"].toString().replace("9999", "---") + emote.fpp + " | " + racesettings["upperpower"].toString().replace("9999", "---") + " HP" + " | " + racesettings["upperweight"].toString().replace("9999", "---") + " Ibs" + "**"+"\n**AI Minimum FPP:** " + "**" + racesettings["lowerfpp"].toString().replace("9999", "---") + emote.fpp + "**",
        "**Maximum Tire Grade:** " + racesettings["tires"],
        "**Makes:** " + makes,
        "**Countries:** " + countries,
        "**Types:** " + types,
        "**Drivetrains:** " + drivetrains,          "**Engine Aspirations:** " + drivetrains]
        if (typeof query["extra"] !== 'undefined') {
          try {
          var finalgrid = require(gtf.RACE).creategrid(racesettings, stats.currentcar(userdata), racesettings["grid"]);
        userdata["customracetemp"]["finalgrid"] = finalgrid
        stats.save(userdata)
        var extra = "/n/n" + "✅ " + query["extra"] + "/n" + "⚠ The grid has been reset to random opponents meeting these regulations."
          } catch (error) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Regulations", description: "This regulation can not be applied as there are no AI cars are eligible.", embed: "", seconds: 0 }, msg, userdata);
            return
          }
          
          pageargs["list"][pageargs["list"].length-1] = pageargs["list"][pageargs["list"].length-1] + extra
          delete query["extra"]
          delete query["regulations"]
        }
        
        pageargs["selector"] = "regulations"
        pageargs["query"] = query
          if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **This is the regulations menu. Certain settings that require additional arguments (FPP/AI Minimum FPP) must be set in the slash command menu.**"
        }
        
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      }

      function saveevent() {
 require(gtf.LOBBY).savesettings(userdata["customracetemp"], userdata)
        require(gtf.EMBED).alert({ name: "✅ Success", description: "Event settings saved.", embed: [], seconds: 3 }, msg, userdata);
        return
      }
      function clearregulations() {
        var regulations = {models: [],
    makes: [],
    types: [],
    countries: [],
    tires: "Racing",
    drivetrains: [],
    engines: [],                     
    fpplimit: 9999,
    upperfpp: 9999,
    lowerfpp: 0,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0,
    special: [],
    prohibited: []                     
    }
        racesettings = {...userdata["customracetemp"]["racesettings"], ...regulations}
      userdata["customracetemp"]["racesettings"] = racesettings
        query = {options: "list"}
        pageargs["query"] = {options: "list"}
        pageargs["list"] = createmenu()
          if (!pageargs["list"]) {
          return
        }
        pageargs["selector"] = "settings"
        pageargs["query"] = query
          if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **This is the Custom Race menu where you can adjust event settings such as track, laps, environment, and difficulity. Regulations and grid can also be adjusted in the second page.**"
        }
        pageargs["numbers"] = false
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        
        return;
      }
  }
  }
}
