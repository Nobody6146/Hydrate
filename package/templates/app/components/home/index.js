import { HydrateComponent } from "../../lib/hydrate/hydrate.js";
const APP_NAME = "Demo App";
export class HomeComponent extends HydrateComponent {
    onInit(eventDetails) {
        this.model = {
            name: APP_NAME
        };
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
