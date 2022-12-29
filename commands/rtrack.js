var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "rtrack",
  title: "GT Fitness Track Randomizer",
  cooldown: 3,
  level: 0,
  channels: ["gtf-mode", "testing", "gtf-test-mode"],
  aliases: ["rt", "dwtrack"],

  delete: false,
  requirecar: false,
  availitoeveryone: true,
  availinmaint: true,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
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
      buttons: false,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    /* Setup */
    if ("options" in query) {
      if (query["options"] == "info") {
 embed.setTitle(emote.tracklogo + " __GTF Track Randomizer: Info__");
    results = "**Total Tracks:** " +
        require(gtf.TRACKS).find({}).length
        embed.setFields([{name: "Type", value: "**Original Tracks:** " +
        require(gtf.TRACKS).find({ types: ["Original"] }).length +
        "\n" +
        "**Real Tracks:** " +
        require(gtf.TRACKS).find({ types: ["Real"] }).length +
        "\n" +
        "**City Tracks:** " +
        require(gtf.TRACKS).find({ types: ["City"] }).length +
        "\n" +
        "**Dirt Tracks:** " +
        require(gtf.TRACKS).find({ types: ["Dirt"] }).length, inline: true}, {name: "By Latest Version", value: "**Gran Turismo 2:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 2"]}).length +
        "\n" +
        "**Gran Turismo 3:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 3"]}).length +
        "\n" +
        "**Gran Turismo 4:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 4"]}).length +
        "\n" +
        "**Gran Turismo 5:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 5"]}).length +
        "\n"+ 
        "**Gran Turismo 6:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 6"]}).length +
        "\n" +
        "**Gran Turismo Sport:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo Sport"]}).length +
        "\n" + "**Gran Turismo 7:** " +
        require(gtf.TRACKS).find({"versions":["Gran Turismo 7"]}).length +
        "\n", inline: true}])
       
      embed.setDescription(results);
      require(gtf.DISCORD).send(msg, {embeds: [embed]});
      return;
      }
    }
   
    embed.setTitle(emote.tracklogo + " __GTF Track Randomizer__");
    var track = require(gtf.TRACKS).random({}, 1)[0];
    var imagestyle = 0
    var extra = ""
    /*if (car["image"].length >= 2) {
      var choose = ["A", "A", "B", "B","B", "B","B","B","B", "B"]
      if (choose[Math.floor(Math.random() * choose.length)] == "A") {
        imagestyle = gtftools.randomInt(1, car["image"].length - 1)
        extra = " | `⭐" + imagestyle + "`" 
      } else {
        imagestyle = 0
      }
    }*/
    embed.setDescription("**" + track["name"] + "**" + " `" + track["type"] + "`\n\n" + 
    "**Length:** " + track["length"] + "km | " + require(gtf.MATH).round( (track["length"]  * 0.62137119), 2) + "mi " + "\n" + 
    "**Latest Version:** " + track["version"] + "\n" + 
    "**Corners:** " + track["corners"] + extra);
    //
    require(gtf.DISCORD).send(msg, {embeds: [embed]});
  },
};
