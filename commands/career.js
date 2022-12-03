var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder, } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "career",
  title: "Career Mode",
  level: 0,
  aliases: ["c"],
  channels: ["testing", "gtf-mode", "gtf-demo"],

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
      rows: 10,
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
    
    var mode = "CAREER";
    if (parseInt(query["options"]) == 1) {
      query["options"] = "B";
    }
    if (parseInt(query["options"]) == 2) {
      query["options"] = "A";
      if (!require(gtf.EXP).checklevel(5, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 3) {
      query["options"] = "IC";
        if (!require(gtf.EXP).checklevel(10, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 4) {
      query["options"] = "IB";
      if (!require(gtf.EXP).checklevel(15, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 5) {
      query["options"] = "IA";
      if (!require(gtf.EXP).checklevel(20, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 6) {
      query["options"] = "S";
        if (!require(gtf.EXP).checklevel(25, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 7) {
      query["options"] = "KART";
      if (!require(gtf.EXP).checklevel(5, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 8) {
      query["options"] = "RALLY";
      if (!require(gtf.EXP).checklevel(15, embed, msg, userdata)) {
        return;
      }
    }
    if (parseInt(query["options"]) == 9) {
      query["options"] = "FORMULA";
      if (!require(gtf.EXP).checklevel(27, embed, msg, userdata)) {
        return;
      }
    }
    pageargs["image"].push( "https://github.com/J24681357/gtfbot/raw/master/images/career/" + query["options"].toUpperCase() + "_level.png")

    if (userdata["id"] == "237450759233339393") {
      query["options"] = "TESTING";
    }
    

    var races = [...require(gtf.CAREERRACES).find({types: [query["options"]] })]

    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🏁" + " __Career Mode__");
      results =
        "__**B Level**__ " +
        "\n" +
        "__**A Level**__ " +
        emote.exp +
        " `Lv.5`" +
        "\n" +
        "__**IC Level**__ " +
        emote.exp +
        " `Lv.10`" +
        "\n" +
        "__**IB Level**__ " +
        emote.exp +
        " `Lv.15`" +
        "\n" +
        "__**IA Level**__ " +
        emote.exp +
        " `Lv.20`" +
        "\n" +
        "__**S Level**__ " +
        emote.exp +
        " `Lv.25`" + "/n/n" + 
        "__Special Events__" + "\n" + 
        "__**Kart**__ " +  emote.exp +
        " `Lv.5`" + "\n" +
        "__**Rally**__ " +  emote.exp +
        " `Lv.15`" + "\n" +
        "__**Formula**__ " +  emote.exp +
        " `Lv.27`"
        var list = results.split("\n")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a league from the list above using the numbers associated with the buttons.\n`Lv.XX` represents that the driver level that is required.**";
      }
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return
    }
    var ids = Object.keys(races);
    if (ids.length != 0 && query["number"] === undefined) {
      results = []
        for (var t = 0; t < ids.length; t++) {
          var raceevent = races[ids[t]];
          
          var rmakes = raceevent["makes"];
          var rcountries = raceevent["countries"];
          var rmodels = raceevent["models"];
          var drivetrains = raceevent["drivetrains"]
          var engines = raceevent["engines"]
          var tires = raceevent["tires"]
          
          var rmake = rmakes.length != 0 ? rmakes.join(", ") + " | ": ""
          var rcountry = rcountries.length != 0 ? rcountries.join(", ") + " | " : ""
          var rmodel = rmodels.length != 0 ? rmodels.join(", ") + " | ": ""
          var drivetrain = drivetrains.length != 0 ? drivetrains.join(", ") + " | " : ""
          var engine = engines.length != 0 ? engines.join(", ") : ""
          var bop = raceevent["bop"] ? (" " + emote.bop) : ""
          var weather = (raceevent["weatherchange"] >= 1) ? (" " + emote.weather) : ""
          var championship = raceevent["championship"][0] ? ("🏆 ") : ""
          var any = [rcountry,rmake,rmodel,drivetrain,engine,bop].join("").length != 0 ? "" : "None"
          
          var types = raceevent["types"].length != 0 ? raceevent["types"].join(", ") : ""
          if (raceevent["type"] == "TIMETRIAL") {
            results.push(
            "⌛" +
            "__**" +
            raceevent["title"] + "**__" + " " +
            stats.eventstatus(query["options"] + "-" + (t + 1), userdata) +
            "/n" +
            "**Track:** " + raceevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + raceevent["car"]
          )
          } else {
          results.push(
            championship +
            "__**" +
            raceevent["title"] +
            " - " +
            raceevent["tracks"].length +
            " Races**__ " +
            stats.eventstatus(query["options"] + "-" + (t + 1), userdata) +
            "/n" +
            "**" +
            raceevent["fpplimit"].toString().replace("9999", "--") + emote.fpp + " " + 
            raceevent["upperpower"].toString().replace("9999", "--") + " hp" + " " + 
            gtftools.numFormat(raceevent["upperweight"].toString().replace("9999", "--")) + " Lbs" + " " +
            emote.tire  + tires + weather +
            "**/n" +
            "**Regulations:** " +
           rcountry + rmake +
            rmodel + drivetrain + engine + bop + any +
            "/n" +
            "**Types:** " +
            types
          )
        }
        }
        embed.setTitle("🏁 __Career Mode - " + query["options"].toUpperCase() + " (" + ids.length + " Events)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an event from the list above using the numbers associated with the buttons.\nEach event has car regulations that your current car must meet before entry, so change your car accordingly.**";
      }
      if (query['options'] == "KART") {
        pageargs["footer"] = emote.igorf + " **" + require(gtf.ANNOUNCER).say({name1:"intro", name2: "igorf"}) + "**"
      }
      if (query['options'] == "FORMULA") {
        pageargs["footer"] = emote.lewish + " **" + require(gtf.ANNOUNCER).say({name1:"intro", name2: "lewish"}) + "**"
      }
        pageargs["rows"] = 3
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);

         setTimeout(function() {
          var t = 0 
            for (t; t < ids.length; t++) {
          raceevent = races[ids[t]];
          var achieve = stats.isracescomplete(query["options"].toLowerCase() + "-" + (t + 1), raceevent["tracks"].length, 1, userdata);
          if (achieve) {
            stats.eventcomplete(query["options"].toLowerCase() + "-" + (t + 1), userdata);
            stats.gift(emote.goldmedal + " Congrats! Completed " + raceevent["title"].split(" - ")[0] + " " + emote.goldmedal, raceevent["prize"], embed, msg, userdata);
          }
            }
          }, 2000)
        return;
    }

    query["number"] = parseInt(query["number"])
      if (!gtftools.betweenInt(query["number"], 1, Object.keys(races).length) && !isNaN(query["number"])) {
          require(gtf.EMBED).alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
          return
      }
      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
      var event = require(gtf.RACE).careerevent(races, query, embed, msg, asyncrace, userdata);
      if (event == "Invalid") {
          return
      }

      function asyncrace(event) {
        if (event == "Invalid") {
          return;
        }
        if (event["type"] == "TIMETRIAL") {
        var raceprep = {
          mode: mode,
          modearg: "",
          carselect: "LOANER",
          car: {},
          trackselect: "N/A",
          track: {},
          racesettings: event,
          other: [],
        }
        } else {
        var raceprep = {
          mode: mode,
          modearg: "",
          carselect: "GARAGE",
          car: stats.currentcar(userdata),
          trackselect: "N/A",
          track: {},
          racesettings: event,
          other: [],
        };
      }
         require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
      }
      }
}
