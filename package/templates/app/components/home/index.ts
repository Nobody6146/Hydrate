import { HydrateComponent, HydrateEventDetails } from "../../lib/hydrate/hydrate.js";
// import { APP_NAME } from "../../components/root/index.js"

interface HomeComponentState {
    name:string;
}

const APP_NAME = "Demo App";

export class HomeComponent extends HydrateComponent<HomeComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        this.model = {
            name: APP_NAME
        }
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}