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
export let ErrorPageTemplate = `<template h-model="app.page.error" h-init>
    <style h-style>
        :root {
            color: red;
        }
    </style>
    <div>
        Error: <span h-model="^" h-property="textContent: ${propName(x => x.errorMessage)}"></span>
    </div>
</template>`;
export class ErrorPageComponent extends HydrateComponent {
    onInit(eventDetails) {
        this.model = {
            errorMessage: eventDetails.request?.state?.errorMessage
        };
    }
    onPreRender(eventDetails) {
        //this.dependency(LoggerService).error("Issues resolving route");
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
