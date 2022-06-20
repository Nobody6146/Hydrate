type HydrateModelEventType = 'bind' | "unbind" | 'set' | 'callback' | 'function' | 'handler' | 'initialize' | 'route' | "tracked"/*when element first is tracked by framework*/;
type HydrateModelEventHandler = (arg:HydrateAttributeArgument, modelEvent:HydrateModelEvent) => Promise<boolean>;
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

class HydrateModelEvent {
    hydrate: HydrateApp;
    target: HTMLElement;
    type: HydrateModelEventType;

    baseName:string;
    base:any;

    model:any;
    modelName: string;
    modelPath:string;

    #state: any;
    #previousState: any;

    propName:string;
    propPath:string;

    nestedEvent:HydrateModelEvent;

    constructor(hydrate:HydrateApp, target:HTMLElement, eventType:HydrateModelEventType, propPath:string, previousState:any, nestedEvent:HydrateModelEvent) {
        this.hydrate = hydrate;
        this.target = target;
        this.type = eventType;

        let index = propPath.lastIndexOf(".");
        this.propPath = propPath;
        this.propName = index < 0 ? null : propPath.substring(index + 1);

        this.modelPath = index < 0 ? propPath : propPath.substring(0, index);
        index = this.modelPath.lastIndexOf(".");
        this.modelName = index < 0 ? null : this.modelPath.substring(index + 1);
        this.model = hydrate.model(this.modelPath);

        index = this.modelPath.indexOf(".");
        this.baseName = index < 0 ? this.modelPath : this.modelPath.substring(0, index);
        this.base = hydrate.model(this.baseName);
        
        this.#state = hydrate.state(this.base);
        this.#previousState = previousState;

        this.nestedEvent = nestedEvent;
    }

    get prop() {
        return this.state(this.propPath);
    }
    state(propPath?:string) {
        return this.#resolveValue(this.#state, propPath);
    }
    previousState(propPath?:string) {
        return this.#resolveValue(this.#previousState, propPath);
    }
    #resolveValue(startValue:any, propPath?:string) {
        if(propPath == null || propPath.trim() === "")
            propPath = this.baseName;
        let index = propPath.indexOf(".");
        return this.hydrate.resolveValue(startValue, index < 0 ? propPath : propPath.substring(index + 1));
    }
}

class HydrateApp {

    #options:HydrateAppOptions;
    #htmlExcecuters: Map<HTMLElement, Map<HydrateModelEventType, Map<string, HydrateModelEventExecuter[]>>>; //element name -> event type -> model.prop -> callbacks
    #root:HTMLElement;
    #models:object;

    constructor(options?:HydrateAppOptions) {
        
        this.#options = options ?? new HydrateAppOptions();
        this.#htmlExcecuters = new Map();
        this.#root = document.querySelector(this.#options.dom.rootSelector);
        this.#models = {};

        this.#addStandardAttributeHandlers();
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

    resolveValue(startValue:any, propPath:string) {
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
            model = this.#models[model];
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.stateProperty];
    }
    model(path:string) {
        if(path == null)
            return undefined;
        path = path.trim();
        if(path === "")
            return undefined;
        return this.resolveValue(this.#models, path);
    }
    base(model:string | any) {
        if(typeof model === "string")
            model = this.#models[model];
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.baseProperty]; 
    }
    parent(model:string | any) {
        if(typeof model === "string")
            model = this.#models[model];
        if(model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.parentProperty];
    }
    name(model:string | any) {
        if(typeof model === "string")
            model = this.#models[model];
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
            let promise = this.#dispatch(this.#root, "bind", name, true, undefined);
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

        let baseName = this.base(model);
        if(baseName == undefined)
            return;// Promise.reject("model not found");
        let promise = this.#dispatch(this.#root, "unbind", baseName, true,  this.state(model));
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
                    return parent;
                if(prop === app.#options.model.baseProperty)
                    return baseName;
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
                //let previousValue = obj[prop];
                obj[prop] = value;
                models = {};

                //Don't allow DOM update to trigger if value is up-to-date or this model is no longer bound
                if(app.model(name) !== proxy) {
                    return true;
                }
                let previousValue = app.state(app.base(proxy));
                // if(!obj.propertyIsEnumerable(prop))
                //     return;
                let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
                //app.dispatch("set", proxy, propName, previousValue, app.root, "all");
                app.#dispatch(app.#root, "set", name + "." + propName, true, previousValue);
                return true;
            },
            deleteProperty: function(obj, prop) {
                if (prop in obj) {
                    //let previousValue = obj[prop];
                    let previousValue = app.state(app.base(proxy));
                    delete obj[prop];
                    if(models[prop] != undefined)
                        delete models[prop];
                    let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
                    //app.dispatch("unbind", proxy, propName, property, app.root, "all");
                    app.#dispatch(app.#root, "unbind", name + "." + propName, true, previousValue);
                }
                return true;
            }
        });

        return proxy;
    }

    #addStandardAttributeHandlers () {
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.property), (arg:HydrateAttributeArgument, modelEvent:HydrateModelEvent) => {
            let value = modelEvent.hydrate.resolveArgumentValue(arg.arg3, modelEvent);
            if(value === undefined)
                return;
            if(modelEvent.target[arg.arg2] === value)
                return Promise.resolve(false);
            modelEvent.target[arg.arg2] = value;
            return Promise.resolve(true);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.attribute), (arg:HydrateAttributeArgument, modelEvent:HydrateModelEvent) => {
            let value = modelEvent.hydrate.resolveArgumentValue(arg.arg3, modelEvent);
            if(value === undefined)
                return;
            if(modelEvent.target.getAttribute(arg.arg2) === value)
                return Promise.resolve(false);
            modelEvent.target.setAttribute(arg.arg2, value);
            return Promise.resolve(true);
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

    resolveArgumentValue(expression:string, event:HydrateModelEvent) {
        if(expression == null || expression.trim() === "")
            return event.prop;
        //TODO: finish trying to resolve values
        return event.prop;
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

    async #trackElement(element:HTMLElement):Promise<void> {
        let selector = this.#trackableElementSelector;
        if(!element.matches(selector))
        {
            this.#untrackElement(element);
            return;
        }
        let elementEexecuters = this.#updateExecuters(element);
        let promises:Promise<boolean>[] = [];
        let propertyExecuters = elementEexecuters.get("bind");
        if(propertyExecuters === undefined)
            return Promise.resolve();
        Promise.all
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

    async #dispatch(target:HTMLElement, eventType:HydrateModelEventType, propPath:string, nested:boolean, previousState:any) {
        let elements = this.#getTrackableElements(target);
        let elementExecuters = this.#getExcecuters(eventType, elements, propPath, nested);
        for(let element of elements)
        {
            let propertyExecuters = elementExecuters.get(element);
            for(let property of propertyExecuters.keys())
            {
                // let nameIndex = property.indexOf(".");
                // let rootModelName = nameIndex < 0 ? property : property.substring(0, nameIndex);
                // let state = this.state(rootModelName);
                let nestedEvent = propPath.startsWith(property)
                    ? new HydrateModelEvent(this, element, eventType, propPath, previousState, null)
                    : null;
                let modelEvent = new HydrateModelEvent(this, element, eventType, property, previousState, nestedEvent);
                for(let executer of propertyExecuters.get(property))
                    await executer.handler(executer.arg, modelEvent);
            }
        }
    }

    #untrackElement(element:HTMLElement) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if(elementExecuters === undefined) 
            return;
        this.#htmlExcecuters.delete(element);
    }    

    #updateExecuters(element:HTMLElement):Map<HydrateModelEventType, Map<string, HydrateModelEventExecuter[]>> {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if(elementExecuters === undefined) 
        {
            elementExecuters = new Map();
            this.#htmlExcecuters.set(element, elementExecuters);
        }
        else {
            elementExecuters.clear();
        }
    
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        let modelPath = element.getAttribute(modelAttribute);
        this.#addSetPropertyHandler(element, modelPath);
        this.#addSetAttributeHandler(element, modelPath);
        return elementExecuters;
    }

    #addExecuter(element:HTMLElement, eventType:HydrateModelEventType, fullPropName:string, arg:HydrateAttributeArgument, handler:HydrateModelEventHandler):void {
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

    #getExcecuters(eventType:HydrateModelEventType, targets:HTMLElement[]=[], propPath:string=undefined, nested:boolean=false):Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> {
        let results:Map<HTMLElement, Map<string, HydrateModelEventExecuter[]>> = new Map();
        let filterProps = propPath != undefined && propPath.trim() != "";
        for(let element of this.#htmlExcecuters.keys())
        {
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
                    if(nested)
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
}