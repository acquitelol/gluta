const {app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage} = require('electron');
let fs = require('fs');
const RPC = require("discord-rpc");
const client = new RPC.Client({transport: "ipc"});
const path = require('path');
let mainWindow = null;
let tray = null;
let iconpath = path.join(__dirname, './assets/cc.png')
let codeRun = false;
let date = null;
let version = '1.5.83';


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
    
    function func() {
        ipcMain.on("gibData", () => {
            const fileNames = dialog.showOpenDialogSync();
            // fileNames is an array that contains all the selected
            if (fileNames === undefined) {
              console.log("No file selected");
              return;
            }
        
            const filePath = fileNames[0];
        
            fs.readFile(filePath, "utf-8", (err, data) => {
              if (err) {
                return;
              }
              mainWindow.webContents.send("parsedData", data);
            });
        });
    };

    function func2() {
        ipcMain.on('clearCache', (event, arg) => {
            console.log(arg);
            event.sender.send('clearCacheResponse');
        })
    };
    
    rightClickMenu = () => {
        const menu = [
            { label: '╸Import Rich Presence╺', role: func() },
            { label: 'Separator',       type: 'separator'},
            { label: '╸Clear all Cache╺', role: func2() },
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

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log( arg );
  
    // send message to index.html
    
    const { clientVar, stateVar, detailsVar, largeIdtVar, largeTxtVar, smallIdtVar, smallTxtVar, btnTxt1VarLol, btnTxt2VarLol, btnUrl1Var, btnUrl2Var } = arg;


    if (clientVar=="") {
        let errMsg = "Client Var is Empty, put in a Client ID!! (Example: 9238401841280140)";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (stateVar=="") {
        let errMsg = "State Variable is Empty. It needs to be at least 2 Characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (detailsVar=="") {
        let errMsg = "Details Variable is Empty. It needs to be at least 2 Characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (largeIdtVar=="") {
        let errMsg = 'Large Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (smallIdtVar=="") {
        let errMsg = 'Small Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (smallTxtVar=="") {
        let errMsg = "Small Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (largeTxtVar=="") {
        let errMsg = "Large Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnTxt1VarLol=="") {
        let errMsg = "Button 1 Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnTxt2VarLol=="") {
        let errMsg = "Button 2 Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnUrl1Var.startsWith('https://')!=true) {
        let errMsg = "Button 1 Url is not a real URL. It needs to start with 'https://'";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnUrl2Var.startsWith('https://')!=true) {
        let errMsg = "Button 2 Url is not a real URL. It needs to start with 'https://'";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else {
        const activity={
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
                instance: true
        };
                    
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
        console.log(client.transport.client);
    };


});



ipcMain.on('asynchronous-messagelol', (event, arg) => {
    console.log( arg );
  
    // send message to index.html
    
    const { clientVar, stateVar, detailsVar, largeIdtVar, largeTxtVar, smallIdtVar, smallTxtVar, btnTxt1VarLol, btnTxt2VarLol, btnUrl1Var, btnUrl2Var } = arg;


    if (clientVar=="") {
        let errMsg = "Client Var is Empty, put in a Client ID!! (Example: 9238401841280140)";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (stateVar=="") {
        let errMsg = "State Variable is Empty. It needs to be at least 2 Characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (detailsVar=="") {
        let errMsg = "Details Variable is Empty. It needs to be at least 2 Characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (largeIdtVar=="") {
        let errMsg = 'Large Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (smallIdtVar=="") {
        let errMsg = 'Small Identity Variable is Empty!! Please enter the image name for the asset of the image in the Discord Developer Portal.';
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (smallTxtVar=="") {
        let errMsg = "Small Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (largeTxtVar=="") {
        let errMsg = "Large Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnTxt1VarLol=="") {
        let errMsg = "Button 1 Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnTxt2VarLol=="") {
        let errMsg = "Button 2 Text Variable is Empty. It must be at least 2 characters.";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnUrl1Var.startsWith('https://')!=true) {
        let errMsg = "Button 1 Url is not a real URL. It needs to start with 'https://'";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else if (btnUrl2Var.startsWith('https://')!=true) {
        let errMsg = "Button 2 Url is not a real URL. It needs to start with 'https://'";
        console.log(errMsg);
        event.sender.send('errMsgDtt', errMsg );
    } else {
        const activity={
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
                instance: true
        };
                    
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
        console.log(client.transport.client);
    };
});