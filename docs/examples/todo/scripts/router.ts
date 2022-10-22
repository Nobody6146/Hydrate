class Router {
    #routes:HydrateRoute[];

    constructor(hydrate:HydrateApp) {
        //Define our application routes
        this.#routes = [
            {path: "#home", action: request => request.resolve()},
            {path: "#about", action: request => request.resolve()},
            {path: "", action: request => request.redirect("#home")},
        ];
        //Turn on client side routing
        document.addEventListener("hydrate.routing.start", this.#clientSideRouting.bind(this));
        //Route the active page
        hydrate.route();
    }

    #clientSideRouting(event:HydrateRouteEvent) {
        const request = event.detail.request;
        try {
            const matches = request.match(request.url, ...this.#routes);
            for(let match of matches) {
                match.route.action(request);
                if(request.handled)
                    return;
            }
        }
        catch(error) {
            console.error(error);
        }
        request.reject();
    }
}