var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var fs = require("fs");

module.exports.message = function(client, title, text, color, image, channelid, elist, number) {
  var server = client.guilds.cache.get(gtf.SERVERID);
  var channel = server.channels.cache.get(channelid);
  var embed = new EmbedBuilder();
  var description = text;


  if (typeof channel == 'undefined') {
    channel.send({content: 'Invalid'});
    return;
  }

  var elist = [...elist]
  next(elist)

 function next(elist) {

    channel.messages.fetch().then(msg => {

    var arr = Array.from(msg.entries()).reverse();

    if (typeof arr[number - 1] === 'undefined') {
      embed.setTitle(title);
      embed.setDescription(description);
      if (color.length != 0) {
        embed.setColor(color);
      }
      if (typeof image !== 'undefined') {
        if (image.length != 0) {
          embed.setThumbnail(image);
        }
      }
      channel.send({embeds: [embed]});
      return;
    }


    channel.messages.fetch(arr[number - 1][0]).then(msg => {

      if (msg == undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        channel.send({embeds: [embed]});
        return;
      }

      var otitle = msg.embeds[0].title;
      var odescription = msg.embeds[0].description;
      var ocolor = msg.embeds[0].color

      if (odescription === undefined || otitle === undefined || ocolor === undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        msg.edit({embeds: [embed]});
        return;
      }

      if (JSON.stringify(odescription) !== JSON.stringify(description) || JSON.stringify(otitle) !== JSON.stringify(title) || JSON.stringify(ocolor) !== parseInt(color, 16)) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
          msg.edit({embeds: [embed]});
      }
      var time = 0;
      embed.setTitle(title);
      embed.setDescription(description);

      if (elist.length != 0) {
        var buttons = gtftools.preparebuttonsn(elist, msg);
      } else {
        var buttons = []
      }

       msg.edit({embeds:[embed], components: buttons}).then(msg => {
         var functionlist = []

         for (var i = 0; i < elist.length; i++) {
           functionlist.push(function(val) {
             var useri = msg.guild.members.cache.get(val["id"]);
                    var role = msg.guild.roles.cache.find(r => r.name === elist[val["value"]]["value"]);
                    /*
                    if (useri.guild.roles.cache.some(r => r.name === "Consoles ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Consoles ===============================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "Games ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Games ================================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "Settings ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Settings ================================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "GTF Items ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "GTF Items ==============================")).catch(console.error)
                    }
                    */


                    if (useri.roles.cache.find(r => r.name === elist[val["value"]]["value"])) {
                      require(gtf.DISCORD).role(msg, useri, role, "REMOVE")
                    } else {
                      require(gtf.DISCORD).role(msg, useri, role, "ADD")
                    }
         })
         }
        if (elist.length != 0) {
        gtftools.createbuttonsn(buttons, elist, functionlist, msg)
      }

    })
  })
})
 }
}
