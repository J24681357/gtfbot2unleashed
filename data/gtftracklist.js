var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var gtftools = require(dir + "functions/misc/f_tools");
var emote = require(dir + "index");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var gtftracks = require(gtf.LISTS).gtftracklist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtftracks;
  }
  if (args == "ids") {
    results = Object.keys(gtftracks).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
  if (args == "names") {
    results = Object.keys(gtftracks).map(function (x) {
      return gtftracks[x]["name"];
    });
    return results;
  }
};

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var total = Object.keys(args).length;
  var gtftracks = require(gtf.LISTS).gtftracklist;
  var final = [];
  var ids = Object.keys(gtftracks);

  for (var key = 0; key < ids.length; key++) {
    var track = gtftracks[ids[key]];

    var count = 0;

    if (args["id"] !== undefined) {
      if (args["id"].length == 0) {
        count++;
      } else {
        var numbers = args["id"];
        for (var inumber = 0; inumber < numbers.length; inumbers++) {
          if (parseInt(ids[key]) == parseInt(numbers[inumbers])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["name"] !== undefined) {
      if (args["name"].length == 0) {
        count++;
      } else {
        var names = args["name"];
        for (var iname = 0; iname < names.length; iname++) {
          if (track["name"] == names[iname]) {
            count++;
            break;
          }
        }
      }
    }

    if (args["options"] !== undefined) {
      if (args["options"].length == 0) {
        count++;
      } else {
        var options = args["options"];
        for (var ioption = 0; ioption < options.length; ioption++) {
          if (track["options"].includes(options[ioption])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["types"] !== undefined) {
      if (args["types"].length == 0) {
        count++;
      } else {
        var types = args["types"];
        for (var itype = 0; itype < types.length; itype++) {
          if (track["type"].includes(types[itype])) {
            count++;
            break;
          }
        }
      }
    }

        if (args["versions"] !== undefined) {
      if (args["versions"].length == 0) {
        count++;
      } else {
        var versions = args["versions"];
        for (var iversion = 0; iversion < versions.length; iversion++) {
          if (track["version"] == versions[iversion]) {
            count++;
            break;
          }
        }
      }
    }

    if (count == total) {
      final.unshift(track);
    }
  }
  if (final.length == 0) {
    return "";
  }
  var id = 1;
  final.map(function (x) {
    x["id"] = id;
    id++;
  });
  final.sort(function (a, b) {
    return a["name"].toString().localeCompare(b["name"]);
  });

  return final;
};

module.exports.random = function (args, num) {
  var rlist = [];
  var list = require(gtf.TRACKS).find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};

module.exports.audit = async function () {
  var tracks = require(gtf.LISTS).gtftracklist;
  var x = {};
  var i = 0;

  tracks = Object.keys(tracks).map(function (key) {
    return [key, tracks[key]];
  });
  tracks = tracks.sort((a, b) => a[1]["name"].toString().localeCompare(b[1]["name"]));

  for (i; i < tracks.length; i++) {
    tracks[i][1]["image"] = "https://raw.githubusercontent.com/J24681357/gtfbot/master/" + "images/tracks/" + tracks[i][1]["name"].replace(/ /gi, "").toLowerCase() + ".png";
    x[(i + 1).toString()] = tracks[i][1];
    //await downloadimage2(tracks[i][1], tracks[i][1]["image"], 0);
  }

  console.log("Track List Updated");
  require("fs").writeFile("./jsonfiles/gtftracklist.json", JSON.stringify(x), function (err) {
    if (err) {
      console.log(err);
    }
  });

  async function downloadimage2(oldtrack, imagelink, j) {
    var { request } = require("undici");
    var fs = require("fs");
    var type = "error";
    var name = oldtrack["name"].replace(/ /gi, "").toLowerCase();
    var download2 = async function (uri, filename, callback) {
      try {
        var { statusCode, headers, trailers, body } = await request(uri);
        body = await body.arrayBuffer();
      } catch (error) {
        console.log("The image may not be available for " + uri);
        return;
      }

      if (headers === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }
      if (headers["content-type"] === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }

      var type = headers["content-type"].toLowerCase();
      var file = filename.split("/");
      file.pop();
      if (j >= 1) {
        var extra = (filename = filename + "-" + j.toString() + ".png");
      } else {
        filename = filename + ".png";
      }

      var shell = require("shelljs");
      shell.mkdir("-p", file.join("/"));
      console.log(filename + " " + "image saved.");
      if (!type.includes("image")) {
        console.log("The image may not be available for " + uri);
      }
      fs.writeFileSync(filename, body);
    };

    await download2(imagelink, "./images/tracks/" + name, function () {});

    //download2(imagelink, "", function () {});
  }
};
