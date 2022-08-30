type HydrateModelEventHandler = (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails|HydrateElementMutationEventDetails|HydrateElementTrackingEventDetails|HydrateElementEventListenerEventDetails) => void;
type HydrateModelEventExecuter = {arg:HydrateAttributeArgument, handler:HydrateModelEventHandler};

class HydrateAppOptions {

    dom?:HydrateDomOptions;
    model?:HydrateModelOptions;
    attribute?:HydrateAttributeOptions;
    router?:HydrateRouterOptions;
    debug?:HydrateDebugOptions;

    constructor() {
        this.dom = new HydrateDomOptions();
        this.model = new HydrateModelOptions();
        this.attribute = new HydrateAttributeOptions();
        this.router = new HydrateRouterOptions();
        this.debug = new HydrateDebugOptions();
    }
}

class HydrateDebugOptions {
    dispatchTimer?:boolean;

    constructor() {
        this.dispatchTimer = false;
    }
}

class HydrateRouterOptions {
    hashRouting?:boolean = true;
}

class HydrateDomOptions {
    rootSelector?:string = "body";
}

class HydrateModelOptions {
    baseProperty?:string;
    parentProperty?:string;
    nameProperty?:string;
    stateProperty?:string;

    constructor() {
        this.baseProperty = "__base";
        this.parentProperty = "__parent";
        this.nameProperty = "__name";
        this.stateProperty = "__state";
    }
}

class HydrateAttributeOptions
{
    names?:HydrateAttributeNamesOptions;
    handlers?:Map<string, HydrateModelEventHandler>;
    standardPrefix?:string;
    customPrefix?:string;
    trackables?:string[];

    constructor() {
        this.names = new HydrateAttributeNamesOptions();
        this.handlers = new Map<string, HydrateModelEventHandler>();
        this.standardPrefix = "h";
        this.customPrefix = "hc";
        this.trackables = []
    }
}

class HydrateAttributeNamesOptions
{
    //Linking
    model?:string
    nested?:string;//Will also respond to nested property changes

    //Basic element manipulation
    property?:string;
    attribute?:string;
    toggle?:string//Toggles an attribute
    class?:string; //Toggles the inclusion of a class to an element
    remove?:string; //removes an element

    //Binding
    input?:string;
    mutation?:string;

    //Conditionals
    //static = "static"; //Executes once
    //condition = "condition";

    //Functions and execution
    event?:string; //Calls a callback any time the framework event type is triggered
    on?:string; //Fires a callback when the "on" event of the element is fired

    //Templating and Components
    script?:string;
    template?:string; //template changes queries user of the templates then regenerate
    component?:string; //="[PROP] [TEMPLATE] [property | model | array | dictionary | map]?
    duplicate?:string; //Duplicates the component x times 
    id?:string; //Places an id

    //Routing
    route?:string; //Mark a route associated with this element
    routing?:string; //Mark the element to say which router events it's responding to

    //Execution and Timing
    delay?:string;
    debounce?:string;
    throttle?:string;

    // customs:string[] = []; 

    constructor() {
        //Linking
        this.model = "model";
        this.nested = "nested";//Will also respond to nested property changes

        //Basic element manipulation
        this.property = "property";
        this.attribute = "attribute";
        this.toggle = "toggle"; //Toggles an attribute
        this.class = "class"; //Toggles the inclusion of a class to an element
        this.remove = "remove"; //removes an element

        //Binding
        this.input = "input";
        this.mutation = "mutation";

        //Functions and execution
        this.event = "event"; //Calls a callback any time the framework event type is triggered
        this.on = "on"; //Fires a callback when the "on" event of the element is fired

        //Templating and Components
        this.script = "script";
        this.template = "template"; //template changes queries user of the templates then regenerate
        this.component = "component"; //="[PROP] [TEMPLATE] [property | model | array | dictionary | map]?
        this.duplicate = "duplicate"; //Duplicates the component x times 
        this.id = "id"; //Places an id

        //Routing
        this.route = "route"; //Mark a route associated with this element
        this.routing = "routing"; //Mark the element to say which router events it's responding to

        //Execution and Timing
        this.delay = "delay";
        this.debounce = "debounce";
        this.throttle = "throttle";

        // customs:string[] = []; 
    }
}

interface HydrateAttributeArgument {
    field: string;
    expression: string;
}

type HydrateEventType = 'track' | 'untrack' | 'bind' | "unbind" | 'set' | "input" | "on"
    | "mutation.target.added" | "mutation.target.removed" | "mutation.target.attribute" | "mutation.target.characterdata"
    | "mutation.parent.added" | "mutation.parent.removed" | "mutation.parent.attribute" | "mutation.parent.characterdata"
    | "mutation.child.added" | "mutation.child.removed" | "mutation.child.attribute" | "mutation.child.characterdata"
    | 'routing.start' | "routing.resolve" | "routing.reject";
type HydrateComponentTemplateType = "template" | "url";

interface HydrateEventDetailProperties {
    propPath:string;
    propName:string;
    modelPath:string;
    modelName:string;
    baseName:string;
    parentName:string;
    parentPath:string;
}

class HydrateElementTrackingEvent extends CustomEvent<HydrateElementTrackingEventDetails> {

    constructor(detail:HydrateElementTrackingEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateModelEvent extends CustomEvent<HydrateModelEventDetails> {

    constructor(detail:HydrateModelEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateRouteEvent extends CustomEvent<HydrateRouteEventDetails> {

    constructor(detail:HydrateRouteEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateElementMutationEvent extends CustomEvent<HydrateElementMutationEventDetails> {

    constructor(detail:HydrateElementMutationEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateElementEventListenerEvent extends CustomEvent<HydrateElementEventListenerEventDetails> {

    constructor(detail:HydrateElementEventListenerEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateElementInputEvent extends CustomEvent<HydrateElementInputEventDetails> {

    constructor(detail:HydrateElementInputEventDetails) {
        super(`hydrate.${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

abstract class HydrateEventDetails
{
    hydrate: HydrateApp;
    element: HTMLElement;
    type: HydrateEventType;

    baseName:string;

    modelName: string;
    modelPath:string;

    propName:string;
    propPath:string;

    parentPath:string;
    parentName:string;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, baseName:string, parentName:string, parentPath, modelName:string, modelPath:string, propName:string, propPath:string) {
        this.hydrate = hydrate;
        this.element = element;
        this.type = eventType;

        this.baseName = baseName;

        this.parentName = parentName;
        this.parentPath = parentPath;

        this.modelPath = modelPath;
        this.modelName = modelName;

        this.propPath = propPath;
        this.propName = propName;
    }

    get base() {
        return this.hydrate.model(this.baseName);
    }
    get parent() {
        return this.hydrate.model(this.parentPath);
    }
    get model() {
        return this.hydrate.model(this.modelPath);
    }
    get state() {
        return this.hydrate.state(this.modelPath);
    }
    get prop() {
        return this.hydrate.state(this.propPath);
    }
}

class HydrateElementTrackingEventDetails extends HydrateEventDetails
{
    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
    }
}

class HydrateModelEventDetails extends HydrateEventDetails {
    
    nested:HydrateModelEventDetails;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties, nested:HydrateModelEventDetails) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
        this.nested = nested;
    }
}

class HydrateElementMutationEventDetails extends HydrateEventDetails {
    mutation:MutationRecord;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties, mutation:MutationRecord) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
        this.mutation = mutation;
    }
}

class HydrateElementInputEventDetails extends HydrateEventDetails {
    
    event:Event;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType,properties:HydrateEventDetailProperties, event:Event) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
        this.event = event;
    }
}

class HydrateElementEventListenerEventDetails extends HydrateEventDetails {
    event:Event;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties, event:Event) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
        this.event = event;
    }
}

class HydrateRouteEventDetails extends HydrateEventDetails {
    request:HydrateRouteRequest;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties, request:HydrateRouteRequest) {
        super(hydrate, element, eventType, properties.baseName, properties.parentName, properties.parentPath, properties.modelName, properties.modelPath, properties.propName, properties.propPath);
        this.request = request;
    }
}

interface HydrateRouteRequest {
    path: string;
    url: string;
    pathname: string;
    search: string;
    hash: string;
    state:any;
    match:(url:URL, ...routes:string[]) => HydrateResolvedRoute[];
    resolve: () => void;
    reject: () => void;
    response:any; //Empty field where you can attach any data needed by your handling code
}

interface HydrateResolvedRoute {
    url:string;
    route:string;
    params:object;
    query:object;
}

interface HydrateElementDelayDispatch {
    timeout:number;
    eventType:HydrateEventType;
    element:HTMLElement;
    propPath:string;
    detail:HydrateEventDetailProperties;
    target:HTMLElement;
    data:any;
}

class HydrateApp {
    #dispatchId = 0;

    #options:HydrateAppOptions;
    #htmlExcecuters: Map<HTMLElement, Map<HydrateEventType, Map<string, HydrateModelEventExecuter[]>>>; //element name -> event type -> model.prop -> callbacks
    #onDomEventListeners: Map<HTMLElement, Map<string, EventListenerOrEventListenerObject>>; //A list of dynamic (h-on) event listeners added by the framework
    #elementHandlerDelays:Map<HTMLElement, Map<HydrateEventType, HydrateElementDelayDispatch>>;
    #root:HTMLElement;
    #models:object;

    #observer : MutationObserver;

    constructor(options?:HydrateAppOptions) {
        
        this.#options = {...new HydrateAppOptions(), ...options};
        this.#htmlExcecuters = new Map();
        this.#onDomEventListeners = new Map();
        this.#elementHandlerDelays = new Map();
        this.#root = document.querySelector(this.#options.dom.rootSelector);
        this.#models = {};

        this.#addTrackableAttributes();
        this.#addStandardAttributeHandlers();

        this.#observer = new MutationObserver(this.#mutationCallback.bind(this));
        this.#observer.observe(this.root, <MutationObserverInit>{
            subtree: true,
            childList: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            //attributeFilter: [...this.#options.attribute.trackables],
        });
        this.root.addEventListener("input", this.#inputListener.bind(this));
        window.addEventListener("popstate", this.#popStateListener.bind(this));
        
        this.#trackElements();
    }

    get root():HTMLElement {
        return this.#root;
    }
    get options():HydrateAppOptions {
        return this.#options;
    }
    // get exectuers() {
    //     return this.#htmlExcecuters;
    // }

    route(url?:string, state?:any):void {
        if(url == null)
        {
            url = window.location.href;
            state = history.state;
        }
        else if (state == null)
        {
            state = {};
        }
        
        history.pushState(state, '', url);
        this.#navigateTo(location.href, state);
    }

    #navigateTo(uri:string, state:any):void {
        const app = this;
        let url = new URL(uri);
        let request:HydrateRouteRequest = {
            path: this.#determineRoutePath(url),
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            url: uri,
            state: state,
            match: app.match.bind(app),
            resolve: function() {
                app.#dispatch(app.#root, "routing.resolve", undefined, request);
            },
            reject: function() {
                app.#dispatch(app.#root, "routing.reject", undefined, request);
            },
            response: null
        };
        
        this.#dispatch(this.#root, "routing.start", undefined, request);
    }

    #determineRoutePath(url:URL):string {
        return !this.#options.router.hashRouting ? url.pathname
            : (url.hash === "" ? "#" : url.hash);
    }

    #popStateListener(event:PopStateEvent):void {
        this.#navigateTo(window.location.href, event.state);
    }

    /**
     * Attempts to resolve the route. If it fails, you'll return null
     */
    match(url:URL, ...routes:string[]):HydrateResolvedRoute[] {
        let results:HydrateResolvedRoute[] = [];
        let path = this.#determineRoutePath(url);
        for(let route of routes) {
            let regexRoute = this.#routeToRegex(route);
            let match = path.match(regexRoute);
            if(match)
                results.push({
                    url: path,
                    route: route,
                    params: this.#getRouteParams(route, match),
                    query: this.#getQueryParams(url.search),
                });
        }
        return results.length > 0
            ? results : null;
    }

    #routeToRegex(route:string): RegExp {
        if(!route == null || route === "")
            return new RegExp(".*");
        let regex = route.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)");
        return RegExp("^" + regex + "$");
    }
    #getRouteParams(route:string, match:RegExpMatchArray): object {
        let params = {};
        let keys = route.match(/:(\w+)/g);
        if(keys)
            for(let i = 0; i < keys.length; i++)
                params[keys[i].substring(1)] = match[i + 1];
        return params;
    };
    #getQueryParams(search: string): object {
        let query = {};
        location.search.substring(1, location.search.length).split("&").forEach(x => {
            let [name, value] = x.split("=");
            if(name === "")
                return;
            let variable = query[name];
            if(variable == null)
                query[name] = value;
            else
            {
                if(!Array.isArray(variable))
                    query[name] = [variable];
                query[name].push(value);
            }
        });
        return query;
    }

    /**
     * 
     * @param name the root "name" of the attribute. For standard attributes, it is the option property name. For customs, it's just the name
     * @returns The full formatted attribute name with prefix
     */
    attribute(name:string) {
        let key = this.#options.attribute.names[name];
        if(key === undefined || name === "customs")
        {
            // if(!this.#options.attribute.names.customs.includes(name))
            //     return undefined;
            return `${this.#options.attribute.customPrefix}-${name}`;
        }
        return `${this.#options.attribute.standardPrefix}-${key}`;
    }

    resolveObjectValue(startValue:any, propPath:string) {
        let nameParts = propPath.split(".");
        let state = startValue;
        for(let i = 0; i < nameParts.length; i++)
        {
            if(!(state instanceof Object))
                return undefined;
            
            state = state[nameParts[i]];
        }
        return state;
    }
    state(model:string | any) {
        if(typeof model === "string")
            model = this.model(model);
        if(model == undefined || !(model instanceof Object))
            return model;
        return model[this.options.model.stateProperty];
    }
    model(path:string) {
        if(path == null)
            return undefined;
        path = path.trim();
        if(path === "")
            return undefined;
        return this.resolveObjectValue(this.#models, path);
    }
    base(model:string | any) {
        if(typeof model === "string")
            model = this.model(model);
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.baseProperty]; 
    }
    parent(model:string | any) {
        if(typeof model === "string")
            model = this.model(model);
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.parentProperty];
    }
    name(model:string | any) {
        if(typeof model === "string")
            model = this.model(model);
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.nameProperty];
    }

    /** Bind a new model to the framework */
    bind(name?: string, state?: object): any {
        if(name == null || name === "")
            throw Error("invalid model name");
        if(!name.match(/^[$A-Z_][0-9A-Z_$]*$/i))
            throw Error("invalid model name");
        if(state == null)
            state = {};

        //TODO: check to make sure the name is a proper identifier
        let app = this;
        //return new Promise(async (resolve, reject) => {
            //If this model already exist, unbind it first
            if(this.#models[name] != undefined)
                this.unbind(name);

            let proxy = this.#makeProxy(state, name, undefined);
            this.#models[name] = proxy;
            let promise = this.#dispatch(this.#root, "bind", name, undefined);
            //await promise;
            return proxy;
        //     resolve(proxy);
        // });
    }
    
    /** Unbinds the model from the framework related to the search. Search can be a string (name of model) or the state of the model */
    unbind(search: string | object): void {
        let model = typeof search === "string"
            ? this.model(search)
            : search;
        if(model == undefined)
            return;//Promise.reject("model not found");

        let baseName = this.name(this.base(model));
        if(baseName == undefined)
            return;// Promise.reject("model not found");
        this.#dispatch(this.#root, "unbind", baseName,undefined);
        delete this.#models[baseName];
        //return await promise;
    }

    #makeProxy(data: any, name: string, parent: string) {
        const app = this;
        const baseName = parent == null ? name : parent.split(".")[0];
        let models = {};
        let proxy;

        let bindOrGet = function(obj: any, prop: string | symbol, parentName: string) {
            if(obj[prop] instanceof Date || !(obj[prop] instanceof Object))
                return null;
            let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
            let modelName = name + "." + propName;

            let model = models[prop];
            if(model !== undefined)
                return model;
            else {
                //Make proxy
                models[prop] = app.#makeProxy(obj[prop], modelName, parentName);
                return models[prop];
            }
        }

        proxy = new Proxy(data, {
            get(obj, prop) {
                if(prop === app.#options.model.stateProperty)
                    return obj;
                if(prop === app.#options.model.nameProperty)
                    return name;
                if(prop === app.#options.model.parentProperty)
                    return app.model(parent);
                if(prop === app.#options.model.baseProperty)
                    return app.model(baseName);
                if(prop === 'toJson')
                {
                    if(typeof obj.toJson === 'function')
                        return obj.toJson;
                    else return function() {return JSON.stringify(this)};
                }

                if (obj[prop] instanceof Object && obj[prop] != null)
                {
                    let model = bindOrGet(obj, prop, name);
                    //let model = null;
                    return model ? model : obj[prop];
                }
                else
                    return obj[prop];
            },
            set: function(obj, prop, value) {
                obj[prop] = value;
                models = {};

                //Don't allow DOM update to trigger if value is up-to-date or this model is no longer bound
                if(app.model(name) !== proxy) {
                    return true;
                }

                // if(!obj.propertyIsEnumerable(prop))
                //     return;
                let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
                //app.dispatch("set", proxy, propName, previousValue, app.root, "all");
                app.#dispatch(app.#root, "set", name + "." + propName, undefined);

                //TODO IMMEDIATELY WORKING ON
                //Change previous state to only store previous prop state
                //Only way to gaurentee a true "copy" and really the only useful part

                return true;
            },
            deleteProperty: function(obj, prop) {
                if (prop in obj) {
                    delete obj[prop];
                    if(models[prop] != undefined)
                        delete models[prop];
                    let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
                    //app.dispatch("unbind", proxy, propName, property, app.root, "all");
                    app.#dispatch(app.#root, "unbind", name + "." + propName, undefined);
                }
                return true;
            }
        });

        return proxy;
    }

    //Ayyyy, finish this later to start parsing the mutation event and allow it to filter out
    //syntax: h-mutation="" | h-mutation="" responds to all mutations
    //  h-mutation="target: *" responds to all mutation.target events
    //  h-mutation="target: characterdata; child: added, removed;" responds to all target characterdata events, and all child added and removed events
    #parseElementMutationEvents(element:HTMLElement):Map<HydrateEventType, boolean> {
        let mutationAttribute = this.attribute(this.#options.attribute.names.mutation);
        let map = new Map<HydrateEventType, boolean>();
        if(!element.hasAttribute(mutationAttribute))
            return map;

        let args = this.parseAttributeArguments(element, mutationAttribute);
        const wildcard = "*";

        map.set("mutation.target.added", false);
        map.set("mutation.target.removed", false);
        map.set("mutation.target.attribute", false);
        map.set("mutation.target.characterdata", false);
        map.set("mutation.parent.added", false);
        map.set("mutation.parent.removed", false);
        map.set("mutation.parent.attribute", false);
        map.set("mutation.parent.characterdata", false);
        map.set("mutation.child.added", false);
        map.set("mutation.child.removed", false);
        map.set("mutation.child.attribute", false);
        map.set("mutation.child.characterdata", false);

        if(args.length === 1 && args[0].field === "" 
            && (args[0].expression.trim() === wildcard || args[0].expression.trim() === ""))
        {
            for(let key of map.keys())
                map.set(key, true);
            return map;
        }

        for(let arg of args)
        {
            let value = arg.expression.trim();
            //If wildcard or empty, allow all
            if((value === wildcard || value === ""))
            {
                //If we are only an attribute value="*" || "", let all of the mutations through
                if(arg.field === "" && args.length === 1)
                {
                    for(let key of map.keys())
                        map.set(key, true);
                    return map;
                }
                for(let key of map.keys())
                {
                    if(key.startsWith(`mutation.${arg.field}`))
                        map.set(key, true);
                }
            }
            else
            {
                var types = arg.expression.match(/([a-zA-Z]+)/g)
                if(types === null)
                    continue;
                for(let t = 0; t < types.length; t++)
                {
                    let key = `mutation.${arg.field}.${types[t]}`
                    let value = map.get(key as HydrateEventType);
                    if(value == null)
                        continue;
                    map.set(key as HydrateEventType, true);
                }
            }
        }
        return map;
    }

    #mutationCallback(mutations:MutationRecord[], observer:MutationObserver) {
        let updatedElements:HTMLElement[] = [];
        this.#trackableElementSelector
        const trackableSelector = this.#trackableElementSelector;

        let trackableElements = new Set<HTMLElement>();
        let untrackableElements = new Set<HTMLElement>();

        let modelAttribute = this.attribute(this.#options.attribute.names.model);

        mutations.forEach(mutation => {
            if(!(mutation.target instanceof HTMLElement))
                return;
            const target = mutation.target;
            switch(mutation.type)
            {
                case "attributes":
                {
                    if(mutation.target.getAttribute(mutation.attributeName) === mutation.oldValue)
                        return;
                    if(this.#options.attribute.trackables.indexOf(mutation.attributeName) >= 0)
                    {
                        if(mutation.target.matches(trackableSelector))
                        {
                            let element = mutation.target;
                            let newTrack = this.#trackElement(element);
                            if(!newTrack) {
                                //Wasn't a new track, but a core value changed, so rebind the element
                                let modelName = element.getAttribute(modelAttribute);
                                this.#dispatch(element, "bind", modelName, undefined);
                            }
                        }
                        else
                            untrackableElements.add(mutation.target);
                    }

                    this.#dispatch(mutation.target, "mutation.parent.attribute", undefined, mutation);
                    this.#dispatch(mutation.target, "mutation.target.attribute", undefined, mutation);
                    this.#dispatch(mutation.target, "mutation.child.attribute", undefined, mutation);
                    break;
                }
                case "childList":
                {
                    let addedElement = false;
                    mutation.addedNodes.forEach(node => {
                        if(!(node instanceof HTMLElement))
                            return;
                        addedElement = true;
                        this.#trackElement(node);
                        let modelName = node.getAttribute(modelAttribute);
                        //this.#dispatch(node, "bind", modelName, this.state(modelName), undefined);
                    });
                    if(addedElement)
                    {
                        this.#dispatch(mutation.target, "mutation.parent.added", undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.target.added", undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.child.added", undefined, mutation);
                    }

                    let removedElement = false;
                    for(let node of mutation.removedNodes)
                    {
                        if(!(node instanceof HTMLElement))
                            return;
                        removedElement = true;
                        this.#untrackElement(node);
                    }
                    if(removedElement)
                    {
                        this.#dispatch(mutation.target, "mutation.parent.removed", undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.target.removed", undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.child.removed", undefined, mutation);
                    }
                    break;
                }
                case "characterData":
                {
                    this.#dispatch(mutation.target, "mutation.parent.characterdata", undefined, mutation);
                    this.#dispatch(mutation.target, "mutation.target.characterdata", undefined, mutation);
                    this.#dispatch(mutation.target, "mutation.child.characterdata", undefined, mutation);
                    break;
                }
            }
        });

        
        //Update each element
        for(let element of untrackableElements) {
            this.#untrackElement(element);
        }
        for(let element of trackableElements) {
            this.#trackElement(element);
            let modelName = element.getAttribute(modelAttribute);
            
        }
    }
    #inputListener(event:InputEvent) {
        let target = event.target as HTMLElement;
        if(!target.matches(this.#trackableElementSelector))
            return;
        let modelName = target.getAttribute(this.attribute(this.#options.attribute.names.model));
        let model = this.model(modelName);
        let state = this.state(modelName);
        if(!(state instanceof Object))
            return;
        this.#dispatch(target, "input", modelName, event);
        // let modelEvent = this.#createEvent(target, "input", this.#determineEventDetailProperties(modelName, "property"), null, undefined);
        // let args = this.parseAttributeArguments(target, this.attribute(this.#options.attribute.names.input));
        
        // for(let i = 0; i < args.length; i++)
        // {
        //     //How do we want to format the input attribute?
        //     //this.#createEvent(target, "input", this.state())
        //     let arg = args[i];
        //     let propName = arg.field;
        //     let value = this.resolveArgumentValue(modelEvent.detail, arg, event);
        //     if(state[propName] === value)
        //         continue;
        //     model[propName] = value;
        // }
    }

    #addTrackableAttributes() {
        this.#options.attribute.trackables.push(
            this.attribute(this.#options.attribute.names.property),
            this.attribute(this.#options.attribute.names.model),
            this.attribute(this.#options.attribute.names.attribute),
            this.attribute(this.#options.attribute.names.property),
            this.attribute(this.#options.attribute.names.toggle),
            this.attribute(this.#options.attribute.names.class),
            this.attribute(this.#options.attribute.names.remove),
            this.attribute(this.#options.attribute.names.event),
            this.attribute(this.#options.attribute.names.on),
            this.attribute(this.#options.attribute.names.component),
            this.attribute(this.#options.attribute.names.route),
            this.attribute(this.#options.attribute.names.mutation),
        );
        let app = this;
        //this.#options.attribute.trackables.push(...this.#options.attribute.names.customs.map(x => app.attribute(x)));
    }

    #addStandardAttributeHandlers () {
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.property), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if(value === undefined)
                return;
            if(eventDetails.element[arg.field] === value)
                return;
            eventDetails.element[arg.field] = value;
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.attribute), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if(value === undefined)
                return;
            if(eventDetails.element.getAttribute(arg.field) === value)
                return;
            eventDetails.element.setAttribute(arg.field, value);
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.class), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            eventDetails.element.classList.toggle(arg.field, value);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.toggle), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            eventDetails.element.toggleAttribute(arg.field, value);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.remove), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null
                && eventDetails.propPath !== null && eventDetails.type !== 'unbind')
                return;
            eventDetails.element.remove();
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.event), (arg:HydrateAttributeArgument, eventDetails:HydrateEventDetails) => {
            // if(eventDetails.modelName !== "" && eventDetails.model == null)
            //     return;
            if(arg.field !== "*" && arg.field !== eventDetails.type)
                return;

            if(eventDetails.element.hasAttribute(this.attribute(this.#options.attribute.names.routing)))
            {
                let url = new URL((eventDetails as HydrateRouteEventDetails).request.url);
                if(this.#elementIsHandledByRoute(eventDetails.element, eventDetails.type, url) !== "handled")
                    return;
            }
                
            eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.input), (arg:HydrateAttributeArgument, eventDetails:HydrateElementInputEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null
                && eventDetails.propPath !== null && eventDetails.type !== 'unbind')
                return;
            
            let value = this.resolveArgumentValue(eventDetails, arg, eventDetails.event);
            if(eventDetails.state[arg.field] === value)
                return;
            eventDetails.model[arg.field] = value;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.on), (arg:HydrateAttributeArgument, eventDetails:HydrateElementEventListenerEventDetails) => {
            if(arg.field !== eventDetails.event.type)
                return;
            eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, eventDetails.event);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.component), (arg:HydrateAttributeArgument, eventDetails:HydrateEventDetails) => {
            if(eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let isRouting = this.#isRoutingEvent(eventDetails.type);
            if(eventDetails.element.hasAttribute(this.attribute(this.#options.attribute.names.routing)))
            {
                
                if(!isRouting)
                    return;
                let url = new URL((eventDetails as HydrateRouteEventDetails).request.url);
                switch(this.#elementIsHandledByRoute(eventDetails.element, eventDetails.type, url))
                {
                    case "unhandled":{
                        let element = eventDetails.element;
                        while(element.firstChild)
                            element.removeChild(element.firstChild);
                        return;
                    }
                    case "unchanged":
                        return;
                    case "handled":
                        break;
                }
            }
            
            //Only generate the component if the model changed, not the child properties
            let modelAttribute = this.attribute(this.#options.attribute.names.model);
            if(eventDetails.element.getAttribute(modelAttribute) !== eventDetails.modelPath)
                return;

            let element = eventDetails.element;
            let templateAttribute = this.attribute(this.#options.attribute.names.template);
            let templateName = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            
            //Check template type
            switch(arg.field)
            {
                case "url":
                {
                    fetch(templateName)
                    .then(res => res.text())
                    .then(html => {
                        let div = document.createElement("div");
                        div.innerHTML = html;
                        this.#buildComponent(div.childNodes, modelAttribute, eventDetails);
                    });
                    break;
                }
                case "template":
                default:
                {
                    let template = this.#root.querySelector(`template[${templateAttribute}=${templateName}]`) as HTMLTemplateElement;
                    if(template == null)
                        return; 
                    this.#buildComponent(template.content.childNodes, modelAttribute, eventDetails);
                    return;
                }
            }
        });
    }

    #isRoutingEvent(eventType:HydrateEventType): boolean {
        switch(eventType) {
            case "routing.start":
            case "routing.resolve":
            case "routing.reject":
                return true;
            default:
                return false;
        }
    }

    #elementIsHandledByRoute(element:HTMLElement, eventType:HydrateEventType, url?:URL):"handled" | "unhandled" | "unchanged" {
        if(url == null)
            url = new URL(window.location.href);
        let routeAttribute = this.attribute(this.#options.attribute.names.route);
        let routingAttribute = this.attribute(this.#options.attribute.names.routing);
        let routing = element.getAttribute(routingAttribute);

        let routerElement = element;
        let route = routerElement.getAttribute(routeAttribute);
        if(route == null)
        {
            routerElement = element.parentElement;
            if(routerElement != null)
                route = routerElement.getAttribute(routeAttribute);
        }
        
        if(route == null)
        {
            return "unhandled";
        }

        let routingType = eventType.substring(eventType.lastIndexOf(".") + 1);
        let selector = `[${routingAttribute}~=${routingType}]`;
        if(this.match(url, route) == null)
            return element.matches(selector) ? "unhandled" : "unchanged";

        if(routerElement === element && routing == null)
            return "unchanged";

        let children = routerElement === element
            ? [element] : [...routerElement.children]

        for(let child of children)
        {
            if(child.matches(selector))
                return child === element ?
                    "handled" : "unhandled";
        }
        return "unchanged";
    }

    #buildComponent(template:NodeListOf<ChildNode>, modelAttribute:string, eventDetails:HydrateEventDetails) {
        let element = eventDetails.element;
        let modelSelector = `[${modelAttribute}^=\\^]`;
        
        const insertModelPath = function(element:HTMLElement, path:string) {
            element.setAttribute(modelAttribute, element.getAttribute(modelAttribute).replace("^", path));
        }

        let id = 1;
        const idAttribute = this.attribute(this.#options.attribute.names.id);
        const idSelector = `[${idAttribute}]`;
        const insertId = function(element:HTMLElement) {
            element.setAttribute(idAttribute, (id++).toString());
        }
        
        let children:Node[] = [];
        let modelPaths = Array.isArray(eventDetails.state)
            ? Object.keys(eventDetails.state).map(x => `${eventDetails.modelPath}.${x}`)
            : [eventDetails.modelPath];

        const duplicateAttribute = this.attribute(this.#options.attribute.names.duplicate);
        if(element.hasAttribute(duplicateAttribute))
        {
            let arg:HydrateAttributeArgument = {
                field: "",
                expression: element.getAttribute(duplicateAttribute)
            };
            const loopCount = this.resolveArgumentValue(eventDetails, arg, null);
            modelPaths = [];
            for(let i = 0; i < loopCount; i++)
                modelPaths.push(eventDetails.modelPath)
        }

        for(let modelPath of modelPaths)
        {
            for(var child of template)
            {
                let node = child.cloneNode(true);
                children.push(node);

                if(!(node instanceof HTMLElement))
                    continue;

                //Inject model name and initialize component
                if(node.matches(modelSelector))
                    insertModelPath(node, modelPath);
                for(let element of node.querySelectorAll<HTMLElement>(modelSelector))
                    insertModelPath(element, modelPath);

                if(node.matches(idSelector))
                    insertId(node);
                for(let element of node.querySelectorAll<HTMLElement>(idSelector))
                    insertId(element);
            }
        }
        
        //delete the current content
        while(element.firstChild)
            element.removeChild(element.firstChild);
        for(let node of children)
            eventDetails.element.appendChild(node);
        
    }

    resolveArgumentValue(detail:HydrateEventDetails, arg:HydrateAttributeArgument, event:Event) {
        let app = this;
        let functionArgs = {
            $hydrate: this,
            $element: detail.element,
            $detail: detail,
            $model: detail.model,
            $event: event, //The native event that caused this action to happen (such as an input event, window event, etc)
            $state: detail.state,
            $parent: detail.parent,
            $modelName: detail.modelName,
            $script: function(name) {
                let selector = `[${app.attribute(app.options.attribute.names.script)}=${name}]`;
                let scriptElement = app.root.querySelector(selector);
                if(scriptElement == null)
                    return null;
                let func = new Function(`'use strict'; return ${scriptElement.textContent.trim()}`)();
                if(!(func instanceof Function))
                    return null;
                return func;
            },
            $id: function(query?:HTMLElement|string) {
                if(query == null)
                    query = detail.element;
                let element = (query instanceof HTMLElement)
                    ? query : app.#root.querySelector(query);
                const idAttribute = app.attribute(app.#options.attribute.names.id);
                return element.getAttribute(idAttribute);
            }
        }
        
        const validIndentifier = /^[$A-Z_][0-9A-Z_$]*$/i;
        var stateKeys = Object.keys(detail.state ?? {}).filter(x => x.match(validIndentifier));
        var keys = Object.keys(functionArgs).concat(stateKeys);
        var values = Object.values(functionArgs);
        if(typeof detail.state === "object")
            for(let key of stateKeys)
                values.push(detail.state[key]);
        let func = new Function(...keys, `'use strict'; return ${arg.expression}`).bind(detail.state);
        if(typeof detail.state === "object")
            func = func.bind(detail.state);
        return func(...values);
    }

    parseAttributeArguments(element:HTMLElement, name:string):HydrateAttributeArgument[] {
        if(!element.hasAttribute(name))
            return [];
        let expression = element.getAttribute(name).trim();
        let args = this.#parseAttributeValues(expression);
        return args.length > 0
            ? args
            : [{
                field: "",
                expression: expression
            }];
    }

    #parseAttributeValues(expression:string) {
        let actions:{field:string, expression:string}[] = [];
        let matchCharacters = function(pattern){
            for(i = i + 1;i < expression.length;i++)
            {
                switch(expression[i])
                {
                    case pattern:
                        return true;
                    case "'":
                        if(!matchCharacters("'"))
                            return false;
                        break;
                    case '"':
                        if(!matchCharacters('"'))
                            return false;
                        break;
                    case "`":
                        if(!matchCharacters("`"))
                            return false;
                        break;
                    case "{":
                        if(!matchCharacters("}"))
                            return false;
                        break;
                }
            }
            return pattern === ";";
        }
        
        let fieldStart = 0;
        let fieldEnd = 0;
        let i = 0;
        let searchingForExpression = false;

        let addArgument = function() {
            actions.push({
                field: expression.substring(fieldStart, fieldEnd).replace(/['"`]/g, "").trim(),
                expression: expression.substring(fieldEnd + 1, i).trim()
            });
            fieldStart = i + 1;
            searchingForExpression = false;
        }

        for(;i < expression.length; i++)
        {
            switch(expression[i])
            {
                case ":":
                {
                    searchingForExpression = true;
                    break;
                }
                case "'":
                case '"':
                case "`":
                    if(!searchingForExpression)
                    {
                        if(!matchCharacters(expression[i]))
                            throw new Error("invalid field name");
                        fieldStart++;
                        searchingForExpression = true;
                        break;
                    }
                    
                default:
                {
                    if(!searchingForExpression)
                        break;
                    fieldEnd = i - 1;
                    if(!matchCharacters(";"))
                        throw new Error("invalid expression");
                    addArgument();
                    searchingForExpression = false;
                }
            }
        }
        
        return actions;
    }

    #getHandlerFunction(attribute:string) {
        return this.#options.attribute.handlers.get(attribute);
    }

    #trackElements() {
        let elements = this.#getTrackableElements()
        for(let element of elements)
            this.#trackElement(element);
    }

    #trackElement(element:HTMLElement):boolean {
        let selector = this.#trackableElementSelector;
        if(!element.matches(selector))
        {
            this.#untrackElement(element);
            return;
        }

        this.#removeOnAttributeEventListeners(element);
        this.#updateDelayedAttributes(element);
        let newTrack = this.#updateExecuters(element);
        if(newTrack)
        {
            //Send a track event
            let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
            this.#dispatch(element, "track", modelName, undefined);
        }
        return newTrack;
    }

    #updateDelayedAttributes(element:HTMLElement) {
        let throttleAttribute = this.attribute(this.#options.attribute.names.throttle);
        let debounceAttribute = this.attribute(this.#options.attribute.names.debounce);
        let delayAttribute = this.attribute(this.#options.attribute.names.delay);
        if(!element.hasAttribute(throttleAttribute) && !element.hasAttribute(debounceAttribute) && !element.hasAttribute(delayAttribute))
        {
            this.#elementHandlerDelays.delete(element);
            return;
        }
        
        if(!this.#elementHandlerDelays.has(element))
            this.#elementHandlerDelays.set(element, new Map());
    }

    #untrackElement(element:HTMLElement) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if(elementExecuters === undefined) 
            return;
        
        //Send an untrack event
        let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
        if(this.#dispatch(element, "untrack", modelName, undefined))
            return;
        //Allow the element not to detach if we prevented the default behavior
        this.#htmlExcecuters.delete(element);
        this.#removeOnAttributeEventListeners(element);
    }
    
    #removeOnAttributeEventListeners(element:HTMLElement) {
        let listeners = this.#onDomEventListeners.get(element);
        if(listeners == null)
            return;
        for(let eventType of listeners.keys())
        {
            element.removeEventListener(eventType, listeners.get(eventType));
        }
        this.#onDomEventListeners.delete(element);
    }

    #addOnAttributeEventListener(element:HTMLElement, eventType:string) {
        let elementListeners = this.#onDomEventListeners.get(element);
        if(elementListeners == null)
        {
            elementListeners = new Map();
            this.#onDomEventListeners.set(element, elementListeners);
        }
        if(elementListeners.has(eventType))
            return;

        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        let modelPath = element.getAttribute(modelAttribute);
        const app = this;
        let listener = event => {
            app.#dispatch(element, "on", modelPath, event);
        };
        elementListeners.set(eventType, listener);
        element.addEventListener(eventType, listener);
    }

    #updateExecuters(element:HTMLElement):boolean {
        let created = false;
        let elementExecuters = this.#htmlExcecuters.get(element);
        if(elementExecuters === undefined) 
        {
            elementExecuters = new Map();
            this.#htmlExcecuters.set(element, elementExecuters);
            created = true;
        }
        else {
            elementExecuters.clear();
        }
    
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        let modelPath = element.getAttribute(modelAttribute);

        let mutationEvents = this.#parseElementMutationEvents(element);
        let possibleEventTypes:HydrateEventType[] = [
            'track',
            'untrack',
            'bind',
            'unbind',
            'set',
            'on',
            'input',
            "routing.start",
            "routing.resolve",
            "routing.reject",
        ];
        for(let key of mutationEvents.keys())
        {
            if(mutationEvents.get(key) === true)
                possibleEventTypes.push(key as HydrateEventType);
        }
        
        this.#addSetPropertyHandler(element, modelPath, possibleEventTypes);
        this.#addSetAttributeHandler(element, modelPath, possibleEventTypes);
        this.#addToggleClassHandler(element, modelPath, possibleEventTypes);
        this.#addToggleAttributeHandler(element, modelPath, possibleEventTypes);
        this.#addRemoveElementHandler(element, modelPath, possibleEventTypes);
        this.#addInputHandler(element, modelPath, possibleEventTypes);
        this.#addExecuteEventCallbackHandler(element, modelPath, possibleEventTypes);
        this.#addElementEventListenersHandler(element, modelPath, possibleEventTypes);
        this.#addGenerateComponentHandler(element, modelPath, possibleEventTypes);
        return created;
    }

    #addSetPropertyHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.property);
        let eventTypes:HydrateEventType[] = [
            'track',
            'bind',
            'set',
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addToggleClassHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.class);
        let eventTypes:HydrateEventType[] = [
            'track',
            'bind',
            'set',
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addToggleAttributeHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.toggle);
        let eventTypes:HydrateEventType[] = [
            'track',
            'bind',
            'set',
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addRemoveElementHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.remove);
        let eventTypes:HydrateEventType[] = [
            'unbind'
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, false);
    }

    #addSetAttributeHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.attribute);
        let eventTypes:HydrateEventType[] = [
            'track',
            'untrack',
            'bind',
            'unbind',
            'set',
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addExecuters(element:HTMLElement, attribute:string, modelPath:string, eventTypes:HydrateEventType[], possibleEventTypes:HydrateEventType[], parseArgs:boolean):HydrateAttributeArgument[] {
        if(!element.hasAttribute(attribute))
            return;
        
        let args = parseArgs ? this.parseAttributeArguments(element, attribute)
            : [
                {
                    field: "",
                    expression: element.getAttribute(attribute)
                }
            ];
        let handler = this.#getHandlerFunction(attribute);
        
        let elementExecuters = this.#htmlExcecuters.get(element);
        for(let eventType of eventTypes)
        {
            if(!possibleEventTypes.includes(eventType))
                continue;
            for(let arg of args)
            {
                let eventExecuters = elementExecuters.get(eventType);
                if(eventExecuters === undefined) 
                {
                    eventExecuters = new Map();
                    elementExecuters.set(eventType, eventExecuters);
                }
                let modelExecuters = eventExecuters.get(modelPath);
                if(modelExecuters === undefined) 
                {
                    modelExecuters = [];
                    eventExecuters.set(modelPath, modelExecuters);
                }
                modelExecuters.push({
                    arg: arg,
                    handler: handler
                });
            }
        }
        return args;
    }

    #addInputHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.input);
        let eventTypes:HydrateEventType[] = [
            "input"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addExecuteEventCallbackHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.event);
        let eventTypes:HydrateEventType[] = [
            'track',
            'untrack',
            'bind',
            'unbind',
            'set',
            'input',
            "on",
            "routing.start",
            "routing.resolve",
            "routing.reject",
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #addElementEventListenersHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.on);
        let eventTypes:HydrateEventType[] = [
            "on"
        ];
        let args = this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
        if(args == null)
            return;
        for(let arg of args) {
            this.#addOnAttributeEventListener(element, arg.field);
        }
    }

    #addGenerateComponentHandler(element:HTMLElement, modelPath:string, possibleEventTypes:HydrateEventType[]):void {
        let attribute = this.attribute(this.#options.attribute.names.component);
        let eventTypes:HydrateEventType[] = [
            'track',
            'bind',
            "set",
            "routing.start",
            "routing.resolve",
            "routing.reject",
            "mutation.target.added",
            "mutation.target.removed",
            "mutation.target.attribute",
            "mutation.target.characterdata",
            "mutation.parent.added",
            "mutation.parent.removed",
            "mutation.parent.attribute",
            "mutation.parent.characterdata",
            "mutation.child.added",
            "mutation.child.removed",
            "mutation.child.attribute",
            "mutation.child.characterdata"
        ];
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, true);
    }

    #getTrackableElements(target?:HTMLElement) {
        if(target == null)
            target = this.#root;
        let selector = this.#trackableElementSelector;
        let elements:HTMLElement[] = [];
        if(target.matches(selector))
            elements.push(target);
        return elements.concat([...target.querySelectorAll<HTMLElement>(selector)]);
    }

    get #trackableElementSelector() {
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        return `[${modelAttribute}]`;
    }

    #getExcecuters(eventType:HydrateEventType, targets:HTMLElement[]=[], propPath:string=undefined):Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> {
        let details = this.#determineEventDetailProperties(propPath, "property");
        let results:Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> = new Map();
        if(targets == null)
            return results;
        let filterModels = propPath != undefined && propPath.trim() != "";
        for(let element of this.#htmlExcecuters.keys())
        {
            let nested = element.hasAttribute(this.attribute(this.#options.attribute.names.nested));
            if(targets != null && targets.length > 0 && !targets.includes(element))
                continue;
            let eventExecuters = this.#htmlExcecuters.get(element).get(eventType);
            if(eventExecuters == undefined || eventExecuters.size === 0)
                continue;
            let exectuers:Map<string, HydrateModelEventExecuter[]> = new Map();
            if(filterModels)
            {
                for(let modelPath of eventExecuters.keys())
                {
                    //if(nested)
                    if(modelPath !== propPath
                        && modelPath !== details.modelPath //Not a change to a property on our model
                        && !modelPath.startsWith(propPath) //Not a change in our parent
                        && (!nested || !propPath.startsWith(modelPath))) //not a nested change we're looking for
                        continue;
                    let modelExecuters = eventExecuters.get(modelPath);
                    if(modelExecuters == undefined || modelExecuters.length === 0)
                        continue;
                    exectuers.set(modelPath, modelExecuters);
                }
            }
            else
            {
                for(let property of eventExecuters.keys())
                    exectuers.set(property, eventExecuters.get(property));
            }
            results.set(element, exectuers);
        }
        //TODO: filter out any conditionals, static, etc.

        return results;
    }

    #dispatch(target:HTMLElement, eventType:HydrateEventType, propPath:string, data:any):boolean {
        let dispatchId:number;
        let dispatchTimer:string;
        if(this.#options.debug.dispatchTimer)
        {
            dispatchId = this.#dispatchId++;
            dispatchTimer = `hydrate.dispatch.${eventType}.${dispatchId}`;
            console.time(dispatchTimer);
        }
        
        //Data is any additional object data that may be needed for an event
        let detail = this.#determineEventDetailProperties(propPath, "property");
        let listenerEvent = this.#createEvent(target, eventType, detail, null, data);
        let dispatchElement = target.isConnected ? target : this.#root;
        dispatchElement.dispatchEvent(listenerEvent);
        if(listenerEvent.defaultPrevented)
            return true;
        
        let elements:HTMLElement[];
        if(eventType.startsWith("mutation.child"))
            elements = target.parentElement !== null ? [target.parentElement] : [];
        else if(eventType.startsWith("mutation.target"))
            elements = [target];
        else if(eventType.startsWith("mutation.parent"))
        {
            elements = [];
            for(let node of target.childNodes)
                if(node instanceof HTMLElement)
                    elements.push(node);
            if(elements.length === 0)
                elements = null;
        }
        else
            elements = this.#getTrackableElements(target);
        
        let elementExecuters = this.#getExcecuters(eventType, elements, propPath);
        for(let element of elementExecuters.keys())
        {
           let modelExecuters = elementExecuters.get(element);
            if(this.#throttle(eventType, element, propPath, listenerEvent.detail, target, data))
                continue;
            if(this.#debounce(eventType, element, propPath, listenerEvent.detail, target, data))
                continue;
            if(this.#delay(eventType, element, propPath, listenerEvent.detail, target, data))
                continue;
            this.#dispatchDomEvents(eventType, element, modelExecuters, propPath, detail, target, data);
        }

        if(this.#options.debug.dispatchTimer)
        {
            console.timeEnd(dispatchTimer);
        }
        
        return listenerEvent.defaultPrevented;
    }

    #throttle(eventType:HydrateEventType, element:HTMLElement, propPath:string, detail:HydrateEventDetails, target:HTMLElement, data:any):boolean 
    {
        let throttleAttribute = this.attribute(this.#options.attribute.names.throttle);
        let throttleArg = this.parseAttributeArguments(element, throttleAttribute)
            .find(x => x.field === eventType || x.field === "*");
        if(throttleArg == null)
            return false;
        let delayHandlers = this.#elementHandlerDelays.get(element);
        if(delayHandlers == null)
            return false;
        let dispatch = delayHandlers.get(eventType);

        if(dispatch?.timeout == null)
        {
            let delay = this.#parseDelayMs(detail, throttleArg);

            const app = this;
            dispatch = {
                timeout: null,
                eventType: null,
                element: null,
                propPath: null,
                detail: null,
                target: null,
                data: null
            }
            delayHandlers.set(eventType, dispatch);
            dispatch.timeout = setTimeout(() => {
                console.log("timeout reached");
                let dispatch = app.#elementHandlerDelays?.get(element)?.get(eventType);
                if(dispatch == null)
                    return;
                dispatch.timeout = null;
                if(dispatch?.element == null)
                    return;
                
                let modelExecuters = app.#getExcecuters(dispatch.eventType, [dispatch.element], dispatch.propPath)?.get(dispatch.element);
                app.#dispatchDomEvents(dispatch.eventType, dispatch.element, modelExecuters, dispatch.propPath, dispatch.detail, dispatch.target, dispatch.data);
            }, delay);
            return false;
        } else {
            dispatch = {
                timeout: dispatch.timeout,
                eventType: eventType,
                element: element,
                propPath: propPath,
                detail: detail,
                target: target,
                data: data
            };
            delayHandlers.set(eventType, dispatch);
            return true;
        }
    }

    #parseDelayMs(detail:HydrateEventDetails, arg:HydrateAttributeArgument):number {
        let delay = 0;
        try {
            delay = this.resolveArgumentValue(detail, arg, null);
            if(!Number.isInteger(delay))
                console.error("delay is not a number");
        }
        catch(err) {
            console.error(err);
        }
        return delay;
    }

    #debounce(eventType:HydrateEventType, element:HTMLElement, propPath:string, detail:HydrateEventDetails, target:HTMLElement, data:any):boolean 
    {
        let debounceAttribute = this.attribute(this.#options.attribute.names.debounce);
        let arg = this.parseAttributeArguments(element, debounceAttribute)
            .find(x => x.field === eventType || x.field === "*");
        if(arg == null)
            return false;
        let delayHandlers = this.#elementHandlerDelays.get(element);
        if(delayHandlers == null)
            return false;
        let dispatch = delayHandlers.get(eventType);

        if(dispatch?.timeout != null)
            clearTimeout(dispatch.timeout);

        let delay = this.#parseDelayMs(detail, arg);
        const app = this;
        dispatch = {
            timeout: null,
            eventType: eventType,
            element: element,
            propPath: propPath,
            detail: detail,
            target: target,
            data: data
        };
        delayHandlers.set(eventType, dispatch);
        dispatch.timeout = setTimeout(() => {
            console.log("timeout reached");
            let dispatch = app.#elementHandlerDelays?.get(element)?.get(eventType);
            if(dispatch == null)
                return;
            dispatch.timeout = null;
            if(dispatch?.element == null)
                return;
            
            let modelExecuters = app.#getExcecuters(dispatch.eventType, [dispatch.element], dispatch.propPath)?.get(dispatch.element);
            app.#dispatchDomEvents(dispatch.eventType, dispatch.element, modelExecuters, dispatch.propPath, dispatch.detail, dispatch.target, dispatch.data);
        }, delay);
        return true;
    }

    #delay(eventType:HydrateEventType, element:HTMLElement, propPath:string, detail:HydrateEventDetails, target:HTMLElement, data:any):boolean 
    {
        let delayAttribute = this.attribute(this.#options.attribute.names.delay);
        let arg = this.parseAttributeArguments(element, delayAttribute)
            .find(x => x.field === eventType || x.field === "*");
        if(arg == null)
            return false;
        
        let delay = this.#parseDelayMs(detail, arg);
        const app = this;
        
        setTimeout(() => {
            console.log("timeout reached");
            let modelExecuters = app.#getExcecuters(eventType, [element], propPath)?.get(element);
            app.#dispatchDomEvents(eventType, element, modelExecuters, propPath, detail, target, data);
        }, delay);
        return true;
    }

    #dispatchDomEvents(eventType:HydrateEventType, element:HTMLElement, modelExecuters:Map<string, HydrateModelEventExecuter[]>, propPath:string, detail:HydrateEventDetailProperties, target:HTMLElement, data:any)
    {
        if(modelExecuters == null)
            return;
        for(let modelPath of modelExecuters.keys())
        {
            // let nameIndex = property.indexOf(".");
            // let rootModelName = nameIndex < 0 ? property : property.substring(0, nameIndex);
            // let state = this.state(rootModelName);
            let event:any;
            if(propPath === modelPath) {
                event = this.#createEvent(element, eventType, this.#determineEventDetailProperties(propPath, "model"), null, data);
            }
            else if(modelPath === detail.modelPath)
            {
                //Touched property of the model
                event = this.#createEvent(element, eventType, this.#determineEventDetailProperties(propPath, "property"), null, data);
                //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, this.state(property), nestedEvent);
            }
            else
            {
                let nestedEvent = this.#createEvent(target, eventType, this.#determineEventDetailProperties(propPath, "property"), null, data);
                event = this.#createEvent(element, eventType, this.#determineEventDetailProperties(modelPath, "model"), nestedEvent.detail, data);
            }
            for(let executer of modelExecuters.get(modelPath))
            {
                try{
                    executer.handler(executer.arg, event.detail);
                }
                catch(error) {
                    console.error(error);
                }
            }
        }
    }

    #createEvent(target:HTMLElement, eventType:HydrateEventType, properties:HydrateEventDetailProperties, nested:any, data:any) {
        switch(eventType)
        {
            case "bind":
            case "set":
            case "unbind":
            {
                let detail = new HydrateModelEventDetails(this, target, eventType, properties, nested);
                return new HydrateModelEvent(detail);
            }
            case "input":
            {
                let detail = new HydrateElementInputEventDetails(this, target, eventType, properties, data);
                return new HydrateElementInputEvent(detail);
            }
            case "routing.start":
            case "routing.resolve":
            case "routing.reject":
            {
                let detail = new HydrateRouteEventDetails(this, target, eventType, properties, data);
                return new HydrateRouteEvent(detail);
            }
            case "track":
            case "untrack":
            {
                let detail = new HydrateElementTrackingEventDetails(this, target, eventType, properties);
                return new HydrateElementTrackingEvent(detail);
            }
            case "mutation.target.attribute":
            case "mutation.target.characterdata":
            case "mutation.target.added":
            case "mutation.target.removed":
            case "mutation.parent.attribute":
            case "mutation.parent.characterdata":
            case "mutation.parent.added":
            case "mutation.parent.removed":
            case "mutation.child.attribute":
            case "mutation.child.characterdata":
            case "mutation.child.added":
            case "mutation.child.removed":
            {
                let detail = new HydrateElementMutationEventDetails(this, target, eventType, properties, data);
                return new HydrateElementMutationEvent(detail);
            }
            case "on":
            {
                let detail = new HydrateElementEventListenerEventDetails(this, target, eventType, properties, data);
                return new HydrateElementEventListenerEvent(detail);
            }
        }
    }

    #determineEventDetailProperties(path:string, type:"property"|"model"):HydrateEventDetailProperties {
        let index = path != null ? path.lastIndexOf(".") : -1;
        let propName = type === "model" || index < 0 ? undefined : path.substring(index + 1);
        let propPath = type === "model" || index < 0 ? undefined : path;

        let modelPath = type === "model" || index < 0 ? path : path.substring(0, index);
        index = modelPath != null ? modelPath.lastIndexOf(".") : -1;
        let modelName = index < 0 ? modelPath : modelPath.substring(index + 1);

        index = modelPath != null ? modelPath.lastIndexOf(".") : -1;
        let parentPath = index < 0 ? null : modelPath.substring(0, index);
        index = parentPath != null ? parentPath.lastIndexOf(".") : -1;
        let parentName = index < 0 ? parentPath : parentPath.substring(index + 1);

        index = modelPath != null ? modelPath.indexOf(".") : -1;
        let baseName = index < 0 ? modelPath : modelPath.substring(0, index);

        return {
            propName,
            propPath,
            modelPath,
            modelName,
            baseName,
            parentName,
            parentPath
        }
    }
}