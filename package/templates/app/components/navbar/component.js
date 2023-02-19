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
    <a h-model="^" h-routing="start" h-attribute="href: ${name((x) => x.url)}; h-route: ${name((x) => x.url)}"
     h-property="textContent: ${name((x) => x.title)}"
     h-class="activePage: window.location.hash === ${name((x) => x.url)}">
    </a>
</template>`;
;
export class NavbarComponent extends HydrateComponent {
    onInit(eventDetails) {
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
}
