import { HydrateApp } from "../../lib/hydrate/hydrate.js";
import { War } from "./scripts/war.js";
import { ImageGallery } from "./scripts/gallery.js";

class App {
    #hydrate:HydrateApp;

    constructor() {
        this.#hydrate = new HydrateApp();
    }

    get hydrate():HydrateApp {
        //Initialize the framework
        return this.#hydrate;
    }

    async start(playerCount:number = 2): Promise<void> {
        //Tell the framework to start running
        this.#hydrate.start();
        //Load all of our app dependencies
        await this.#loadDependencies(playerCount);
    }

    async #loadDependencies(playerCount:number):Promise<void> {
        //Load our card images
        const cardsImage = await this.#loadImage("images/cards.png");
        //Configure our dependencies
        this.#hydrate.singleton(ImageGallery, (hydrate:HydrateApp, source:any) => new ImageGallery(cardsImage));
        this.#hydrate.singleton(War, (hydrate:HydrateApp, source:any) => new War(playerCount));
    }

    async #loadImage(src:string):Promise<HTMLImageElement> {
        const app = this;
        return new Promise( (resolve, reject) => {
            const image = new Image();
            image.onload = function() {
                resolve(image);
            };
            image.onerror = function(error) {
                reject(error);
            }
            image.src = src;
        });
    }
}

const app = new App();
//globalThis.app = app;
app.start(4);