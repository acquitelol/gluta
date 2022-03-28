const {app, BrowserWindow, ipcMain, Tray, Menu, nativeImage} = require('electron');
const RPC = require("discord-rpc");
const client = new RPC.Client({transport: "ipc"});
const path = require('path');
let mainWindow = null;
let tray = null;
let iconpath = path.join(__dirname, './assets/cc.png')
let codeRun = false;
let date = null;
let version = '1.5.9';
let instances = 0;



const createWindow = () => {


    mainWindow = new BrowserWindow({
        width: 250,
        height: 360,
        resizable: false,
        fullscreenable: false,
        show: false,
        frame: false,
        refreshable: false,
        icon: __dirname + './assets/cc.png',
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        }
        

    });

    getWindowPosition = () => {
        const windowBounds = mainWindow.getBounds();
        const trayBounds = tray.getBounds();
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
        const y = Math.round(trayBounds.y + trayBounds.height);
        return { x, y };
      };
    
    showWindow = () => {
        const position = getWindowPosition();
        mainWindow.setPosition(position.x, position.y, false);
        mainWindow.show();
        mainWindow.setVisibleOnAllWorkspaces(true);
      };
    
    rightClick = () => {
        // clear cache function
        const clearCache = () => {
            let response = "Successfully cleared cache.";
            mainWindow.webContents.send('clearCacheResponse', response);
            console.log(response)
        };
        const menu = [
            { label: '╸Clear all Cache╺', click: clearCache },
            { label: 'Separator',       type: 'separator'},
            { label: '╸Quit Rich Presence╺', role: 'quit' },
        ];
        tray.popUpContextMenu(Menu.buildFromTemplate(menu))
    }



    const image = nativeImage.createFromPath(
        iconpath = path.join(__dirname, './assets/cc.png')
    );
    tray = new Tray(image.resize({ width: 20, height: 20 }));
    
    tray.setToolTip(`Gluta v${version}`);
    tray.on('click', () => {
        if (!codeRun) {
            mainWindow.loadFile('./index.html');
            date = Date.now();
            console.log("Successfully Created Application");
            codeRun = true;
        }
        mainWindow.isVisible()?mainWindow.hide():showWindow();
    });

    tray.on('right-click', () => {
        rightClick()
    });
};

app.on('ready', function(){
    createWindow();
    app.dock.hide();
});

app.on(
    "window-all-closed",
    () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
    
);

app.on('browser-window-blur', (event, win) => {
    if (win.webContents.isDevToolsFocused()) {
      console.log('Ignore this case')
    } else {
      console.log('Hidden window until needed again.')
      mainWindow.hide()
    }
})


// receive message from index.html 
// constant loop <>
let loop = setInterval(() => {
    
    ipcMain.removeAllListeners('asynchronous-message');

    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log( arg );
        // checks if it should set a new instance of the RPC or not.
        let instanceVar = true;

        // checks if any values are empty
        const checkProperties = (obj) => {
            for (var key in obj) {
                if (obj[key] == null || obj[key] == "")
                    if (key != "elapsed") {
                        return `${key} is Empty. Please Add a valid input to it.`;
                    }
                    
            }
            return false;
        }
        
        let response = checkProperties(arg)
        console.log(response)

        if (response.toString().includes("Empty")) {
            event.sender.send('errmMsgDDt', response)
            return;
        };

        // takes out all keys and converts into usable variables
        const { clientVar, stateVar, detailsVar, largeIdtVar, largeTxtVar, smallIdtVar, smallTxtVar, btnTxt1VarLol, btnTxt2VarLol, btnUrl1Var, btnUrl2Var, elapsed } = arg;

        // further checks the urls for the correct link
        if (!btnUrl1Var.startsWith('https://')) {
            let errMsg = "Button 1 Url is not a real URL. It needs to start with 'https://'";
            console.log(errMsg);
            event.sender.send('errMsgDtt', errMsg );
            return;
        } else if (!btnUrl2Var.startsWith('https://')) {
            let errMsg = "Button 2 Url is not a real URL. It needs to start with 'https://'";
            console.log(errMsg);
            event.sender.send('errMsgDtt', errMsg );
            return;
        }

        // checks if it should have elapsed time or not
        let activity = {};
        if (!elapsed) {
            activity={
                state: stateVar,
                details: detailsVar,
                assets:{
                    large_image: largeIdtVar,
                    large_text: largeTxtVar,
                    small_image: smallIdtVar,
                    small_text: smallTxtVar,
                },
                buttons:[
                    {
                        "label": btnTxt1VarLol,
                        "url": btnUrl1Var
                        },
                    {
                        "label": btnTxt2VarLol,
                        "url": btnUrl2Var
                    }
                ],
                    timestamps: {start: date},
                    instance: instanceVar
            };
        } else {
            activity={
                state: stateVar,
                details: detailsVar,
                assets:{
                    large_image: largeIdtVar,
                    large_text: largeTxtVar,
                    small_image: smallIdtVar,
                    small_text: smallTxtVar,
                },
                buttons:[
                    {
                        "label": btnTxt1VarLol,
                        "url": btnUrl1Var
                        },
                    {
                        "label": btnTxt2VarLol,
                        "url": btnUrl2Var
                    }
                ],
                    instance: instanceVar
            };
        }
                    
        // sets the rich presence based on the "activity" object
        client.on("ready", () => {
            client.request("SET_ACTIVITY", {pid: process.pid, activity: activity});
            
            console.log("Successfully set Rich Presence!");
            // collects client information for setting avatar and username in preview
            let { id, username, discriminator, avatar } = client.user;
            const userData = {
                avatarIcon: `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}?size=160`,
                userID: username,
                userDisc: discriminator,
            }
            // send message to index.html
            event.sender.send('asynchronous-reply', userData );
            console.log(userData);
            
        
        });
        
        // logs into the client with the client ID to set the Rich presence
        client.login({ clientId: clientVar })
    });
}, 1000)