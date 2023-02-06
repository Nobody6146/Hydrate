import { HydrateComponent } from "../../lib/hydrate/hydrate.js";
export class LoadingpageComponent extends HydrateComponent {
    onInit(eventDetails) {
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
    syncDocumentTitle() {
        //If we traveled to this link, set the document name
        if (window.location.hash === this.state.route)
            document.title = this.state.title;
    }
}
