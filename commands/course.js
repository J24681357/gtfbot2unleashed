var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "course",
  title: "GTF Course Maker",
  level: 11,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
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
   stats.load("CUSTOMCOURSES", userdata, startcourse)
    
    function startcourse(coursestats) {
      
      coursestats = coursestats["courses"]

      if (query["options"] == "list") {
        delete query["number"]
        delete query["name"]

        if (coursestats.length == 0) {
          require(gtf.EMBED).alert({ name: "❌ No Courses", description: "You have no courses saved.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        embed.setTitle(emote.tracklogo + "__My Courses (" + coursestats.length + "/" + require(gtf.GTF).courselimit + " Courses)__");
        info = "";
        var list = coursestats.map(function (course, index) {
          return "`📌ID:" + (index+1) + "` " + course["name"];
        });

        pageargs["list"] = list;
        pageargs["selector"] = "number";
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "**❓ Select your course associated with the list above with the buttons. You can view your courses here.**";
        }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
        pageargs["text"] = gtftools.formpage(pageargs, userdata);
        gtftools.formpages(pageargs, embed, msg, userdata);
        return;
      }
      if (query["options"] == "view") {
        var number = query["number"];
        if (!gtftools.betweenInt(number, 1, coursestats.length)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var course = coursestats[number - 1];

        embed.setTitle(emote.tracklogo + "__GTF Course Maker__");
        const attachment = new AttachmentBuilder(course["image"].buffer, {name: "course.png"});
        
        embed.setImage("attachment://course.png");
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This contains course information about your procedurally generated track. The red point would be the starting point.**";
        }
        var lengthselect = [course["lengthkm"] + " km", course["length"] + " mi"];
        embed.setDescription("**Name:** " + course["name"] + "\n" + 
        "**Author:** " + msg.guild.members.cache.get(course["author"]).user.username + "\n" + 
        "**Environment:** " + course["location"] + " | " + course["surface"] + "\n" +
        "**Track Length:** " + lengthselect[userdata["settings"]["UNITS"]] + pageargs["footer"]);
             var emojilist = [
  { emoji: "🗑️", 
  emoji_name: "🗑️", 
  name: 'Remove Course', 
  extra: "",
  button_id: 0 }
]
var buttons = gtftools.preparebuttons(emojilist, msg, userdata);
         require(gtf.DISCORD).send(msg, {
          embeds: [embed],
          files: [attachment],
          components: buttons
        }, courseviewfunc);

        function courseviewfunc(msg) {
          function deletec() {
         require(dir + "commands/course").execute(msg, {options:"delete", number:parseInt(query["number"])}, userdata);
        }
        var functionlist = [deletec]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
          
        }


        return;
      }
      if (query["options"] == "rename") {
        var number = query["number"];
        var newname = query["name"]
        if (!gtftools.betweenInt(number, 1, coursestats.length)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (query["name"] === undefined) {
          require(gtf.EMBED).alert({ name: "❌ Invalid Name", description: "No name has been inputted.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (!gtftools.betweenInt(newname.length, 3, 30)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Name", description: "Name must be between 3 and 30 characters. (" + newname.length + ")", embed: "", seconds: 0 }, msg, userdata);
            return;
        }
        var name = coursestats[number-1]["name"]
        embed.setDescription("⚠ Rename " + "`📌ID:" + number + "` " + "**" + name + "**" + " to " + "**" + newname + "**" + "? This may take a while.");
          var emojilist = [
             { emoji: emote.yes, 
              emoji_name: 'Yes', 
              name: 'Confirm', 
              extra: "Once",
              button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

         require(gtf.DISCORD).send(msg, {embeds:[embed],components:buttons}, coursefunc)
         
         function coursefunc(msg) {
          function renamecourse() {
            require(gtf.COURSEMAKER).renamecourse(number-1, newname, coursestats, userdata);
            setTimeout(function() {require(dir + "commands/" + pageargs["command"]).execute(msg, {options:"list", extra:"Renamed " + "`📌ID:" + number + "` " + "**" + name + "**" + " to " + "**" + newname + "**" + "."}, userdata);
            }, 1000)
          }
          var functionlist = [renamecourse]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "delete") {
        var number = query["number"];
        if (!gtftools.betweenInt(number, 1, coursestats.length + 1)) {
          require(gtf.EMBED).alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = coursestats[number-1]["name"]
        embed.setDescription("⚠ Delete " + "`📌ID:" + number + "` " + "**" + name + "**? This may take a while.");
          var emojilist = [
             { emoji: emote.yes, 
              emoji_name: 'Yes', 
              name: 'Confirm', 
              extra: "Once",
              button_id: 0 }]
    var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        require(gtf.DISCORD).send(msg, {embeds:[embed], components:buttons}, coursefunc2)
        
        function coursefunc2(msg) {
          function deletecourse() {
            require(gtf.COURSEMAKER).deletecourse(number-1, coursestats, userdata);        
            setTimeout(function() {require(dir + "commands/" + pageargs["command"]).execute(msg, {options:"list", extra:"Deleted " + "`📌ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletecourse]
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }

      if (query["options"] == "clear") {
        var emojilist = [{ emoji: emote.yes, emoji_name: "Yes", name: "Confirm", extra: "Once", button_id: 0 }];
        var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        embed.setDescription("⚠ Clear all of your saved courses? This is permanent.");
        embed.setColor(0xffff00);
        require(gtf.DISCORD).send(msg, {embeds: [embed], components: buttons }, coursefunc3)
        
        function coursefunc3(msg) {
          function clearcourses() {
            require(gtf.COURSEMAKER).clearcourses(userdata);
            require(gtf.EMBED).alert({ name: "✅ Success", description: "Course data cleared.", embed: embed, seconds: 3 }, msg, userdata);
          }
          var functionlist = [clearcourses];

          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
        }
      }

      if (query["options"] == "create") {
        delete query["number"]

        var curviness = 0.3;
        var maxangle = 120;
        var minsegment = 2;
        var maxsegment = 20;
        var allsegment = 0;
        var type = "circuit";
        var location = "Grass"
        var surface = "Tarmac"
        var name = "Generic Track " + "#" + gtftools.randomInt(0,9).toString() + gtftools.randomInt(0,9).toString() + gtftools.randomInt(0,9).toString() + gtftools.randomInt(0,9).toString() 

        if ("name" in query) {
          name = query["name"].toString();
          if (!gtftools.betweenInt(name.length, 3, 30)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Name", description: "Name must be between 3 and 30 characters. (" + name.length + ")", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if ("allsegments" in query) {
          /// 0 - 20
          allsegment = parseFloat(query["allsegments"]);
          if (!gtftools.betweenInt(allsegment, 2, 20)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Segment lengths must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
          minsegment = allsegment;
          maxsegment = allsegment;
          allsegment = "";
        }
        if ("maxsegment" in query) {
          maxsegment = parseFloat(query["maxsegment"]);
          if (allsegment.toString().length != 0) {
            if (!gtftools.betweenInt(maxsegment, 2, 20)) {
              require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Maximum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
        }
        if ("minsegment" in query) {
          /// 0 - 20
          minsegment = parseFloat(query["minsegment"]);

          if (allsegment.toString().length != 0) {
            if (!gtftools.betweenInt(minsegment, 2, 20)) {
              require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Mininum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
        }
        if ("curviness" in query) {
          /// 0.0 - 1.0
          curviness = parseFloat(query["curviness"]);
          if (!gtftools.betweenInt(curviness, 0, 1)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Curviness value must be between 0 and 1.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if ("maxangle" in query) {
          /// 50-150
          maxangle = parseFloat(query["maxangle"]);
          if (!gtftools.betweenInt(maxangle, 50, 150)) {
            require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Max Angle value must be between 50 and 150.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if (typeof query["type"] !== 'undefined') {
          type = query["type"];
        }
        if (typeof query["location"] !== 'undefined') {
          location = query["location"];
        }

        if (typeof query["surface"] !== 'undefined') {
          surface = query["surface"];
        }

        if (maxsegment < minsegment) {
          require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Maximum segment length is lower than the minimum segment length.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        if (minsegment > minsegment) {
          require(gtf.EMBED).alert({ name: "❌ Invalid Arguments", description: "Minimum segment length is greater than the maximum segment length.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        var t = require(gtf.COURSEMAKER).trackparams({
          min: 40,
          max: 80,
          minSegmentLength: minsegment,
          maxSegmentLength: maxsegment,
          curviness: curviness,
          maxAngle: maxangle,
          location: location,
          surface: surface,
          layout: type,
        });
        require(gtf.COURSEMAKER).drawtrack(t, callback)

        function callback(course) {
        course["name"] = name.replace(/_/g, " ");
        course["options"] = ["Drift", course["layout"]];
        course["author"] = msg.author.id;
        course["date"] = stats.lastonline(userdata)

        embed.setTitle(emote.tracklogo + "__GTF Course Maker__");
        const attachment = new AttachmentBuilder(course["image"], {name: "course.png"});
        embed.setImage("attachment://course.png");
        var footer = "Type = " + type + " | " + "Segments = " + minsegment + ":" + maxsegment + " | " + "Curviness = " + curviness + " | " + "Max Angle = " + maxangle;
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This contains course information about your procedurally generated track. The red point would be the starting point. You can save this course for Arcade mode.**";
        }
        embed.setDescription("**Name:** " + course["name"] + "\n" +
        "**Environment:** " + course["location"] + " | " + course["surface"] + "\n" +
         "**Track Length:** " + [course["lengthkm"] + "km", course["length"] + "mi"][userdata["settings"]["UNITS"]] + pageargs["footer"]);
        embed.setFooter({text: footer});

    if (coursestats.length >= require(gtf.GTF).courselimit) {
       var emojilist = [{ emoji: "❌", emoji_name: "❌", name: "Courses Full", extra: "Once", button_id: 0 }];
    } else {
      var emojilist = [{ emoji: "📌", emoji_name: "📌", name: "Save Track", extra: "Once", button_id: 0 }];
    }
        var buttons = gtftools.preparebuttons(emojilist, msg, userdata);

        require(gtf.DISCORD).send(msg, {embeds: [embed], files: [attachment], components: buttons }, coursefunc4)
        
        function coursefunc4(msg) {
          function save() {
            if (coursestats.length >= require(gtf.GTF).courselimit) {
              return;
            }
            require(gtf.COURSEMAKER).savecourse(course, userdata);
            require(gtf.EMBED).alert({ name: "✅ Success", description: "**" + course["name"] + "**" + " has been saved to your course list.", embed: "", seconds: 3 }, msg, userdata);
            return;
          }
          var functionlist = [save];
          gtftools.createbuttons(buttons, emojilist, functionlist, msg, userdata);
        }
        }
      }
    }
  },
};
