import { HydrateApp } from "../../hydrate.js";
import { UiService } from "./scripts/ui.js";
import { TaskService } from "./scripts/task.js";
import { Router } from "./scripts/router.js";
export class App {
    hydrate;
    constructor() {
        //Establish front-end framework
        this.hydrate = new HydrateApp();
        //Initialize any services
        //Single to the app that we've finished loading
        this.hydrate.singleton(UiService);
        this.hydrate.singleton(TaskService);
        //Setup routes
        const router = new Router(this.hydrate);
        this.hydrate.start();
        this.hydrate.route();
        this.hydrate.bind("loaded", {});
    }
}
