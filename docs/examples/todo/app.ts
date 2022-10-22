class App {
    hydrate:HydrateApp;
    #api:Api;
    #router:Router;
    #taskService:TaskService;
    #uiService:UiService;

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

    get router():Router {
        return this.#router;
    }
    get taskService():TaskService {
        return this.#taskService;
    }
    get uiService():UiService {
        return this.#uiService;
    }
}