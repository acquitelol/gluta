 # Gluta is A discord Rich Presence script built for Genshin Impact made to be as easy as possible to use.


 To use it, it's as simple as this:

### Chapter 1: **Installing the program**.
 1. Download the DMG for your mac (usually under https://github.com/acquitelol/releases/latest/)
 2. Once it is done installing, open it and drag the application to the /Applications folder as asked
 3. Then, try to open the application. You might get a "Gluta.app can’t be opened because Apple cannot check it for malicious software." error, you can just Right Click > Open to bypass this and open Gluta normally.

**Please note that Gluta is a Menu Bar Application, not a full window.**

### Chapter 2: **Filling in all boxes**.

 1. Go to the Discord Developer Portal (https://discord.com/developers/applications) or click on the Dice inside of Gluta, and create a New Application.
 2. The name that you give this Application is the name of the Rich Presence, so be careful (calling it Genshin Impact or something similar is the best way to go)
 3. Go to the oAuth2 tab and click "Copy" on the Client ID box.
 4. Open Gluta and paste the string in the empty "Client ID" box
 5. Now you can enter in your Game Name (default is Genshin Impact, change it to whatever you called your Application), State and Details
 6. Go back to the developer portal, and upload 2 images which are 512x512, and call them something you will remember.
 7. In Gluta, click on the large image placeholder, and change the Large Image Text to whatever you want the Large image to show when hovered, and change the large image identifier to whatever you called the image in the Developer Portal.
 8. Repeat this process for the small image.
 9. Enter a name for the Buttons, this is what will appear in Discord as the button
 10. Click on the cog next to each of the buttons, and enter a URL that you would like the buttons to direct to (the URLs are forcefully set to begin with "https://", so please make sure you meet this criteria.)
 11. The rich presence should now be set!
 
 ((***Additional Info***))
 - Right click on the Tray Menu app (the white G) and go to ╸Utilities╺ > ╸Profiles╺.
 - From here, you can switch to the second profile, where you can set a seperate RPC. To do this, refer to the steps from [here](#chapter-2-filling-in-all-boxes)
 - (This menu allows you to toggle between them at any time)
 - From ╸Utilities╺, you can also turn off the RPC and Clear the cache (Clears everything to default state, requires restart)
 - Please note that **all** boxes must be filled for the rich presence to begin.
 - Please also note you must have the Regular, Canary, or PTB client open *before* you start the rich presence.
 - Please also note that the data which you input is saved to your cache, AKA it loads the Rich Presence automatically when you start the program.
   (THIS DOES NOT MEAN I CAN READ THE DATA YOU INPUT, the source code is here and you can read it if you like, I am in no way storing this data. It is
    only stored on your Local Device.)
 - Also note that if it is not working, do CMD+OPT+I on your keyboard, and go to Console, and report any Errors to /Issues.
 - Furthermore, you can toggle the Rich Presence on and off by going into the Right Click Menu.
 - Also, if you, for some reason, Reload or Quit Discord, you will have to Refresh Gluta (CMD+R) or quit&restart Gluta for the Rich Presence to start again. (should be fine as it saves to cache.)
 - Lastly, Please note that the Preview in the program is just a *representation* and is not the actual Rich Presence, it was recreated with HTML + CSS
 as a vizualisation of the Rich Presence.
 
Made with **<3** by *acquite#0001* with help from *Roeegh#3643*!
