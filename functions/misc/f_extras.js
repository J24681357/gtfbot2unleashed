var dir = "../../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////
var gtfuser = require(dir + "index");
var fs = require("fs");

module.exports.message = function (client, title, text, color, image, channelid, reactions, number) {
  var server = client.guilds.cache.get(gtf.SERVERID);
  var channel = server.channels.cache.get(channelid);
  var embed = new EmbedBuilder();
  var description = text;

  if (typeof channel == "undefined") {
    channel.send("Invalid");
    return;
  }

  channel.messages.fetch().then(msg => {
    var arr = Array.from(msg.entries()).reverse();

    if (typeof arr[number - 1] === "undefined") {
      embed.setTitle(title);
      embed.setDescription(description);
      if (color.length != 0) {
        embed.setColor(color);
      }
      if (typeof image !== "undefined") {
        if (image.length != 0) {
          embed.setThumbnail(image);
        }
      }
      channel.send({ embeds: [embed] });
      return;
    }

    channel.messages.fetch({ message: arr[number - 1][0] }).then(msg => {
      if (msg == undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== "undefined") {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        channel.send({ embeds: [embed] });
        return;
      }

      var otitle = msg.embeds[0].title;
      var odescription = msg.embeds[0].description;

      if (odescription === undefined || otitle === undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== "undefined") {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        msg.edit({ embeds: [embed] });
        return;
      }

      if (JSON.stringify(odescription) !== JSON.stringify(description) || JSON.stringify(otitle) !== JSON.stringify(title)) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== "undefined") {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        msg.edit({ embeds: [embed] });
      }
      var time = 0;
      if (reactions.length != 0) {
        if (msg.reactions.cache.size < reactions.length) {
          time = 3000 * (reactions.length + 1);
          var i = 0;
          gtftools.interval(
            function () {
              msg.react(reactions[i][0]);
              i++;
            },
            3000,
            reactions.length
          );
        }

        setTimeout(function () {
          var filters = function (index) {
            var filterzero = (reaction, user) => reaction.emoji.name === reactions[index][0];
            const filter11 = msg.createReactionCollector({ filterzero, timer: 1000 });

            filter11.on("collect", r => {
              try {
                for (const user of r.users.cache.values()) {
                  if (user.id == gtf.USERID) {
                    continue;
                  }
                  r.users.remove(user).then(x => function () {});
                  var useri = msg.guild.members.cache.get(user.id);
                  var role = msg.guild.roles.cache.find(r => r.name === reactions[index][1]);

                  if (useri.roles.cache.find(r => r.name === reactions[index][1])) {
                    useri.roles.remove(role).catch(console.error);
                  } else {
                    useri.roles.add(role).catch(console.error);
                  }
                }
              } catch (error) {
                console.error(error);
              }
            });
          };
          for (var i = 0; i < reactions.length; i++) {
            filters(i);
          }
        }, time);
      }
    });
  });
};