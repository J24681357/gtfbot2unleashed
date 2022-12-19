var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////


module.exports.trackparams = function (params) {
  var track = new Object();
  var min = params.min;
  var max = params.max;
  var minSegmentLength = params.minSegmentLength;
  var maxSegmentLength = params.maxSegmentLength;
  var curviness = params.curviness;
  var maxAngle = (params.maxAngle / 360) * Math.PI;

  track.data = new Array();
  track.points = Math.floor((max - min) * Math.random()) + min;

  track.minX = 0;
  track.minY = 0;
  track.maxX = 0;
  track.maxY = 0;

  track.data[0] = { x: 400, y: 400 };
  direction = 0;

  for (i = 1; i < track.points; i++) {
    var len = Math.floor((maxSegmentLength - minSegmentLength) * Math.random()) + minSegmentLength;
    var dx = Math.sin(direction) * len;
    var dy = Math.cos(direction) * len;
    var x = track.data[i - 1].x + dx;
    var y = track.data[i - 1].y + dy;
    track.data[i] = { x: x, y: y };
    turn = Math.pow(Math.random(), 1 / curviness);
    if (Math.random() < 0.5) turn = -turn;
    direction += turn * maxAngle;
  }

  // In the last quarter of the track, force the points progressively closer to the start.
  q = Math.floor(track.points * 0.75);
  c = track.points - q;
  var x0 = track.data[0].x;
  var y0 = track.data[0].y;

  for (i = q; i < track.points; i++) {
    var x = track.data[i].x;
    var y = track.data[i].y;
    var a = i - q;
    track.data[i].x = (x0 * a) / c + x * (1 - a / c);
    track.data[i].y = (y0 * a) / c + y * (1 - a / c);
  }

  for (i = 1; i < track.points; i++) {
    x = track.data[i].x;
    y = track.data[i].y;
    if (x < track.minX) track.minX = x;
    if (y < track.minY) track.minY = y;
    if (x > track.maxX) track.maxX = x;
    if (y > track.maxY) track.maxY = y;

    track.minSize = Math.min(track.minX, track.minY);
    track.maxSize = Math.max(track.maxX, track.maxY);
  }

  track.layout = params.layout;
  track.location = params.location
  track.surface = params.surface
  return track;
};
module.exports.drawtrack = async function (track, callback) {

  var rint = 1
  //var rint = gtftools.randomInt(1,2)
  console.log(track)
  if (track.location == "Grass") {
  var url = 'https://raw.githubusercontent.com/J24681357/gtfbot/raw/master/images/coursemaker/backgrounds' + '/grass' + rint.toString() + '.png'
  }
  if (track.location == "Desert") {
  var url = 'https://raw.githubusercontent.com/J24681357/gtfbot/raw/master/images/coursemaker/backgrounds' +  '/desert' + rint.toString() + '.png'
  }
  if (track.location == "Mountain") {
  var url = 'https://raw.githubusercontent.com/J24681357/gtfbot/raw/master/images/coursemaker/backgrounds' +  '/mountain' + rint.toString() + '.png'
  }
  if (track.location == "Snow") {
  var url = 'https://raw.githubusercontent.com/J24681357/gtfbot/raw/master/images/coursemaker/backgrounds' +  '/snow' + rint.toString() + '.png'
  } else {
    var url = ""
  }
  
  var Canvas = require("@napi-rs/canvas");
  
  var { request } = require("undici") 
  if (url.length != 0) {
  const { body } = await request(url);
  const background = await Canvas.loadImage(await body.arrayBuffer())
  }
  
  var canvas = Canvas.createCanvas(2000, 2000);
  var ctx = canvas.getContext("2d");
  
  var total = 0;

  var x = 0;
  var y = 0;
  var scale = 500 / (track.maxSize - track.minSize);
  ctx.setTransform(scale, 0, 0, scale, -track.minSize, -track.minSize);
  ctx.strokeStyle = "#000000";

  ctx.lineWidth = 0;
  ctx.globalCompositeOperation = "xor";

  if (track.layout != "sprint") {
    ctx.moveTo(track.data[0].x, track.data[0].y);
    for (i = 1; i <= track.points; i++) {
      var p = i % track.points;
      ctx.lineTo(track.data[p].x, track.data[p].y);
    }

    ctx.stroke();
  }
  // To draw the actual track, we need to bisect each line segment and use the center as the curve
  // endpoint, then use the original line endpoints as the control points
  ctx.beginPath();

  if (track.location != "Blank") {
    ctx.strokeStyle = "#414954";
  } else {
  ctx.strokeStyle = "#FFFFFF";
  }
  if (track.surface == "Dirt") {
     ctx.strokeStyle = "#9B7653";
  }
  if (track.surface == "Snow") {
     ctx.strokeStyle = "#A1C2F2";
  }
  ctx.lineWidth = 4;

  ctx.globalCompositeOperation = "source-over";

  x_prev = 0;
  y_prev = 0;
  var distance = [];

  var p1 = 0;
  var p2 = 0;

  for (i = 0; i <= track.points; i++) {
    if (track.layout == "sprint") {
      p1 = i % track.points;
      p2 = (i + 1) % track.points;
      if (gtftools.betweenInt(p1, 0, 20) || gtftools.betweenInt(p2, 0, 20)) {
        continue;
      }
    } else {
      p1 = i % track.points;
      p2 = (i + 1) % track.points;
    }
    x = (track.data[p1].x + track.data[p2].x) / 2;
    y = (track.data[p1].y + track.data[p2].y) / 2;

    if (i == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.quadraticCurveTo(track.data[p1].x, track.data[p1].y, x, y);
    }

    var dist = Math.sqrt(Math.pow(x_prev - x, 2) + Math.pow(y_prev - y, 2));
    distance.push(dist);
    x_prev = x;
    y_prev = y;
  }
  distance = distance.slice(1);
  total = distance.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  total = Math.round(((total * 10) / 1609) * 100) / 100;

  ctx.stroke();
  ctx.closePath();

  if (track.layout == "sprint") {
    var i = 21;
  } else {
    var i = gtftools.randomInt(2, track.points - 5);
  }
  var p1 = i % track.points;
  var p2 = (i + 1) % track.points;
  x = (track.data[p1].x + track.data[p2].x) / 2;
  y = (track.data[p1].y + track.data[p2].y) / 2;

  ctx.fillStyle = "#c82124"; //red
  ctx.beginPath();
  ctx.arc(track.data[p1].x, track.data[p1].y, 5, 0.5 * Math.PI, 2.5 * Math.PI);
  ctx.closePath();
  ctx.fill();

  var trimmedcanvas = await trimCanvas(canvas);

  async function trimCanvas(c) {
    var ctx = c.getContext("2d")
       
    pixels = ctx.getImageData(0, 0, c.width, c.height)
      
      l = pixels.data.length
      i;
      bound = {
        top: null,
        left: null,
        right: null,
        bottom: null,
      };
      x;
      y;

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % c.width;
        y = ~~(i / 4 / c.width);

        if (bound.top === null) {
          bound.top = y;
        }

        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }

        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }

        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }

    // Calculate the height and width of the content
    var trimHeight = bound.bottom - bound.top;
    trimWidth = bound.right - bound.left;
      
    ctx.globalCompositeOperation='destination-over';
      if (url.length != 0) {
      ctx.drawImage(background, 0, 0, 1024, 1024);
    }
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth + 10, trimHeight + 10);
    trimmed.width = trimWidth;
    trimmed.height = trimHeight;
    copy = Canvas.createCanvas(trimWidth, trimHeight)
    copy2 = copy.getContext("2d")
    
    copy2.putImageData(trimmed, 0, 0);

    // Return trimmed canvas
    return copy;
  }
  
   var image = await trimmedcanvas.encode("png")
  
  var course = { name: "", image: image, location: track.location, layout: track.layout, surface: track.surface, type: "Course Maker - " + track.surface, length: total, lengthkm: Math.round(total * 1.609 * 100) / 100 };
  callback(course)
};

////////////////////////////////////

module.exports.loadcourse = function (number, userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo
      .collection("CUSTOMCOURSES")
      .find({ id: userdata["id"] })
      .forEach(row => {
        coursestats = row["courses"];
      })
      .then(() => {
        var course = coursestats[number.toString()];
        return course;
      });
  });
};
module.exports.removedata = function (userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("CUSTOMCOURSES").deleteOne({ id: userdata["id"]});
  });
};

module.exports.clearcourses = function (userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
     dbo
      .collection("CUSTOMCOURSES")
      .find({ id: userdata["id"] })
      .forEach(row => {
        dbo.collection("CUSTOMCOURSES").replaceOne({id: userdata["id"]}, { id: userdata["id"] , courses:[]});
      });
  });
};

module.exports.deletecourse = function (index, coursedata, userdata) {
delete coursedata[index]
coursedata = coursedata.filter(function(val) { return val !== null})

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("CUSTOMCOURSES").replaceOne({ id: userdata["id"] }, {id:userdata["id"], courses:coursedata});
  });
};

module.exports.renamecourse = function (index, name, coursedata, userdata) {
coursedata[index]["name"] = name.toString()

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("CUSTOMCOURSES").replaceOne({ id: userdata["id"] }, {id:userdata["id"], courses:coursedata});
  });
};

module.exports.savecourse = function (course, userdata) {
  var coursedata = "";
  var found = false;

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");

    dbo
      .collection("CUSTOMCOURSES")
      .find({ id: userdata["id"] })
      .forEach(row => {
        coursedata = row;
        delete coursedata["_id"];
        coursedata["courses"].push(course)
        dbo.collection("CUSTOMCOURSES").replaceOne({ id: userdata["id"] }, coursedata);
        found = true;
      });
  });
};
