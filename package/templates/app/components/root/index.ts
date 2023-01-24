import { HydrateComponent, HydrateEventDetails } from "../../lib/hydrate/hydrate.js";

interface RootComponentState {
    name:string;
    description:string;
    copyrightYear:number;
}

export class RootComponent extends HydrateComponent<RootComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        this.model = {
            name: "{{APP_NAME}}",
            description: "You are running a Hydrate app!",
            copyrightYear: 2023
        }
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}