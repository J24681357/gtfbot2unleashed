var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "status",
  title: "Session Status",
  cooldown: 5,
  license: "N", level: 0,
  roles: [],
  channels: ["testing", "gtf-mode", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: false,
  description: [""],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
        text: "",
        list: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 0,
        page: 0,
        numbers: false,
        buttons: true,
        carselectmessage: false,
        image: [],
        footer: "",
        special: "",
        other: "",
      }, msg, userdata)
      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

      embed.setTitle("__Session Status__")
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "\n\n" + "**❓ You can view the message link to your current session here. You can cancel it while in progress such as races, drift trials, speed runs, etc.**"
      }
      if (!userdata["raceinprogress"]["active"]) {
        embed.setDescription("**❗ You are not in a session.**" + pageargs["footer"])
        require(gtf.DISCORD).send(msg, {embeds: [embed]})
        return;
      } 

      if (userdata["inlobby"]["active"]) {
        embed.setDescription("**❗ You cannot use this command while in a lobby.**" + pageargs["footer"])
        require(gtf.DISCORD).send(msg, {embeds: [embed]})
        return;
      }
      
      if (query["options"] == "exit" || query["options"] == "cancel") {
          exitnow(msg);
          return;
      }

      if (query["options"] == "status" || query["options"] == "view") {
        
        embed.setDescription("**❓ You can view the message link to your current session here. You can also cancel your current session here such as races, drift trials, speed runs, etc.**")
        embed.addFields([{name:"Session in Progress", value: "[Message Link](https://discord.com/channels/" + "239493425131552778" + "/" + userdata["raceinprogress"]["channelid"] + "/" + userdata["raceinprogress"]["messageid"] + ")", inline: true}, {name:"Time Remaining", value: (require(gtf.DATETIME).getFormattedTime(userdata["raceinprogress"]["expire"] - new Date().getTime())) + " minutes", inline: true}])
        results = pageargs["footer"] 
        //embed.setDescription(results);
 var emojilist = [
  { emoji: emote.exit, 
  emoji_name: "gtfexit", 
  name: 'Cancel Session', 
  extra: "Once",
  button_id: 0 }]
  
  var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
        require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons}, cancelfunc)
          
        function cancelfunc(msg) {
          var functionlist = [exitnow]

           gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
          return;
        }
      }
        

      function exitnow() {
        /*
        if ( parseFloat(userdata["raceinprogress"]["expire"] - new Date().getTime()) <= 0 * 1000) {
          require(gtf.EMBED).alert({ name: "❌ Session Ending Soon", description: "You can not exit a session that has under 10 seconds remaining.", embed: "", seconds: 0 }, msg, userdata);
          return
        }
        */
        
        userdata["raceinprogress"]["active"] = false
        require(gtf.EMBED).alert({ name: "✅ Success", description: "You have left the session.", embed: "", seconds: 5 }, msg, userdata);
        if (userdata["raceinprogress"]["messageid"].length != 0) {
          msg.channel.messages
          .fetch({ message: userdata["raceinprogress"]["messageid"]})
          .then(message => {
            setTimeout(() => message.delete(), 0);
            console.log("OK")
          });
        }
        stats.removeracedetails(userdata);
        stats.clearraceinprogress(userdata);
        userdata["raceinprogress"]["expire"] = "EXIT"
        stats.save(userdata)
        return;
      }
  }
};
