var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "seasonal",
  title: "Seasonal Events",
  cooldown: 3,
  license: "N", level: 13,
  license: "N", aliases: ["seasonals"],
  channels: ["testing", "gtf-mode", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: [''],
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
    var races = {}
    var mode = "CAREER";
    stats.load("SEASONALS", userdata, seasonal)

    function seasonal(races) {
      if (races["races"]["seasonals"]["date"] != userdata["seasonalcheck"]) {
      var careeraceskeys = Object.keys(userdata["careerraces"])
      userdata["seasonalcheck"] = races["races"]["seasonals"]["date"]
        for (var i = 0; i < careeraceskeys.length; i++) {
      if (careeraceskeys[i].includes("seasonal")) {
      userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
      }
}
      }


      if (query["options"] == "list") {
      delete query["number"]
        var ids = Object.keys(races["races"]);
        results = []
        for (var t = 0; t < ids.length; t++) {
          var raceevent = races["races"][ids[t]];
          var rmakes = raceevent["makes"];
          var rmodels = raceevent["models"];
          var drivetrains = raceevent["drivetrains"]
          var tires = raceevent["tires"]
          var rcountries = raceevent["countries"]
          var engines = raceevent["engines"]
          
           var rmake = rmakes.length != 0 ? rmakes.join(", ") + " | ": ""
          var rcountry = rcountries.length != 0 ? rcountries.join(", ") + " | " : ""
          var rmodel = rmodels.length != 0 ? rmodels.join(", ") + " | ": ""
          var drivetrain = drivetrains.length != 0 ? drivetrains.join(", ") + " | " : ""
          var engine = engines.length != 0 ? engines.join(", ") : ""
          var bop = raceevent["bop"] ? (" " + emote.bop) : ""
          var weather = (raceevent["weatherchange"] >= 1) ? (" " + emote.weather) : ""
          var championship = raceevent["championship"][0] ? ("🏆 ") : ""
          var any = [rcountry,rmake,rmodel,drivetrain,engine,bop].join("").length != 0 ? "" : "None"

          results.push(
            "__**" + raceevent["title"] +
            " - " +
            raceevent["tracks"].length +
            " Races " + "**__ " +
            stats.eventstatus("seasonal" + "-" + (t + 1), userdata) +
            "/n" +
            "**Limit: " +
            raceevent["fpplimit"].toString().replace("9999", "Any") +
            emote.fpp + emote.tire + tires +
            "**/n" +
            "**Regulations:** " +
           rcountry + rmake +
            rmodel + drivetrain + engine + bop + any +
            "/n" +
            "**Types:** " +
            raceevent["types"].join(", ")
          )
        }
        embed.setTitle("🎉 __Seasonal Events" + " (" + ids.length + " Events)" + "__");

        pageargs["list"] = results;
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "\n" + "**❓ Select an event from the list above using the numbers associated with the buttons. Seasonals run daily, meaning that any progress will be reset every 48 hours.**"
        } 
  
        var date = new Date();
        
        var hoursleft = ( (23 * (4 - races["count"].length)) - date.getHours())
        
        pageargs["footer"] = "`🎉 Ends: " + "~" + hoursleft + " hours`" + pageargs["footer"]
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
         setTimeout(function() {
          var t = 0 
            for (t; t < ids.length; t++) {
          raceevent = races["races"][ids[t]];
          var achieve = stats.isracescomplete("seasonal" + "-" + (t + 1), raceevent["tracks"].length, 1, userdata);
          if (achieve) {
            stats.eventcomplete("seasonal" + "-" + (t + 1), userdata);
            stats.gift(emote.goldmedal + " Congrats! Completed " + raceevent["title"].split(" - ")[0] + " " + emote.goldmedal, raceevent["prize"], embed, msg, userdata);
          }
            }
          }, 2000)
        return;
      }
      
      if (query["options"] == "select") {
      query["number"] = parseInt(query["number"])

      if (!require(gtf.MATH).betweenInt(query["number"], 1, Object.keys(races["races"]).length)) {
           require(gtf.EMBED).alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
           return
      }
      if (stats.eventstatus("seasonal" + "-" + query["number"], userdata) == "✅") {
        require(gtf.EMBED).alert({ name: "❌ Seasonal Event Complete", description: "This seasonal event can not be repeated after **Gold** completion.", embed: "", seconds: 3 }, msg, userdata);  
      }
     
      embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
      var event = require(gtf.RACE).careerevent(races["races"], query, embed, msg, asyncrace, userdata);
     if (event == "Invalid") {
          return
      }

      function asyncrace(event) {
        if (event == "Invalid") {
          return;
        }

        var raceprep = {
          mode: mode,
          modearg: "",
          carselect: "GARAGE",
          car: stats.currentcar(userdata),
          trackselect: "N/A",
          track: {types:["Tarmac"]},
          racesettings: event,
          other: [],
        };
        require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
      }
      }

    }
  },
};
