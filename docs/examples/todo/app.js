class App {
    hydrate;
    #api;
    #router;
    #taskService;
    #uiService;
    constructor() {
        //Establish front-end framework
        this.hydrate = new HydrateApp();
        //Initialize any services
        this.#api = new Api();
        this.#taskService = new TaskService(this.hydrate, this.#api);
        this.#uiService = new UiService(this.hydrate);
        this.#router = new Router(this.hydrate);
        //Single to the app that we've finished loading
        this.hydrate.bind("loaded", {});
    }
    get router() {
        return this.#router;
    }
    get taskService() {
        return this.#taskService;
    }
    get uiService() {
        return this.#uiService;
    }
}
