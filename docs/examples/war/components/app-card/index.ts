import { HydrateComponent, HydrateEventDetails } from "../../../../hydrate.js";
import { PlayingCard } from "../../scripts/card.js";
import { ImageGallery } from "../../scripts/gallery.js";

interface ComponentState {
    card:PlayingCard;
}

export class AppCard extends HydrateComponent<ComponentState> {
    #imageGallery:ImageGallery;

    onInit(eventDetails:HydrateEventDetails) {
        this.#imageGallery = this.dependency(ImageGallery);
    }

    drawImage(canvas:HTMLCanvasElement, card:PlayingCard) {
        if(!canvas.isConnected)
            return;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        const image = this.#imageGallery.card(card.id);
        context.drawImage(image.source, image.x, image.y, image.width, image.height, 0, 0, canvas.width, canvas.height);
    }
}