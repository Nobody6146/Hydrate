export interface CardImage {
    source:HTMLImageElement;
    x:number;
    y:number;
    width:number;
    height:number;
}

export class ImageGallery {
    
    #cardsImage:HTMLImageElement;

    constructor(cardsImage:HTMLImageElement) {
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