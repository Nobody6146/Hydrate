import { HydrateApp, HydrateAppService } from "../../../lib/hydrate/hydrate.js";

export interface CardImage {
    source:HTMLImageElement;
    x:number;
    y:number;
    width:number;
    height:number;
}

export class ImageGallery extends HydrateAppService {
    
    #cardsImage:HTMLImageElement;

    constructor(cardsImage:HTMLImageElement) {
        super();
        this.#cardsImage = cardsImage;
    }

    card(id:number):CardImage {
        const width = this.#cardsImage.width / 13;
        const height = this.#cardsImage.height / 4;
        return {
            source: this.#cardsImage,
            x: (id % 13) * width,
            y: Math.floor(id / 13) * height,
            width: width,
            height: height
        }
    }
}