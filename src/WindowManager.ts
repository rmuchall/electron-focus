import {app, BrowserWindow, Event, Menu, Tray} from "electron";
import path from "path";

export class WindowManager {
    static instance: WindowManager;
    mainWindow: BrowserWindow | null;
    isMaximized: boolean;
    isExit: boolean;
    tray: Tray;
    menu: Menu;

    constructor() {
        if (WindowManager.instance) {
            return WindowManager.instance;
        }

        WindowManager.instance = this;

        this.createTray();
        this.createWindow();
    }

    createTray(): void {
        this.tray = new Tray(path.join(process.cwd(), "/resources/logo.ico"));
        this.tray.on("click", () => this.showWindow());

        this.menu = Menu.buildFromTemplate([
            {
                label: "Show",
                click: () => this.showWindow()
            },
            {
                label: "Exit",
                click: () => this.exitWindow()
            }
        ]);

        this.tray.setContextMenu(this.menu);
    }

    createWindow(): void {
        this.mainWindow = new BrowserWindow({
            title: "Electron Focus Test",
            icon: path.join(process.cwd(), "/resources/logo.ico"),
            webPreferences: {
                contextIsolation: false,
                preload: path.join(process.cwd(), "preload.js")
            }
        });

        this.mainWindow.on("maximize", () => {
            this.isMaximized = true;
        });

        this.mainWindow.on("unmaximize", () => {
            this.isMaximized = false;
        });

        this.mainWindow.on("minimize", (event: Event) => {
            event.preventDefault();
            this.mainWindow?.hide();
        });

        this.mainWindow.on("close", (event: Event) => {
            if (!this.isExit) {
                event.preventDefault();
                this.mainWindow?.hide();
            }
        });

        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });

        this.isMaximized = true;
        this.showWindow();
    }

    showWindow(): void {
        this.mainWindow?.setAlwaysOnTop(true);
        if (this.isMaximized) {
            this.mainWindow?.maximize();
        } else {
            this.mainWindow?.showInactive();
        }

        this.mainWindow?.setAlwaysOnTop(false);
        this.mainWindow?.focus();
        app.focus({
            steal: true
        });
    }

    exitWindow(): void {
        this.isExit = true;
        this.mainWindow?.close();
    }
}
