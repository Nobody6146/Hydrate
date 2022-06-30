type HydrateModelEventHandler = (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => void;
type HydrateModelEventExecuter = {arg:HydrateAttributeArgument, handler:HydrateModelEventHandler};

class HydrateAppOptions {

    dom:HydrateDomOptions;
    model:HydrateModelOptions;
    attribute:HydrateAttributeOptions;

    constructor() {
        this.dom = new HydrateDomOptions();
        this.model = new HydrateModelOptions();
        this.attribute = new HydrateAttributeOptions();
    }
}

class HydrateDomOptions {
    rootSelector:string = "body";
}

class HydrateModelOptions {
    baseProperty = "__base";
    parentProperty = "__parent";
    nameProperty = "__name";
    stateProperty = "__state";
}

class HydrateAttributeOptions
{
    names = new HydrateAttributeNamesOptions();
    handlers = new Map<string, HydrateModelEventHandler>();
    standardPrefix = "h";
    customPrefix = "hc";
    trackables:string[] = []

    constructor() {
    }
}

class HydrateAttributeNamesOptions
{
    //Linking
    model = "model";
    mock = "mock";
    nested = "nested";//Will also respond to nested property changes

    //Basic element manipulation
    property = "property";
    attribute = "attribute";
    toggle = "toggle"; //Toggles an attribute
    class = "class"; //Toggles the inclusion of a class to an element
    delete = "delete"; //removes an element

    //Binding
    input = "input";
    mutation = "mutation";

    //Conditionals
    event = "event";
    static = "static"; //Executes once
    condition = "condition";

    //Functions and execution
    callback = "callback"; //Calls a property function
    handler = "handler"; //Fires a callback when the "on" event of the element is fired

    //Templating and Components
    script = "script";
    template = "template"; //template changes queries user of the templates then regenerate
    initialize = "initialize" //script called on creation of template to initialize component
    component = "component"; //="[PROP] [TEMPLATE] [property | model | array | dictionary | map]?

    //Routing
    route = "route"; //Make element only respond to route request
    page = "page"; //Tells component how page should be inserted

    //Timing
    delay = "delay";
    debounce = "debounce";
    throttle = "throttle";

    customs:string[] = []; 
}

class HydrateAttributeArgument {
    arg1: string;
    arg2: string;
    arg3: string;

    constructor(arg1, arg2, arg3) {
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.arg3 = arg3;
    }
}

type HydrateEventType = 'track' | 'untrack' | 'bind' | "unbind" | 'set' | "route" | 'callback' | 'function' | 'handler' | 'initialize' | 'route' | "mutation"
interface HydrateEventDetailProperties {
    propPath:string;
    propName:string;
    modelPath:string;
    modelName:string;
    baseName:string;
}

class HydrateElementTrackingEvent extends CustomEvent<HydrateElementTrackingEventDetails> {

    constructor(detail:HydrateElementTrackingEventDetails) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateModelEvent extends CustomEvent<HydrateModelEventDetails> {

    constructor(detail:HydrateModelEventDetails) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateRouteEvent extends CustomEvent<HydrateModelEventDetails> {

    constructor(detail:HydrateModelEventDetails) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}

class HydrateElementTrackingEventDetails
{
    hydrate: HydrateApp;
    element: HTMLElement;
    type: HydrateEventType;

    baseName:string;

    modelName: string;
    modelPath:string;

    propName:string;
    propPath:string;
    previousValue:any;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, baseName:string, modelName:string, modelPath:string, propName:string, propPath:string, previousValue:any, nested:HydrateModelEventDetails) {
        this.hydrate = hydrate;
        this.element = element;
        this.type = eventType;

        this.baseName = baseName;

        this.modelPath = modelPath;
        this.modelName = modelName;

        this.propPath = propPath;
        this.propName = propName;
        this.previousValue = previousValue;
    }

    get base() {
        return this.hydrate.model(this.baseName);
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

class HydrateModelEventDetails {
    hydrate: HydrateApp;
    element: HTMLElement;
    type: HydrateEventType;

    baseName:string;

    modelName: string;
    modelPath:string;

    propName:string;
    propPath:string;
    previousValue:any;

    nested:HydrateModelEventDetails;

    constructor(hydrate:HydrateApp, element:HTMLElement, eventType:HydrateEventType, baseName:string, modelName:string, modelPath:string, propName:string, propPath:string, previousValue:any, nested:HydrateModelEventDetails) {
        this.hydrate = hydrate;
        this.element = element;
        this.type = eventType;

        this.baseName = baseName;

        this.modelPath = modelPath;
        this.modelName = modelName;

        this.propPath = propPath;
        this.propName = propName;
        this.previousValue = previousValue;

        this.nested = nested;
    }

    get base() {
        return this.hydrate.model(this.baseName);
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

class HydrateApp {

    #options:HydrateAppOptions;
    #htmlExcecuters: Map<HTMLElement, Map<HydrateEventType, Map<string, HydrateModelEventExecuter[]>>>; //element name -> event type -> model.prop -> callbacks
    #root:HTMLElement;
    #models:object;

    #observer : MutationObserver;

    constructor(options?:HydrateAppOptions) {
        
        this.#options = options ?? new HydrateAppOptions();
        this.#htmlExcecuters = new Map();
        this.#root = document.querySelector(this.#options.dom.rootSelector);
        this.#models = {};

        this.#addTrackableAttributes();
        this.#addStandardAttributeHandlers();

        this.#observer = new MutationObserver(this.#mutationCallback.bind(this));
        this.#observer.observe(this.root, <MutationObserverInit>{
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [...this.#options.attribute.trackables],
        });
        this.root.addEventListener("input", this.#inputListener.bind(this));
        
        this.#trackElements();
    }

    get root():HTMLElement {
        return this.#root;
    }
    get options():HydrateAppOptions {
        return this.#options;
    }
    get exectuers() {
        return this.#htmlExcecuters;
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
            if(!this.#options.attribute.names.customs.includes(name))
                return undefined;
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
        if(name == null)
            name = "";
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
        let promise = this.#dispatch(this.#root, "unbind", baseName, this.state(model));
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
                let previousValue = obj[prop];
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
                app.#dispatch(app.#root, "set", name + "." + propName, previousValue);

                //TODO IMMEDIATELY WORKING ON
                //Change previous state to only store previous prop state
                //Only way to gaurentee a true "copy" and really the only useful part

                return true;
            },
            deleteProperty: function(obj, prop) {
                if (prop in obj) {
                    let previousValue = obj[prop];

                    delete obj[prop];
                    if(models[prop] != undefined)
                        delete models[prop];
                    let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
                    //app.dispatch("unbind", proxy, propName, property, app.root, "all");
                    app.#dispatch(app.#root, "unbind", name + "." + propName, previousValue);
                }
                return true;
            }
        });

        return proxy;
    }
    #mutationCallback(mutations:MutationRecord[], observer:MutationObserver) {
        let updatedElements:HTMLElement[] = [];
        this.#trackableElementSelector
        const trackableSelector = this.#trackableElementSelector;

        let trackableElements = new Set<HTMLElement>();
        let untrackableElements = new Set<HTMLElement>();

        mutations.forEach(mutation => {
            if(!(mutation.target instanceof HTMLElement))
                return;
            const target = mutation.target;
            switch(mutation.type)
            {
                case "attributes":
                {
                    if(mutation.target.matches(trackableSelector))
                        trackableElements.add(mutation.target);
                    else
                        untrackableElements.add(mutation.target);
                }
                case "childList":
                {
                    mutation.addedNodes.forEach(node => {
                        if(!(node instanceof HTMLElement))
                            return;
                        trackableElements.add(node);
                    });
                    for(let node of mutation.removedNodes)
                    {
                        if(!(node instanceof HTMLElement))
                            return;
                        untrackableElements.add(node);
                    }
                }
            }
        });

        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        //Update each element
        for(let element of untrackableElements) {
            this.#untrackElement(element);
        }
        for(let element of trackableElements) {
            this.#trackElement(element);
            let modelName = element.getAttribute(modelAttribute);
            this.#dispatch(element, "bind", modelName, this.state(modelName));
        }
    }
    #inputListener(event:InputEvent) {
        let target = event.target as HTMLElement;
        if(!target.matches(this.#trackableElementSelector))
            return;
        let modelName = target.getAttribute(this.attribute(this.#options.attribute.names.model));
        let inputs = this.#parseAttributeArguments(target, this.attribute(this.#options.attribute.names.input));
        if(modelName == null || inputs.length === 0)
            return;
        for(let i = 0; i < inputs.length; i++)
        {
            let arg = inputs[i];
            let model = this.model(modelName);
            if(model == null || !(model instanceof Object))
                continue;
            let propName = arg.arg1;
            let propPath = modelName + "." + propName;
            if(propPath == null)
                continue;
            let inputPropName = arg.arg2;
            if(inputPropName == null)
                continue;
            let inputProp = target[inputPropName];
            let prop = this.resolveArgumentValue(arg.arg3, inputProp);
            if(this.state(model)[propName] === prop)
                continue;
            model[propName] = prop;
        }
    }

    #addTrackableAttributes() {
        this.#options.attribute.trackables.push(
            this.attribute(this.#options.attribute.names.property),
            this.attribute(this.#options.attribute.names.model),
            this.attribute(this.#options.attribute.names.attribute),
            this.attribute(this.#options.attribute.names.property),
            this.attribute(this.#options.attribute.names.toggle),
            this.attribute(this.#options.attribute.names.class),
            this.attribute(this.#options.attribute.names.delete),
            this.attribute(this.#options.attribute.names.event),
            this.attribute(this.#options.attribute.names.static),
            this.attribute(this.#options.attribute.names.condition),
            this.attribute(this.#options.attribute.names.callback),
            this.attribute(this.#options.attribute.names.handler),
            this.attribute(this.#options.attribute.names.component),
            this.attribute(this.#options.attribute.names.route),
            this.attribute(this.#options.attribute.names.page),
        );
        let app = this;
        this.#options.attribute.trackables.push(...this.#options.attribute.names.customs.map(x => app.attribute(x)));
    }

    #addStandardAttributeHandlers () {
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.property), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            let value = eventDetails.hydrate.resolveArgumentValue(arg.arg3, eventDetails.prop);
            if(value === undefined)
                return;
            if(eventDetails.element[arg.arg2] === value)
                return;
            eventDetails.element[arg.arg2] = value;
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.attribute), (arg:HydrateAttributeArgument, eventDetails:HydrateModelEventDetails) => {
            let value = eventDetails.hydrate.resolveArgumentValue(arg.arg3, eventDetails.prop);
            if(value === undefined)
                return;
            if(eventDetails.element.getAttribute(arg.arg2) === value)
                return;
            eventDetails.element.setAttribute(arg.arg2, value);
            return;
        });
    }

    #addSetPropertyHandler(element:HTMLElement, modelPath:string) {
        let attribute = this.attribute(this.#options.attribute.names.property);
        if(element.hasAttribute(attribute))
        {
            let args = this.#parseAttributeArguments(element, attribute);
            let handler = this.#getHandlerFunction(attribute);
            for(let arg of args)
            {
                let propertyPath = `${modelPath}.${arg.arg1}`;
                this.#addExecuter(element, "bind", propertyPath, arg, handler);
                this.#addExecuter(element, "set", propertyPath, arg, handler);
            } 
        }
    }

    #addSetAttributeHandler(element:HTMLElement, modelPath:string) {
        let attribute = this.attribute(this.#options.attribute.names.attribute);
        if(element.hasAttribute(attribute))
        {
            let args = this.#parseAttributeArguments(element, attribute);
            let handler = this.#getHandlerFunction(attribute);
            for(let arg of args)
            {
                let propertyPath = `${modelPath}.${arg.arg1}`;
                this.#addExecuter(element, "bind", propertyPath, arg, handler);
                this.#addExecuter(element, "set", propertyPath, arg, handler);
            } 
        }
    }

    resolveArgumentValue(expression:string, prop:any) {
        if(expression == null || expression.trim() === "")
            return prop;
        //TODO: finish trying to resolve values
        return prop;
    }

    #parseAttributeArguments(element:HTMLElement, name:string):HydrateAttributeArgument[] {
        if(!element.hasAttribute(name))
            return [];
        //return value.split(/({{.+}})?;/).filter(x => x !== undefined).map(x => { 
        return element.getAttribute(name).trim().split(';').map(x => { 
            //return x.trim().split(/\s+/)
            let baseParams = x.trim();
            //splits on two whitespaces: "[model_prop] [el_prop] [THIRD_PARAM]"
            let regParams = baseParams.match(/[^\s]+\s+[^\s]+\s+/);
            if(!regParams)
            {
                let args = baseParams.split(/\s+/);
                return new HydrateAttributeArgument(args[0], args[1], undefined);
            }
            //We have a 3rd argument for a replacement/insertion value to stick into arg 2 field
            let result = baseParams.split(/\s+/);
            return new HydrateAttributeArgument(result[0], result[1], baseParams.substring(regParams[0].length));
        });
    }

    #getHandlerFunction(attribute:string) {
        return this.#options.attribute.handlers.get(attribute);
    }

    #trackElements() {
        let elements = this.#getTrackableElements()
        for(let element of elements)
            this.#trackElement(element);
    }

    #trackElement(element:HTMLElement):void {
        let selector = this.#trackableElementSelector;
        if(!element.matches(selector))
        {
            this.#untrackElement(element);
            return;
        }

        if(this.#updateExecuters(element))
        {
            //Send a track event
            let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
            let state = modelName === undefined ? undefined : this.state(modelName);
            this.#dispatch(element, "track", modelName, state);
        }
    }

    #untrackElement(element:HTMLElement) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if(elementExecuters === undefined) 
            return;
        
        //Send an untrack event
        let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
        let state = modelName === undefined ? undefined : this.state(modelName);
        if(this.#dispatch(element, "untrack", modelName, state))
            return;
        //Allow the element not to detach if we prevented the default behavior
        this.#htmlExcecuters.delete(element);
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
        this.#addSetPropertyHandler(element, modelPath);
        this.#addSetAttributeHandler(element, modelPath);
        return created;
    }

    #addExecuter(element:HTMLElement, eventType:HydrateEventType, fullPropName:string, arg:HydrateAttributeArgument, handler:HydrateModelEventHandler):void {
        let elementExecuters = this.#htmlExcecuters.get(element);
        
        let eventExecuters = elementExecuters.get(eventType);
        if(eventExecuters === undefined) 
        {
            eventExecuters = new Map();
            elementExecuters.set(eventType, eventExecuters);
        }
        let propertyExecuters = eventExecuters.get(fullPropName);
        if(propertyExecuters === undefined) 
        {
            propertyExecuters = [];
            eventExecuters.set(fullPropName, propertyExecuters);
        }
        propertyExecuters.push({
            arg: arg,
            handler: handler
        });
    }

    #getTrackableElements(target?:HTMLElement) {
        if(target == null)
            target = this.#root;
        let selector = this.#trackableElementSelector;
        let elements:HTMLElement[] = [];
        if(target.matches(selector))
            elements.push(target);
        return elements.concat([...this.#root.querySelectorAll<HTMLElement>(selector)]);
    }

    get #trackableElementSelector() {
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        return `[${modelAttribute}]`;
    }

    #getExcecuters(eventType:HydrateEventType, targets:HTMLElement[]=[], propPath:string=undefined):Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> {
        let results:Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> = new Map();
        let filterProps = propPath != undefined && propPath.trim() != "";
        for(let element of this.#htmlExcecuters.keys())
        {
            let nested = element.hasAttribute(this.attribute(this.#options.attribute.names.nested));
            if(targets != null && targets.length > 0 && !targets.includes(element))
                continue;
            let eventExecuters = this.#htmlExcecuters.get(element).get(eventType);
            if(eventExecuters === undefined || eventExecuters.size === 0)
                continue;
            let exectuers:Map<string, HydrateModelEventExecuter[]> = new Map();
            if(filterProps)
            {
                for(let property of eventExecuters.keys())
                {
                    //if(nested)
                    if(property !== propPath && !property.startsWith(propPath) && (!nested || !propPath.startsWith(property)))
                        continue;
                    let propertyExecuters = eventExecuters.get(property);
                    if(propertyExecuters === undefined || propertyExecuters.length === 0)
                        continue;
                    exectuers.set(property, propertyExecuters);
                }
            }
            else
            {
                for(let property of eventExecuters.keys())
                    exectuers.set(property, eventExecuters.get(propPath));
            }
            results.set(element, exectuers);
        }
        //TODO: filter out any conditionals, static, etc.

        return results;
    }

    #dispatch(target:HTMLElement, eventType:HydrateEventType, propPath:string, previousValue:any):boolean {
        let listenerEvent = this.#createEvent(target, eventType, previousValue, this.#determineEventDetailProperties(propPath), null);
        let dispatchElement = target.isConnected ? target : this.#root;
        dispatchElement.dispatchEvent(listenerEvent);
        if(listenerEvent.defaultPrevented)
            return true;
        
        let elements = this.#getTrackableElements(target);
        let elementExecuters = this.#getExcecuters(eventType, elements, propPath);
        for(let element of elementExecuters.keys())
        {
            let propertyExecuters = elementExecuters.get(element);
            for(let property of propertyExecuters.keys())
            {
                // let nameIndex = property.indexOf(".");
                // let rootModelName = nameIndex < 0 ? property : property.substring(0, nameIndex);
                // let state = this.state(rootModelName);
                let event:any;
                if(propPath !== property && propPath.startsWith(property))
                {
                    let nestedEvent = this.#createEvent(target, eventType, previousValue, this.#determineEventDetailProperties(propPath), null);
                    event = this.#createEvent(element, eventType, this.state(property), this.#determineEventDetailProperties(property), nestedEvent.detail);
                    //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, this.state(property), nestedEvent);
                }
                else
                {
                    event = this.#createEvent(element, eventType, previousValue, this.#determineEventDetailProperties(property), null);
                    //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, previousValue, null);
                }
                for(let executer of propertyExecuters.get(property))
                    executer.handler(executer.arg, event.detail);
            }
        }

        return listenerEvent.defaultPrevented;
    }

    #createEvent(target:HTMLElement, eventType:HydrateEventType, previousValue:any, properties:HydrateEventDetailProperties, nested) {
        switch(eventType)
        {
            case "bind":
            case "set":
            case "unbind":
            {
                let detail = new HydrateModelEventDetails(this, target, eventType, properties.baseName, properties.modelName,
                    properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                return new HydrateModelEvent(detail);
            }
            case "route":
            {
                let detail = new HydrateModelEventDetails(this, target, eventType, properties.baseName, properties.modelName,
                    properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                return new HydrateRouteEvent(detail);
            }
            case "track":
            case "untrack":
            {
                let detail = new HydrateElementTrackingEventDetails(this, target, eventType, properties.baseName, properties.modelName,
                    properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                return new HydrateElementTrackingEvent(detail);
            }
        }
    }

    #determineEventDetailProperties(path:string):HydrateEventDetailProperties {
        let index = path != null ? path.lastIndexOf(".") : -1;
        let propName = index < 0 ? undefined : path.substring(index + 1);
        let propPath = index < 0 ? undefined : path;

        let modelPath = index < 0 ? path : path.substring(0, index);
        index = modelPath != null ? modelPath.lastIndexOf(".") : -1;
        let modelName = index < 0 ? modelPath : modelPath.substring(index + 1);

        index = modelPath != null ? modelPath.indexOf(".") : -1;
        let baseName = index < 0 ? modelPath : modelPath.substring(0, index);

        return {
            propName,
            propPath,
            modelPath,
            modelName,
            baseName
        }
    }
}