import { HydrateComponent } from "../../../../hydrate.js";
import { ImageGallery } from "../../scripts/gallery.js";
export class AppCard extends HydrateComponent {
    #imageGallery;
    onInit(eventDetails) {
        this.#imageGallery = this.dependency(ImageGallery);
    }
    drawImage(canvas, card) {
        if (!canvas.isConnected)
            return;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        const image = this.#imageGallery.card(card.id);
        context.drawImage(image.source, image.x, image.y, image.width, image.height, 0, 0, canvas.width, canvas.height);
    }
}
