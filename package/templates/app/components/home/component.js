import { HydrateComponent } from "../../lib/hydrate/hydrate.js";
function argName(exp) {
    return name(exp);
}
function propName(exp) {
    return name(exp);
}
function name(exp) {
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
</template>`;
const APP_NAME = "Demo App";
export class HomeComponent extends HydrateComponent {
    onInit(eventDetails) {
        this.model = {
            name: APP_NAME
        };
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
