var dir = "../../";
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.randomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

module.exports.randomIntSeed = function (min, max, seed) {
  const Random = require('yy-random')
  Random.seed(seed)
  return Random.range(min, max)
};

module.exports.betweenInt = function (number, min, max) {
  if (isNaN(number)) {
    return false;
  }
  return parseInt(number) >= min && parseInt(number) <= max;
};

module.exports.shuffle = function (array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

module.exports.removeDups = function (names) {
  let unique = {};
  names.forEach(function (i) {
    if (!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
};

module.exports.interval = function interval(func, wait, times) {
  var interv = (function (w, t) {
    return function () {
      if (typeof t === "undefined" || t-- > 0) {
        setTimeout(interv, w);
        try {
          func.call(null);
        } catch (e) {
          t = 0;
          throw e
        }
      }
    };
  })(wait, times);

  setTimeout(interv, wait);
};

module.exports.lengthalpha = function (fpp, weather, track) {
  var offroad = 1;
  if (track["type"].includes("Dirt") || track["type"].includes("Snow")) {
    offroad = 0.85;
  }
  if (typeof weather === "string") {
    weather = parseInt(weather.split(" ").pop());
    var weatherx = weather / 100;
  } else {
    var weatherx = parseFloat(weather["wetsurface"]);
    if (weatherx != 0) {
      weatherx = weatherx / 100;
    }
  }

  var percentage = fpp / 1100;
  percentage = (195 - 70) * percentage + 90;
  return (percentage - weatherx * 40) * offroad;
};

module.exports.formpage = function (args, userdata) {
  if (userdata["settings"]["MENUSELECT"] == 1) {
    args["numbers"] = true;
  }
  var list = [];
  var listnumber = "";
  var pagetotal = Math.ceil(args["list"].length / args["rows"]);
  var x = 0;
  var page = args["page"];
  page = page * args["rows"];
  while (x < args["rows"] && args["list"][x + page] !== undefined) {
    if (args["numbers"]) {
      listnumber = "`" + (x + 1 + page).toString() + ".` ";
    }
    if (!args["numbers"]) {
      listnumber = "";
    }

    list.push(listnumber + args["list"][x + page]);
    x++;
  }

  if (list == "") {
    if (args["page"] < 0) {
      args["page"]++;
      return;
    }
    if (args["page"] > pagetotal) {
      args["page"]--;
      return;
    }
  }
  return list;
};

module.exports.toEmoji = function (text) {
  var list = {
    blicense: emote.blicense,
    alicense: emote.alicense,
    iclicense: emote.iclicense,
    iblicense: emote.iblicense,
    ialicense: emote.ialicense,
    slicense: emote.slicense,
    blank: emote.transparent,
    playercar: emote.carright,
    playercarup: emote.carup,
    playercardown: emote.cardown,
    curbhorizontal: emote.curbh,
    curbvertical: emote.curbv,
    curbturnleftdown: emote.curbturnleftdown,
    curbturnleftup: emote.curbturnleftup,
    curbturnupright: emote.curbturnupright,
    curbturndownright: emote.curbturndownright,
    "N/A": "N/A",
    austria: "🇦🇹",
    "czech republic": "🇨🇿",
    "French Polynesia": "🇵🇫",
    china: "🇨🇳",
    croatia: "🇭🇷",
    france: "🇫🇷",
    brazil: "🇧🇷",
    monaco: "🇲🇨",
    uk: "🇬🇧",
    spain: "🇪🇸",
    switzerland: "🇨🇭",
    germany: "🇩🇪",
    italy: "🇮🇹",
    japan: "🇯🇵",
    "south korea": "🇰🇷",
    sweden: "🇸🇪",
    usa: "🇺🇸",
  };
  return list[text.toLowerCase()];
};

module.exports.formpages = async function (args, embed, msg, userdata) {
  var list = args["list"];
  var currentpagelength = args["text"].length;
  var oldquery = {};
  args["oldquery"] = Object.assign(oldquery, args["query"]);

  var select = 0;
  var reset = true;
  var index = 0;
  var files = [];
  stats.addcount(userdata);
  args["text"] = args["text"]
    .map(function (x) {
      if (reset) {
        if (userdata["settings"]["MENUSELECT"] == 0) {
          x = userdata["settings"]["ICONS"]["select"] + " " + x;
        }
        reset = false;
      }
      return x;
    })
    .join("\n")
    .replace(/\/n/gi, "\n");
  embed.setDescription(args["text"] + "\n\n" + args["footer"]);

  embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
  if (args["image"].length != 0) {
    if (typeof args["image"][0] === "object") {
      files = [args["image"][0]];
      embed.setThumbnail("attachment://image.png");
    } else {
      embed.setThumbnail(args["image"][0]);
    }
  }

  var msg2 = msg;
  //
  if (userdata["settings"]["MENUSELECT"] == 1) {
    var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var emojilist = numberlist
      .map(function (x, i) {
        return {
          emoji: "",
          emoji_name: "",
          name: (i + 1).toString(),
          extra: "Number",
          button_id: i + 2,
        };
      })
      .slice(0, currentpagelength);
    emojilist.unshift({
      emoji: emote.rightarrow,
      emoji_name: "rightarrow",
      name: "",
      extra: "",
      button_id: 1,
    });
    emojilist.unshift({
      emoji: emote.leftarrow,
      emoji_name: "leftarrow",
      name: args["page"] + 1 + "/" + Math.ceil(args["list"].length / args["rows"]),
      extra: "",
      button_id: 0,
    });
  } else {
    var emojilist = [
      { emoji: emote.yes, emoji_name: "Yes", name: args["page"] + 1 + "/" + Math.ceil(args["list"].length / args["rows"]), extra: "", button_id: 0 },
      {
        emoji: emote.leftarrow,
        emoji_name: "leftarrow",
        name: "",
        extra: "",
        button_id: 1,
      },
      {
        emoji: emote.rightarrow,
        emoji_name: "rightarrow",
        name: "",
        extra: "",
        button_id: 2,
      },
      {
        emoji: emote.uparrow,
        emoji_name: "uparrow",
        name: "",
        extra: "",
        button_id: 3,
      },
      {
        emoji: emote.downarrow,
        emoji_name: "downarrow",
        name: "",
        extra: "",
        button_id: 4,
      },
    ];
  }

  if (args["buttons"]) {
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
  } else {
    var buttons = [];
  }

  var garagepage = 0;
  var hundredpage = 0;
  var totallength = userdata["garage"].length;
  var gmenulist = [];
  var gmenulistselect = [];
  var gemojilist = [];
  var namex = "";
  var menu = [];
  var functionlist2 = [];
  var garagemenuvars = [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength];

  //////
  garagemenuvars = require(gtf.GTF).garagemenu("", "", args, garagemenuvars, msg, embed, userdata);
  //////

  require(gtf.DISCORD).send(msg, { embeds: [embed], components: buttons, files: files }, createfunctions);

  function createfunctions(msg) {
    garagemenuvars = require(gtf.GTF).garagemenufunctions("", "", args, garagemenuvars, msg, embed, userdata);

    function selectoption() {
      var pick = select + 1 + args["page"] * args["rows"];
      if (args["command"] == "car") {
        if (args["query"]["options"] == "select") {
          if (typeof args["query"]["name"] !== "undefined") {
            args["query"]["options"] = "search";
            delete args["query"]["manufacturer"];
            delete args["query"]["type"];
          }
          var pick = select + 1 + args["page"] * args["rows"];
        } else if (args["query"]["options"] == "list") {
          var pick = [args["list"][select + args["page"] * args["rows"]].split(" `")[0].split(" ").slice(1).join(" ")];
          args["query"]["options"] = "select";
        }
      }

      if (args["command"] == "sponsors") {
        if (args["query"]["options"] == "select") {
          var pick = select + 1 + args["page"] * args["rows"];
        } else if (args["query"]["options"] == "type") {
          var pick = args["list"][select + args["page"] * args["rows"]].split(" <:")[0];
          args["query"]["options"] = "view";
          args["selector"] = "name";
        } else if (args["query"]["options"] == "list") {
          var pick = args["list"][select + args["page"] * args["rows"]];
          args["query"]["options"] = "type";
        }
      }
      if (args["command"] == "levels") {
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "info";
        }
      }
      if (args["command"] == "gifts") {
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "accept";
        }
      }
      if (args["command"] == "setup") {
        var pick = args["list"][select + args["page"] * args["rows"]].split("__**")[1].split("**__")[0];
      }
      if (args["command"] == "course") {
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "view";
        }
      }
      if (args["command"] == "career") {
        if (args["query"]["options"] == "list") {
          delete args["query"]["options"];
        }
      }
      if (args["command"] == "seasonal" || args["command"] == "timetrial") {
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "select";
        }
      }
      if (args["command"] == "garage") {
        if (args["special"] == "Regulation") {
          var pick = parseInt(args["list"][select + args["page"] * args["rows"]].split(":")[1].split("`")[0]);
          args["query"] = [];
        }
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "view";
        }
      }
      if (args["command"] == "replay") {
        if (args["query"]["options"] == "list") {
          args["query"]["options"] = "load";
        }
      }

      if (args["command"] == "wheels") {
        if (args["query"]["make"] == "list") {
          var pick = args["list"][select + args["page"] * args["rows"]].split(" `").slice(0, -1).join(" ");
        }
      }
      if (args["command"] == "lobby") {
        if (args["query"]["options"] == "set") {
          if (typeof args["query"]["settings"] === "undefined" && typeof args["query"]["regulations"] === "undefined") {
            var pick = args["list"][select + args["page"] * args["rows"]].split(": ")[0].toLowerCase();
          }
        } else {
          var pick = parseInt(args["list"][select + args["page"] * args["rows"]].split(":")[1].split("`")[0]);
          args["command"] = "lobby";
          delete args["query"]["list"];
          args["query"]["options"] = "join";
        }
      }
      if (args["command"] == "customrace") {
        if (args["query"]["options"] == "set") {
          args["selector"] = "number";
        } else if (args["query"]["options"] == "list") {
          args["query"]["options"] = "set";
        } else {
          var pick = parseInt(args["list"][select + args["page"] * args["rows"]].split(":")[1].split("`")[0]);
          args["command"] = "customrace";
          delete args["query"]["list"];
        }
      }

      args["query"][args["selector"]] = pick;

      try {
        require("../../commands/" + args["command"]).execute(msg2, args["query"], userdata);
        return stats.save(userdata);
      } catch (error) {
        require(gtf.EMBED).alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, msg, userdata);
        console.error(error);
      }
    }

    function selectnumber(number) {
      if (typeof number == "string") {
        return;
      }
      select = number - 2;
      if (currentpagelength < select) {
        return;
      }

      selectoption();
    }

    function back() {
      reset = true;
      if (args["page"] != 0) {
        args["page"]--;
      } else {
        args["page"] = Math.ceil(args["list"].length / args["rows"]) - 1;
      }
      select = 0;
      args["text"] = gtftools.formpage(args, userdata);
      currentpagelength = args["text"].length;
      args["text"] = args["text"]
        .map(function (x) {
          if (reset) {
            if (userdata["settings"]["MENUSELECT"] == 0) {
              x = userdata["settings"]["ICONS"]["select"] + " " + x;
            }
            reset = false;
          }
          return x;
        })
        .join("\n")
        .replace(/\/n/gi, "\n");
      embed.setDescription(args["text"] + "\n\n" + args["footer"]);
      if (args["image"].length >= 2) {
        if (typeof args["image"][select + args["page"] * args["rows"]] === "object") {
          files = [args["image"][select + args["page"] * args["rows"]]];
          embed.setThumbnail("attachment://image.png");
        } else {
          embed.setThumbnail(args["image"][select + args["page"] * args["rows"]]);
        }
      }
      args["text"] = "";
      var value = stats.currentcarmain(userdata)
      var b = (value == "No car.") ? 0 : 1
      embed.setFields([{ name: stats.main(userdata), value: value }]);
      console.log(b)
      
      buttons[b].components[0].setLabel(args["page"] + 1 + "/" + Math.ceil(args["list"].length / args["rows"]).toString());
      if (userdata["settings"]["MENUSELECT"] == 1) {
        buttons.map(function (button, i) {
          if (i == 0) {
            return button;
          }
          button.components.map(function (x, j) {
            if (j >= 2 && i == 1) {
              x.setLabel((args["rows"] * args["page"] + (j - 1)).toString());
            }
            if (i == 2) {
              x.setLabel((args["rows"] * args["page"] + (j + 5 - 1)).toString());
            }
            if (i == 3) {
              x.setLabel((args["rows"] * args["page"] + (j + 10 - 1)).toString());
            }
          });
          return button;
        });
      }
      msg.edit({ embeds: [embed], components: buttons, files: files });
    }

    function next() {
      reset = true;
      if (args["page"] != Math.ceil(args["list"].length / args["rows"]) - 1) {
        args["page"]++;
      } else {
        args["page"] = 0;
      }
      select = 0;

      args["text"] = gtftools.formpage(args, userdata);
      currentpagelength = args["text"].length;
      args["text"] = args["text"]
        .map(function (x) {
          if (reset) {
            if (userdata["settings"]["MENUSELECT"] == 0) {
              x = userdata["settings"]["ICONS"]["select"] + " " + x;
            }
            reset = false;
          }
          return x;
        })
        .join("\n")
        .replace(/\/n/gi, "\n");
      embed.setDescription(args["text"] + "\n\n" + args["footer"]);
      if (args["image"].length >= 2) {
        //if (embed.thumbnail.url != args["image"][select]) {
        if (typeof args["image"][select + args["page"] * args["rows"]] === "object") {
          files = [args["image"][select + args["page"] * args["rows"]]];
          embed.setThumbnail("attachment://image.png");
        } else {
          embed.setThumbnail(args["image"][select + args["page"] * args["rows"]]);
        }
        // }
      }
      args["text"] = "";
      var value = stats.currentcarmain(userdata)
      var b = (value == "No car.") ? 0 : 1
      embed.setFields([{ name: stats.main(userdata), value: value }]);
      
      buttons[b].components[0].setLabel(args["page"] + 1 + "/" + Math.ceil(args["list"].length / args["rows"]).toString());
      if (userdata["settings"]["MENUSELECT"] == 1) {
        buttons.map(function (button, i) {
          if (i == 0) {
            return button;
          }
          button.components.map(function (x, j) {
            if (j >= 2 && i == 1) {
              x.setLabel((args["rows"] * args["page"] + (j - 1)).toString());
            }
            if (i == 2) {
              x.setLabel((args["rows"] * args["page"] + (j + 5 - 1)).toString());
            }
            if (i == 3) {
              x.setLabel((args["rows"] * args["page"] + (j + 10 - 1)).toString());
            }
          });
          return button;
        });
      }
      msg.edit({ embeds: [embed], components: buttons, files: files });
    }

    function up() {
      var index = 0;

      args["text"] = gtftools.formpage(args, userdata);

      select--;
      if (select <= -1) {
        select = args["text"].length - 1;
      }
      args["text"] = args["text"]
        .map(function (x) {
          if (select == index) {
            x = userdata["settings"]["ICONS"]["select"] + " " + x;
          }
          index++;
          return x;
        })
        .join("\n")
        .replace(/\/n/gi, "\n");
      embed.setDescription(args["text"] + "\n\n" + args["footer"]);

      if (args["image"].length >= 2) {
        //if (embed.thumbnail.url != args["image"][select]) {
        if (typeof args["image"][select + args["page"] * args["rows"]] === "object") {
          files = [args["image"][select + args["page"] * args["rows"]]];
          embed.setThumbnail("attachment://image.png");
        } else {
          embed.setThumbnail(args["image"][select + args["page"] * args["rows"]]);
        }
        // }
      }

      embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
      msg.edit({ embeds: [embed] });
    }

    function down() {
      var index = 0;

      args["text"] = gtftools.formpage(args, userdata);
      select++;

      if (select >= args["text"].length) {
        select = 0;
      }

      args["text"] = args["text"]
        .map(function (x) {
          if (select == index) {
            x = userdata["settings"]["ICONS"]["select"] + " " + x;
          }
          index++;
          return x;
        })
        .join("\n")
        .replace(/\/n/gi, "\n");
      embed.setDescription(args["text"] + "\n\n" + args["footer"]);
      if (args["image"].length >= 2) {
        //if (embed.thumbnail.url != args["image"][select]) {
        if (typeof args["image"][select + args["page"] * args["rows"]] === "object") {
          files = [args["image"][select + args["page"] * args["rows"]]];
          embed.setThumbnail("attachment://image.png");
        } else {
          embed.setThumbnail(args["image"][select + args["page"] * args["rows"]]);
        }
        // }
      }

      embed.setFields([{ name: stats.main(userdata), value: stats.currentcarmain(userdata) }]);
      msg.edit({ embeds: [embed] });
    }

    if (userdata["settings"]["MENUSELECT"] == 1) {
      var functionlist = [back, next];
      for (var x = 2; x < args["list"].length + 2; x++) {
        functionlist.push(selectnumber);
      }
    } else {
      var functionlist = [selectoption, back, next, up, down];
    }
    emojilist = emojilist.concat(gemojilist);
    functionlist = functionlist.concat(functionlist2);
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
  }
};

module.exports.emojilist = function (list) {
  var nlist = "";
  for (var index = 0; index < list.length; index++) {
    var emoji = list[index].split(" ")[0];
    nlist = nlist + "**" + emoji + " " + list[index].split(" ").slice(1).join(" ") + "**" + "\n";
  }
  return nlist;
};

module.exports.index = function (list, item) {
  item = JSON.stringify(item);
  var index = 0;
  for (; index < list.length; index++) {
    if (item == JSON.stringify(list[index])) {
      return index + 1;
    }
  }
  return -1;
};
// OFFSET PST 16

module.exports.removereactions = function (list, msg) {
  var i = 0;
  filter(i);
  function filter(i) {
    var emoji = msg.reactions.cache.find(r => r.emoji.name === list[i]);
    if (emoji == null) {
      increase();
    } else {
      emoji.remove(gtf.USERID);
      increase();
    }
  }

  function increase() {
    i++;
    if (i == list.length) {
      return;
    } else {
      setTimeout(function () {
        filter(i);
      }, 2000);
    }
  }

  gtftools.interval(
    function () {
      for (var index = 0; index < list.length; index++) {
        var emoji = msg.reactions.cache.find(r => r.emoji.name === list[index]);
        if (emoji == null) {
          continue;
        } else {
          emoji.remove(gtf.USERID);
        }
      }
    },
    1000 * list.length,
    1
  );
};

module.exports.numFormat = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports.preparemenu = function (name, menulist, emojilist, msg, userdata) {
  let menu = new ActionRowBuilder();
  var menuoptions = [];
  for (var j = 0; j < menulist.length; j++) {
    if (menulist[j]["description"].length == 0) {
      menulist[j]["description"] = "\u200B";
    }
    menuoptions.push({
      label: menulist[j]["emoji"] + " " + menulist[j]["name"],
      description: menulist[j]["description"],
      value: menulist[j]["menu_id"].toString(),
    });
    emojilist.push({
      emoji: menulist[j]["emoji"],
      emoji_name: menulist[j]["emoji"],
      name: menulist[j]["name"],
      menu_id: menulist[j]["menu_id"],
      extra: "",
    });
  }
  if (name.length == 0) {
    var options = new SelectMenuBuilder().setCustomId("MENU").setPlaceholder(" ").addOptions(menuoptions);
  } else {
    var options = new SelectMenuBuilder().setCustomId("MENU").setPlaceholder(name).addOptions(menuoptions);
  }
  menu.addComponents(options);
  return menu;
};

module.exports.setupcommands = function (embed, results, query, pageargs, msg, userdata) {
  var embed = new EmbedBuilder();
  embed.setColor(userdata["settings"]["COLOR"]);
  var user = msg.guild.members.cache.get(userdata["id"]);
  embed.setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL() });
  var results = "";
  if (Object.keys(pageargs["query"]).length == 0) {
    if (pageargs["command"] == "arcade") {
      pageargs["query"] = { league: "list" };
    } else if (pageargs["command"] == "debug" || pageargs["command"] == "home" || pageargs["command"] == "gtf" || pageargs["command"] == "rcar" || pageargs["command"] == "rcourse" || pageargs["command"] == "rtrack") {
      pageargs["query"] = {};
    } else {
      pageargs["query"] = { options: "list" };
    }
  }
  query = pageargs["query"];
  return [embed, results, query, pageargs];
};

module.exports.preparebuttons = function (emojilist, msg, userdata) {
  var i = 0;
  var list = [];
  var finalindex = 0;
  var newlist = new ActionRowBuilder();
  var color = "SECONDARY";
  for (var i = 0; i < emojilist.length; i++) {
    if (i % 5 === 0 && i > 0) {
      list.push(newlist);
      finalindex++;
      newlist = new ActionRowBuilder();
    }
    if (emojilist[i]["emoji"] == emote.yes) {
      color = 1;
    } else if (emojilist[i]["emoji"] == emote.flag) {
      color = 3;
    } else if (emojilist[i]["emoji"] == emote.exit) {
      color = 4;
    } else {
      color = 2;
    }
    if (emojilist[i]["extra"].includes("https://")) {
      var button = new ButtonBuilder().setStyle(5).setLabel(emojilist[i]["name"]).setURL(emojilist[i]["extra"]);
    } else {
      if (emojilist[i]["name"].length == 0) {
        var button = new ButtonBuilder().setStyle(color).setLabel(" ").setCustomId(emojilist[i]["button_id"].toString());
      } else {
        var button = new ButtonBuilder().setStyle(color).setLabel(emojilist[i]["name"]).setCustomId(emojilist[i]["button_id"].toString());
      }
    }

    if (typeof emojilist[i]["emoji"] !== "string") {
      button.setEmoji(emojilist[i]["emoji"].slice(2).slice(0, -1).split(":")[1], false);
    } else {
      if (emojilist[i]["emoji"].length != 0) {
        button.setEmoji(emojilist[i]["emoji"], false);
      }
    }

    newlist.addComponents(button);
  }
  list[finalindex] = newlist;
  return list;
};

module.exports.createbuttons = function (buttons, emojilist, functionlist, msg, userdata) {
  var i = 0;
  var id = userdata["id"];
  var reactid = stats.count(userdata);
  var l = require("discord.js-rate-limiter").RateLimiter;
  var rateLimiter = new l(1, 1000);
  var loop = functionlist.length;
  var menuindex = 0;

  for (i; i < functionlist.length; i++) {
    filter(i);
  }
  for (var j = 0; j < emojilist.length; j++) {
    if (typeof emojilist[j]["menu_id"] !== "undefined") {
      menuindex = j;
      break;
    }
  }

  function filter(i) {
    const filter1 = button => {
      return button.customId === i.toString() && button.user.id === userdata["id"];
    };

    var filter11 = msg.createMessageComponentCollector({ filter1, timer: 10 * 1000, dispose: true });

    filter11.on("collect", r => {
      if (loop == 1) {
        let limited = rateLimiter.take(userdata["id"]);
        if (limited) {
          loop = functionlist.length;
          return;
        } else {
          go(r);
        }
        loop = functionlist.length;
      } else {
        loop--;
        return;
      }
    });

    function go(r) {
      try {
        r.deferUpdate();
        if (reactid != stats.count(userdata)) {
          return;
        }
        if (r.user.id != userdata["id"]) {
          return;
        }
        if (r.customId == "MENU") {
          value = r.values[0];
        } else {
          value = parseInt(r.customId);
        }
        if (typeof value !== "undefined") {
          if (r.customId != "MENU") {
            if (emojilist[parseInt(value)]["extra"] == "Once") {
              if (reactid != stats.count(userdata)) {
                return;
              }
              stats.addcount(userdata);
              //filter11.stop()
              //r.setDisabled(true)
            }
          }
          if (r.customId == "MENU") {
            if (value == "NEXTPAGE" || value == "PREVPAGE" || value == "FAVORITES") {
              return functionlist[functionlist.length - 1](value);
            } else {
              if (userdata["settings"]["MENUSELECT"] == 1) {
                return functionlist[functionlist.length - 1](parseInt(value));
              }
              return functionlist[menuindex + parseInt(value)](parseInt(value));
            }
          } else {
            return functionlist[parseInt(value)](parseInt(value));
          }
        }
        return functionlist[value]();
      } catch (error) {
        console.error(error);
      }
    }
  }
};

module.exports.createreactions = function (emojilist, msg, userdata) {
  var i = 0;
  var id = userdata["id"];
  var reactid = stats.count(userdata);
  var l = require("discord.js-rate-limiter").RateLimiter;
  var rateLimiteradd = new l(1, 1500);
  increase(i);

  function increase() {
    if (i == emojilist.length) {
      return;
    } else {
      setTimeout(function () {
        filter(i - 1);
      }, 1200);
    }
    i++;
  }

  function filter(i) {
    var emote = emojilist[i][0];
    if (emote.includes("<:")) {
    }
    var name = emojilist[i][1];
    var func = emojilist[i][2];
    if (reactid != stats.count(userdata)) {
      return;
    }
    msg.react(emote).then(function () {
      var Filter1 = (reaction, user) => reaction.emoji.name === name && id === user.id;

      const filter11 = msg.createReactionCollector({ Filter1, timer: 60 * 1000, dispose: true });

      filter11.on("collect", r => {
        next(r);
      });

      /* filter11.on("remove", r => {
        next(r);
      });*/
      filter11.on("end", r => {
        filter11.stop();
      });
      function next(r) {
        var limited = rateLimiteradd.take(msg.author.id);
        if (limited) {
          console.log("Rate Limit");
          return;
        }
        go(r);
      }
      function go(r) {
        const notbot = r.users.cache.filter(clientuser => clientuser.id == id).first();

        if (true) {
          return;
        }
        if (typeof emojilist[i][3] !== "undefined") {
          if (emojilist[i][3] == "Once") {
            if (reactid != stats.count(userdata)) {
              return;
            }
            stats.addcount(userdata);
          }
        }
        if (typeof emojilist[i][3] !== "undefined") {
          if (!isNaN(emojilist[i][3])) {
            return func(emojilist[i][3]);
          } else {
            return func();
          }
        }
        return func();
      }
    });

    increase();
  }
};

module.exports.checkcarlist = async function (gtfcars) {
  var fs = require("fs");
  var newcars = [];
  var fppupdate = [];

  var index = 0;
  var makes = Object.keys(gtfcars);

  for (var make = 0; make < makes.length; make++) {
    var group = [];
    for (var i = 0; i < gtfcars[makes[make]].length; i++) {
      var car = gtfcars[makes[make]][i];
      var perf = require(gtf.PERF).perf(car, "DEALERSHIP");

      var totalimages = car["image"].length;
      var makee = car["make"].replace(/ /gi, "").toLowerCase();
      var name = car["name"].replace(/ /gi, "").toLowerCase();

      for (var j = 0; j < totalimages; j++) {
        if (!car["image"][j].includes("raw.githubusercontent.com") && !car["image"][j].includes("github.com")) {
          if (j >= 1) {
            newcars.push(car["name"] + " " + car["year"] + " - " + j);
          } else {
            newcars.push(car["name"] + " " + car["year"]);
          }
          var oldcar = JSON.parse(JSON.stringify(car));
          await downloadimage2(oldcar, oldcar["image"][j], j);
          if (j >= 1) {
            var extra = "-" + j.toString();
          } else {
            var extra = "";
          }
          var urll = "https://raw.githubusercontent.com/J24681357/gtfbot/master/" + "images/cars/" + makee + "/" + name + "" + car["year"] + extra + ".png";
          car["image"][j] = urll;
        }
        delete car["id"];
      }
      group.push(car);
    }
    group = group.sort((a, b) => a["name"].toString().localeCompare(b["name"]));
    gtfcars[makes[make]] = group;
  }
  fs.writeFile("./jsonfiles/gtfcarlist.json", JSON.stringify(gtfcars), function (err) {
    if (err) {
      console.log(err);
    }
  });
  if (newcars.length == 0) {
    console.log("No new cars.");
  }
  fs.writeFile("./jsonfiles/newcars.json", JSON.stringify(newcars), function (err) {
    if (err) {
      console.log(err);
    }
  });

  /*
  function downloadimage(oldcar, imagelink, j) {
    var type = "error";

    var download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        if (res === undefined) {
          console.log("The image may not be available for " + uri);
          return;
        }
        if (res.headers["content-type"] === undefined) {
          console.log("The image may not be available for " + uri);
          return;
        }
        var type = res.headers["content-type"].toLowerCase();
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

        setTimeout(function () {
          request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
        }, 2500);
      });
    };
    var name = oldcar["name"].replace(/ /gi, "").toLowerCase();
    var make = oldcar["make"].replace(/ /gi, "").toLowerCase();
    download(imagelink, "./images/cars/" + make + "/" + name + "" + oldcar["year"], function () {});
  }
  */
  async function downloadimage2(oldcar, imagelink, j) {
    var { request } = require("undici");
    var type = "error";
    var name = oldcar["name"].replace(/ /gi, "").toLowerCase();
    var make = oldcar["make"].replace(/ /gi, "").toLowerCase();
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

    await download2(imagelink, "./images/cars/" + make + "/" + name + "" + oldcar["year"], function () {});

    //download2(imagelink, "", function () {});
  }
};

module.exports.checktracklist = async function (tracks) {
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

module.exports.checksponsorslist = function (gtfcars, gtfwheels) {
  var fs = require("fs");
  var sponsors = {};

  var makes = require(gtf.CARS).list("makes");
  var makesfilter = makes
    .filter(function (x) {
      var list = require(gtf.CARS).find({ make: [x], types: ["Production", "Aftermarket"] });
      return list.length >= 5;
    })
    .map(function (x) {
      sponsors[x.toLowerCase()] = {
        name: x,
        level: 10,
        type: "Cars",
        require: [x],
        levels: [1000, 2500, 5000],
        percent: 10,
        bonus: "credits",
      };
    });

  var wheelmakes = require(gtf.WHEELS).list("makes");
  wheelmakes.map(function (x) {
    sponsors[x.toLowerCase()] = {
      name: x,
      level: 5,
      type: "Rims",
      require: [x],
      levels: [700, 1500, 3000],
      percent: 5,
      bonus: "credits",
    };
  });

  fs.writeFile("./jsonfiles/gtfsponsors.json", JSON.stringify(sponsors), function (err) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports.querymap = function (args) {
  if (typeof obj === "object") {
    return;
  }
  var query = {};
  for (var i = 0; i < args.length; i++) {
    query[args[i].trim().split(/=(.+)/)[0]] = args[i].trim().split(/=(.+)/)[1];
  }
  return query;
};

module.exports.updateallsaves = function (name, json) {
  var i = 0;
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  if (name == "EVENTSETTINGS") {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection(name)
        .find({})
        .forEach(row => {
          if (typeof row["id"] === undefined) {
            return;
          } else {
            var userdata = row;
            row = {
              id: userdata["id"],
              events: [],
            };
            console.log("Saved for " + userdata["id"]);
            dbo.collection(name).replaceOne({ id: userdata["id"] }, row);
            return;
          }
        })
        .then(x => {
          console.log("All saves updated", JSON.stringify(json));
        });
    });
  }
  if (name == "GTF2SAVES") {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection(name)
        .find({})
        .forEach(row => {
          if (typeof row["id"] === undefined) {
            return;
          } else {
            var userdata = row;
            if (typeof userdata["garage"] === "undefined") {
              return;
            }
            if (typeof json["addobject"] !== "undefined") {
              userdata[json["addobject"][0]] = json["addobject"][1];
            }
            for (var i = 0; i < userdata["garage"].length; i++) {
              i
              if (typeof json["fppupdate"] !== "undefined") {
                if (json["fppupdate"]) {
                  userdata["garage"][i]["fpp"] = require(gtf.PERF).perf(userdata["garage"][i], "GARAGE")["fpp"];
                }
              }
              if (typeof json["oldcarname"] !== "undefined" && typeof json["newcarname"] !== "undefined") {
                if (userdata["garage"][i]["name"] == json["oldcarname"]) {
                  userdata["garage"][i]["name"] = json["newcarname"];
                }
              }
            }
            //userdata["mileage"] = 0
            //userdata["totalmileage"] = 0

            console.log("Saved for " + userdata["id"]);
            dbo.collection(name).replaceOne({ id: userdata["id"] }, userdata);
            return;
          }
        })
        .then(x => {
          console.log("All saves updated", JSON.stringify(json));
        });
    });
  }
};

module.exports.getsite = function (url, type, callback) {
  if (type == "https") {
    var https = require("https");
  } else {
    var https = require("http");
  }

  https.get(url, resp => {
    let data = "";
    resp.on("data", chunk => {
      data += chunk;
    });

    resp.on("end", () => {
      return callback(data);
    });
  });
};
