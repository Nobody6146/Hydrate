import { HydrateComponent, HydrateEventDetails } from "../../../../lib/hydrate/hydrate.js";

export default class extends HydrateComponent<any> {
    onInit(eventDetails: HydrateEventDetails): void {
        console.log("initialized");
    }
}