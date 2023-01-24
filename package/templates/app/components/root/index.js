import { HydrateComponent } from "../../lib/hydrate/hydrate.js";
export class RootComponent extends HydrateComponent {
    onInit(eventDetails) {
        this.model = {
            name: "{{APP_NAME}}",
            description: "You are running a Hydrate app!",
            copyrightYear: 2023
        };
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
