import { HydrateComponent, HydrateEventDetails, HydrateFieldExpressionArgs, HydrateRouteEventDetails } from "../../lib/hydrate/hydrate.js";

//****** Boiler Plate Code to dynamically get names of object properties *******/
interface ComponentFieldExpressionArgs extends HydrateFieldExpressionArgs<ErrorPageComponentState, ErrorPageComponent> {
    this:ErrorPageComponent;
}
function argName(exp: (x:ComponentFieldExpressionArgs) => any):string {
    return name(exp);
}
function propName(exp: (x:ErrorPageComponentState) => any):string{
    return name(exp);
}
function name(exp: (...any) => any):string {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}

export let ErrorPageTemplate = `<template h-model="app.page.error" h-init>
    <style h-style>
        :root {
            color: red;
        }
    </style>
    <div>
        Error: <span h-model="^" h-property="textContent: ${propName(x => x.errorMessage)}"></span>
    </div>
</template>`

interface ErrorPageComponentState {
    errorMessage:string;
}

export class ErrorPageComponent extends HydrateComponent<ErrorPageComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        this.model = {
            errorMessage: (eventDetails as HydrateRouteEventDetails).request?.state?.errorMessage
        };
    }

    onPreRender(eventDetails:HydrateEventDetails):void {
        //this.dependency(LoggerService).error("Issues resolving route");
    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}