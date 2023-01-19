import { HydrateComponent, HydrateEventDetails } from "../../../../hydrate.js";

export default class extends HydrateComponent<any> {
    onInit(eventDetails: HydrateEventDetails): void {
        console.log("initialized");
    }
}