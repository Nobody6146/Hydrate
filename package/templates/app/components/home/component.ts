import { HydrateComponent, HydrateEventDetails, HydrateFieldExpressionArgs } from "../../lib/hydrate/hydrate.js";

//****** Boiler Plate Code to dynamically get names of object properties *******/
interface ComponentFieldExpressionArgs extends HydrateFieldExpressionArgs<HomeComponentState, HomeComponent> {
    this:HomeComponent;
}
function argName(exp: (x:ComponentFieldExpressionArgs) => any):string {
    return name(exp);
}
function propName(exp: (x:HomeComponentState) => any):string{
    return name(exp);
}
function name(exp: (...any) => any):string {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}

export let HomeComponentTemplate = `<template h-model="app.page.home" h-init>
    <style h-style>
    </style>    
    <div>
        <h2 h-model="^" h-property="textContent: ${propName(x => x.name)}">APP_NAME</h2>
        <p>
            Hydrate, building dynamic website your way. Welcome home!
        </p>
    </div>
</template>`

interface HomeComponentState {
    name:string;
}

const APP_NAME = "Demo App";

export class HomeComponent extends HydrateComponent<HomeComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        this.model = {
            name: APP_NAME
        }
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}