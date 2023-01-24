import { HydrateComponent, HydrateEventDetails } from "../../../../lib/hydrate/hydrate.js";
import { Deck, PlayingCard } from "../../scripts/card.js";

interface ComponentState {
    name:string;
    deck:Deck;
    hand:PlayingCard[];
}

export class AppPlayer extends HydrateComponent<ComponentState> {

}