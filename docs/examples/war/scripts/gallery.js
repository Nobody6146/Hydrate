export class ImageGallery {
    #cardsImage;
    constructor(cardsImage) {
        this.#cardsImage = cardsImage;
    }
    card(id) {
        const width = this.#cardsImage.width / 13;
        const height = this.#cardsImage.height / 4;
        return {
            source: this.#cardsImage,
            x: (id % 13) * width,
            y: Math.floor(id / 13) * height,
            width: width,
            height: height
        };
    }
}
