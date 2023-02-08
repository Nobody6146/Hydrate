import { HydrateComponent, HydrateEventDetails } from "../../lib/hydrate/hydrate.js";
import { AppRoutes } from "../../routes.js";
import { NavbarComponentState } from "../navbar/index.js";
import { PageComponentState } from "../page/index.js";

export interface RootComponentState {
    text:string;
    pages: PageComponentState,
    navbar:NavbarComponentState
}

const APP_NAME:string = "Demo";

export class RootComponent extends HydrateComponent<RootComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        const routes = AppRoutes.filter(x => x.path.match(/\w+/)).map(x => { return {
            title: x.name ?? `${x.path.substring(1, 2).toUpperCase()}${x.path.substring(2)}`,
            route: x.path,
            component: `app-${x.path.substring(1)}`
        }});
        this.model = {
            text: "Hello world",
            pages: routes.map(x => { return {
                title: `${APP_NAME} - ${x.title}`,
                route: x.route,
                component: x.component
            }}),
            navbar: {
                items: routes.map(x => { return {
                    title: x.title,
                    url: x.route
                }})
            }
        };
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}