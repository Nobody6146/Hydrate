import { HydrateComponent, HydrateEventDetails, HydrateFieldExpressionArgs } from "../../lib/hydrate/hydrate.js";

//****** Boiler Plate Code to dynamically get names of object properties *******/
interface ComponentFieldExpressionArgs extends HydrateFieldExpressionArgs<NavbarComponentState, NavbarComponent> {
    this:NavbarComponent;
}
function argName(exp: (x:ComponentFieldExpressionArgs) => any):string {
    return name(exp);
}
function propName(exp: (x:NavbarComponentState) => any):string{
    return name(exp);
}
function name(exp: (...any) => any):string {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}

export let NavbarComponentTemplate = `<template>
    <style h-style>
        :root {
            color: inherit;
        }
        
        :root a:visited {
            text-decoration: none;
        }
        
        :root .activePage {
            font-weight: bold;
            color: blue;
        }
    </style>
    <a h-model="^" h-routing="start" h-attribute="href: ${name((x:NavItemState) => x.url)}; h-route: ${name((x:NavItemState) => x.url)}"
     h-property="textContent: ${name((x:NavItemState) => x.title)}"
     h-class="activePage: window.location.hash === ${name((x:NavItemState) => x.url)}">
    </a>
</template>`

export interface NavItemState {
    title:string,
    url:string
}

export interface NavbarComponentState {
    items:NavItemState[]
};

export class NavbarComponent extends HydrateComponent<NavbarComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}