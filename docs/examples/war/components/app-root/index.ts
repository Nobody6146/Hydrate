import { HydrateComponent, HydrateEventDetails } from "../../../../lib/hydrate/hydrate.js";
import { War, Player } from "../../scripts/war.js";

interface AppState {
    players:Player[];
    display:string;
}

export class AppRoot extends HydrateComponent<AppState> {
    #war:War;

    onInit(detail:HydrateEventDetails) {
        this.#war = this.dependency(War);

        const state:AppState = {
            players: this.#war.players,
            display: "Click fight to play!"
        };
        this.model = state;
    }

    fight() {
        const {players, winner } = this.#war.fight();
        if(winner != null)
        {
            if(players.filter(x => x.deck.size + x.hand.length > 0 ).length === 1)
                this.model.display = `${winner.player.name} has won the war with ${winner.cards.length + winner.player.deck.size} cards!`;
            else
                this.model.display = `${winner.player.name} won ${winner.cards.length} cards!`;
        }
        else
            this.model.display = "Gameover!";
        this.model.players = players;
    }
}