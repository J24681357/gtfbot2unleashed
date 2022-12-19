var stats = require("../../functions/profile/f_stats");
var emote = require("../../index");
var gtftools = require("../../functions/misc/f_tools");

const Discord = require("discord.js");
var gtf = require("../../files/directories");
////////////////////////////////////////////////////

module.exports.delete = function (index, replaydata, userdata) {
delete replaydata[index]
replaydata = replaydata.filter(function(val) { return val !== null})

userdata["stats"]["numreplays"] = replaydata.length

 var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("REPLAYS").replaceOne({ id: userdata["id"] }, {id:userdata["id"], replays:replaydata});
  });
};


module.exports.clear = function (userdata) {
 var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
     dbo
      .collection("REPLAYS")
      .find({ id: userdata["id"] })
      .forEach(row => {
        dbo.collection("REPLAYS").replaceOne({id: userdata["id"]}, { id: userdata["id"] , replays:[]});
      });
  });
  userdata["stats"]["numreplays"] = 0
};

module.exports.remove = function (userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");
    dbo.collection("REPLAYS").deleteOne({ id: userdata["id"]});
  });
  userdata["stats"]["numreplays"] = 0
};


module.exports.savereplay = function (replay, userdata) {
  var replaydata = "";
  var found = false;

  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  MongoClient.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("GTFitness");

    dbo
      .collection("REPLAYS")
      .find({ id: userdata["id"] })
      .forEach(row => {
        replaydata = row;
        delete replaydata["_id"];
        if (replaydata["replays"].length > require(gtf.GTF).replaylimit) {
          return
        }
        
        add();
        dbo.collection("REPLAYS").replaceOne({ id: userdata["id"] }, replaydata);
        found = true;
      });
  });

  function add() {
    replay["date"] = stats.lastonline(userdata)
    replaydata["replays"].push(replay)
    userdata["stats"]["numreplays"] = Object.keys(replaydata["replays"]).length
  }
};
