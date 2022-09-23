interface UiServiceModel {
    addTaskMenu:AddTaskUiModel;
}
interface AddTaskUiModel  {
    visible:boolean;
}

class UiService {

    static #hydrate:HydrateApp;
    static #model:UiServiceModel;

    static initialize(hydrate:HydrateApp) {
        UiService.#hydrate = hydrate;
        UiService.#model = hydrate.bind("ui", {
            addTaskMenu: {
                visible: false
            }
        });
    }

    static get addTaskMenu():AddTaskUiModel {
        return UiService.#model.addTaskMenu;
    }

    static toggleAddTaskMenu():boolean {
        const toggle = !(UiService.#hydrate.state(UiService.#model).addTaskMenu.visible);
        UiService.#model.addTaskMenu.visible = toggle;
        return toggle;
    }
}