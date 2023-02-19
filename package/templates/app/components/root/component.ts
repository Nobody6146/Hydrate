import { HydrateComponent, HydrateEventDetails, HydrateFieldExpressionArgs } from "../../lib/hydrate/hydrate.js";
import { AppRoutes } from "../../routes.js";
import { NavbarComponentState } from "../navbar/component.js";
import { PageComponentState } from "../page/component.js";

//****** Boiler Plate Code to dynamically get names of object properties *******/
interface ComponentFieldExpressionArgs extends HydrateFieldExpressionArgs<RootComponentState, RootComponent> {
    this:RootComponent;
}
function argName(exp: (x:ComponentFieldExpressionArgs) => any):string {
    return name(exp);
}
function propName(exp: (x:RootComponentState) => any):string{
    return name(exp);
}
function name(exp: (...any) => any):string {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}

export let RootComponentTemplate = `<template h-model="app" h-init>
    <style h-style>
        :root footer i {
            color: gray;
        }
    </style>
    <header>
        <nav h-model="^.${propName(x => x.navbar.items)}" h-component="app-navbar"></nav>
    </header>
    <main>
        <app-page h-model="^.${propName(x => x.pages)}"></app-page>
    </main>
    <footer>
        <p>
            <i>Hydrate 2023</i>
        </p>
    </footer>
</template>`

const APP_NAME:string = "Demo";

export interface RootComponentState {
    text:string;
    pages: PageComponentState,
    navbar:NavbarComponentState
}

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
                component: x.component,
                name: x.title
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