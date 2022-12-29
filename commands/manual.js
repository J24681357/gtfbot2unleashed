var dir = "../"
var stats = require(dir + "functions/profile/f_stats");
var emote = require(dir + "index");
var gtftools = require(dir + "functions/misc/f_tools");

const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var gtf = require(dir + "files/directories");
////////////////////////////////////////////////////

module.exports = {
  name: "manual",
  cooldown: 3,
  level: 0,
  channels: ["testing", "gtf-mode","gtf-demo"],

  delete: false,
  availinmaint: false,
  description: ["Test"],
  aliases: ["help"],
  requirecar: false,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtftools.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 1,
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

    /* Setup */
    var list = [
      "__**Basics: Controls**__" + "\n" +
  "1. **/home** is the main menu for the GTF game where you can find the command names."+ "\n" + 
    "2. Many commands have Discord buttons and menus that you can navigate through." + "\n" + 
    "3. Lists in commands have directional buttons and confirm (" + emote.yes + ") buttons." + "\n" +
    "4. There are many tips (❓) to guide you through each command, so reading them may help you. You can also disable tips by using **/settings - Tips**." + "\n" +
    "5. In many places, you can change cars underneath the message in the drop-down menu. The drop-down menu are usually found in the commands' menu (❗) in the slash command options." + "\n" +
    "6. For the vast majority of commands, **[number]** arguments are optional unless the command require you to. This is represented with **[]**." + "\n" + 
    "`Ex.` **/garage - Sell Car [number]** requires you to input a number in the command associated in your **/garage** list.",
      
    "__**Basics: Cars / Career Races**__" + "\n" + 
    "1. Like any other driver, you can purchase car in the GTF Dealerships by using **/car - Select [manufacturer/type]**." + "\n" + 
    "2. In the **/car** slash command, you can choose a manufacturer/type to filter by from (Only at most 1 manufacturer and at most 1 type)." + "\n" + 
    "`Ex.` If you want to open the catalog of all Nissans, you need to input **/car Select [manufacturer/type] Nissan**. If you want to open the catalog of all GT4 race cars, you need to input **/car Select [manufacturer/type] Race Car: GT4**" + "\n" + 
    "3. This will open up the list of manufacturer/type that you filtered. If you want the dealership list in a different order, you can change this in **/settings - Dealership Sorting Type**." + "\n" + 
    "4. You can view your cars and their car details by clicking on them in your **/garage**." + "\n" +
    "5. Your first career races are in B Level, and you can advance to higher levels as your earn more EXP. To find races in the B Level for example, you use **/career - B Level** to go to them. You can press the confirm button to participate in them." + "\n" + 
    "6. Each event contain a series of races to compete against other cars. Completing 1st place for all races will give you a gold prize, ranging from big credits to mystery cars!",

      "__**Pre-Race/Pre-Session Entry**__" + "\n" +
    "1. In the pre-session menu, there are different buttons and menus before staring the session." + "\n" +
    "2. When you load the track, you can view the track & race details, and grid for your session." + "\n" +
    "3. You can also change tires that you've purchased on your current car via the drop-down menu." + "\n" +
    "4. The starting grid button allows you to view the starting grid for the session." + "\n" +
    "5. The optimal tire usage button will equip the most suitable tires for dynamic weather." + "\n" +
    "5. When you start, there will be a timer to wait until the session finishes and return your results." + "\n" +
    "6. While you are waiting, you can view the status of your session by using **/status**, to get the message link and time remaining." + "\n" +
    emote.exp + " Experience points value more in career and seasonal events than other modes." + "\n" +
    emote.dailyworkout + " You can earn up to double the credits if you driven at least once for 5 consecutive days.",

      "__**Experience Points System**__" + "\n" + 
    "1. Throughout the GTF game, you can earn EXP points from career, arcade, seasonal events, etc."  + "\n" + 
    "2. The amount of experience points you earn is based upon the mode and amount of credits earned for each race. Higher difficulties will reward more experience points."  + "\n" + 
    "3. There are 50 levels to rank up in your life as a GTF driver (with new mode unlocks and prize cars throughout the way)." + "\n" +
    emote.exp + " To see more information about each of the level rewards, you can use **/database GTF Levels** command.",

      "__**Career - /career**__" + "\n" + 
    "1. This GTF game contains a variety of career events ordered by level, from Beginner events (B) to extreme events (S). There are EXP level requirements for each level except for the B level." + "\n" + 
    "2. Many events have different regulations such as FPP, manufacturer, etc, for entry. Make sure that you have a car that can qualify."  + "\n" + 
    "3. Each event has a set of races to compete with other opponents." + "\n" +
    "4. There are special events you can unlock along the way as you increase your experience level." + "\n" +
    emote.goldmedal + " In order to complete the event and get the gold reward, you must finish 1st in all events." + "\n" + 
    "__**Arcade - /arcade**__" + "\n" + 
    "1. In this GTF game, you can participate in single races, drift trials, and speed tests." + "\n" +
    "__Single Race__: There are different difficulties (Beginner, Amateur, Professional, and Endurance) to race against other opponents in randomized tracks. Opponents are chosen based on the performance & type of your garage car." + "\n" +
    "__Single Race__: Different difficulties has different credit payouts, race lengths. There are EXP level requirements for each level except for the Beginner level."  + "\n" + 
    "__Single Race & Drift Trial__: You may select between a random Gran Turismo track, a randomized course maker track, or your own course maker tracks that you saved from **/course**." + "\n" +
    emote.credits + emote.exp + " Arcade races have lower credit payouts and less EXP points rewarded than career races.",

      "__**Arcade - /arcade**__" + "\n" +  
    "__Drift Trial__: You can select a difficulty between Beginner and Professional. While in session, you will accumulate a certain amount of drift points until the timer is up." + "\n" +
    "__Drift Trial__: In the race results, the total points accumulated and the rating (COMPLETE, BRONZE, SILVER, GOLD) will be shown. You can earn credits based on your rating." + "\n" +
    emote.tire + " Using comfort tires in your garage car would be the most optimal. Racing tires would make it harder to earn points." + "\n" +
    "⚠ FF drivetrains are probibited in drift trials." + "\n" +
    "__Speed Test__: You can test the top speed of your garage cars with 400m, 1000m, & 10000m speed tests at Special Stage Route X"  + "\n" + 
    "__Speed Test__: Finishing a 10000m top speed run will give you the highest top speed of your current car while a 400m top speed run will give you the top speed in 1/4 mile." + "\n" + 
    "⚠ Concept cars and other special cars are prohibited in top speed test.",

     "__**Lobby Matchmaking - /lobby**__" + "\n" + 
      "1. In this GTF game, you can compete against other players via lobby matchmaking in Discord threads." + "\n" +
      "__How To Create A Lobby__: You can create a lobby by using the command **/lobby - Host Lobby**. A new lobby will be created as a Discord thread and lobby messages will be sent inside that thread." + "\n" + 
      "You can view the lobby infomation (players, cars, etc) by using the command **/lobby - Lobby Info**." + "\n" +
      "In the lobby information screen, you are able to start the race (host only), change the lobby settings, and view the grid of players." + "\n"+
    "⚠ Once you create a thread, most GTF commands will be limited (Ex. /career, /arcade, etc)." + "\n"+
    "⚠ Certain lobby settings require you to input a number or name **in the slash command menu**, not in the lobby setting menus itself (Ex. Room Name & FPP Limit)." + "\n" +
      "__How To Join A Lobby__: You can search & select for any available lobbies by using **/lobby - Open Lobby Menu**." + "\n" +
 "When the success prompt appears after you select a lobby, the GTF bot will ping you inside the thread (this is where the joined lobby is located." + "\n" +
      "⚠ Do not just join the thread, the GTF bot will not recognize you unless you do the above." + "\n" +
      "__How To Change Cars__: " + "You can change cars in a lobby via **/garage**." + "\n" +
      "Your garage will be filtered based on the current lobby settings. You can also change your tires here.",
      
      "__**Seasonal Events - /seasonal**__" + "\n" + 
    "1. Seasonal events work similarly to career events, but in a more randomized fashion and change daily." + "\n" +
    "2. In the menu, seasonal events are randomized every 3 days with different regulations and tracks, making the combinations practically fun." + "\n" +
    "3. Like career events, you are able to earn credits and prize cars in seasonal events." + "\n" + 
    "4. After 3 days, your progress in these events will reset and will not be saved.",

      "__**Garage - /garage**__" + "\n" + 
     "1. The garage menu will open your garage where you can view all of the cars you've earned and purchased. ID numbers (`🚘`) are associated with the order of your garage list based on your settings (**/settings - Garage Sorting Type**)." + "\n" +
     "2. Selecting a car in this menu will bring up the car details, performance specs, and other details about the car." + "\n" +
    "4. You may also mark a car as your favorite with the ⭐ to select it in the favorites options in the drop down menu in different places."  + "\n" + 
     "3. You can easily change your current car in your garage in menus from the drop-down menu or in the car details."  + "\n" +
     "4. For convenience, you may also sell your cars for credits or in the case that you want more room for other cars." + "\n" +
     "5. Once you reach the garage limit of " + require(gtf.GTF).garagelimit + ", you may not add any more cars to your garage." + "\n" +
     "🚘 You may still earn prize cars from other modes; it will be added to your garage, but you will be unable to purchase cars until you have under " + require(gtf.GTF).garagelimit + " cars.",

      "__**Tuning Cars (GTF Auto) - /tune**__" + "\n" + 
     "1. In the menu, you can view the type of performance parts that are available in the tuning shop for your current. The amount of parts available (🔧) are based on the specs and type of your garage car." + "\n" + 
     "2. Each type of performanace parts has upgrades and stages that you can purchase for your current car. Your current custom part is labeled as ✅." + "\n" + 
     "3. When you purchase a custom part, it will be applied to your current car and will be added to the car's inventory 📦. When you apply a different custom part from the same type, the previous part will be put in the car's inventory. You can apply parts in the inventory for free." + "\n" +
     "💧 You can also wash your car here after many days of racing." + "\n" +
     "__**Car Setups - /setup**__" + "\n" + 
     "1. Transmission and Suspension custom parts in GTF have advanced tuning options that you can modify by using **/setup**." + "\n" + 
     "2. Default parts cannot be modified." + "\n" + 
     "3. Some parts may affect performance of cars in some sessions such as **/ssrx**.",

      "__**Replays - /replay**__" + "\n" + 
     "1. In this GTF game, you can save replays from any session after a session has finished. " + "\n" + 
     "2. In the replay menu, it opens the list of all of the replays you've saved. Selecting a replay will load the replay and it displays its session results and grid results." + "\n" +
     "3. Replays can be deleted by using **/replay - Delete Replay [number]**, where [number] represents the replay associated with the list in the menu.",

      "__**Course Maker Courses - /course**__" + "\n" + "" + "\n" +
     "1. Custom courses can be created via **/course**. The menu opens the list of all of the course maker tracks you've saved." + "\n" + 
     "2. You can create your own courses by using **/course - Generate Course** and using the parameters used in the slash command (except for the number argument)." + "\n" + 
     "3. Circuit & Sprint courses can be generated." + "\n" + 
     "4. The type of course generated can be either asphalt or gravel (Dirt)." + "\n" + 
     "5. You can use your own courses in Arcade mode to race with other opponents." + "\n" +
     "6. Courses can be deleted by using **/course - Delete Course [number]**, where [number] represents the course associated with the list in the menu.",
      
       "__**Custom Races - /customrace**__" + "\n" + 
      "1. In this GTF game, you can create your own custom races." + "\n" +
      "__How To Create A Race__: You can create a race by using the command **/customrace - Create Event**. A new menu will appear with a new randomized event. If you want to create an event with no regulations, you can use the command **/customrace - Create Event (No Regulations).**" + "\n" + 
      "In the first Custom Race menu, you can adjust the following:" + "\n" +
      "- Track location/layout & laps: Longer duration = more credits" + "\n" +
      "- Time & Weather" + "\n" +
      "- AI Difficulty: Harder difficulty = more credits" + "\n" + "__Loading & Saving Event Settings__" + "\n" + 
      "The GTF bot will remember your current event settings, but not when you create a new event. Therefore, you need to manually save if you want to keep them for another time." + "\n" + 
      "In the second page of the Custom Race Menu, select **Save Event** to save your current event settings." + "\n" + 
      "To load your saved events use the command **/customrace - Load Saved Events** to load one of the event settings you have saved." + "\n" + "__Grid Settings__" + "\n" +
      "In the grid menu, you are able to customize the grid:" + "\n" +
      "- Selecting a car: The car will be in bold and you are able to change the position via selecting a different place." + "\n" + 
      "- Add AI Driver: Adds a random AI driver to the grid based on the current regulations." + "\n" + 
      "- Remove AI Driver: Removes an AI driver from the grid", 
      "__**Custom Races (Regulations)**__" + "\n" + 
      "1. In Custom Races, you can change the regulations in the event to your preferences." + "\n" +
      "⚠ Making any changes to the regulations will replace your current grid." + "\n" +
      "2. FPP Limit / Power Limit / Weight Limit / AI Minimum FPP: You can change the limit via the slash commands, not in the menu." + "\n" + 
      "- Example: To change the FPP Limit to 500. You use the command **/customrace Edit Event Settings**. Then select the **regulation** argument, select **FPP Limit**, and type 500 in the **number** argument." + "\n" + 
      "3. Maximum Tire Grade: Choose the tire requirements for the event. Note that this only affects your garage car." + "\n" +
      "4. Makes / Countries / Types / Drivetrains / Aspirations: Filter the car requirements for the grid. Multiple options can be selected from each of these categories.", 
      "__**Daily Workouts - /daily**__" + "\n" + 
     "1. Using **/daily**, you are able to earn credits & random cars every day by driving at least 26.2mi/42.1 km." + "\n" + 
     "2. Your daily mileage will be reset every 24 hours. You can set the time zone for daily workouts in **/settings - Time Zone**, to match with your time zone." + "\n" + 
     "__**Gifts - /gifts**__" + "\n" +  
     "1. In this GTF game, you can earn rewards that can be redeemable in **/gifts**." + "\n" +
     "2. This command will open the list of gifts that you have earned. Selecting one of them will redeem the item to your save data accordingly." + "\n" +
     "3. You can quickly redeem your latest item by using **/gifts - Redeem Latest Reward**"
    ]



    if (!isNaN(query["options"])) {
      embed.setTitle("📝 __GTF Game Manual__");
      results = list[parseInt(query["options"]) - 1]
          if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "\n\n" + "**❓ Welcome to the GTF game manual! You can find some helpful guides about the game.**"
    }
    embed.setDescription(results + pageargs["footer"])
    stats.addcount(userdata);
    require(gtf.DISCORD).send(msg, {embeds:[embed]})
    return
    }

    embed.setTitle("📝 GTF Game Manual");
    pageargs["list"] = list;
    if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "**❓ Welcome to the GTF game manual! You can find some helpful guides about the game.**"
    }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtftools.formpage(pageargs, userdata);
    gtftools.formpages(pageargs, embed, msg, userdata);
    }
};
