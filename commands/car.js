var dir = "../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "car",
  title: "GTF Car Dealerships",
  license: "N", level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(
      embed,
      results,
      query,
      {
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
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var searchname = "";
    if (query["options"] == "search") {
      query["options"] = "select";
      if (typeof query["name"] !== "undefined") {
        searchname = query["name"].slice();
      }
    }

    if (typeof query["manufacturer"] === "undefined") {
      query["manufacturer"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("manufacturer")));
      query["manufacturer"] = [Object.values(query["manufacturer"])[0]];
      if (query["manufacturer"][0] === undefined) {
        query["manufacturer"] = [];
      } else {
        query["manufacturer"][0] = query["manufacturer"][0].replace(/,/g, "-");
      }
    }
    if (typeof query["country"] === "undefined") {
      query["country"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("country")));
      query["country"] = [Object.values(query["country"])[0]];
      if (query["country"][0] === undefined) {
        query["country"] = [];
      }
    }

    if (typeof query["type"] === "undefined") {
      query["type"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("type")));
      query["type"] = [Object.values(query["type"])[0]];
      if (query["type"][0] === undefined) {
        query["type"] = [];
      }
    }

    if (typeof query["drivetrain"] === "undefined") {
      query["drivetrain"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("drivetrain")));
      query["drivetrain"] = [Object.values(query["drivetrain"])[0]];
      if (query["drivetrain"][0] === undefined) {
        query["drivetrain"] = [];
      }
    }

    if (typeof query["engine"] === "undefined") {
      query["engine"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("engine")));
      query["engine"] = [Object.values(query["engine"])[0]];
      if (query["engine"][0] === undefined) {
        query["engine"] = [];
      }
    }

    if (typeof query["special"] === "undefined") {
      query["special"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("special")));
      query["special"] = [Object.values(query["special"])[0]];
      if (query["special"][0] === undefined) {
        query["special"] = [];
      }
    }

    if (query["fpplimit"] === undefined) {
      query["fpplimit"] = 9999
    }

    delete query["manufacturer1"];
    delete query["manufacturer2"];
    delete query["manufacturer3"];
    delete query["type1"];
    delete query["drivetrain1"];
    delete query["engine1"];
    delete query["special1"];

    var sort = userdata["settings"]["DEALERSORT"];

    var makelist = require(gtf.CARS).list("makes");
    var number = 0;
    var itempurchase = false;

    var list = [];

    if (searchname.length != 0) {
      query["name"] = searchname;
    }

    if (query["options"] == "info") {
      delete query["number"];
      embed.setTitle("🏢 __GTF Car Dealerships - Info__");
      require(gtf.CARS).stats(embed);
      require(gtf.DISCORD).send(msg, { embeds: [embed] });
      return;
    }

    if (query["options"] == "list") {
      delete query["number"];
      delete query["manufacturer"];
      delete query["manufacturer1"];
      delete query["manufacturer2"];
      delete query["manufacturer3"];
      delete query["country"];
      delete query["country1"];
      delete query["type"];
      delete query["type1"];
      delete query["drivetrain"];
      delete query["drivetrain1"];
      delete query["engine"];
      delete query["engine1"];
      delete query["special"];
      delete query["special1"];
      for (var makei = 0; makei < makelist.length; makei++) {
        var m = makelist[makei].replace(/,/, " ");
        var cars = require(gtf.CARS).find({ makes: [m] });
        var count = cars.length;
        var country = gtftools.toEmoji(cars[0]["country"]);
        if (require(gtf.GTF).invitationlist.includes(m) && !stats.checkitem(m + " Invitation", "", userdata)) {
          list.push(country + " " + m + " " + "`🚘" + count + "` ✉");
        } else {
        list.push(country + " " + m + " " + "`🚘" + count + "`");
        }
      }
      embed.setTitle("🏢 __GTF Car Dealerships (" + list.length + " Makes)" + "__");
      pageargs["selector"] = "manufacturer";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **Select from the manufacturers listed above. `🚘XX` represents the amount of cars availiable for each manufacturer.**";
      }
      pageargs["list"] = list;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    if (query["options"] == "select" || query["options"] == "selectused") {

      if (typeof query["manufacturer"] !== "undefined" || typeof query["country"] !== "undefined" || typeof query["type"] !== "undefined" || typeof query["drivetrain"] !== "undefined" || typeof query["engine"] !== "undefined" || typeof query["special"] !== "undefined") {
        var term = { makes: query["manufacturer"], countries: query["country"], types: query["type"], drivetrains: query["drivetrain"], engines: query["engine"], special: query["special"], upperfpp: query["fpplimit"], sort: sort };

        if (searchname.length != 0) {
          term["fullname"] = [searchname];
        }

        if (query["options"] == "selectused") {
          var list = require(gtf.CARS).find({uppercostm: 30, upperyear: 2012, sort: sort})
          var indexes = []
          var day = require(gtf.DATETIME).getCurrentDay()
          var seed = 1
          for (var num = 0; num < 20; num++) { indexes.push(require(gtf.MATH).randomIntSeed(0, list.length, (num+1000) + day))
          }
          list = list.filter(function(x,i) {
            if (indexes.includes(i)) {
              return true
            } else {
              return false
            }
          }).map(function(x) {
            seed = x["id"] + day
            var discount = [10,20,30,40,50,60][require(gtf.MATH).randomIntSeed(0,5, seed)]
            x["discount"] = discount
            return x
          })
        } else if (query["options"] == "selectrecommended") {

        } else {
          var list = require(gtf.CARS).find(term);
        }

        var total = list.length;
        if (total == 0) {
          if (searchname.length != 0) {
            require(gtf.EMBED).alert({ name: "❌ No Cars Found", description: "Cars of your search query does not exist in the GTF dealerships. Try again with another query.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            require(gtf.EMBED).alert({ name: "❌ No Cars Found", description: "Cars of this manufacturer and/or type does not exist in the GTF dealerships. Try again with another query.", embed: "", seconds: 5 }, msg, userdata);
            return;
          }
        }

        var make = query["manufacturer"].length == 0 ? "" : query["manufacturer"][0];
        var country = query["country"].length == 0 ? "" : query["country"][0];
        var type = query["type"].length == 0 ? "" : query["type"][0];
        var drivetrain = query["drivetrain"].length == 0 ? "" : query["drivetrain"][0];
        var engine = query["engine"].length == 0 ? "" : query["engine"][0];
        var special = query["special"].length == 0 ? "" : query["special"][0];

        if (require(gtf.GTF).invitationlist.includes(make)) {
          if (!stats.checklicense("IC", embed, msg, userdata)) {
            return
          } else {
            if (!stats.checkitem(make + " Invitation", "", userdata)) {
              console.log("OK")
              require(dir + "commands/license").execute(msg, {options: make.toLowerCase(), number: 1}, userdata);
              return
            }
          }
        }

        var carlist = [];
        for (var i = 0; i < list.length; i++) {
          var fpp = require(gtf.PERF).perf(list[i], "DEALERSHIP")["fpp"];
          var cost = require(gtf.CARS).costcalc(list[i], fpp);
          var make = list[i]["make"]
          var name = list[i]["name"];
          var year = list[i]["year"];
          var image = list[i]["image"][0];
          var numbercost = list[i]["carcostm"] == 0 ? "❌ " : require(gtf.MATH).numFormat(cost) + emote.credits + " ";
          numbercost = (require(gtf.GTF).invitationlist.includes(make) && !stats.checkitem(make + " Invitation", "", userdata)) ? "✉ " : numbercost
          var discount = list[i]["discount"] == 0 ? "" : "`⬇ " + list[i]["discount"] + "%" + "` ";
          carlist.push(discount + "**" + numbercost + "**" + name + " " + year + " **" + fpp + emote.fpp + "**" + require(gtf.CARS).checkcar(name + " " + year, userdata));
          pageargs["image"].push(image);
        }
        if (query["number"] !== undefined) {
          if (!require(gtf.MATH).betweenInt(query["number"], 1, total)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Number", description: "This number does not exist in the " + make + " dealership.", embed: "", seconds: 3 }, msg, userdata);
            return;
          } else {
            itempurchase = true;
            var number = parseInt(query["number"]) - 1;
            var item = list[number];
          }
          if (itempurchase) {
            embed.fields = [];
            if (item["carcostm"] == 0) {
              require(gtf.EMBED).alert({ name: "❌ Car Unavailable", description: "You cannot purchase this car.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }

        if (require(gtf.GTF).invitationlist.includes(item["make"])) {
          if (!stats.checklicense("IC", embed, msg, userdata)) {
            return
          } else {
            if (!stats.checkitem(item["make"] + " Invitation", "", userdata)) {

              require(dir + "commands/license").execute(msg, {options: item["make"].toLowerCase(), number: 1}, userdata);
              return
            }
          }
        }
            require(gtf.MARKETPLACE).purchase(item, "CAR", "", embed, msg, userdata);
            return;
          }
        }
        if (make.length == 0 && type.length != 0 && drivetrain.length != 0 && engine.length != 0) {
          embed.setTitle("__All (" + carlist.length + " Cars) (" + userdata["settings"]["DEALERSORT"] + ")__");
        } else if (query["options"] == "selectused") {
          embed.setTitle("__GTF Dealership: Discounts" + searchname + make + type + drivetrain + engine + special + " (" + userdata["settings"]["DEALERSORT"] + ")__");
        } else {
          var emot = gtftools.toEmoji(list[0]["country"]) + " ";
          if (type.length == 0 || drivetrain.length == 0 || engine.length == 0 || special.length == 0 || searchname.length == 0) {
            emot = "";
          }
          if (country.length != 0) {
           emot = gtftools.toEmoji(list[0]["country"]) + " ";
          }
          embed.setTitle(emot + "__" + searchname + make + country + type + drivetrain + engine + special + " (" + carlist.length + " Cars) (" + userdata["settings"]["DEALERSORT"] + ")__");
        }

        pageargs["selector"] = "number";
        pageargs["query"] = query;
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "**❓ Select a car from the list to purchase a car above using the buttons.**";
        }
        pageargs["list"] = carlist;

        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      }

      var list = [];
      for (var makei = 0; makei < makelist.length; makei++) {
        var m = makelist[makei].replace(/,/g, "-");
        var count = require(gtf.CARS).find({ makes: [m] }).length;
        list.push(m + " `🚘" + count + "`");
      }
      embed.setTitle("🏢 __GTF Car Dealerships (" + list.length + " Makes)" + "__");
      pageargs["selector"] = "manufacturer";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["special"] = "Manufacturer";
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
  },
};
