async function preload() {
    const { contextBridge, ipcRenderer } = await import('electron');

    contextBridge.exposeInMainWorld('electron', {
	    send: (channel, data) => {
		    ipcRenderer.send(channel, data);
	    },
	    sendSync: (channel, data) => {
		    ipcRenderer.sendSync(channel, data);
	    },
	    receive: (channel, func) => {
		    ipcRenderer.on(channel, (event, ...args) => func(...args));
	    },
    });
}

preload();
