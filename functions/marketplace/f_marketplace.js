var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require("../../files/directories");
////////////////////////////////////////////////////
var Canvas = require("@napi-rs/canvas");

module.exports.purchase = function (user, item, type, embed, msg, userdata) {
  var applytocurrentcar = "";
  var oldpartmessage = "";
  var installedoncurrentcar = "";
  var fpp = "";
  var replacement = "";
  var discount = 1

  var part_tostock = false;
  var part_in_inv = false;

  if (type == "CAR") {

    if (require(gtf.EMBED).checkgarageerror(embed, msg, userdata)) {
      return;
    }
    var name = item["name"] + " " + item["year"];

    var fpp = require(gtf.PERF).perf(item, "DEALERSHIP")["fpp"];
    var dealershipcost = require(gtf.MARKETPLACE).costcalc(item, fpp);
    var mcost = dealershipcost;
    var link = item["image"][0];
    var aeronum = (item["type"].includes("Race Car")) ? 0 : (item["image"].length - 1)
    var extrainfo = "\n**" + aeronum + " " + emote.aero + " Aero Kits" + " | " + item["livery"].length + " " + emote.livery + " Liveries" + "**"
    
    var make = item["make"];
    
    embed.setImage(link);

    fpp = "\n**" + fpp + "**" + emote.fpp + "**" + " | " + gtftools.numFormat(item["power"]) + " hp" + " | " + gtftools.numFormat(item["weight"]) + " lbs** | **" + item["drivetrain"] + "** | **" + item["engine"] + "**" + extrainfo;

            var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: " ",
  button_id: 0,
  },
  { emoji: "🚘", 
  emoji_name: "🚘", 
  name: 'Purchase & Change Car', 
  extra: " ",
  button_id: 1 },
  { emoji: emote.google, 
  emoji_name: "google", 
  name: 'Car Info', 
  extra: "https://www.google.com/search?q=" + name.replace(/ /ig, "+"),
  button_id: 2 }
]
  }
  if (type == "ROLE") {
        var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: '', 
  extra: " ",
  button_id: 0 }
]
    var name = item[0];
    var cost = item[1];
    var mcost = cost;
  }
  if (type == "PART") {
    var emojilist = [{
      emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
    ]
    if (stats.currentcarmain(userdata) == "No car.") {
      require(gtf.EMBED).alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var car = stats.currentcar(userdata);

    var type1 = item["type"];
    var name = item["type"] + " " + item["name"];
    var cost = item["cost"];
    var discount = 1
    if (type1 != "Tires") {
      var ocar = require(gtf.CARS).find({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })[0]
      discount = require(gtf.PERF).perf(ocar, "DEALERSHIP")["fpp"]/500
      if (discount > 1) {
        discount = discount ** 2
      }
    }
    cost = Math.round(item["cost"] * discount / 100)*100
    if (cost == 0) {
      cost = 100
    }
    var mcost = cost;

    if (type1 != "Car Wash") {
    replacement = "\n**" + type1.charAt(0).toUpperCase() + type1.slice(1) + " " + car[type1.toLowerCase()]["current"] + " -> " + name + "**\n" + "⚠ Any tuning adjustments from **/setup** will be reset." + "\n";

    type1 = type1.toLowerCase();
    if (type1 == "aero kits") {
      var ocar = require(gtf.CARS).find({ make: [car["make"]], fullname: [car["name"]], year: [car["year"]] })[0];
      embed.setImage(ocar["image"][parseInt(item["name"].split(" ").pop())])
    }
    if (item["name"] == "Default") {
      part_tostock = true;
      if (car[type1]["current"] == "Default") {
        require(gtf.EMBED).alert({ name: "❌ Part Already Default", description: "This part is already **Default** in your **" + car["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
    }

    if (car[type1]["current"] == "Default") {
      var oldpart = { name: "Default", type: type1, cost: 0 };
    } else {
      var oldpart = require(gtf.PARTS).find({ name: car[type1]["current"], type: type1 })[0];
    }

    oldpartmessage = "\nReplaced **" + car[type1]["current"] + "**.";
    if (car[type1]["list"].includes(item["name"])) {
      cost = 0;
      mcost = 0;
      part_in_inv = true;
    }

    var perf1 = require(gtf.PERF).partpreview(oldpart, car, "GARAGE");
    var perf2 = require(gtf.PERF).partpreview(item, car, "GARAGE");

    var powerdesc = "";
    var weightdesc = "";
    if (perf1["power"] != perf2["power"]) {
      powerdesc = "\n" + "**Power: " + perf1["power"] + "hp -> " + perf2["power"] + "hp**";
    }
    if (perf1["weight"] != perf2["weight"]) {
      weightdesc = "\n" + "**Weight: " + gtftools.numFormat(perf1["weight"]) + "lbs -> " + gtftools.numFormat(perf2["weight"]) + "lbs**";
    }

    fpp = "\n**FPP: " + perf1["fpp"] + emote.fpp + " -> " + perf2["fpp"] + "**" + emote.fpp + powerdesc + weightdesc;
    }
  }
  if (type == "PAINT") {

    var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
]
    if (stats.currentcarmain(userdata) == "No car.") {
      require(gtf.EMBED).alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var car = stats.currentcar(userdata);

    var type1 = "color";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["type"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    replacement = "\n**Paint: " + car[type1]["current"] + " -> " + name + "**\n";

    if (item["name"].includes("Default")) {
      part_tostock = true;
      if (car["color"]["current"] == "Default" && car["livery"]["current"] == "Default") {
        require(gtf.EMBED).alert({ name: "❌ Paint Already Applied", description: "This paint is already painted on your **" + car["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
    }

    if (item["type"] == "Livery") {
      purchasefunc(msg)
      return
    }

    if (car["color"]["current"] == "Default") {
      var oldpart = { name: "Default", type: type1, cost: 0 };
    } else {
      var oldpart = require(gtf.PAINTS).find({ name: car["color"]["current"], type: type1 })[0];
    }
    oldpartmessage = "\nRepainted from **" + car["color"]["current"] + "**.";
  }
  if (type == "WHEEL") {
    var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
]
    if (stats.currentcarmain(userdata) == "No car.") {
      require(gtf.EMBED).alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var car = stats.currentcar(userdata);

    var type1 = "rims";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["make"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    replacement = "\n**Rims: " + car[type1]["current"] + " -> " + name + "**\n";

    if (item["name"].includes("Default")) {
      if (car["rims"]["current"] == "Default") {
        require(gtf.EMBED).alert({ name: "❌ Rims Already Applied", description: "The rims are already installed on your **" + car["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
    }

    if (car["rims"]["current"] == "Default") {
      var oldpart = { name: "Default", type: type1, cost: 0 };
    } else {
      var oldpart = require(gtf.WHEELS).find({ name: car["rims"]["current"], make: type1 })[0];
    }
    oldpartmessage = "\nReinstalled from **" + car["rims"]["current"] + "**.";
    if (car[type1]["list"].includes(item["name"])) {
      cost = 0;
      mcost = 0;
      part_in_inv = true;
    }
  }
  if (type == "DRIVER") {
    var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
]

    var type1 = "driver";
    var name = item["name"];
    var cost = item["cost"];
    var mcost = cost;

    replacement = "\n**" + item["type"] + " Paint: " + userdata[type1][item["type"].toLowerCase() + "color"] + " -> " + name + "**\n";
    oldpartmessage = ""
    //oldpartmessage = "\nRepainted from **" + car["color"]["current"] + "**.";
    return purchasefunc(msg)
  }

  if (stats.credits(userdata) - mcost < 0) {
    require(gtf.EMBED).alert(
      {
        name: "❌ Insufficient Credits",
        description: "You have insufficient credits to purchase the **" + name + "**.\n\n" + "**Credits: " + gtftools.numFormat(stats.credits(userdata)) + emote.credits + "** -> **" + gtftools.numFormat(mcost) + "**",
        embed: "",
        seconds: 3,
      },
      msg,
      userdata
    );
    return
  }

  if (part_tostock) {
    if (car["livery"]["current"] != "Default") {
    var results = "Paint **" + car["livery"]["current"] + "** to **Default**? " + applytocurrentcar + replacement + fpp;
    } else {
    var results = "Paint **" + car[type1]["current"] + "** to **Default**? " + applytocurrentcar + replacement + fpp;
    }
  } else if (part_in_inv) {
    var results = "Reinstall **" + name + "** for **Free**? " + applytocurrentcar + replacement + fpp;
  } else {
    var results = "**" + name + "**" + " | **" + gtftools.numFormat(mcost) + "**" + emote.credits + " "  + applytocurrentcar + replacement + fpp;
  }

  embed.setDescription(results);
  embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);

  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, purchasefunc)
   
   function purchasefunc(msg) {
    function purchase() {
      if (type == "ROLE") {
        stats.addcredits(-cost, userdata);
        let role = msg.guild.roles.find(r => r.name === item[0]);
        user.roles.add(role).catch(console.error);
        installedoncurrentcar = "\n" + "Purchased " + "**" + item[0] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
      }
      if (type == "CAR") {
        stats.addcredits(-mcost, userdata);
        stats.addcar(item, "SORT", userdata);
        installedoncurrentcar = "Purchased " + "**" + name + "**." + " **-" + mcost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        cost = mcost;
      }
      if (type == "PART") {
        if (part_tostock) {
          require(gtf.PERF).partinstall(item, userdata);
          installedoncurrentcar = "Reinstalled " + name + " on **" + car["name"] + "**.";
        } else {
          stats.addcredits(-cost, userdata);
          if (type1 == "Car Wash") {
            embed.setThumbnail("https://github.com/J24681357/gtfbot/raw/master/images/gtauto/carwash/bubbles.gif")
            embed.setColor(0x2069a9)
            embed.setDescription("**🚿 Car Wash Successful! " + "-" + gtftools.numFormat(cost) + emote.credits + "**") 
            require(gtf.PERF).carclean(100, userdata) 
            embed.fields = []
            embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
            msg.edit({ embeds: [embed]})
            stats.save(userdata);
            return
          }
          require(gtf.PERF).partinstall(item, userdata);
          installedoncurrentcar = "Installed **" + name + "** on **" + car["name"] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        }
        require("../../commands/tune").execute(msg, {type:"list", extra:installedoncurrentcar}, userdata);
         stats.save(userdata);
        return
      }
      if (type == "PAINT") {
        if (part_tostock) {
          require(gtf.PERF).paint(item, userdata);
          installedoncurrentcar = "Painted to **Default** on **" + car["name"] + "**."
        } else {
          stats.addcredits(-cost, userdata);
          require(gtf.PERF).paint(item, userdata);
          installedoncurrentcar = "Painted **" + name + "** on **" + car["name"] + "**.";
        }
        require("../../commands/paint").execute(msg, {type:"list", extra:installedoncurrentcar}, userdata);
        
        stats.save(userdata);
        return
      }
      if (type == "WHEEL") {
        if (item["name"] == "Default") {
          require(gtf.PERF).rimsinstall(item, userdata);
          installedoncurrentcar = "Reinstalled " + name + " on **" + car["name"] + "**.";
        } else {
          stats.addcredits(-cost, userdata);
          require(gtf.PERF).rimsinstall(item, userdata);
          installedoncurrentcar = "Installed **" + name + "** on **" + car["name"] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        }
        require("../../commands/wheels").execute(msg, {make:"list", extra:installedoncurrentcar}, userdata);
        
        stats.save(userdata);
        return
      }
      if (type == "DRIVER") {
          userdata[type1][item["type"].toLowerCase() + "color"] = name
        
          installedoncurrentcar = "Painted **" + name + "** on **" + item["type"] + "**.";
        require("../../commands/driver").execute(msg, {type:"list", extra:installedoncurrentcar}, userdata);
        
        stats.save(userdata);
        return
      }

      if (part_tostock) {
        results = "Reinstalled " + name + " on **" + car["name"] + "**.";
      } else {
        results = installedoncurrentcar;
      }

      require(gtf.EMBED).alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);

    }
    function purchasecarchange() {
        stats.addcredits(-mcost, userdata);
        stats.addcar(item, undefined, userdata);
        var changecar = stats.setcurrentcar(stats.garage(userdata).length, {function:function(x) {return x}}, userdata);
        userdata["garage"] = stats.garagesort(userdata)
        installedoncurrentcar = "Purchased " + "**" + name + "**." + " **-" + mcost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits + "\n" + "Selected the **" + name + "**.";
        cost = mcost;
        results = installedoncurrentcar;
        require(gtf.EMBED).alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);
    }

    var functionlist = [purchase];
    if (type == "DRIVER" || item["type"] == "Livery") {
      purchase()
      return
    }
    if (type == "CAR") {
      functionlist.push(purchasecarchange)
    }
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
  }
};

module.exports.sell = function (item, type, query, embed, msg, userdata) {
  var results = "";
  if (type == "CAR") {
    var id = item["ID"];
    var name = item["name"];
    
    var sell = require(gtf.PERF).perf(item, "GARAGE")["sell"];
    
    if (stats.currentcar(userdata) != null) {
      if (stats.currentcar(userdata)[0] == id) {
        require(gtf.EMBED).alert({ name: "❌ Current Car", description: "You cannot sell a car you are currently in." + "\n\n" + "❗ Choose another option when this message disappears", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
    }
    results = "⚠ Sell **" + name + "** for **" + sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits + "?";
  }

  if (type == "CARS") {
    var first = item[0];
    var last = item[1];
    var name = "**" + (last - first + 1) + "** cars";
    results = "⚠ Sell **" + name + "** from your garage (IDs: " + first + "-" + last + ") ?";
  }
  embed.fields = [];
  embed.setDescription(results);
  embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);
var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: '', 
  extra: "Once",
  button_id: 0 }
]
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, sellfunc)
   
   function sellfunc(msg) {
    function sell1() {
      if (type == "CAR") {
        stats.removecar(item, id, sell, userdata);
        results = "Sold **" + name + "**." + " **+" + sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        require("../../commands/garage").execute(msg, {options:"list", extra: results, type:query["type"]}, userdata);
        stats.save(userdata)
        return
      }
      if (type == "CARS") {
        var money = stats.removecars(first, last, userdata);
        results = "Sold **" + name + "**. " + "**+" + money + "**" + emote.credits;
        require("../../commands/garage").execute(msg, {options:"list", extra: results, type:query["type"]}, userdata);
        stats.save(userdata)
        return
      }
      require(gtf.EMBED).alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);

      return;
    }
     var functionlist = [sell1]

         gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
  }
};

module.exports.sellcalc = function (cost) {
  return -Math.ceil((-cost * 0.3 + 1) / 100) * 100;
};

module.exports.costcalc = function (car, fpp) {
  if (car["carcostm"] <= 0.25) {
    return (10000 * car["carcostm"]) - ((10000 * car["carcostm"]) * (car["discount"]/100))
  }
  var cost = car["carcostm"] * 10000;

  if (fpp == undefined) {
    
  } else {
    var offset = fpp - 250;
    if (offset < 0) {
      cost = -((-offset) ** 1.8) + cost;
    } else {
      cost = offset ** 1.8 + cost;
    }
  }
  cost = cost - (cost * (car["discount"]/100))

  return Math.round(cost / 100) * 100;
};

module.exports.fourgifts = function (title, results, prizes, embed, msg, userdata) {
  var select = [
    [emote.rightarrow + " ", emote.transparent + " ", emote.transparent + " ", emote.transparent + " "],
    [emote.transparent + " ", emote.rightarrow + " ", emote.transparent + " ", emote.transparent + " "],
    [emote.transparent + " ", emote.transparent + " ", emote.rightarrow + " ", emote.transparent + " "],
    [emote.transparent + " ", emote.transparent + " ", emote.transparent + " ", emote.rightarrow + " "],
  ];
  embed.fields = [];
  embed.setTitle("__" + title + "__");
  embed.setDescription(results);
  require(gtf.DISCORD).send(msg, {embeds:[embed]}, fourgiftsfunc)
  
  function fourgiftsfunc(msg) {
    var index = 0;
    var results1 = function (index) {
      return select[index][0] + "||" + prizes[0][1]["name"] + "||" + "\n" 
      + select[index][1] + "||" + prizes[1][1]["name"] + "||" + "\n" 
      + select[index][2] + "||" + prizes[2][1]["name"] + "||" + "\n"
      + select[index][3] + "||" + prizes[3][1]["name"] + "||";
    };

    gtftools.interval(
      function () {
        index = Math.floor(Math.random() * select.length);
        var final = results1(index);
        embed.setDescription(final);
        msg.edit({embeds: [embed]});
      },
      2000,
      4
    );

    setTimeout(function () {
    if (prizes[0][0] == "CREDITS") {
      var item = prizes[index];

      stats.gift("🎉 " + item[1]["name"], item, embed, msg, userdata);
      } else if (prizes[0][0] == "CAR") {
      var item = prizes[index];

      stats.gift("🎉 " + item[1]["name"], item, embed, msg, userdata);
      } else if (prizes[0][0] == "RANDOMCAR") {
      var item = prizes[index];
      item[0] = "CAR"
      item[1] = { id: -1, name: prizes[index][1]["name"], item:  prizes[index][1], author: "", isgift: false }
      stats.gift("🎉 " + item[1]["name"], item, embed, msg, userdata);
      }
    }, 9000);
  }
};

/*
module.exports.carwash = function(gtfcar, embed, msg, userdata) {
    

    .read(car["image"][imagestyle], async function (err, image) {
  if (err) {
    console(err)
  } else {
const imageData = new ImageData(
      Uint8ClampedArray.from(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height
);
 var ctx = canvas.getContext('2d');
ctx.putImageData(imageData, 0, 0);
 const water = await Canvas.loadImage("https://github.com/J24681357/gtfbot/raw/master/images/gtauto/carwash/watertexture.jpg");
      ctx.globalAlpha = 0.2
      ctx.drawImage(water, 0,0, 2000,2000);
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'carwash.png'});  
      embed.setImage("attachment://carwash.png");
      
	    msg.edit({ embeds: [embed], files: [attachment] })
  }
})
      //ctx.drawImage(image, 0,0);

     
}
*/