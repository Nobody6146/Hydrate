import { HydrateComponent } from "../lib/hydrate/hydrate.js";
function argName(exp) {
    return name(exp);
}
function propName(exp) {
    return name(exp);
}
function name(exp) {
    return exp.toString().match(/\=\>\s+[^\.]+\.(.+)/)?.[1];
}
//******* HTML Template *******/
export let COMPONENT_NAMEComponentTemplate = `<template h-model MODIFIERS>
    <div>
        Testing COMPONENT_NAME Component
        <p h-model="^" h-property="textContent: 'Model name: ' + ${argName(x => x.$modelName)}"></p>
    </div>
</template>`;
export class COMPONENT_NAMEComponent extends HydrateComponent {
    onInit(eventDetails) {
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
