let mainWindow; 
const dev = process.env.NODE_ENV === 'dev';
const port = dev ? 5173 : 3000;
	
async function createWindow() {
const { default: windowStateManager } = await import('electron-window-state');
    const { BrowserWindow } = await import('electron');
    const { default: electronReloader } = await import('electron-reloader');
    const { default: path } = await import('path');
    electronReloader(module);

    let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: dev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}/catalog`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

async function createMainWindow() {
	mainWindow = await createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	loadVite(port);
}

async function start() {
    const { app } = await import('electron');
    const { fork } = await import('child_process');
    const { join } = await import('path');

    let backendProcess = undefined;
    if (!dev) {
        const scriptPath = join(__dirname, 'build', 'index.js');
        backendProcess = fork(scriptPath, {
            env: {
                APP_PATH: __dirname,
                NODE_ENV: 'production',
            },
        });
    }

    app.once('ready',  createMainWindow);

    app.on('activate', async () => {
        if (!mainWindow) {
            await createMainWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (backendProcess) backendProcess.kill();
        if (process.platform !== 'darwin') app.quit();
    });
}
start();
