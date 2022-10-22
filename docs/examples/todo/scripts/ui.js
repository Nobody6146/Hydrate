class UiService {
    #hydrate;
    #model;
    constructor(hydrate) {
        this.#hydrate = hydrate;
        this.#model = hydrate.bind("ui", {
            addTaskMenu: {
                visible: false
            }
        });
    }
    subscribeToShowAddTaskMenu(callback) {
        return this.#hydrate.subscribe(`${this.#hydrate.path(this.#model.addTaskMenu)}.visible`, callback);
    }
    toggleAddTaskMenu() {
        const toggle = !(this.#hydrate.state(this.#model).addTaskMenu.visible);
        this.#model.addTaskMenu.visible = toggle;
        return toggle;
    }
}
