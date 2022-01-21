const {app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage} = require('electron');
let fs = require('fs');
const RPC = require("discord-rpc");
const { ipc } = require('discord-rpc/src/transports');
const { truncate } = require('fs');
const client = new RPC.Client({transport: "ipc"});
const { is } = require('electron-util');
// const TrayGenerator = require('TrayGenerator.js');
const path = require('path');
let mainWindow = null;
let tray = null;
let iconpath = path.join(__dirname, './assets/cc.png')


const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 250,
        height: 550,
        resizable: false,
        fullscreenable: false,
        show: false,
        frame: false,
        icon: __dirname + './assets/cc.png',
        webPreferences: {
            enableremotemodule: true,
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
    
    
    rightClickMenu = () => {
        const menu = [
            {
              role: 'quit',
              accelerator: 'Command+Q'
            }
          ];
          this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
    };
    const image = nativeImage.createFromPath(
        iconpath = path.join(__dirname, './assets/cc.png')
    );
    tray = new Tray(image.resize({ width: 20, height: 20 }));

    tray.setToolTip("Genshin Rich Presence");
    tray.on('click', () => {
        mainWindow.loadFile('./index.html');
        mainWindow.isVisible()?mainWindow.hide():showWindow();
    });
    /*


    tray.on('right-click', () => {
        rightClickMenu()
    });
    */
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
    ipcMain.on("exportAA", (event, arg) => {
        event.sender.send('asynchronous-reply2', 'some data lol' );
        const { clientVar2, stateVar2, detailsVar2, largeVar2, smallVar2, btnTxt1Var2, btnTxt2Var2, btnUrl1Var2, btnUrl2Var2} = arg;
        let name = "untitled";
        let amount = 0;
        let fileName = name;
        let options = {
            title: "Export Rich Presence",
            buttonLabel : "Export File",
            filters :[
                {name: 'Text Files', extensions: ['json']},
                {name: 'All Files', extensions: ['*']}
            ]
        };
        let pathName  = dialog.showSaveDialogSync(options);

        const obj2 = {
            clientVar: clientVar2,
            stateVar: stateVar2,
            detailsVar: detailsVar2,
            largeVar: largeVar2,
            smallVar: smallVar2,
            btnUrl1Var: btnTxt1Var2,
            btnUrl2Var: btnTxt2Var2,
            btnTxt1Var: btnUrl1Var2,
            btnTxt2Var: btnUrl2Var2,
        }

        var dictstring = JSON.stringify(obj2);
        try {
            if (fs.existsSync(pathName)) {
                amount++;

                let nameNew = name+"_"+amount;
                pathName = './saves/' + nameNew + ".json"
            }
            else {
                fs.writeFile(pathName, dictstring, function(err, result) {
                    if(err) console. log('error', err);
                    console.log("a")
                });   
            }
        } catch(err) {
            console.error(err)
        }
    })
}


// console.log(app);

app.on('ready', () => {
    createWindow();
    console.log("Successfully Created Application");

})

app.on(
    "window-all-closed",
    () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
);



// app.dock.hide();


// receive message from index.html 
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log( arg );
  
    // send message to index.html
    event.sender.send('asynchronous-reply', 'hello' );
    const { clientVar, stateVar, detailsVar, largeVar, smallVar, btnTxt1Var, btnTxt2Var, btnUrl1Var, btnUrl2Var} = arg;
    const activity={
        state: stateVar,
        details: detailsVar,
        assets:{
            large_image: "large",
            large_text: largeVar,
            small_image: "small",
            small_text: smallVar,
        },
        buttons:[
            {
                "label": btnTxt1Var,
                "url": btnUrl1Var
                },
            {
                "label": btnTxt2Var,
                "url": btnUrl2Var
            }
        ],
        timestamps: {start: Date.now()},
        instance: true
    };
            
    client.on("ready", () => {
        console.log(client.user)
        client.request("SET_ACTIVITY", {pid: process.pid, activity: activity});
        console.log("Successfully set Rich Presence!");
    
    })
    
    client.login({ clientId: clientVar })
});

