class UiService {
    static #hydrate;
    static #model;
    static initialize(hydrate) {
        UiService.#hydrate = hydrate;
        UiService.#model = hydrate.bind("ui", {
            addTaskMenu: {
                visible: false
            }
        });
    }
    static get addTaskMenu() {
        return UiService.#model.addTaskMenu;
    }
    static toggleAddTaskMenu() {
        const toggle = !(UiService.#hydrate.state(UiService.#model).addTaskMenu.visible);
        UiService.#model.addTaskMenu.visible = toggle;
        return toggle;
    }
}
