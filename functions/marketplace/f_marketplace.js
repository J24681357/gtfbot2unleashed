var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var Canvas = require("@napi-rs/canvas");

module.exports.purchase = function (item, type, special, embed, msg, userdata) {
  var image = ""
  var info = ""
  var oldpartmessage = "";
  var successmessage = "";
  var fpp = "";
  var replacement = "";

  var part_inv = false;

  if (type == "CAR") {
    if (require(gtf.EMBED).checkgarageerror(embed, msg, userdata)) {
      return;
    }
    var name = item["name"] + " " + item["year"];
    var fpp = require(gtf.PERF).perf(item, "DEALERSHIP")["fpp"];
    var mcost = require(gtf.MARKETPLACE).costcalc(item, fpp);
    var image = item["image"][0];
    
    var aeronum = (item["type"].includes("Race Car")) ? 0 : (item["image"].length - 1)
    
    
    var make = item["make"];

    info = "\n**" + fpp + "**" + emote.fpp + "**" + " | " + gtftools.numFormat(item["power"]) + " hp" + " | " + gtftools.numFormat(item["weight"]) + " lbs** | **" + item["drivetrain"] + "** | **" + item["engine"] + "**" + "\n**" + aeronum + " " + emote.aero + " Aero Kits" + " | " + item["livery"].length + " " + emote.livery + " Liveries" + "**";
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
      var results = "**" + name + "**" + " | **" + gtftools.numFormat(mcost) + "**" + emote.credits + " " + info;
    
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

    var gtfcar = stats.currentcar(userdata);

    var type1 = item["type"];
    var name = item["type"] + " " + item["name"];
    var cost = item["cost"];
    
    var mcost = cost;

    if (type1 != "Car Wash") {


    if (type1 == "Aero Kits") {
      var ocar = require(gtf.CARS).find({ make: [gtfcar["make"]], fullname: [gtfcar["name"]] })[0];
      embed.setImage(ocar["image"][parseInt(item["name"].split(" ").pop())])
    }

    if (gtfcar["perf"][type1.toLowerCase().replace(/ /g, " ")]["current"] == "Default") {
      var oldpart = { type: type1, name: "Default", cost: 0, percent: 0,
      engine: [],
      eligible: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0}
    } else {
      var oldpart = require(gtf.PARTS).find({ name: gtfcar["perf"][type1.toLowerCase().replace(/ /g, " ")]["current"], type: type1 })[0];
    }

    oldpartmessage = "\nReplaced **" + gtfcar["perf"][type1.toLowerCase().replace(/ /g, " ")]["current"] + "**.";
      
    if (gtfcar["perf"][type1.toLowerCase().replace(/ /g, " ")]["list"].includes(item["name"])) {
      cost = 0;
      mcost = 0;
      part_inv = true;
    }

    var perf1 = require(gtf.PERF).partpreview(oldpart, gtfcar, "GARAGE");
    var perf2 = require(gtf.PERF).partpreview(item, gtfcar, "GARAGE");

    var powerdesc = "";
    var weightdesc = "";
    if (perf1["power"] != perf2["power"]) {
      powerdesc = "\n" + "**Power: " + perf1["power"] + "hp -> " + perf2["power"] + "hp**";
    }
    if (perf1["weight"] != perf2["weight"]) {
      weightdesc = "\n" + "**Weight: " + gtftools.numFormat(perf1["weight"]) + "lbs -> " + gtftools.numFormat(perf2["weight"]) + "lbs**";
    }

    info = "\n**FPP: " + perf1["fpp"] + emote.fpp + " -> " + perf2["fpp"] + "**" + emote.fpp + powerdesc + weightdesc;
    }

    /*
    if (gtfcar["livery"]["current"] != "Default") {
    var results = "Paint **" + gtfcar["livery"]["current"] + "** to **Default**? " + info + fpp;
    } else {
    var results = "Paint **" + gtfcar[type1.toLowerCase().replace(/ /g, " ")]["current"] + "** to **Default**? " + info + fpp;
    }
    */

    var info = "\n**" + type1 + " " + gtfcar["perf"][type1.toLowerCase().replace(/ /g, " ")]["current"] + " -> " + name + "**\n" + "⚠ Any tuning adjustments from **/setup** will be reset." + "\n" + info;

  if (part_inv) {
    var results = "Reinstall **" + name + "** for **Free**? " + info;
  } else if (item["name"] == "Default") {
    var results = "Revert to **Default**? " + info;
  } else {
  var results = "**" + name + "**" + " | **" + gtftools.numFormat(mcost) + "**" + emote.credits + " " + info;
  }

            var emojilist = [{
      emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
    ]
    
  }
  if (type == "PAINT") {

    if (stats.currentcarmain(userdata) == "No car.") {
      require(gtf.EMBED).alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var gtfcar = stats.currentcar(userdata);

    var type1 = "color";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["type"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    info = "\n**Paint: " + gtfcar[type1]["current"] + " -> " + name + "**\n";
    
    var results = "**" + name + "**" + " | **" + gtftools.numFormat(mcost) + "**" + emote.credits + " " + info;

      var oldpart = require(gtf.PAINTS).find({ name: gtfcar["color"]["current"], type: type1 })[0];
    oldpartmessage = "\nRepainted from **" + gtfcar["color"]["current"] + "**.";
  
    var emojilist = [
  { emoji: emote.yes, 
  emoji_name: "Yes", 
  name: 'Purchase', 
  extra: "Once",
  button_id: 0 }
]
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
    var gtfcar = stats.currentcar(userdata);

    var type1 = "rims";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["make"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    replacement = "\n**Rims: " + gtfcar[type1]["current"] + " -> " + name + "**\n";

    if (item["name"].includes("Default")) {
      if (gtfcar["rims"]["current"] == "Default") {
        require(gtf.EMBED).alert({ name: "❌ Rims Already Applied", description: "The rims are already installed on your **" + gtfcar["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
        return;
      }
    }

    if (gtfcar["rims"]["current"] == "Default") {
      var oldpart = { name: "Default", type: type1, cost: 0 };
    } else {
      var oldpart = require(gtf.WHEELS).find({ name: gtfcar["rims"]["current"], make: type1 })[0];
    }
    oldpartmessage = "\nReinstalled from **" + gtfcar["rims"]["current"] + "**.";
    if (gtfcar[type1]["list"].includes(item["name"])) {
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

  if (image.length != 0) {
    embed.setImage(image);
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


    if (special == "silent") {
      purchasefunc(msg)
      return
    }
  embed.setDescription(results);
  embed.setFields([{name:stats.main(userdata), value: stats.currentcarmain(userdata)}]);

  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
   require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, purchasefunc)
   
   function purchasefunc(msg) {
    function purchase() {
      if (type == "CAR") {
        stats.addcredits(-mcost, userdata);
        stats.addcar(item, "SORT", userdata);
        successmessage = "Purchased " + "**" + name + "**." + " **-" + mcost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        cost = mcost;
      }
      if (type == "ROLE") {
        stats.addcredits(-cost, userdata);
        let role = msg.guild.roles.find(r => r.name === item[0]);
        user.roles.add(role).catch(console.error);
        successmessage = "\n" + "Purchased " + "**" + item[0] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
      }
      if (type == "PART") {
        
          require(gtf.PERF).partinstall(item, userdata);
        
        if (part_inv) {
          successmessage = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
        } else {
          if (cost > 0) {
          userdata["stats"]["numparts"]++
        }
          stats.addcredits(-cost, userdata);
          /*
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
          */
          successmessage = "Installed **" + name + "** on **" + gtfcar["name"] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        }
        require(dir + "commands/tune").execute(msg, {type:"list", extra:successmessage}, userdata);
         stats.save(userdata);
        return
      }
      if (type == "PAINT") {

          stats.addcredits(-cost, userdata);
          require(gtf.PERF).paint(item, userdata);
          successmessage = "Painted **" + name + "** on **" + gtfcar["name"] + "**.";
        require(dir + "commands/paint").execute(msg, {type:"list", extra:successmessage}, userdata);
        
        stats.save(userdata);
        return
      }
      if (type == "WHEEL") {
        if (item["name"] == "Default") {
          require(gtf.PERF).rimsinstall(item, userdata);
          successmessage = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
        } else {
          stats.addcredits(-cost, userdata);
          require(gtf.PERF).rimsinstall(item, userdata);
          successmessage = "Installed **" + name + "** on **" + gtfcar["name"] + "**." + " **-" + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits;
        }
        require(dir + "commands/wheels").execute(msg, {make:"list", extra:successmessage}, userdata);
        
        stats.save(userdata);
        return
      }
      if (type == "DRIVER") {
          userdata[type1][item["type"].toLowerCase() + "color"] = name
        
          successmessage = "Painted **" + name + "** on **" + item["type"] + "**.";
        require(dir + "commands/driver").execute(msg, {type:"list", extra:successmessage}, userdata);
        
        stats.save(userdata);
        return
      }

      /*
      if (part_tostock) {
        results = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
      } else {
        results = successmessage;
      }
      */

      require(gtf.EMBED).alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);

    }
    function purchasecarchange() {
        stats.addcredits(-mcost, userdata);
        stats.addcar(item, undefined, userdata);
        var changecar = stats.setcurrentcar(stats.garage(userdata).length, {function:function(x) {return x}}, userdata);
        userdata["garage"] = stats.garagesort(userdata)
        successmessage = "Purchased " + "**" + name + "**." + " **-" + mcost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "**" + emote.credits + "\n" + "Selected the **" + name + "**.";
        cost = mcost;
        results = successmessage;
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
        require(dir + "commands/garage").execute(msg, {options:"list", extra: results, type:query["type"]}, userdata);
        stats.save(userdata)
        return
      }
      if (type == "CARS") {
        var money = stats.removecars(first, last, userdata);
        results = "Sold **" + name + "**. " + "**+" + money + "**" + emote.credits;
        require(dir + "commands/garage").execute(msg, {options:"list", extra: results, type:query["type"]}, userdata);
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
      return select[index][0] + "||" + prizes[0]["name"] + "||" + "\n" 
      + select[index][1] + "||" + prizes[1]["name"] + "||" + "\n" 
      + select[index][2] + "||" + prizes[2]["name"] + "||" + "\n"
      + select[index][3] + "||" + prizes[3]["name"] + "||";
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
    if (prizes[index]["type"] == "CREDITS") {
      var item = prizes[index];

      stats.redeemgift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "CAR") {
      var item = prizes[index];

      stats.redeemgift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "RANDOMCAR") {
      var gift = prizes[index];
      gift = { id: -1, type: "CAR", name: gift["name"], item: gift["item"], author: "", inventory: false }
      stats.redeemgift("🎉 " + gift["name"], gift, embed, msg, userdata);
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