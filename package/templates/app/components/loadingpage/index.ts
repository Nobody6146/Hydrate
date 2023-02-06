import { HydrateComponent, HydrateEventDetails } from "../../lib/hydrate/hydrate.js";
import { PageState } from "../page/index.js";

interface LoadingpageComponentState extends PageState {

}

export class LoadingpageComponent extends HydrateComponent<LoadingpageComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }

    syncDocumentTitle() {
        //If we traveled to this link, set the document name
        if(window.location.hash === this.state.route)
            document.title = this.state.title;
    }
}