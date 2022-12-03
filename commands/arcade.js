var dir = "../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "arcade",
  title: "Arcade Mode",
  level: 0,
  roles: [],
  channels: ["testing", "gtf-mode", "bot-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
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
    /*
    console.log(query)
    if (userdata["id"] == "237450759233339393") {
    query = {mode:3, type:1}
    }
    */
    var name = "";
    if (parseInt(query["mode"]) == 1 || query["mode"] == "ARCADE") {
      query["mode"] = "ARCADE";
      name = "Single Race";
      singleracemodeselect(msg);
      return;
    } else if (parseInt(query["mode"]) == 2 || query["mode"] == "DRIFT") {
      query["mode"] = "DRIFT";
      name = "Drift Trial";
      driftmodeselect(msg);
      return;
    } else if (parseInt(query["mode"]) == 3 || query["mode"] == "SSRX") {
      query["mode"] = "SSRX";
      name = "Speed Test";
      speedtestmodeselect(msg);
    } else {
      delete query["mode"];
      results = "__**Single Race**__" + "\n" +
        "__**Drift Trial**__" + " " + emote.exp + " `Lv.5`" + "\n" + "__**Speed Test**__" + " " + emote.exp + " `Lv.7`";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "mode";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **Select a mode from the buttons below.**";
      }
      pageargs["list"] = list;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    function arcadefunc(msg) {
      var car = stats.currentcar(userdata);
      /// REGULATIONS
      if (typeof query["trackselect"] !== "undefined" && query["mode"] == "DRIFT") {
        if (require(gtf.CARS).get({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })["drivetrain"] == "FF") {
          require(gtf.EMBED).alert({ name: "❌ FF Cars Prohibited", description: "Front Wheel Drive cars are not allowed in a Drift Trial.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
      }
      ///
      if (query["trackselect"] == 1) {
        return selectgaragemode();
      }
      if (query["trackselect"] == 2) {
        return selectgaragemodedirt();
      }
      if (query["trackselect"] == 3) {
        return selectgaragemodesnow();
      }
      if (query["trackselect"] == 4) {
        return selectgaragemodecoursemakerrandom();
      }
      if (query["trackselect"] == 5) {
        return selectgaragemodecoursemaker();
      }
      function selectgaragemode() {
        embed.fields = [];
        var raceprep = {
          mode: query["mode"],
          modearg: query["league"],
          carselect: "GARAGE",
          car: car,
          trackselect: "RANDOM",
          track: { types: ["Tarmac"] },
          racesettings: {},
          other: [],
        };
        if (query["mode"] == "DRIFT") {
          raceprep["track"]["options"] = ["Drift"];
        }
        var x = function () {
          return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
        };
        require(gtf.GTF).checktireregulations(car, { tires: "Racing", type: "Tarmac" }, x, "", msg, embed, userdata);
      }
      function selectgaragemodedirt() {
        embed.fields = [];
        var raceprep = {
          mode: query["mode"],
          modearg: query["league"],
          carselect: "GARAGE",
          car: car,
          trackselect: "RANDOM",
          track: { types: ["Dirt"] },
          racesettings: {},
          other: [],
        };
        var x = function () {
          return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
        };
        require(gtf.GTF).checktireregulations(car, { tires: "Dirt", type: "Dirt" }, x, "", msg, embed, userdata);
      }
      function selectgaragemodesnow() {
        embed.fields = [];
        var raceprep = {
          mode: query["mode"],
          modearg: query["league"],
          carselect: "GARAGE",
          car: car,
          trackselect: "RANDOM",
          track: { types: ["Snow"] },
          racesettings: {},
          other: [],
        };
        var x = function () {
          return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
        };
        require(gtf.GTF).checktireregulations(car, { tires: "Snow", type: "Snow" }, x, "", msg, embed, userdata);
      }
      function selectgaragemodecoursemaker() {
        embed.fields = [];
        selecttrack();
      }
      function selectgaragemodecoursemakerrandom() {
        embed.fields = [];
        var x = function () {
          return selectrandomtrack();
        };
        require(gtf.GTF).checktireregulations(car, { tires: "Racing", type: "Tarmac" }, x, "", msg, embed, userdata);
      }

      embed.setTitle("__" + name + " - Track Selection__");
      delete query["trackselect"];
      results = "__**Random GT Tarmac Course**__" + "\n" + "__**Random GT Dirt Course**__" + "\n" + "__**Random GT Snow Course**__" + "\n" + "__**Random CM Course**__" + "\n" + "__**Select From My Courses**__";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "trackselect";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "❓ **Click one of the buttons to select a type of track.**";
      }
      pageargs["list"] = list;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    function ssrxfunc(msg) {
      var car = stats.currentcar(userdata);
      var ocar = require(gtf.CARS).get({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] });
      if (ocar["type"] == "Concept" || ocar["type"] == "Vision Gran Turismo" || ocar["type"] == "Redbull X" || ocar["type"] == "Kart") {
        require(gtf.EMBED).alert({ name: "❌ Car Prohibited", description: "This car is not allowed in the Speed Test.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }

      var continuee = function () {
        var raceprep = {
          mode: query["mode"],
          modearg: query["type"],
          carselect: "GARAGE",
          car: car,
          trackselect: "SELECT",
          track: require(gtf.TRACKS).find({ name: ["Special Stage Route X"] })[0],
          players: [],
          other: [],
        };
        raceprep["track"]["length"] = parseInt(query["type"]) / 1000;
        return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
      };
      require(gtf.GTF).checktireregulations(car, { tires: "Racing", type: "Tarmac" }, continuee, "", msg, embed, userdata);
    }

    function driftmodeselect(msg) {
      if (!require(gtf.EXP).checklevel(5, embed, msg, userdata)) {
        return;
      }

      if (parseInt(query["league"]) == 1) {
        query["league"] = "driftbeginner";
      }
      if (parseInt(query["league"]) == 2) {
        query["league"] = "driftprofessional";
      }

      if (query["league"] == "driftbeginner") {
        if (!require(gtf.EXP).checklevel(5, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "driftprofessional") {
        if (!require(gtf.EXP).checklevel(15, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      }

      delete query["number"];
      embed.setTitle(emote.gtlogowhite + " __Drift Trial__");
      results = "__**Beginner**__ " + emote.exp + " `Lv.5`" + "\n" + "__**Professional**__ " + emote.exp + " `Lv.15`";
      var list = results.split("\n");
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a difficulty from the list above.\nYou can drift your cars here. Make sure you are using the apporatiate tires to score efficiently.**";
      }
      pageargs["selector"] = "league";
      pageargs["query"] = query;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    function singleracemodeselect(msg) {
      if (parseInt(query["league"]) == 1) {
        query["league"] = "beginner";
      }
      if (parseInt(query["league"]) == 2) {
        query["league"] = "amateur";
      }
      if (parseInt(query["league"]) == 3) {
        query["league"] = "pro";
      }
      if (parseInt(query["league"]) == 4) {
        query["league"] = "endurance";
      }
      if (query["league"] == "beginner") {
        arcadefunc(msg);
        return;
      }
      if (query["league"] == "amateur" || query["league"] == "a") {
        if (!require(gtf.EXP).checklevel(5, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "professional" || query["league"] == "pro") {
        if (!require(gtf.EXP).checklevel(20, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "endurance" || query["league"] == "endur") {
        if (!require(gtf.EXP).checklevel(25, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      }
      delete query["number"];
      embed.setTitle(emote.gtlogowhite + " __Single Race__");
      results = "__**Beginner**__ " + "\n" + "__**Amateur**__ " + emote.exp + " `Lv.5`" + "\n" + "__**Professional**__ " + emote.exp + " `Lv.20`" + "\n" + "__**Endurance**__ " + emote.exp + " `Lv.25`";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "league";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] =
          "❓ **Select a league from the list above.**" +
          "\n" +
          "**`Lv.XX` represents that the driver level that is required. You can enter a single race with the difficulties above. You can obtain credits and experience points here. The amount you earn is based on your finishing position, track length, and difficulty.**";
      }
      pageargs["list"] = list;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    function speedtestmodeselect(msg) {
      if (!require(gtf.EXP).checklevel(7, embed, msg, userdata)) {
        return;
      }
      if (parseInt(query["type"]) == 1) {
        query["type"] = 400;
        
        ssrxfunc(msg);
        return;
      }
      if (parseInt(query["type"]) == 2) {
        query["type"] = 1000;
        ssrxfunc(msg);
        return;
      }
      if (parseInt(query["type"]) == 3) {
        query["type"] = 10000;
        ssrxfunc(msg);
        return;
      }

      delete query["number"];
      embed.setTitle("🛣️ __Special Stage Route X - Speed Test__");
      results = "__**400m**__ " + "\n" + "__**1,000m**__ " + "\n" + "__**10,000m**__ ";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "type";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select the distance from the list above using the numbers associated with the buttons. You can perform top speed runs with your garage cars.**";
      }
      pageargs["list"] = list;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    function selecttrack() {
      stats.load("CUSTOMCOURSES", userdata, selectcourse);

      function selectcourse(coursestats) {
        var car = stats.currentcar(userdata);
        coursestats = coursestats["courses"];
        if (coursestats.length == 0) {
          require(gtf.EMBED).alert({ name: "❌ No Courses", description: "You have no courses saved." + "\n\n" + "Select another option when this message disappears.", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
        info = "";
        embed.setTitle("__Arcade Mode - Course Selection (" + coursestats.length + " Tracks)" + "__");

        var emojilist = [];
        var functionlist = [];
        var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        results = coursestats.map(function (x, i) {
          emojilist.push({
            emoji: numberlist[i],
            emoji_name: numberlist[i],
            name: "",
            extra: "Once",
            button_id: i,
          });
          functionlist.push(function func2(index) {
            var track = coursestats[index];
            if (track["layout"] == "sprint" && query["league"] == "endurance") {
              require(gtf.EMBED).alert({ name: "❌ Invalid", description: "Endurances are unavailable for sprint courses.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }
            var raceprep = {
              mode: query["mode"],
              modearg: query["league"],
              carselect: "GARAGE",
              car: car,
              trackselect: "SELECT",
              track: track,
              racesettings: {},
              other: [],
            };
            function x1() {
              return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
            }
            if (track["type"].includes("Dirt")) {
              var tire = "Dirt";
            } else if (track["type"].includes("Snow")) {
              var tire = "Snow";
            } else {
              var tire = "Racing";
            }
            require(gtf.GTF).checktireregulations(car, { tires: tire, type: track["type"] }, x1, "", msg, embed, userdata);
          });
          return numberlist[i] + " " + x["name"] + " `" + x["type"].split(" - ")[1] + "`";
        });

        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ Select your track from the list associated above with the buttons. You cannot use sprints in endurance races.**";
        }
        results = results.join("\n") + pageargs["footer"];
        embed.setDescription(results);
        var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
        require(gtf.DISCORD).send(msg, { embeds: [embed], components: buttons }, arcadecoursefunc);

        function arcadecoursefunc(msg) {
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
        }
      }
    }
    function selectrandomtrack() {
      var t = require(gtf.COURSEMAKER).trackparams({
        min: 40,
        max: 80,
        minSegmentLength: 2,
        maxSegmentLength: 10,
        curviness: 0.3,
        maxAngle: 120,
        location: "Blank",
        type: "Circuit",
      });
      var track = require(gtf.COURSEMAKER).drawtrack(t, callback);

      function callback(track) {
        var car = stats.currentcar(userdata);
        var randomid = "#" + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString();
        track["name"] = "Generic Track " + randomid;
        track["options"] = ["Drift"];
        track["author"] = "GTFITNESS";
        var raceprep = {
          mode: query["mode"],
          modearg: query["league"],
          carselect: "GARAGE",
          car: car,
          trackselect: "SELECT",
          track: track,
          racesettings: {},
          other: [],
        };
        return require(gtf.RACE).raceprep(raceprep, embed, msg, userdata);
      }
    }
  },
};
