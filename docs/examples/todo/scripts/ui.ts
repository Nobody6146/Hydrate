import { HydrateApp, HydrateSubscriptionCallback } from "../../../hydrate.js";

interface UiServiceModel {
    addTaskMenu:{
        visible:boolean;
    };
}

export class UiService {
    
    #hydrate:HydrateApp;
    #model:UiServiceModel;

    constructor(hydrate:HydrateApp) {
        this.#hydrate = hydrate;
        this.#model = hydrate.bind("ui", {
            addTaskMenu: {
                visible: false
            }
        });
    }

    subscribeToShowAddTaskMenu(callback:HydrateSubscriptionCallback<boolean>) {
        return this.#hydrate.subscribe(`${this.#hydrate.path(this.#model.addTaskMenu)}.visible`, callback);
    }

    toggleAddTaskMenu():boolean {
        const toggle = !(this.#hydrate.state(this.#model).addTaskMenu.visible);
        this.#model.addTaskMenu.visible = toggle;
        return toggle;
    }
}