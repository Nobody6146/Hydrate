class App {
    hydrate;
    #routes;
    constructor() {
        //Define our routes
        this.#routes = [
            { path: "#home", action: request => request.resolve() },
            { path: "#about", action: request => request.resolve() },
            { path: "", action: request => request.redirect("#home") },
        ];
        //Establish front-end framework
        this.hydrate = new HydrateApp();
        //Bind our initial state
        this.#bindState();
        //Turn on client side routing
        document.addEventListener("hydrate.routing.start", this.#clientSideRouting.bind(this));
        //Route the active page
        this.hydrate.route();
    }
    #clientSideRouting(event) {
        const request = event.detail.request;
        try {
            const matches = request.match(request.url, ...this.#routes);
            for (let match of matches) {
                match.route.action(request);
                if (request.handled)
                    return;
            }
        }
        catch (error) {
            console.error(error);
        }
        request.reject();
    }
    #bindState() {
        // this.hydrate.bind("header", {
        //     title: "Task Tracker"
        // });
        // this.hydrate.bind("tasks");
        this.hydrate.bind("addTask");
        const ui = {
            addTask: {
                show: false,
                toggleShow: function () {
                    this.show = !this.show;
                    this.updateButtonState();
                },
                updateButtonState: function () {
                    if (this.show) {
                        this.button.text = "Close",
                            this.button.color = "red";
                    }
                    else {
                        this.button.text = "Add";
                        this.button.color = "green";
                    }
                },
                button: {
                    text: "Add",
                    color: "green",
                    onClick: null
                }
            }
        };
        ui.addTask.updateButtonState();
        const uiModel = this.hydrate.bind("ui", ui);
        ui.addTask.button.onClick = function () {
            uiModel.addTask.toggleShow();
        };
    }
}
