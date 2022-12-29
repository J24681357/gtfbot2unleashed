var dir = "../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "home",
  title: "My GTF Home",
  level: 0,
  channels: ["testing", "gtf-demo", "gtf-mode"],

  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
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
        buttons: false,
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
    var showcasenumber = 0;
    var count = stats.count(userdata);
    var notifications = ["**🔔 No notfications available.**"];

    if (typeof query["options"] !== 'undefined') {
      var cmd = require(dir + "commands/" + query["options"]);
      return cmd.execute(msg, {}, userdata);
    }

    if (stats.mileage(userdata) == 0) {
      notifications.push("**🔔 You have not driven in the last 24 hours. Complete at least one session to increase your credits multiplier the next day!**");
    }

    if (stats.mileage(userdata) > 42.1 && !userdata["dailyworkout"]) {
      notifications.push("**🔔 You have enough daily mileage to receive your daily workout! Use __/daily__ to redeem.**");
    }
    if (stats.gifts(userdata).length >= 1) {
      notifications.push("**🔔 You have 🎁" + stats.gifts(userdata).length + " items waiting in your inventory! Use __/items__ to redeem your items.**");
    }

    if (notifications.length >= 2) {
      notifications = notifications.slice(1);
    }
    var message = notifications[Math.floor(Math.random() * notifications.length)] + "\n\n";

    if (query["select"] !== undefined) {
      require(dir + "commands/" + query["select"]).execute(msg, [], userdata);
    }

    embed.setTitle(emote.gtflogo + " __My Home__");
    embed.setThumbnail(msg.guild.members.cache.get(gtf.USERID).user.displayAvatarURL());

    embed.setDescription(message + results);

    var menulist = require(gtf.GTF).commandlist.map(function(x, i) {
      x["name"] = x[1]
      x["emoji"] = x[2]
      x["extra"] = ""
      x["description"] = x[0]
      x["menu_id"] = i
      return x
    })

    var commandslist = require(gtf.GTF).commandlist.map(x => x[0])

    var gmenulistselect = [];
    var emojilist = [];
    var menupage = 0;
    var gmenulistselect = menulist.slice(0 + 10 * menupage, 10 + 11 * menupage);
    gmenulistselect.push({
      emoji: "➡",
      name: "Next Page",
      description: "",
      menu_id: "NEXTPAGE",
    });
    var gemojilist = [];
    var menu = gtftools.preparemenu("Select A Mode", gmenulistselect, [], msg, userdata);

    var car = require(gtf.CARS).random({}, 1)[0];
    results = "**" + car["name"] + " " + car["year"] + " " + gtftools.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + emote.gtlogoblue + " **Use the menu below to select an option.**";
    embed.setDescription(message + results);
    embed.setThumbnail(car["image"][0]);
    embed.fields = [];

    embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);

    require(gtf.DISCORD).send(msg, { embeds: [embed], components: [menu] }, homefunc);

    function homefunc(msg) {
      var functionslist = [];
      for (var j = 0; j < menulist.length; j++) {
        functionslist.push(function (int) {
          if (int == "NEXTPAGE") {
            menupage++;
            if (gmenulistselect.length <= 0 + (11 * menupage - 1)) {
              menupage = 0;
            }
            gmenulistselect = menulist.slice(10 * menupage, 10 + 11 * menupage);
            gmenulistselect.push({
              emoji: "➡",
              name: "Next Page",
              description: "",
              menu_id: "NEXTPAGE",
            });
            var menu = gtftools.preparemenu("Select A Mode", gmenulistselect, gemojilist, msg, userdata);
            msg.edit({ components: [menu] });
            return;
          }
          showcasenumber = -1;
          var cmd = require(dir + "commands/" + commandslist[int]);
          if (cmd.channels.length >= 1) {
            if (!cmd.channels.some(name => msg.channel.name.includes(name))) {
              userdata = require(gtf.GTF).defaultuserdata
              require(gtf.EMBED).alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }
          }
          if (!require(gtf.EXP).checklevel(cmd.level, embed, msg, userdata)) {
            return;
          }
          cmd.execute(msg, {}, userdata);
        });
      }

      
function createlist() {
  var showcase0 = function() {
          msg.removeAttachments();
          embed.image = "";
          var t = require(gtf.COURSEMAKER).trackparams({
            min: 40,
            max: 80,
            minSegmentLength: 2,
            maxSegmentLength: 10,
            curviness: 0.3,
            maxAngle: 120,
            location: ["Grass", "Desert", "Mountain", "Snow", "Blank"][Math.floor(Math.random() * 5)],
            type: "Circuit",
          });
          var track = require(gtf.COURSEMAKER).drawtrack(t, callback);

          function callback(track) {
            var randomid = "#" + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString() + gtftools.randomInt(0, 9).toString();
            track["name"] = "Generic Track " + randomid;
            track["options"] = ["Drift"];
            track["author"] = "ARCADE";
            results = "**🖼 " + track["name"] + "**\n" + "**Generate your own courses using __/course__ or in the Course Maker selection." + "**\n\n" + emote.gtlogoblue + " **Use the menu below to select an option.**";
            embed.setDescription(message + results);
            const attachment = new AttachmentBuilder(track["image"], { name: "course.png" });
            embed.setThumbnail("attachment://course.png");
            embed.fields = [];
            embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          
        }
        }
        var showcase1 = function() {
          msg.removeAttachments();
          embed.image = "";
          var car = require(gtf.CARS).random({}, 1)[0];
          results = "**" + car["name"] + " " + car["year"] + " " + gtftools.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + emote.gtlogoblue + " **Use the menu below to select an option.**";
          embed.setDescription(message + results);
          embed.setThumbnail(car["image"][0]);
          embed.fields = [];
          embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase2 = function() {
          msg.removeAttachments();
          embed.image = "";
          var track = require(gtf.TRACKS).random({}, 1)[0];
          results =
            "**" +
            track["name"] +
            "** `" +
            track["version"] +
            "`\n" +
            "**Length:** " +
            [track["length"] + " km", require(gtf.MATH).round( (track["length"] * 0.62137119), 2) + " mi"].join(" | ") +
            "\n" +
            emote.tracklogo +
            " **Drive over many tracks from the Gran Turismo series in GT Fitness!**" +
            "\n\n" +
            emote.gtlogoblue +
            " **Use the menu below to select an option.**";
          embed.setDescription(message + results);
          embed.setThumbnail(track["image"]);
          embed.fields = [];
        
          embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase3 = function() {
          msg.removeAttachments();
          var attachment = [];

          embed.fields = [];
          var car = stats.currentcar(userdata);
          results = stats.view(car, embed, userdata);
          stats.loadcarimage(car, embed, userdata, then);

          function then(attachment) {
            embed.setThumbnail("attachment://image.png");
            embed.setDescription(message + results);
            embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          }
        }
        return [showcase0, showcase1, showcase2, showcase3]
}
      var showcaselist = createlist()
      
      var s = setInterval(function () {
        if (showcasenumber == -1 || stats.count(userdata) != count) {
          clearInterval(s);
          return;
        }
  
        showcasenumber = gtftools.randomInt(0, showcaselist.length-1);
        showcaselist[showcasenumber]()
      }, 15 * 1000);
      gtftools.createbuttons(menu, emojilist, functionslist, msg, userdata);
    }
    return;
  }
};

