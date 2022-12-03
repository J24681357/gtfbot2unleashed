var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var gtfbot = require(gtf.MAIN).bot

module.exports.send = function(msg, content, callback) {
  //console.log(Buffer.byteLength(content["files"]["attachment"]))
    if (content["type1"] == "CHANNEL") {             
    msg.sendTyping()
      } else {
    msg.channel.sendTyping() 
  }
  if (typeof callback === "undefined") {
    callback = function() {}
  }
  gtfbot["totalmsg"]++
   if (gtfbot["totalmsg"] == 0) {
      return
    } else {
      var timer;
      var i;
      var check = function() {
          clearInterval(timer)
          clearInterval(i)
          gtfbot["msglimit"] = false
      }
      
      var repeat = function() {
        if (gtfbot["msglimit"] == false) {
        gtfbot["msglimit"] = true        
         timer = setInterval(function() {
            if (gtfbot["totalmsg"] != 0) {
              gtfbot["totalmsg"]--
              if (content["type1"] == "CHANNEL") {             
              msg.send(content).then(msgg => {
                callback(msgg)}
              )
              } else {
              msg.channel.send(content).then(msgg => {
                callback(msgg)}
                )
              }
        }
        check()
      }, 1500)
      
        }
      }

      if (gtfbot["msglimit"] == false) {
        repeat()
      } else {
       i = setInterval(function() {repeat()}, 4000)
      }
}
}

module.exports.edit = function(msg, content, callback) {
  if (typeof callback === "undefined") {
    callback = function() {}
  }
  gtfbot["totalmsg"]++
   if (gtfbot["totalmsg"] == 0) {
      return
    } else {
      var timer;
      var i;
      var check = function() {
          clearInterval(timer)
          clearInterval(i)
          gtfbot["msglimit"] = false
      }
      
      var repeat = function() {
        if (gtfbot["msglimit"] == false) {
        gtfbot["msglimit"] = true        
         timer = setInterval(function() {
            if (gtfbot["totalmsg"] != 0) {
              gtfbot["totalmsg"]--
              msg.edit(content).then(msgg => {
                callback(msgg)}
                )
        }
        check()
      }, 1500)
      
        }
      }

      if (gtfbot["msglimit"] == false) {
        repeat()
      } else {
       i = setInterval(function() {repeat()}, 1500)
      }
}
}