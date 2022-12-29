var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder, } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "license",
  title: "License Center",
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
      if (!stats.checklicense("B", embed, msg, userdata)) {
        return
      }
    }
    if (parseInt(query["options"]) == 3) {
      query["options"] = "IC";
      if (!stats.checklicense("A", embed, msg, userdata)) {
        return
      }
    }
    if (parseInt(query["options"]) == 4) {
      query["options"] = "IB";
      if (!stats.checklicense("IC", embed, msg, userdata)) {
        return
      }
    }
    if (parseInt(query["options"]) == 5) {
      query["options"] = "IA";
      if (!stats.checklicense("IB", embed, msg, userdata)) {
        return
      }
    }
    if (parseInt(query["options"]) == 6) {
      query["options"] = "S";
      if (!stats.checklicense("IA", embed, msg, userdata)) {
        return
      }
    }
    
    pageargs["image"].push( "https://github.com/J24681357/gtfbot/raw/master/images/career/" + query["options"].toUpperCase() + "_level.png")
    

    var licenses = [...require(gtf.CAREERRACES).find({types: [ "LICENSE" + query["options"]] })]

    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("💳" + " __License Center__");
      results =
        "__**B License**__ " +
        "\n" +
        "__**A License**__ " +
        "\n" +
        "__**IC License**__ " +
        "\n" +
        "__**IB License**__ " +
        "\n" +
        "__**IA License**__ " +
        "\n" +
        "__**S License**__ "
        /*+ "/n/n" +
        "__Special Events__" + "\n" + 
        "__**Kart**__ " +  emote.exp +
        " `Lv.5`" + "\n" +
        "__**Rally**__ " +  emote.exp +
        " `Lv.15`" + "\n" +
        "__**Formula**__ " +  emote.exp +
        " `Lv.27`"
        */
        var list = results.split("\n")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a license from the list above using the numbers associated with the buttons.\nEach license has a different difficulty. Increasing your experience level will help you complete tests more efficiently.**";
      }
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return
    }
    var ids = Object.keys(licenses);
    if (ids.length == 0) {
      require(gtf.EMBED).alert({ name: "❌ Invaild", description: "There are no license here.", embed: "", seconds: 3 }, msg, userdata);
      return
    }

    if (typeof query["number"] === 'undefined') {
      results = []
        for (var t = 0; t < ids.length; t++) {
          var licenseevent = licenses[ids[t]];
          
          if (licenseevent["type"] == "TIMETRIAL") {
            results.push(
            "⌛" +
            "__**" +
            licenseevent["title"] + "**__" + " " +
            stats.eventstatus(licenseevent["eventid"], userdata) +
            "/n" +
            "**Track:** " + licenseevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + licenseevent["car"]
          )
          }
        }
        embed.setTitle("🏁 __License Center - " + query["options"].toUpperCase() + " (" + ids.length + " Tests)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an event from the list above using the numbers associated with the buttons.\nEach event has car regulations that your current car must meet before entry, so change your car accordingly.**";
      }
        pageargs["rows"] = 3
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
      setTimeout(function() {
         var bronzecomplete = stats.checklicensetests(query["options"], "3rd", userdata);
         var goldcomplete = stats.checklicensetests(query["options"], "1st", userdata);
        if (bronzecomplete && !stats.checklicense(query["options"], "", msg, userdata)) {
          stats.completelicense(query["options"].toUpperCase(), userdata);
          var option = query["options"].toLowerCase()
            var total = 6
            if (option.includes("ic")) {
              total = 4
              }
          var prize = licenses[ids[total-1]]["prize"]
          stats.redeemgift("🎉 License " + query["options"].toUpperCase() + " Achieved 🎉", prize, embed, msg, userdata);
        }
        if (goldcomplete) {
          var option = query["options"].toLowerCase()
            var total = 6
            if (option.includes("ic")) {
              total = 4
            }
          var args = licenses[ids[total]]["prize"]["item"]
          var car = require(gtf.CARS).random(args, 1)[0];
          stats.addgift({
      id: -1, type:"CAR", name: "License " + option.toUpperCase() + ": All Gold Reward", item: car, author: "GT FITNESS", inventory: true }, userdata)
        }
      },2000)
        return;
    }
    //

    var number = parseInt(query["number"])
      if (!gtftools.betweenInt(number, 1, Object.keys(licenses).length) && !isNaN(number)) {
          require(gtf.EMBED).alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
          return
      }
     // embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
var event = {...licenses[number-1]}
      var raceprep = {
          mode: "LICENSE",
          modearg: "",
          track: event["tracks"][0][1],
          car: event["car"],
          racesettings: event,
          other: {}
      }
    raceprep["racesettings"]["laps"] = event["tracks"][0][2]
    raceprep["racesettings"]["mode"] = "LICENSE"
      var gtfcar = stats.currentcar(userdata)
        require(gtf.RACE).raceprep(raceprep, gtfcar, embed, msg, userdata);
      }
}
