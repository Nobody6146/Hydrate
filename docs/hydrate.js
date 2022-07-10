class HydrateAppOptions {
    dom;
    model;
    attribute;
    constructor() {
        this.dom = new HydrateDomOptions();
        this.model = new HydrateModelOptions();
        this.attribute = new HydrateAttributeOptions();
    }
}
class HydrateDomOptions {
    rootSelector = "body";
}
class HydrateModelOptions {
    baseProperty = "__base";
    parentProperty = "__parent";
    nameProperty = "__name";
    stateProperty = "__state";
}
class HydrateAttributeOptions {
    names = new HydrateAttributeNamesOptions();
    handlers = new Map();
    standardPrefix = "h";
    customPrefix = "hc";
    trackables = [];
    constructor() {
    }
}
class HydrateAttributeNamesOptions {
    //Linking
    model = "model";
    mock = "mock";
    nested = "nested"; //Will also respond to nested property changes
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
    initialize = "initialize"; //script called on creation of template to initialize component
    component = "component"; //="[PROP] [TEMPLATE] [property | model | array | dictionary | map]?
    //Routing
    route = "route"; //Make element only respond to route request
    page = "page"; //Tells component how page should be inserted
    //Timing
    delay = "delay";
    debounce = "debounce";
    throttle = "throttle";
    customs = [];
}
class HydrateElementTrackingEvent extends CustomEvent {
    constructor(detail) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}
class HydrateModelEvent extends CustomEvent {
    constructor(detail) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}
class HydrateRouteEvent extends CustomEvent {
    constructor(detail) {
        super(`hydrate:${detail.type}`, {
            detail: detail,
            bubbles: true
        });
    }
}
class HydrateElementTrackingEventDetails {
    hydrate;
    element;
    type;
    baseName;
    modelName;
    modelPath;
    propName;
    propPath;
    previousValue;
    constructor(hydrate, element, eventType, baseName, modelName, modelPath, propName, propPath, previousValue, nested) {
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
    hydrate;
    element;
    type;
    baseName;
    modelName;
    modelPath;
    propName;
    propPath;
    previousValue;
    nested;
    constructor(hydrate, element, eventType, baseName, modelName, modelPath, propName, propPath, previousValue, nested) {
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
    #options;
    #htmlExcecuters; //element name -> event type -> model.prop -> callbacks
    #root;
    #models;
    #observer;
    constructor(options) {
        this.#options = options ?? new HydrateAppOptions();
        this.#htmlExcecuters = new Map();
        this.#root = document.querySelector(this.#options.dom.rootSelector);
        this.#models = {};
        this.#addTrackableAttributes();
        this.#addStandardAttributeHandlers();
        this.#observer = new MutationObserver(this.#mutationCallback.bind(this));
        this.#observer.observe(this.root, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [...this.#options.attribute.trackables],
        });
        this.root.addEventListener("input", this.#inputListener.bind(this));
        this.#trackElements();
    }
    get root() {
        return this.#root;
    }
    get options() {
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
    attribute(name) {
        let key = this.#options.attribute.names[name];
        if (key === undefined || name === "customs") {
            if (!this.#options.attribute.names.customs.includes(name))
                return undefined;
            return `${this.#options.attribute.customPrefix}-${name}`;
        }
        return `${this.#options.attribute.standardPrefix}-${key}`;
    }
    resolveObjectValue(startValue, propPath) {
        let nameParts = propPath.split(".");
        let state = startValue;
        for (let i = 0; i < nameParts.length; i++) {
            if (!(state instanceof Object))
                return undefined;
            state = state[nameParts[i]];
        }
        return state;
    }
    state(model) {
        if (typeof model === "string")
            model = this.model(model);
        if (model == undefined || !(model instanceof Object))
            return model;
        return model[this.options.model.stateProperty];
    }
    model(path) {
        if (path == null)
            return undefined;
        path = path.trim();
        if (path === "")
            return undefined;
        return this.resolveObjectValue(this.#models, path);
    }
    base(model) {
        if (typeof model === "string")
            model = this.model(model);
        if (model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.baseProperty];
    }
    parent(model) {
        if (typeof model === "string")
            model = this.model(model);
        if (model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.parentProperty];
    }
    name(model) {
        if (typeof model === "string")
            model = this.model(model);
        if (model == undefined || !(model instanceof Object))
            return undefined;
        return model[this.options.model.nameProperty];
    }
    /** Bind a new model to the framework */
    bind(name, state) {
        if (name == null)
            name = "";
        if (state == null)
            state = {};
        //TODO: check to make sure the name is a proper identifier
        let app = this;
        //return new Promise(async (resolve, reject) => {
        //If this model already exist, unbind it first
        if (this.#models[name] != undefined)
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
    unbind(search) {
        let model = typeof search === "string"
            ? this.model(search)
            : search;
        if (model == undefined)
            return; //Promise.reject("model not found");
        let baseName = this.name(this.base(model));
        if (baseName == undefined)
            return; // Promise.reject("model not found");
        let promise = this.#dispatch(this.#root, "unbind", baseName, this.state(model));
        delete this.#models[baseName];
        //return await promise;
    }
    #makeProxy(data, name, parent) {
        const app = this;
        const baseName = parent == null ? name : parent.split(".")[0];
        let models = {};
        let proxy;
        let bindOrGet = function (obj, prop, parentName) {
            if (obj[prop] instanceof Date || !(obj[prop] instanceof Object))
                return null;
            let propName = (typeof prop === 'symbol') ? prop.toString() : prop;
            let modelName = name + "." + propName;
            let model = models[prop];
            if (model !== undefined)
                return model;
            else {
                //Make proxy
                models[prop] = app.#makeProxy(obj[prop], modelName, parentName);
                return models[prop];
            }
        };
        proxy = new Proxy(data, {
            get(obj, prop) {
                if (prop === app.#options.model.stateProperty)
                    return obj;
                if (prop === app.#options.model.nameProperty)
                    return name;
                if (prop === app.#options.model.parentProperty)
                    return app.model(parent);
                if (prop === app.#options.model.baseProperty)
                    return app.model(baseName);
                if (prop === 'toJson') {
                    if (typeof obj.toJson === 'function')
                        return obj.toJson;
                    else
                        return function () { return JSON.stringify(this); };
                }
                if (obj[prop] instanceof Object && obj[prop] != null) {
                    let model = bindOrGet(obj, prop, name);
                    //let model = null;
                    return model ? model : obj[prop];
                }
                else
                    return obj[prop];
            },
            set: function (obj, prop, value) {
                let previousValue = obj[prop];
                obj[prop] = value;
                models = {};
                //Don't allow DOM update to trigger if value is up-to-date or this model is no longer bound
                if (app.model(name) !== proxy) {
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
            deleteProperty: function (obj, prop) {
                if (prop in obj) {
                    let previousValue = obj[prop];
                    delete obj[prop];
                    if (models[prop] != undefined)
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
    #mutationCallback(mutations, observer) {
        let updatedElements = [];
        this.#trackableElementSelector;
        const trackableSelector = this.#trackableElementSelector;
        let trackableElements = new Set();
        let untrackableElements = new Set();
        mutations.forEach(mutation => {
            if (!(mutation.target instanceof HTMLElement))
                return;
            const target = mutation.target;
            switch (mutation.type) {
                case "attributes":
                    {
                        if (mutation.target.matches(trackableSelector))
                            trackableElements.add(mutation.target);
                        else
                            untrackableElements.add(mutation.target);
                    }
                case "childList":
                    {
                        mutation.addedNodes.forEach(node => {
                            if (!(node instanceof HTMLElement))
                                return;
                            trackableElements.add(node);
                        });
                        for (let node of mutation.removedNodes) {
                            if (!(node instanceof HTMLElement))
                                return;
                            untrackableElements.add(node);
                        }
                    }
            }
        });
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        //Update each element
        for (let element of untrackableElements) {
            this.#untrackElement(element);
        }
        for (let element of trackableElements) {
            this.#trackElement(element);
            let modelName = element.getAttribute(modelAttribute);
            this.#dispatch(element, "bind", modelName, this.state(modelName));
        }
    }
    #inputListener(event) {
        let target = event.target;
        if (!target.matches(this.#trackableElementSelector))
            return;
        let modelName = target.getAttribute(this.attribute(this.#options.attribute.names.model));
        let inputs = this.parseAttributeArguments(target, this.attribute(this.#options.attribute.names.input));
        if (modelName == null || inputs.length === 0)
            return;
        let model = this.model(modelName);
        if (model == null || !(model instanceof Object))
            return;
        let state = this.state(model);
        for (let i = 0; i < inputs.length; i++) {
            //How do we want to format the input attribute?
            //this.#createEvent(target, "input", this.state())
            let arg = inputs[i];
            let propName = arg.expression;
            let value = event.target[arg.field];
            if (state[propName] === value)
                continue;
            model[propName] = value;
        }
    }
    #addTrackableAttributes() {
        this.#options.attribute.trackables.push(this.attribute(this.#options.attribute.names.property), this.attribute(this.#options.attribute.names.model), this.attribute(this.#options.attribute.names.attribute), this.attribute(this.#options.attribute.names.property), this.attribute(this.#options.attribute.names.toggle), this.attribute(this.#options.attribute.names.class), this.attribute(this.#options.attribute.names.delete), this.attribute(this.#options.attribute.names.event), this.attribute(this.#options.attribute.names.static), this.attribute(this.#options.attribute.names.condition), this.attribute(this.#options.attribute.names.callback), this.attribute(this.#options.attribute.names.handler), this.attribute(this.#options.attribute.names.component), this.attribute(this.#options.attribute.names.route), this.attribute(this.#options.attribute.names.page));
        let app = this;
        this.#options.attribute.trackables.push(...this.#options.attribute.names.customs.map(x => app.attribute(x)));
    }
    #addStandardAttributeHandlers() {
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.property), (arg, eventDetails) => {
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if (value === undefined)
                return;
            if (eventDetails.element[arg.field] === value)
                return;
            eventDetails.element[arg.field] = value;
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.attribute), (arg, eventDetails) => {
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if (value === undefined)
                return;
            if (eventDetails.element.getAttribute(arg.field) === value)
                return;
            eventDetails.element.setAttribute(arg.field, value);
            return;
        });
    }
    #addSetPropertyHandler(element, modelPath) {
        let attribute = this.attribute(this.#options.attribute.names.property);
        if (element.hasAttribute(attribute)) {
            let args = this.parseAttributeArguments(element, attribute);
            let handler = this.#getHandlerFunction(attribute);
            for (let arg of args) {
                this.#addExecuter(element, "bind", modelPath, arg, handler);
                this.#addExecuter(element, "set", modelPath, arg, handler);
            }
        }
    }
    #addSetAttributeHandler(element, modelPath) {
        let attribute = this.attribute(this.#options.attribute.names.attribute);
        if (element.hasAttribute(attribute)) {
            let args = this.parseAttributeArguments(element, attribute);
            let handler = this.#getHandlerFunction(attribute);
            for (let arg of args) {
                this.#addExecuter(element, "bind", modelPath, arg, handler);
                this.#addExecuter(element, "set", modelPath, arg, handler);
            }
        }
    }
    resolveArgumentValue(detail, arg, event) {
        let app = this;
        let functionArgs = {
            $hydrate: this,
            $element: detail.element,
            $detail: detail,
            $event: event,
            $script: function (name) {
                let selector = `[${app.attribute(app.options.attribute.names.script)}=${arg.expression}]`;
                let scriptElement = app.root.querySelector(selector);
                if (scriptElement == null)
                    return null;
                let func = new Function(`'use strict'; return ${scriptElement.textContent.trim()}`)();
                if (!(func instanceof Function))
                    return null;
                return func;
            }
        };
        var keys = Object.keys(functionArgs).concat(Object.keys(detail.state));
        var values = Object.values(functionArgs).concat(Object.values(detail.state));
        let func = new Function(...keys, `'use strict'; return ${arg.expression}`).bind(detail.state);
        return func(...values);
    }
    parseAttributeArguments(element, name) {
        if (!element.hasAttribute(name))
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
    #parseAttributeValues(expression) {
        let actions = [];
        let matchCharacters = function (pattern) {
            for (i = i + 1; i < expression.length; i++) {
                switch (expression[i]) {
                    case pattern:
                        return true;
                    case "'":
                        if (!matchCharacters("'"))
                            return false;
                        break;
                    case '"':
                        if (!matchCharacters('"'))
                            return false;
                        break;
                    case "`":
                        if (!matchCharacters("`"))
                            return false;
                        break;
                    case "{":
                        if (!matchCharacters("}"))
                            return false;
                        break;
                }
            }
            return pattern === ";";
        };
        let fieldStart = 0;
        let fieldEnd = 0;
        let i = 0;
        let searchingForExpression = false;
        for (; i < expression.length; i++) {
            switch (expression[i]) {
                case ":":
                    {
                        searchingForExpression = true;
                        break;
                    }
                default:
                    {
                        if (!searchingForExpression)
                            break;
                        if (expression[i].match(/\s/)) {
                            fieldEnd = i - 1;
                            if (!matchCharacters(";"))
                                throw new Error("invalid expression");
                            actions.push({
                                field: expression.substring(fieldStart, fieldEnd),
                                expression: expression.substring(fieldEnd + 1, i)
                            });
                            fieldStart = i + 1;
                        }
                        searchingForExpression = false;
                    }
            }
        }
        return actions;
    }
    #getHandlerFunction(attribute) {
        return this.#options.attribute.handlers.get(attribute);
    }
    #trackElements() {
        let elements = this.#getTrackableElements();
        for (let element of elements)
            this.#trackElement(element);
    }
    #trackElement(element) {
        let selector = this.#trackableElementSelector;
        if (!element.matches(selector)) {
            this.#untrackElement(element);
            return;
        }
        if (this.#updateExecuters(element)) {
            //Send a track event
            let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
            let state = modelName === undefined ? undefined : this.state(modelName);
            this.#dispatch(element, "track", modelName, state);
        }
    }
    #untrackElement(element) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if (elementExecuters === undefined)
            return;
        //Send an untrack event
        let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
        let state = modelName === undefined ? undefined : this.state(modelName);
        if (this.#dispatch(element, "untrack", modelName, state))
            return;
        //Allow the element not to detach if we prevented the default behavior
        this.#htmlExcecuters.delete(element);
    }
    #updateExecuters(element) {
        let created = false;
        let elementExecuters = this.#htmlExcecuters.get(element);
        if (elementExecuters === undefined) {
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
    #addExecuter(element, eventType, fullPropName, arg, handler) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        let eventExecuters = elementExecuters.get(eventType);
        if (eventExecuters === undefined) {
            eventExecuters = new Map();
            elementExecuters.set(eventType, eventExecuters);
        }
        let propertyExecuters = eventExecuters.get(fullPropName);
        if (propertyExecuters === undefined) {
            propertyExecuters = [];
            eventExecuters.set(fullPropName, propertyExecuters);
        }
        propertyExecuters.push({
            arg: arg,
            handler: handler
        });
    }
    #getTrackableElements(target) {
        if (target == null)
            target = this.#root;
        let selector = this.#trackableElementSelector;
        let elements = [];
        if (target.matches(selector))
            elements.push(target);
        return elements.concat([...this.#root.querySelectorAll(selector)]);
    }
    get #trackableElementSelector() {
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        return `[${modelAttribute}]`;
    }
    #getExcecuters(eventType, targets = [], propPath = undefined) {
        let results = new Map();
        let filterProps = propPath != undefined && propPath.trim() != "";
        for (let element of this.#htmlExcecuters.keys()) {
            let nested = element.hasAttribute(this.attribute(this.#options.attribute.names.nested));
            if (targets != null && targets.length > 0 && !targets.includes(element))
                continue;
            let eventExecuters = this.#htmlExcecuters.get(element).get(eventType);
            if (eventExecuters === undefined || eventExecuters.size === 0)
                continue;
            let exectuers = new Map();
            if (filterProps) {
                for (let property of eventExecuters.keys()) {
                    //if(nested)
                    if (property !== propPath && !property.startsWith(propPath) && (!nested || !propPath.startsWith(property)))
                        continue;
                    let propertyExecuters = eventExecuters.get(property);
                    if (propertyExecuters === undefined || propertyExecuters.length === 0)
                        continue;
                    exectuers.set(property, propertyExecuters);
                }
            }
            else {
                for (let property of eventExecuters.keys())
                    exectuers.set(property, eventExecuters.get(propPath));
            }
            results.set(element, exectuers);
        }
        //TODO: filter out any conditionals, static, etc.
        return results;
    }
    #dispatch(target, eventType, propPath, previousValue) {
        let listenerEvent = this.#createEvent(target, eventType, previousValue, this.#determineEventDetailProperties(propPath), null);
        let dispatchElement = target.isConnected ? target : this.#root;
        dispatchElement.dispatchEvent(listenerEvent);
        if (listenerEvent.defaultPrevented)
            return true;
        let elements = this.#getTrackableElements(target);
        let elementExecuters = this.#getExcecuters(eventType, elements, propPath);
        for (let element of elementExecuters.keys()) {
            let propertyExecuters = elementExecuters.get(element);
            for (let property of propertyExecuters.keys()) {
                // let nameIndex = property.indexOf(".");
                // let rootModelName = nameIndex < 0 ? property : property.substring(0, nameIndex);
                // let state = this.state(rootModelName);
                let event;
                if (propPath !== property && propPath.startsWith(property)) {
                    let nestedEvent = this.#createEvent(target, eventType, previousValue, this.#determineEventDetailProperties(propPath), null);
                    event = this.#createEvent(element, eventType, this.state(property), this.#determineEventDetailProperties(property), nestedEvent.detail);
                    //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, this.state(property), nestedEvent);
                }
                else {
                    event = this.#createEvent(element, eventType, previousValue, this.#determineEventDetailProperties(property), null);
                    //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, previousValue, null);
                }
                for (let executer of propertyExecuters.get(property)) {
                    try {
                        executer.handler(executer.arg, event.detail);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        return listenerEvent.defaultPrevented;
    }
    #createEvent(target, eventType, previousValue, properties, nested) {
        switch (eventType) {
            case "bind":
            case "set":
            case "unbind":
            case "input":
                {
                    let detail = new HydrateModelEventDetails(this, target, eventType, properties.baseName, properties.modelName, properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                    return new HydrateModelEvent(detail);
                }
            case "route":
                {
                    let detail = new HydrateModelEventDetails(this, target, eventType, properties.baseName, properties.modelName, properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                    return new HydrateRouteEvent(detail);
                }
            case "track":
            case "untrack":
                {
                    let detail = new HydrateElementTrackingEventDetails(this, target, eventType, properties.baseName, properties.modelName, properties.modelPath, properties.propName, properties.propPath, previousValue, nested);
                    return new HydrateElementTrackingEvent(detail);
                }
        }
    }
    #determineEventDetailProperties(path) {
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
        };
    }
}
