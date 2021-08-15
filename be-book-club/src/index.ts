import App, { getDefaultApp } from "./server";
import { getDBConnection } from "./db";

getDBConnection().then( connection => {
    const app = getDefaultApp();
    app.start();
})