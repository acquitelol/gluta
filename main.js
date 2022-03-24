const {app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage} = require('electron');
let fs = require('fs');
const RPC = require("discord-rpc");
const client = new RPC.Client({transport: "ipc"});
const path = require('path');
const { ipc } = require('discord-rpc/src/transports');
const { clear } = require('console');
let mainWindow = null;
let tray = null;
let iconpath = path.join(__dirname, './assets/cc.png')
let codeRun = false;
let date = null;
let version = '1.5.87';
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
    

    const clearCache = () => {
        let response = "Successfully cleared cache.";
        mainWindow.webContents.send('clearCacheResponse', response);
        console.log(response)
    };
    
    rightClickMenu = () => {
        const menu = [
            { label: '╸Clear all Cache╺', role: clearCache() },
            { label: 'Separator',       type: 'separator'},
            { label: '╸Quit Rich Presence╺', role: 'quit' },
          ];
          tray.popUpContextMenu(Menu.buildFromTemplate(menu));
    };
    const image = nativeImage.createFromPath(
        iconpath = path.join(__dirname, './assets/cc.png')
    );
    tray = new Tray(image.resize({ width: 20, height: 20 }));
    
    tray.setToolTip(`Gluta v${version}`);
    tray.on('click', () => {
        if (codeRun==false) {
            mainWindow.loadFile('./index.html');
            date = Date.now();
            console.log("Successfully Created Application");
            codeRun = true;
        } else {
            
        }
        mainWindow.isVisible()?mainWindow.hide():showWindow();
    });

    tray.on('right-click', () => {
        rightClickMenu();
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


// receive message from index.html 
let loop = setInterval(() => {
    
    ipcMain.removeAllListeners('asynchronous-message');
    console.log('Removed listener...')

    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log( arg );
        if (instances<1) {
            instanceVar = true;
            instances++;
        } else {
            instanceVar = false;
        }
        // send message to index.html
        
        const { clientVar, stateVar, detailsVar, largeIdtVar, largeTxtVar, smallIdtVar, smallTxtVar, btnTxt1VarLol, btnTxt2VarLol, btnUrl1Var, btnUrl2Var, elapsed } = arg;
    
        switch ("") {
            case clientVar:
                let errMsg = "Client Var is Empty, put in a Client ID!! (Example: 9238401841280140)";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case stateVar:
                let errMsg = "State Variable is Empty. It needs to be at least 2 Characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case detailsVar:
                let errMsg = "Details Variable is Empty. It needs to be at least 2 Characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case largeIdtVar:
                let errMsg = 'Large Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case smallIdtVar:
                let errMsg = 'Small Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case smallTxtVar:
                let errMsg = "Small Text Variable is Empty. It must be at least 2 characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case largeTxtVar:
                let errMsg = "Large Text Variable is Empty. It must be at least 2 characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case btnTxt1VarLol:
                let errMsg = "Button 1 Text Variable is Empty. It must be at least 2 characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case btnTxt2VarLol:
                let errMsg = "Button 2 Text Variable is Empty. It must be at least 2 characters.";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            case btnUrl2Var:
                let errMsg = "Button 2 Url is not a real URL. It needs to start with 'https://'";
                console.log(errMsg);
                event.sender.send('errMsgDtt', errMsg );
                break;
            default:
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
                const activity;
                if (elapsed==false) {
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
                            
                client.on("ready", () => {
                    client.request("SET_ACTIVITY", {pid: process.pid, activity: activity});
                    
                    console.log("Successfully set Rich Presence!");
                    let { id, username, discriminator, avatar } = client.user;
                    const userData = {
                        avatarIcon: `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}?size=160`,
                        userID: username,
                        userDisc: discriminator,
                    }
                        
                    event.sender.send('asynchronous-reply', userData );
                    console.log(userData);
                    
                
                });
                
                client.login({ clientId: clientVar })
        }
    
    
    });
    console.log('Added listener...')
}, 1000)