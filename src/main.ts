import {app} from "electron";
import {WindowManager} from "./WindowManager";

app.on("ready", () => {
    console.log("Client is ready");
    new WindowManager();
});

app.on("window-all-closed", () => {
    // MacOS expects apps to continue running until explicitly terminated
    if (process.platform !== "darwin") {
        app.quit();
    }
});
