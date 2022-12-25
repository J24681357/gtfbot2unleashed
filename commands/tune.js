var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "tune",
  title: "GTF Auto - Tuning Shop",
  cooldown: 3,
  level: 4,
  channels: ["testing", "gtf-mode", "gtf-test-mode"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: [],
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
    var results2 = "";
    var select = "";
    var gtfcar = stats.currentcar(userdata);
    var ocar = require(gtf.CARS).get({ make: [gtfcar["make"]], fullname: [gtfcar["name"]]});

    if (typeof query["number"] !== 'undefined') {
      tune("")
      return
    }
    stats.loadcarimage(gtfcar, embed, userdata, tune)

    function tune(attachment) {
    pageargs["image"].push(attachment)

    if (query["type"] == "engine" || query["type"] == "eng" || query["type"] == "e" || parseInt(query["type"]) == 1) {
      var type = "engine";
    }

    if (query["type"] == "transmission" || query["type"] == "trans" || query["type"] == "tr" || parseInt(query["type"]) == 2) {
      
      var type = "transmission";
      
    }

    if (query["type"] == "suspension" || query["type"] == "susp" || query["type"] == "sus" || query["type"] == "su" || parseInt(query["type"]) == 3) {
      
      var type = "suspension";
    }

    if (query["type"] == "tires" || query["type"] == "tire" || query["type"] == "ti" || parseInt(query["type"]) == 4) {
      
      var type = "tires";
    }

    if (query["type"] == "weight-reduction" || query["type"] == "weight" || query["type"] == "we" || parseInt(query["type"]) == 5) {
      
      var type = "weight-reduction";
    }

    if (query["type"] == "turbo" || query["type"] == "supercharger" || query["type"] == "tu" || parseInt(query["type"]) == 6) {
      
      var type = "turbo";
    }
      
    if (query["type"] == "brakes" || query["type"] == "brake" || query["type"] == "br" || parseInt(query["type"]) == 7) {
      
      var type = "brakes";
    }

    if (query["type"] == "aero-kits" || query["type"] == "aero-kit" || query["type"] == "aero" || parseInt(query["type"]) == 8) {
      var type = "aero-kits";
    }

    if (query["type"] == "maintenance" || parseInt(query["type"]) == 9) {
      var type = "maintenance"
    }

    if (type == "maintenance") {
      embed.setTitle("🔧 __GTF Auto - Maintenance Service__");
      var partscount = {"Car Wash":0, "Oil Change":0, "Engine Repair": 0, "Transmission Repair": 0, "Suspension Repair": 0, "Body Damage Repair": 0}
      var keys = Object.keys(partscount)
      var costs = []
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        var part = require(gtf.PARTS).find({ type: type })[0];
        costs.push(require(gtf.PARTS).costcalc(part, gtfcar, ocar))
      }
      
      if (typeof query["number"] === 'undefined') {
      var list = ["**" + gtftools.numFormat(costs[0]) + emote.credits + "** " + "__**Car Wash**__ " + "`💧" + gtfcar["condition"]["clean"] + "%`",
        "**" + gtftools.numFormat(costs[1]) + emote.credits + "** " + "__**Oil Change**__ " + "`" + gtfcar["condition"]["oil"] + "%`",
        "**" + gtftools.numFormat(costs[2]) + emote.credits + "** " + "__**Engine Repair**__ " + "`" + gtfcar["condition"]["engine"] + "%`" ,
        "**" + gtftools.numFormat(costs[3]) + emote.credits + "** " + "__**Transmission Repair**__ " + "`" + gtfcar["condition"]["transmission"] + "%`",
        "**" + gtftools.numFormat(costs[4]) + emote.credits + "** " + "__**Suspension Repair**__ " + "`" + gtfcar["condition"]["suspension"] + "%`", 
        "**" + gtftools.numFormat(costs[5]) + emote.credits + "** " + "__**Body Damage Repair**__ " + "`" + gtfcar["condition"]["body"] + "%`" + "/n", 
        "**" + gtftools.numFormat(Math.round(require(gtf.MATH).sum(costs))) + emote.credits + "** " + "__**Apply All**__"]
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Test**"
      }
        
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      stats.addcount(userdata);
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "number"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
      var number = parseInt(query["number"])
      var cost = Math.round(costs[number-1])
      
      if (parseInt(query["number"]) == 1) {
        require(gtf.CONDITION).updatecondition(100, "clean", userdata)
        var successmessage = "Car Wash completed! " + "**-" + cost + emote.credits + "**"
      }
      if (parseInt(query["number"]) == 2) {
          require(gtf.CONDITION).updatecondition(100, "oil", userdata)
        var successmessage = "Oil Change completed! " + "**-" + cost + emote.credits + "**"
      }
      if (parseInt(query["number"]) == 3) {
          require(gtf.CONDITION).updatecondition(100, "engine", userdata)
        var successmessage = "Engine Repair completed! " + "**-" + cost + emote.credits + "**"
      }
      if (parseInt(query["number"]) == 4) {
          require(gtf.CONDITION).updatecondition(100, "transmission", userdata)
        var successmessage = "Transmission Repair completed! " + "**-" + cost + emote.credits + "**"
      }      
      if (parseInt(query["number"]) == 5) {
          require(gtf.CONDITION).updatecondition(100, "suspension", userdata)
        var successmessage = "Suspension Repair completed! " + "**-" + cost + emote.credits + "**"
      }
      if (parseInt(query["number"]) == 6) {
          require(gtf.CONDITION).updatecondition(100, "body", userdata)
        var successmessage = "Body Damage Repair completed! " + "**-" + cost + emote.credits + "**"
      }
      if (parseInt(query["number"]) == 7) {
          require(gtf.CONDITION).updatecondition(100, "all", userdata)
        cost = Math.round(require(gtf.MATH).sum(costs))
        var successmessage = "Car Repair completed! " + "**-" + cost + emote.credits + "**"
      }
      stats.addcredits(-cost, userdata);
      require(dir + "commands/tune").execute(msg, {type:"maintenance", extra:successmessage}, userdata);
      return
    }
    
    if (query["type"] == "list") {
      delete query["number"]
      embed.setTitle(emote.gtauto + " __GTF Auto - Tuning Shop__");
      var partscount = {"Engine":0, "Transmission":0, "Suspension":0, "Tires":0, "Weight Reduction":0, "Turbo":0, 
                        "Brakes": 0, "Aero Kits":0}
      var keys = Object.keys(partscount)
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        var select = require(gtf.PARTS).find({ type: type });
        for (var y = 0; y < select.length; y++) {
         var part = select[y]
          var cond = require(gtf.PARTS).checkpartsavail(part, gtfcar);
          if (cond[0] != "❌") {
            partscount[type]++
          }
      }
      }
      results =
        "__**Engine**__ " + "`🔧" + partscount["Engine"] + "`" +
        "\n" +
        "__**Transmission**__ " + "`🔧" + partscount["Transmission"] + "`" +
        "\n" +
        "__**Suspension**__ " + "`🔧" + partscount["Suspension"] + "`" +
        "\n" +
        "__**Tires**__ "  + "`🔧" + partscount["Tires"] + "`" +
        "\n" +
        "__**Weight Reduction**__ " + "`🔧" + partscount['Weight Reduction'] + "`" +
         "\n" +
        "__**Turbo Kits**__ " + "`🔧" + partscount['Turbo'] + "`" + "\n" +
        "__**Brakes**__ " + "`🔧" + partscount['Brakes'] + "`" + "\n" +
        "__**Aero Kits**__ " + "`🔧" + partscount['Aero Kits'] + "`" + "\n" +
        "__**Maintenance**__ "
      var list = results.split("\n")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Select a part type corresponding with the name (or number) of the part type above. Each part type has performance parts from the number associated of each list for your current car.\nWhen you purchase a part, the current part on your current car will be sold and replaced, and will be added to the current car's inventory.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      stats.addcount(userdata);
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "type"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    var select = require(gtf.PARTS).find({ type: type });

    if (select.length != 0 && query["number"] === undefined) {
    delete query["number"]
    
    var nametype = select[0]["type"];
    embed.setTitle(emote.gtauto + " __GTF Auto - " + nametype + " (" + select.length + " Items)" + "__");
    select = select.map(function (x) {
      x["cost"] = require(gtf.PARTS).costcalc(x, gtfcar, ocar)
      var cond = require(gtf.PARTS).checkpartsavail(x, gtfcar);
      if (cond[0].includes("❌")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else if (cond[0].includes("📦")) {
        return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else {
      if (cond[0].includes("✅")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else {
         return "**" + gtftools.numFormat(x["cost"]) + "**" + emote.credits + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp + cond[0];
      }
      }
    })
    if (type != "tires") {
     
      
      var defaultpartavail = require(gtf.PARTS).checkpartsavail({ type: nametype, name: "Default", cost: 0, percent: 0,
      engine: [],
      eligible: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0}, gtfcar);
    select.unshift("Default " + defaultpartavail[1] + emote.fpp + " " + defaultpartavail[0]);
    }
    if (userdata["settings"]["TIPS"] == 0) {
    pageargs["footer"] = "❓ **Select an upgrade corresponding with the numbers above with the buttons.**";
    }
    pageargs["list"] = select;
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    pageargs["selector"] = "number"
    pageargs["query"] = query
    gtftools.formpages(pageargs, embed, msg, userdata);
    return;
    }

    
    var number = query["number"]
    var nametype = select[0]["type"];
    if (type != "tires") {
      select.unshift({ type: nametype, name: "Default", cost: 0,percent: 0,
      engine: [],
      eligible: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0})
    }
    
    if (!gtftools.betweenInt(number, 1, select.length)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
            return
    }
    
      var part = select[number-1]

    var cond = require(gtf.PARTS).checkpartsavail(part, gtfcar);
        if (cond[0] == "❌") {
          require(gtf.EMBED).alert({ name: "❌ Part Unavailable", description: "**" + part["type"] + " " + part["name"] + "** is unavailable for **" + gtfcar["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
        if (cond[0] == "✅") {
          require(gtf.EMBED).alert({ name: "❌ Part Already Installed", description: "**" + part["type"] + " " + part["name"] + "** is already installed for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      
      require(gtf.MARKETPLACE).purchase(part, "PART","", embed, msg, userdata);
      return;
  }
  }
};
