var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
//////////////////////////////////////////////////// "testing", "gtf-demo", "⭐"

module.exports = {
  name: "garage",
  title: "My Garage",
  level: 0,
  aliases: ["g"],
  channels: ["testing", "gtf-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
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
      numbers: false,
      buttons: true,
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (userdata["inlobby"]["active"] && query["extra"] != "silent") {
      if (msg.channel.type == 11) {
       require(dir + "commands/lobby").execute(msg, {options:"garage"}, userdata);
      } else {
          require(gtf.EMBED).alert({ name: "❌ Lobby In Session", description: "You are unable to use your garage outside of the lobby you are in.", embed: "", seconds: 0 }, msg, userdata); 
        }
      return
    }
    
    if (userdata["id"] == "237450759233339393") {
      //query["name"] = "Nissan"
    }

    if (!isNaN(query["options"])) {
      query["number"] = parseInt(query["number"]);
    }
    var filterlist = []
    query["manufacturer"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes('manufacturer')))
    query["manufacturer"] = [Object.values(query["manufacturer"])[0]]
    
    if (typeof query["manufacturer"][0] === 'undefined') {
      query["manufacturer"] = undefined
    } else {
      query["manufacturer"] = query["manufacturer"][0].replace(/,/g, "-")
    }
        
    if (typeof query["country1"] !== 'undefined') {
      filterlist.push(function(x) {return require(gtf.CARS).get({ make: [x["make"]], fullname: [x["name"]], year: [x["year"]] })["country"].includes(query["country1"])})
    }
    
    if (typeof query["type1"] !== 'undefined') {
      filterlist.push(function(x) {return require(gtf.CARS).get({ make: [x["make"]], fullname: [x["name"]], year: [x["year"]] })["type"].includes(query["type1"])})
    }
    if (typeof query["name"] !== 'undefined') {
      var re = new RegExp(query["name"], 'ig');
       filterlist.push(function(x) {return x["name"].match(re) != null})
    }
    if (typeof query["drivetrain1"] !== 'undefined') {
      filterlist.push(function(x) {return require(gtf.CARS).get({ make: [x["make"]], fullname: [x["name"]], year: [x["year"]] })["drivetrain"].includes(query["drivetrain1"])})
    }
    if (typeof query["engine1"] !== 'undefined') {
      filterlist.push(function(x) {return require(gtf.CARS).get({ make: [x["make"]], fullname: [x["name"]], year: [x["year"]] })["engine"].includes(query["engine1"])})
    }
    if (typeof query["special1"] !== 'undefined') {
      filterlist.push(function(x) {return require(gtf.CARS).get({ make: [x["make"]], fullname: [x["name"]], year: [x["year"]] })["special"].includes(query["special1"])})
    }
    if (typeof query["fpplimit"] !== 'undefined') {
       filterlist.push(function(x) {return x["fpp"] <= query["fpplimit"]})
    }
    if (typeof query["manufacturer"] !== 'undefined') {
       filterlist.push(function(x) {return x["make"].includes(query["manufacturer"])})
    }
    
    if (typeof query["filter"] === 'undefined') {
      query["filter"] = {"function":function(x) {return x}, "args": ""}
    }
    if (Array.isArray(query["filter"])) {
      filterlist = query["filter"]
    }
    
    if (query["options"] === "viewcurrent") {
        query["options"] = "view"
        query["number"] = stats.currentcarnum(userdata);
    }
    
    var makee = (typeof query["manufacturer"] == 'undefined') ? "" : " (" + query["manufacturer"] + ")"
  var country = (typeof query["country1"] == 'undefined') ? "" : " (" + query["country1"] + ")"
    var type = (typeof query["type1"] == 'undefined') ? "" : " (" + query["type1"] + ")"
    var drivetrain = (typeof query["drivetrain1"] == 'undefined') ? "" : " (" + query["drivetrain1"] + ")"
    var engine = (typeof query["engine1"] == 'undefined') ? "" : " (" + query["engine1"] + ")"
    var special = (typeof query["special1"] == 'undefined') ? "" : " (" + query["special1"] + ")"
    var name = (typeof query["name"] == 'undefined') ? "" : " (" + query["name"] + ")"

    if (name.length >= 20) {
      name = name.substring(0,20) + "..."
    }

    if (query["favoritesonly"] == 'enable') {
       filterlist.push(function(x) {return x["favorite"]})
    }

    if (query["options"] == "list") {
       delete query["number"]
      embed.setTitle("🏠" + " __Garage: " + stats.garagecount(userdata) + "/" + require(gtf.GTF).garagelimit + " Cars (" + userdata["settings"]["GARAGESORT"] + ")" + makee + country + type + drivetrain + engine + special + name + "__");
        var cars = stats.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))
        if (cars.length == 0) {
          require(gtf.EMBED).alert({ name: "❌ No Cars", description: "There are no cars with this type in your garage.", embed: "", seconds: 3 }, msg, userdata);
        return;
        }
        list = cars.map(function(i, index) {
          var favorite = i["favorite"] ? " ⭐" : ""
          var name = require(gtf.CARS).shortname(i["name"])
          carname = name + " " + require(gtf.CONDITION).condition(i)["emote"] + " **" + i["fpp"] + emote.fpp + "**" + favorite
          if (stats.currentcarnum(userdata) == index+1)  {
            carname = "`🚘" + (index + 1) + "` **" + name + "** **" + i["fpp"] + emote.fpp + "**" + favorite 
          }
          if (type != "") {
            carname = "`🚘" + (index + 1) + "` " + name + " **" + i["fpp"] + emote.fpp + "**" + favorite
          }
          if (name != "") {
            carname = name + " " + require(gtf.CONDITION).condition(i)["emote"] + " **" + i["fpp"] + emote.fpp + "**" + favorite
          }
          return carname
        })
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ This contains your garage cars.\nFor each car, there is an ID of the ordered list based on your garage sorting type, and the FPP (Fitness Performance Points).**" 
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["selector"] = "number"
      pageargs["query"] = query
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "sell") {
      var number = query["number"];
      var number2 = query["number"];

      if (number <= 0 || isNaN(number) || number === undefined || number > stats.garagecount(userdata)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
      if (number <= stats.currentcarnum(userdata) && number2 >= stats.currentcarnum(userdata)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "You cannot sell your current car.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
      if (number2 == number) {
        var gtfcar = stats.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1];
        query = {options: query["options"], number: query["number"]}
        require(gtf.MARKETPLACE).sell(gtfcar, "CAR", query, embed, msg, userdata);
      } else {
        require(gtf.MARKETPLACE).sell([number, number2], "CARS", query, embed, msg, userdata);
      }
      return
    }
    if (query["options"] == "view") {
      var number = query["number"];
      if (number <= 0 || isNaN(number) || number > stats.garagecount(userdata)) {
        require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
      var gtfcar = stats.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1]
      var favorite = gtfcar["favorite"] ? "⭐" : ""
      embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + favorite);
      results = stats.view(gtfcar, embed, userdata);
      stats.loadcarimage(gtfcar, embed, userdata, then)

      function then(attachment) {
      embed.setThumbnail("attachment://image.png");
      stats.addcount(userdata);
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "\n" + "**❓ This contains detailed information about your garage car. You can set your car as a favorite by toggling the ⭐ button.**"
      }
      var details = 0
      embed.setDescription(results + pageargs["footer"]);
  var icon = require(gtf.CONDITION).condition(gtfcar)["emote"]

       var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: '', 
  extra: "",
  button_id: 0 },
  { emoji: "🔑", 
  emoji_name: "🔑", 
  name: 'Change Car', 
  extra: "",
  button_id: 1 },
  { emoji: "📄", 
  emoji_name: "📄", 
  name: 'Tuning/Details', 
  extra: "",
  button_id: 2 },
       { emoji: icon, 
  emoji_name: icon.split(":")[1], 
  name: 'Condition', 
  extra: "",
  button_id: 3 },
    { emoji: emote.credits, 
  emoji_name: "credits", 
  name: 'Sell', 
  extra: "",
  button_id: 4 },
]
var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
       require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons, files: [attachment]}, carfunc)
       
       function carfunc(msg) {
        function favoritecar() {
          if (gtfcar["favorite"]) {
            stats.favoritecar(number, false, filterlist, userdata)
            var title = embed.title.split(" ")
            title.pop()
            embed.setTitle(title.join(" "))
          } else {
            stats.favoritecar(number, true, filterlist, userdata)
            embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + "⭐");
          }
          if (query["favoritesonly"] == "enable") {
            require(dir + "commands/garage").execute(msg, {options:"list", filter:query["filter"]}, userdata);
          } else {          
            msg.edit({embeds: [embed], components:buttons});
          }
          
          stats.save(userdata)
          
            msg.edit({embeds: [embed], components:buttons});
        }
        function changecar() {
         require(dir + "commands/garage").execute(msg, {options:"select", number:parseInt(query["number"]), filter:filterlist}, userdata);
        }
        function view() {
          if (details == 0) {
            details = 1         
            var results2 = stats.view2(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          } else {
            details = 0
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          }
        }
        function carcondition() {
          var results2 = stats.viewcarcondition(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
        }
         
              function sellcar() {
         require(dir + "commands/garage").execute(msg, {options:"sell", number:parseInt(query["number"]), filter:filterlist}, userdata);
        }

        var functionlist = [favoritecar, changecar, view, carcondition, sellcar]
        gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    } 
    }
    
    if (query["options"] == "select") {
      var number = parseInt(query["number"]);
      var changecar = stats.setcurrentcar(number, filterlist, userdata);
      if (changecar == "Invalid") {
        require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 0 }, msg, userdata);
        return;
      } else {
        if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
          number = 1
        }
        var gtfcar = stats.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1];
        if (userdata["inlobby"]["active"]) {
          require(gtf.LOBBY).updateusercar(gtfcar, userdata);
        }
        if (query["extra"] == "silent") {
          //embed = msg.embeds[0]
          //embed = new EmbedBuilder(embed)
          
        } else {
          require(dir + "commands/garage").execute(msg, 
            {options:"list", 
             extra: "Selected the **" + gtfcar["name"] + " " + gtfcar["fpp"] + emote.fpp + "**" + " `🚘ID:" + number + "`.",
             filter:query["filter"]}, 
            userdata);
        }
      }
      
      stats.save(userdata)
      return;
    } 
  }
};
