var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports.startsession = function (location, msg, embed, userdata) {
  embed.setTitle(" ")
  var grid = [];
  var count = stats.count(userdata)
  var results = ""
  var usercar = {x:1,y:5, object:gtftools.toEmoji("playercar")}
  var usergaragecar = stats.currentcar(userdata)
  var usergaragecarperf = require(gtf.PERF).perf(usergaragecar, "GARAGE");
  
  var time = require(gtf.TIME).random({}, 1)[0];
  var weather = require(gtf.WEATHER).random({}, 1)[0];
  var topspeed = require(gtf.PERF).speedcalc(gtftools.lengthalpha(usergaragecarperf["fpp"], weather,location), usergaragecar);

  var currentspeed = [Math.round(30 * 1.609), 30]
  var totalmileage = [0, 0]
  var allobjects = []
  var yMax = 12
  var xMax = 10
  var cruise = false
  var brake = [false, 0]
  
  var corners = {
    available: false, 
    patterns: [{
      block: "TOP",
      verticalend: 0, 
      verticalstart: gtftools.randomInt(4, 8),
      pattern:["curbturnleftup", "curbhorizontal", "blank", "blank", "blank","curbhorizontal", "curbturnupright"]
   },{
      block: "BOTTOM",
      verticalend: 0, 
      verticalstart: gtftools.randomInt(4, 8),
      pattern:["curbhorizontal", "curbturndownright", "blank", "blank", "blank","curbturnleftup", "curbhorizontal"]
   }
   ,{
      block: "TOP",
      verticalend: 0, 
      verticalstart: gtftools.randomInt(4, 8),
      pattern:["curbhorizontal", "curbturnupright", "blank", "blank", "blank","curbturnleftdown", "curbhorizontal"]
   },{
      block: "BOTTOM",
      verticalend: 0, 
      verticalstart: gtftools.randomInt(4, 8),
      pattern:["curbturnleftdown", "curbhorizontal", "blank", "blank", "blank","curbhorizontal", "curbturnupright"]
   }]
  }
  var currpattern = corners["patterns"][0]

  for (let y = 0; y < yMax; y++) {
      grid[y] = [];

      for (let x = 0; x < xMax; x++) { 
        if (y == 0 || y == yMax - 1) {
        if (gtftools.randomInt(1, 2) == 1) {
           allobjects.push({
        x: x,
        y: y,
        objtype: "BACKGROUND",
        object: location["background_2"][Math.floor(Math.random() * location["background_2"].length)] 
    })
        } else {
          allobjects.push({
        x: x,
        y: y,
        objtype: "BACKGROUND",
        object: emote.transparent 
    })
        }
        }
      if (y == 1 || y == yMax - 2) {
        if (gtftools.randomInt(1, 2) == 1) { 
          
           allobjects.push({
        x: x,
        y: y,
        objtype: "BACKGROUND",
        object: location["background_1"][Math.floor(Math.random() * location["background_1"].length)] 
    })
        } else {
          allobjects.push({
        x: x,
        y: y,
        objtype: "BACKGROUND",
        object: emote.transparent 
    })
        }
      }
      }
  }
  grid = updategrid()
  results = grid.map(x => x.join("")).join("\n")
  embed.setDescription(results)

  embed.setFields(
    {name: 'Speed', value: currentspeed[userdata["settings"]["MILEAGE"]] + ["kmh","mph"][userdata["settings"]["MILEAGE"]], inline: true},
    {name: 'Distance', value: totalmileage[userdata["settings"]["MILEAGE"]] + ["km","mi"][userdata["settings"]["MILEAGE"]], inline:false},
		{ name: 'Time' , value: time["emoji"] + " " + time["hour"].toString() + ":" + time["minutes"], inline:true},
		{ name: 'Weather', value: weather["emoji"] + " " + weather["name"] + " 💧" + weather["wetsurface"] + "%", inline:true },
		{ name: stats.main(userdata), value: stats.currentcarmain(userdata)},
	)

var emojilist = [
  {
    emoji: emote.uparrow,
    emoji_name: 'uparrow',
    name: '',
    extra: "",
    button_id: 0
  },
  {
    emoji: emote.downarrow,
    emoji_name: 'downarrow',
    name: '',
    extra: '',
    button_id: 1
  },
   {
    emoji: emote.brake,
    emoji_name: 'brake',
    name: '',
    extra: "",
    button_id: 2
  },
  {
    emoji: emote.transparent,
    emoji_name: 't_',
    name: 'Cruise Control',
    extra: "",
    button_id: 3
  },
  {
    emoji: "🏁",
    emoji_name: '🏁',
    name: 'Race Nearby Opponent',
    extra: "",
    button_id: 4
  }
]

var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
require(gtf.DISCORD).send(msg, {embeds: [embed], components:buttons}, freerunbuttonsfunc)

function freerunbuttonsfunc(msg) {
  function cruisenow() {
    if (cruise) {
      cruise = false
      return
    } else {
      cruise = true
    }
  }
  function brakenow() {
    if (brake[0]) {
      return
    }
    brake = [true, 3]
  }
  function moveup() {
    if (usercar["y"] <= 2) {
    } else {
      usercar["y"]--
      usercar["object"] = gtftools.toEmoji("playercarup")
    }
  }
  function movedown() {
    if (usercar["y"] >= xMax - 1) {
    } else {
      usercar["y"]++
      usercar["object"] = gtftools.toEmoji("playercardown")
    }
  }
  function startrace() {
    var rname = location["tracks"][Math.floor(Math.random() * location["tracks"].length)]
    var opponent = require(gtf.CARS).get({ fullname: [embed.footer.text.substring(1, embed.footer.text.split(" ").length - 1)], year: [embed.footer.text.split(" ").pop()] })
    if (opponent === undefined) {
      return
    }
    clearInterval(drive)
    
    setTimeout(() => msg.delete(), 0 );
    var fpp = require(gtf.PERF).perf(opponent, "DEALERSHIP")["fpp"];

     var raceprep = {
        mode: "DUEL",
        modearg: [],
        carselect: "GARAGE",
        car: usergaragecar,
        trackselect: "SELECT",
        time: time,
        weather: weather,
        grid: 2,
        players: [{ place: 1, 
        position: 1, 
        name: opponent["name"] + " " + opponent["year"], 
        user: false, 
        fpp: fpp,
        oscore: 0,
        score: 0,
        points: 0 },
        { place: 2, 
        position: 2, 
        name: usergaragecar["name"], 
        user: true, 
        fpp: usergaragecarperf["fpp"],
        oscore: 0,
        score: 0,
        points: 0 }],
        track: require(gtf.TRACKS).find({ name: [rname] })[0],
        time:time,
        weather:weather,
        fpplimit: fpp,
        difficulty: 85,
        locationid: 1,
        other: [],
      }
      embed.fields = []
      stats.addmileage(totalmileage[0],totalmileage[1], userdata)
      stats.addtotalmileage(totalmileage[0],totalmileage[1], userdata)
      stats.addtotalmileagecar(totalmileage[0],totalmileage[1], userdata)
      embed.setFields([{name:stats.main(userdata), value:stats.currentcarmain(userdata))
      return require(gtf.RACE}]).raceprep(raceprep, embed, msg, userdata);
  }
  var functionlist = [moveup, movedown, brakenow, cruisenow, startrace]
  gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
     var speed = 1;
  
  var drive = function() {
    if (currentspeed[1] < 30) {
      speed = 0
    } 
    if (currentspeed[1] >= 30) {
      speed = 1
    } 
    if (currentspeed[1] >= 110) {
      speed = 2
    } 
    if (currentspeed[1] >= 180) {
      speed = 3
    } 
    for (var s = 0; s < speed; s++) {
    var r = gtftools.randomInt(0,100) 
    var r2 = gtftools.randomInt(0,100)
    var r3 = gtftools.randomInt(0,100)
    for (var i = 0; i < allobjects.length; i++) {
      allobjects[i]["x"]--
      if (usercar["x"] == allobjects[i]["x"] && usercar["y"] == allobjects[i]["y"] && allobjects[i]["objtype"] == "OPPONENT") {
             allobjects[i]["object"] = "💥"
      }
    }
    allobjects = allobjects.filter(x => x["x"] >= 0)
    if (r > 80) {
      if (!corners["available"] && allobjects.filter(x => x["objtype"] == "CURB").length == 0) {
        corners["available"] = true
    }
    }

var backgroundobjs = [{
        x: xMax - 1,
        y: 0 ,
        objtype: "BACKGROUND",
        object: location["background_2"][Math.floor(Math.random() * location["background_2"].length)] 
    },
    {
        x: xMax - 1,
        y: 1 ,
        objtype: "BACKGROUND",
        object: location["background_1"][Math.floor(Math.random() * location["background_1"].length)] 
    },{
        x: xMax - 1,
        y: yMax - 2 ,
        objtype: "BACKGROUND",
        object: location["background_1"][Math.floor(Math.random() * location["background_1"].length)] 
    },
    {
        x: xMax - 1,
        y: yMax - 1 ,
        objtype: "BACKGROUND",
        object: location["background_2"][Math.floor(Math.random() * location["background_2"].length)] 
    }]

  for (var i = 0; i < backgroundobjs.length; i++) {
if (r3 > 50) {
    allobjects.push(backgroundobjs[i])
}
r3 = gtftools.randomInt(0,100)
  }

      if (corners["available"] && currpattern["pattern"].length >= 1) {
        var pop = currpattern["pattern"].pop(0)
          var object = {
        x: xMax - 1,
        y: currpattern["verticalstart"] ,
        objtype: "CURB",
        object: gtftools.toEmoji(pop)
      }
      if (pop == "blank") {
      currpattern["verticalstart"] = gtftools.randomInt(4, 8)
      }
      allobjects.push(object)
      for (var i = 2; i < yMax - 2; i++) {
        if (i == object["y"]) {
          continue;
        }
       if (currpattern["block"] == "BOTTOM") {
              if (object["y"] == i - 1 || object["y"] == i - 2) {
          } else {
            if (pop == "curbhorizontal") {
         allobjects.push({
        x: xMax - 1,
        y: i,
        objtype: "COLLISION",
        object: "⬜"
        })
      }
          }
       }
        if (currpattern["block"] == "TOP") {
            if (object["y"] == i + 1 || object["y"] == i + 2) {
          } else {
            if (pop == "curbhorizontal") {
         allobjects.push({
        x: xMax - 1,
        y: i,
        objtype: "COLLISION",
        object: "⬜"
        })
      }
          }
        }
      }
      }

      if (pop == "curbhorizontal") {
      if (currpattern["block"] == "TOP") {
        currpattern["block"] = "BOTTOM"
      } else {
        currpattern["block"] = "TOP"
      }
      }
      if (currpattern["pattern"].length == 0 && allobjects.filter(x => x["objtype"] == "CURB").length == 0) {
        currpattern = corners["patterns"][Math.floor(Math.random() * corners["patterns"].length)]
        currpattern["verticalstart"] = gtftools.randomInt(4, 8)
        corners["available"] = false
      }

      embed.setFooter({text:" "})
      if (!corners["available"] && r2 >= 90) {
      var car = require(gtf.CARS).random({types: ["Production"], upperfpp: usergaragecarperf["fpp"] + 100, lowerfpp: usergaragecarperf["fpp"] - 100}, 1)[0]

      car["x"] = xMax - 1
      car["y"] = gtftools.randomInt(2,xMax - 1)
      car["objtype"] = "OPPONENT"
      car["object"] = gtftools.toEmoji("playercar")
      allobjects.push(car)
      
      }

  grid = updategrid()

  if (grid == "STOP") {
    clearInterval(drive)
    embed.fields = []
    stats.addmileage(Math.round((totalmileage[1] * 100))/100 ,Math.round((totalmileage[0] * 100))/100, userdata)
    stats.addtotalmileage(Math.round((totalmileage[1] * 100))/100 ,Math.round((totalmileage[0] * 100))/100, userdata)
    stats.addtotalmileagecar(Math.round((totalmileage[1] * 100))/100 ,Math.round((totalmileage[0] * 100))/100, userdata)
    
    embed.addFields([{name:stats.main(userdata), value:stats.currentcarmain(userdata))
    results = "__Collision With Wall__" + " " + "**+" + Math.round((totalmileage[userdata["settings"]["MILEAGE"]] * 100)}])/100 + ["km","mi"][userdata["settings"]["MILEAGE"]] + "**" +  emote.mileage + "\n\n" + "🔁 Would you like to restart?"
    emojilist = [{
      emoji: "🔁",
      emoji_name: "🔁",
      name: "Restart",
      extra: "Once",
      button_id: 0
    }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

     function goback_freeroam() {
    require(dir + "commands/freerun").execute(msg, {"options":"list"}, userdata);
    return
  }
    var functionlist = [goback_freeroam]

    embed.setDescription(results)
    if (stats.count(userdata) != count) {
      clearInterval(drive)
      setTimeout(() => msg.delete(),0 );
    }
    msg.edit({embeds:[embed], components:buttons})
    gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    return
  }

  /*if (allobjects.length != 0) {
  console.dir("DEBUG objects: " + allobjects[0]["x"] + " " + allobjects[0]["y"])
  }*/

  results = grid.map(x => x.join("")).join("\n")
  }
  if (!cruise) {

  if (brake[0]) {
    if (brake[1] == 0 || currentspeed[1] <= 10) {
      brake = [false, 0]
    } else {
      brake[1]--
    currentspeed[1] = currentspeed[1] - Math.round(topspeed[1] / 8)
    }
  } else {
  currentspeed[1] = currentspeed[1] + Math.round(topspeed[1] / 30)
    if (currentspeed[1] >= topspeed[1]) {
      currentspeed[1] = topspeed[1]
    }
  }
  
  } else {
    currentspeed[1] = currentspeed[1] - Math.round(topspeed[1] / 8)
    if (currentspeed[1] <= 30) {
    currentspeed[1] = 30
    }
  }
  currentspeed[0] = Math.round(currentspeed[1] * 1.609)

  totalmileage[1] = totalmileage[1] + (currentspeed[1] * (2/3600))
  totalmileage[0] = totalmileage[0] + ((currentspeed[1] * (2/3600)) * 1.609)
  
  embed.fields[0] = {name: 'Speed', value: currentspeed[userdata["settings"]["MILEAGE"]] + ["kmh","mph"][userdata["settings"]["MILEAGE"]], inline:true}
  embed.fields[1] = {name: 'Distance', value: Math.round((totalmileage[userdata["settings"]["MILEAGE"]] * 100))/100 + ["km","mi"][userdata["settings"]["MILEAGE"]], inline:true}

  buttons = gtftools.preparebuttons(emojilist, msg, userdata);

  embed.setDescription(results)
  require(gtf.DISCORD).edit(msg, {embeds:[embed], components:buttons}, drive)
  }
  drive()
}

/////////////////FUNCTIONS/////////////////
function updategrid() {
  for (let y = 0; y < yMax; y++) {
      grid[y] = [];

      for (let x = 0; x < xMax; x++) {
        if (y == 1 || y == yMax - 2) {
           grid[y][x] = "⬜"
        } if (x == usercar["x"] && y == usercar["y"]) {
          grid[y][x] = usercar["object"]
          usercar["object"] = gtftools.toEmoji("playercar")
        } else {
          if (allobjects.length == 0) { 
        grid[y][x] = gtftools.toEmoji("blank");
          } else {
        grid[y][x] = gtftools.toEmoji("blank");
        for (var i = 0; i < allobjects.length; i++) {
if (x == allobjects[i]["x"] && y == allobjects[i]["y"] && allobjects[i]["objtype"] == "CURB") {
           if (usercar["x"] == allobjects[i]["x"]) {           
             grid[y][x] = allobjects[i]["object"]
           } else {
             grid[y][x] = allobjects[i]["object"]
           }
         }
         if (x == allobjects[i]["x"] && y == allobjects[i]["y"] && allobjects[i]["objtype"] == "COLLISION") {
           if (usercar["x"] == allobjects[i]["x"]) {           
             grid[y][x] = allobjects[i]["object"]
           } else {
             grid[y][x] = allobjects[i]["object"]
           }
         }
           if (usercar["x"] == allobjects[i]["x"] && usercar["y"] == allobjects[i]["y"]) {
             if (allobjects[i]["objtype"] == "COLLISION") {  
             return "STOP"
             }
          }
        
        if (x == allobjects[i]["x"] && y == allobjects[i]["y"] && allobjects[i]["objtype"] == "BACKGROUND") {
          grid[y][x] = allobjects[i]["object"]
        } 
         if (x == allobjects[i]["x"] && y == allobjects[i]["y"] && allobjects[i]["objtype"] == "OPPONENT") {
           if (usercar["x"] == allobjects[i]["x"]) {           
             grid[y][x] = allobjects[i]["object"]
             if ((usercar["y"] == allobjects[i]["y"] + 1 || usercar["y"] == allobjects[i]["y"] - 1)  || 
             (usercar["x"] == allobjects[i]["x"] + 1 && usercar["y"] == allobjects[i]["y"] + 1)) {
              embed.setFooter({text: allobjects[i]["name"] + " " + allobjects[i]["year"]})
             
             }
           } else {
             grid[y][x] = allobjects[i]["object"]
           }


         }

        }
      }
  }
      }
  }
  return grid
 }
 function addbackground_1(grid, x, y) {
     if (x == 0) {
    grid[y][x] = "⬜"
  } else {
  grid[y][x] = location["background_1"][Math.floor(Math.random() * location["background_1"].length)]
/*var r = gtftools.randomInt(0,100) 
  if (r > 50) {
    
  } else {
    grid[y][x] = "⬜"
  }*/
}
 }
function addbackground_2(grid, x, y) {
  if (x == 0) {
    grid[y][x] = "⬜"
  } else {
  grid[y][x] = location["background_2"][Math.floor(Math.random() * location["background_2"].length)] 
  }
/*var r = gtftools.randomInt(0,100) 
  if (r > 50) {
    
  } else {
    grid[y][x] = "⬜"
  }*/
}

}

 