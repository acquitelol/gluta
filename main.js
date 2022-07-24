// all variables and initializations
const {app, BrowserWindow, ipcMain, Tray, Menu, nativeImage} = require('electron');
const RPC = require("discord-rpc");
let client = new RPC.Client({transport: "ipc"});
const path = require('path');
let mainWindow = null;
let tray = null;
let codeRun = false;
let date;
let {version} = require('./package.json');
let rpcState = true;
let rpcLabel = '╸Toggle RPC╺ (✓)';
let globalClient;

// main window function
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

    // gets the window position
    getWindowPosition = () => {
        const windowBounds = mainWindow.getBounds();
        const trayBounds = tray.getBounds();
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
        const y = Math.round(trayBounds.y + trayBounds.height);
        return { x, y };
    };
    
    // shows the window
    showWindow = () => {
        const position = getWindowPosition();
        mainWindow.setPosition(position.x, position.y, false);
        mainWindow.show();
        mainWindow.setVisibleOnAllWorkspaces(true);
    };
    
    // function for right click menu in main window function scope
    rightClick = () => {
        // clear cache function
        const clearCache = () => {
            let response = "Successfully cleared cache.";
            mainWindow.webContents.send('clearCacheResponse', response);
            console.log(response)
        };

        const toggle = () => {
            if (rpcState==true) {
                rpcState=false;
                mainWindow.webContents.send('toggle', rpcState)
                rpcLabel = '╸Toggle RPC╺ (×)'
            } else {
                rpcState=true;
                mainWindow.webContents.send('toggle', rpcState)
                rpcLabel = '╸Toggle RPC╺ (✓)'
            }
        }

        const banner = () => {
            let response = "Successfully opened banner GUI";
            mainWindow.webContents.send('setCustomBanner', response);
            console.log(response)
        }

        const openSavesMenu = () => {
            mainWindow.webContents.send('enableSaves')
        }
        const menu = [
            { label: '╸Utilities╺', type: 'submenu', submenu: [
                { label: rpcLabel, click: toggle },
                { label: 'Separator',       type: 'separator'},
                { label: '╸Clear all Cache╺', click: clearCache },
                { label: 'Separator',       type: 'separator'},
                { label: '╸Profiles╺', click: openSavesMenu},
            ]},
            { label: 'Separator',       type: 'separator'},
            { label: '╸Upload Banner╺', click: banner },
            { label: 'Separator',       type: 'separator'},
            { label: '╸Quit Gluta╺', role: 'quit' },
        ];
        tray.popUpContextMenu(Menu.buildFromTemplate(menu))
    }

    // icon
    const image = nativeImage.createFromPath(
        iconpath = path.join(__dirname, './assets/cc.png')
    );
    tray = new Tray(image.resize({ width: 20, height: 20 }));
    
    // metadata and extra settings
    tray.setToolTip(`Gluta v${version}`);
    tray.on('click', () => {
        if (!codeRun) {
            mainWindow.loadFile('./index.html');
            console.log("Successfully Created Application");
            codeRun = true;
        }
        mainWindow.isVisible()?mainWindow.hide():showWindow();
    });

    tray.on('right-click', rightClick);

    mainWindow.webContents.on('did-finish-load', (e) => {
        date = Date.now();
        console.log(`Successfully Reloaded Application, and the date is ${date}`);
    })
};

// extras
app.on('ready', function(){
    createWindow();
    app.dock.hide();
});

app.on(
    "window-all-closed",
    () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
);

// closes browser window if dev tools is not focused and the window is also not focused to increase performance
app.on('browser-window-blur', (event, win) => {
    if (!win.webContents.isDevToolsFocused()) mainWindow.hide();
})

// receive message from index.html 
console.log("Initialized a listener");
ipcMain.on('asynchronous-message', (event, arg) => {
    setTimeout(async () => {
        if (globalClient) {
            await client.destroy();
            client = new RPC.Client({transport: "ipc"});
            globalClient = false;
        }

        console.log( arg );
        // checks if it should set a new instance of the RPC or not.
        let instanceVar = true;
        let activity = {};
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
        if (!rpcState) return;
        
        if (!btnUrl1Var.startsWith('https://')) {
            let errMsg = "Button 1 Url is not a real URL. It needs to start with 'https://'";
            console.log(errMsg);
            event.sender.send('errMsgDttAlert', errMsg );
            return;
        } else if (!btnUrl2Var.startsWith('https://')) {
            let errMsg = "Button 2 Url is not a real URL. It needs to start with 'https://'";
            console.log(errMsg);
            event.sender.send('errMsgDttAlert', errMsg );
            return;
        }

        // checks if it should have elapsed time or not
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
        client.on("ready", (person) => {
            client.request("SET_ACTIVITY", {pid: process.pid, activity: activity});
            
            console.log("Successfully set Rich Presence!");
            // collects client information for setting avatar and username in preview
            if (!client.user) return
            let { id, username, discriminator, avatar } = client.user;

            const userData = {
                avatarIcon: `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}?size=160`,
                userID: username,
                userDisc: discriminator,
            }
            // send message to index.html
            event.sender.send('asynchronous-reply', userData );
            console.log(client.user);
            
        
        });
        
        // logs into the client with the client ID to set the Rich presence
        client.login({ clientId: clientVar })
        globalClient = true;
    }, 100);
});

ipcMain.on('disableRpcCallback', (event, arg) => {
    if (!globalClient) return
    client.request("SET_ACTIVITY", {pid: process.pid});
})