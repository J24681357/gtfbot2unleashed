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
  level: 0,
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
    var car = stats.currentcar(userdata);
    var ocar = require(gtf.CARS).get({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] });

    if (typeof query["number"] !== 'undefined') {
      tune("")
      return
    }
    stats.loadcarimage(car, embed, userdata, tune)

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

    if (query["type"] == "car-wash" || query["type"] == "wash" || parseInt(query["type"]) == 9) {
      
      var type = "car-wash";
    }

    if (query["type"] == "oil-change" || query["type"] == "oil" || parseInt(query["type"]) == 10) {
      var type = "oil-change";
    }
/*
    if (userdata["id"] == "237450759233339393") {
      query["type"] = "oil-change";
    }
    */
    
    if (query["type"] == "list") {
      delete query["number"]
      embed.setTitle("🔧 __GTF Auto - Tuning Shop__");
      var partscount = {"Engine":0, "Transmission":0, "Suspension":0, "Tires":0, "Weight Reduction":0, "Turbo":0, 
                        "Brakes": 0, "Aero Kits":0}
      var keys = Object.keys(partscount)
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        var select = require(gtf.PARTS).find({ type: type });
        for (var y = 0; y < select.length; y++) {
         var part = select[y]
          var cond = require(gtf.PARTS).checkpartsavail(part, car);
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
        "__**Car Wash**__ " + "`💧`"
      var list = results.split("\n")
      pageargs["rows"] = 8;
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Select a part type corresponding with the name (or number) of the part type above. Each part type has performance parts from the number associated of each list for your current car.\nWhen you purchase a part, the current part on your current car will be sold and replaced, and will be added to the current car's inventory.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      stats.addcount(userdata);
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "type"
      pageargs["query"] = query
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    
    var select = require(gtf.PARTS).find({ type: type });

    if (select[0]["type"] == "Car Wash") {
      var part = select[0]
      require(gtf.MARKETPLACE).purchase(msg.member, part, "PART", embed, msg, userdata)
      return
    }

    if (select.length != 0 && query["number"] === undefined) {
    delete query["number"]
    
    var name = select[0]["type"];
    embed.setTitle("🔧 __GTF Auto - " + name + " (" + select.length + " Items)" + "__");
    select = select.map(function (x) {
      var cond = require(gtf.PARTS).checkpartsavail(x, car);
      if (cond[0].includes("❌")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else if (cond[0].includes("📦")) {
        return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else {
      if (type == "tires") {
        var discount = 1
      } else {
      var discount = require(gtf.PERF).perf(ocar, "DEALERSHIP")["fpp"]/500
      if (discount > 1) {
        discount = discount ** 2
      }
      }
      if (cond[0].includes("✅")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp;
      } else {
         return "**" + gtftools.numFormat(Math.round(x["cost"] * discount / 100)*100 ) + "**" + emote.credits + " " + x["type"] + " " + x["name"] + " " + cond[1] + emote.fpp + cond[0];
      }
      }
    })
    if (type != "tires") {
    select.unshift("Default")
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
    if (type != "tires") {
      if (number == "Default" || number == 1) {
        number = "S";
      }
    }
      if (number != "S") {
        if (!gtftools.betweenInt(number, 1, select.length+1)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
            return
       }
       if (type == "tires") {
       if (!gtftools.betweenInt(number, 1, select.length)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
            return
       }
       }
      }

      
      if (number == "S") {
        var part = { name: "Default", type: select[0]["type"], cost: 0 };
      } else {
        if (type == "tires") {
          var part = select[number - 1];
        } else {
        var part = select[number - 2];
        }
        var cond = require(gtf.PARTS).checkpartsavail(part, car);
        if (cond[0].includes("❌")) {
          require(gtf.EMBED).alert({ name: "❌ Part Unavailable", description: "**" + part["type"] + " " + part["name"] + "** is unavailable for **" + car["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
        if (cond[0].includes("✅")) {
          require(gtf.EMBED).alert({ name: "❌ Part Already Installed", description: "**" + part["type"] + " " + part["name"] + "** is already installed for **" + car["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      }
      require(gtf.MARKETPLACE).purchase(msg.member, part, "PART", embed, msg, userdata);
      return;
  }
  }
};
