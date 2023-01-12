import { HydrateComponent, HydrateEventDetails } from "../../../../hydrate.js";

export default class extends HydrateComponent {
    onInit(eventDetails: HydrateEventDetails): void {
        console.log("initialized");
    }
}