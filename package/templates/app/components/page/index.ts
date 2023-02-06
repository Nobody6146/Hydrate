import { HydrateComponent, HydrateEventDetails, HydrateScaffoldEventDetails } from "../../lib/hydrate/hydrate.js";

export interface PageState {
    title:string,
    route:string,
    component:string
}

export type PageComponentState = PageState[];


export class PageComponent extends HydrateComponent<PageComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }

    scaffoldRoute(element:HTMLElement, detail:HydrateScaffoldEventDetails) {
        const routeAttribute = this.hydrate.attribute(this.hydrate.options.attribute.names.route);
        const page:PageState = this.state[detail.modelName];
        element.setAttribute(routeAttribute, page.route);
    }

    scaffoldPage(element:HTMLElement, detail:HydrateScaffoldEventDetails) {
        const componentAttribute = this.hydrate.attribute(this.hydrate.options.attribute.names.component);
        const page:PageState = this.state[detail.modelName];
        element.setAttribute(componentAttribute, page.component);
    }

    title(id:number):string {
        return this.state[id].title;
    }

    component(id:number):string {
        console.warn(this.route);
        return this.state[id].component;
    }

    route(id:number):string {
        return this.state[id].route;
    }
}