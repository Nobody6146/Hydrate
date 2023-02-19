import { HydrateComponent, HydrateEventDetails, HydrateFieldExpressionArgs } from "../lib/hydrate/hydrate.js";

//****** Boiler Plate Code to dynamically get names of object properties *******/
interface ComponentFieldExpressionArgs extends HydrateFieldExpressionArgs<COMPONENT_NAMEComponentState, COMPONENT_NAMEComponent> {
    this:COMPONENT_NAMEComponent;
}
function argName(exp: (x:ComponentFieldExpressionArgs) => any):string {
    return name(exp);
}
function propName(exp: (x:COMPONENT_NAMEComponentState) => any):string{
    return name(exp);
}
function name(exp: (...any) => any):string {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}

//******* HTML Template *******/
export let COMPONENT_NAMEComponentTemplate = `<template h-model MODIFIERS>
    <div>
        Testing COMPONENT_NAME Component
        <p h-model="^" h-property="textContent: 'Model name: ' + ${argName(x => x.$modelName)}"></p>
    </div>
</template>`;

export interface COMPONENT_NAMEComponentState {
    
}

export class COMPONENT_NAMEComponent extends HydrateComponent<COMPONENT_NAMEComponentState> {

    onInit(eventDetails:HydrateEventDetails):void {
        
    }

    onPreRender(eventDetails:HydrateEventDetails):void {

    }

    onPostRender(eventDetails:HydrateEventDetails):void {

    }

    onDestroy():void {

    }
}