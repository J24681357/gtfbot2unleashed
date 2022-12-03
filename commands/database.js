var dir = "../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "database",
  title: "GT Fitness: Database",
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
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
        numbers: true,
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

    if (query["options"] == 1) {
      query["options"] = "tracks";
    }
    if (query["options"] == 2) {
      query["options"] = "exp";
    }

    if (query["options"] == "list") {
      delete query["number"];
      embed.setTitle("__**GTF Database**__");
      results = "Tracks" + "\n" + "GTF Levels/Experience";
      var list = results.split("\n");
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a league from the list above using the numbers associated with the buttons.\nYou can search for database about the GTF game here.**";
      }
      pageargs["selector"] = "options";
      pageargs["query"] = query;
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    if (query["options"] == "track" || query["options"] == "tracks") {
      var tracks = require(gtf.TRACKS).list("names");
      var number = query["number"];
      embed.setTitle(emote.tracklogo + " __**Track ID Database (" + tracks.length + " Tracks)**__");
      if (gtftools.betweenInt(number, 1, tracks.length)) {
        var track = require(gtf.TRACKS).find({ name: [tracks[number - 1]] })[0];
        results =
          "__**" +
          track["name"] +
          "**__" +
          "\n" +
          "**ID:** " +
          number +
          "\n" +
          "**Length:** " +
          [Math.round(1000 * track["length"]) / 1000 + " km", Math.round(100 * (track["length"] / 1.609)) / 100 + " mi"][userdata["settings"]["MILEAGE"]] +
          "\n" +
          "**Version:** " +
          track["version"] +
          "\n" +
          "**Corners:** " +
          track["corners"];
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is the track information for this ID.**";
        }
        embed.setDescription(results + pageargs["footer"]);
        require(gtf.DISCORD).send(msg, { embeds: [embed] });
        return;
      }
      delete query["number"];
      pageargs["list"] = tracks;
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ This is the list of all of tracks in GTF, ranging from Gran Turismo 1 to Gran Turismo 7 tracks. Each track has an ID associated with it.**";
      }
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }
    if (query["options"] == "car") {
    }
    if (query["options"] == "exp") {
      var explevels = require(gtf.LISTS).gtfexp;
      var number = query["number"];
      embed.setTitle(emote.exp + " __**GTF Level/EXP Database (" + Object.keys(explevels).length + " Levels)**__");

      if (gtftools.betweenInt(number, 1, Object.keys(explevels).length)) {
        number = number - 1;
        var levelchosen = explevels[(number + 1).toString()];

        results = "__**Level " + (number + 1).toString() + "**__" + "\n" + "**Experience Required: " + gtftools.numFormat(levelchosen["exp"]) + emote.exp + "**\n" + "**__Rewards__** " + "\n" + levelchosen["rewards"].join("\r");
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is the requirements and rewards for this experience level.**";
        }
        embed.setDescription(results + pageargs["footer"]);
        require(gtf.DISCORD).send(msg, { embeds: [embed] });
        return;
      }
      delete query["number"];
      pageargs["numbers"] = false;
      var list = Object.keys(explevels).map(function (level) {
        return "__**Lv. " + level + "**__ **" + gtftools.numFormat(explevels[level]["exp"]) + emote.exp + "**" + "\r" + explevels[level]["rewards"].join("\r");
      });

      pageargs["list"] = list;
      pageargs["rows"] = 5;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an EXP level associated with the EXP level list using the buttons." + "\n" + "For more information, you can select a level or input the level number using [number].**";
      }
      pageargs["text"] = gtftools.formpage(pageargs, userdata);
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      gtftools.formpages(pageargs, embed, msg, userdata);
      return;
    }

    require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Invalid arguments.", embed: "", seconds: 3 }, msg, userdata);
    return;
  },
};
