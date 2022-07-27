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
    //static = "static"; //Executes once
    //condition = "condition";
    //Functions and execution
    event = "event"; //Calls a callback any time the framework event type is triggered
    on = "on"; //Fires a callback when the "on" event of the element is fired
    //Templating and Components
    script = "script";
    template = "template"; //template changes queries user of the templates then regenerate
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
class HydrateElementMutationEvent extends CustomEvent {
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
class HydrateElementMutationEventDetails {
    hydrate;
    element;
    type;
    baseName;
    propName;
    propPath;
    previousValue;
    modelName;
    modelPath;
    mutation;
    constructor(hydrate, element, eventType, baseName, modelName, modelPath, propName, propPath, previousValue, mutation) {
        this.hydrate = hydrate;
        this.element = element;
        this.type = eventType;
        this.baseName = baseName;
        this.modelPath = modelPath;
        this.modelName = modelName;
        this.propPath = propPath;
        this.propName = propName;
        this.previousValue = previousValue;
        this.mutation = mutation;
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
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            //attributeFilter: [...this.#options.attribute.trackables],
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
    // get exectuers() {
    //     return this.#htmlExcecuters;
    // }
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
        if (name == null || name === "")
            throw Error("invalid model name");
        if (!name.match(/^[$A-Z_][0-9A-Z_$]*$/i))
            throw Error("invalid model name");
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
        let promise = this.#dispatch(this.#root, "bind", name, undefined, undefined);
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
        let promise = this.#dispatch(this.#root, "unbind", baseName, this.state(model), undefined);
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
                app.#dispatch(app.#root, "set", name + "." + propName, previousValue, undefined);
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
                    app.#dispatch(app.#root, "unbind", name + "." + propName, previousValue, undefined);
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
    #parseElementMutationEvents(element) {
        let mutationAttribute = this.attribute(this.#options.attribute.names.mutation);
        let map = new Map();
        if (!element.hasAttribute(mutationAttribute))
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
        if (args.length === 1 && args[0].field === ""
            && (args[0].expression.trim() === wildcard || args[0].expression.trim() === "")) {
            for (let key of map.keys())
                map.set(key, true);
            return map;
        }
        for (let arg of args) {
            let value = arg.expression.trim();
            //If wildcard or empty, allow all
            if ((value === wildcard || value === "")) {
                //If we are only an attribute value="*" || "", let all of the mutations through
                if (arg.field === "" && args.length === 1) {
                    for (let key of map.keys())
                        map.set(key, true);
                    return map;
                }
                for (let key of map.keys()) {
                    if (key.startsWith(`mutation.${arg.field}`))
                        map.set(key, true);
                }
            }
            else {
                var types = arg.expression.match(/([a-zA-Z]+)/g);
                if (types === null)
                    continue;
                for (let t = 0; t < types.length; t++) {
                    let key = `mutation.${arg.field}.${types[t]}`;
                    let value = map.get(key);
                    if (value == null)
                        continue;
                    map.set(key, true);
                }
            }
        }
        return map;
    }
    #mutationCallback(mutations, observer) {
        let updatedElements = [];
        this.#trackableElementSelector;
        const trackableSelector = this.#trackableElementSelector;
        let trackableElements = new Set();
        let untrackableElements = new Set();
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        mutations.forEach(mutation => {
            if (!(mutation.target instanceof HTMLElement))
                return;
            const target = mutation.target;
            switch (mutation.type) {
                case "attributes":
                    {
                        if (mutation.target.getAttribute(mutation.attributeName) === mutation.oldValue)
                            return;
                        if (this.#options.attribute.trackables.indexOf(mutation.attributeName) >= 0) {
                            if (mutation.target.matches(trackableSelector)) {
                                let element = mutation.target;
                                let newTrack = this.#trackElement(element);
                                if (!newTrack) {
                                    //Wasn't a new track, but a core value changed, so rebind the element
                                    let modelName = element.getAttribute(modelAttribute);
                                    this.#dispatch(element, "bind", modelName, this.state(modelName), undefined);
                                }
                            }
                            else
                                untrackableElements.add(mutation.target);
                        }
                        this.#dispatch(mutation.target, "mutation.parent.attribute", undefined, undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.target.attribute", undefined, undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.child.attribute", undefined, undefined, mutation);
                        break;
                    }
                case "childList":
                    {
                        let addedElement = false;
                        mutation.addedNodes.forEach(node => {
                            if (!(node instanceof HTMLElement))
                                return;
                            addedElement = true;
                            this.#trackElement(node);
                            let modelName = node.getAttribute(modelAttribute);
                            //this.#dispatch(node, "bind", modelName, this.state(modelName), undefined);
                        });
                        if (addedElement) {
                            this.#dispatch(mutation.target, "mutation.parent.added", undefined, undefined, mutation);
                            this.#dispatch(mutation.target, "mutation.target.added", undefined, undefined, mutation);
                            this.#dispatch(mutation.target, "mutation.child.added", undefined, undefined, mutation);
                        }
                        let removedElement = false;
                        for (let node of mutation.removedNodes) {
                            if (!(node instanceof HTMLElement))
                                return;
                            removedElement = true;
                            this.#untrackElement(node);
                        }
                        if (removedElement) {
                            this.#dispatch(mutation.target, "mutation.parent.removed", undefined, undefined, mutation);
                            this.#dispatch(mutation.target, "mutation.target.removed", undefined, undefined, mutation);
                            this.#dispatch(mutation.target, "mutation.child.removed", undefined, undefined, mutation);
                        }
                        break;
                    }
                case "characterData":
                    {
                        this.#dispatch(mutation.target, "mutation.parent.characterdata", undefined, undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.target.characterdata", undefined, undefined, mutation);
                        this.#dispatch(mutation.target, "mutation.child.characterdata", undefined, undefined, mutation);
                        break;
                    }
            }
        });
        //Update each element
        for (let element of untrackableElements) {
            this.#untrackElement(element);
        }
        for (let element of trackableElements) {
            this.#trackElement(element);
            let modelName = element.getAttribute(modelAttribute);
        }
    }
    #inputListener(event) {
        let target = event.target;
        if (!target.matches(this.#trackableElementSelector))
            return;
        let modelName = target.getAttribute(this.attribute(this.#options.attribute.names.model));
        let model = this.model(modelName);
        let state = this.state(modelName);
        if (!(state instanceof Object))
            return;
        let modelEvent = this.#createEvent(target, "input", state, this.#determineEventDetailProperties(modelName, "property"), null, undefined);
        let args = this.parseAttributeArguments(target, this.attribute(this.#options.attribute.names.input));
        for (let i = 0; i < args.length; i++) {
            //How do we want to format the input attribute?
            //this.#createEvent(target, "input", this.state())
            let arg = args[i];
            let propName = arg.field;
            let value = this.resolveArgumentValue(modelEvent.detail, arg, event);
            if (state[propName] === value)
                continue;
            model[propName] = value;
        }
    }
    #addTrackableAttributes() {
        this.#options.attribute.trackables.push(this.attribute(this.#options.attribute.names.property), this.attribute(this.#options.attribute.names.model), this.attribute(this.#options.attribute.names.attribute), this.attribute(this.#options.attribute.names.property), this.attribute(this.#options.attribute.names.toggle), this.attribute(this.#options.attribute.names.class), this.attribute(this.#options.attribute.names.delete), this.attribute(this.#options.attribute.names.event), this.attribute(this.#options.attribute.names.on), this.attribute(this.#options.attribute.names.component), this.attribute(this.#options.attribute.names.route), this.attribute(this.#options.attribute.names.page), this.attribute(this.#options.attribute.names.mutation));
        let app = this;
        this.#options.attribute.trackables.push(...this.#options.attribute.names.customs.map(x => app.attribute(x)));
    }
    #addStandardAttributeHandlers() {
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.property), (arg, eventDetails) => {
            if (eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if (value === undefined)
                return;
            if (eventDetails.element[arg.field] === value)
                return;
            eventDetails.element[arg.field] = value;
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.attribute), (arg, eventDetails) => {
            if (eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            let value = eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
            if (value === undefined)
                return;
            if (eventDetails.element.getAttribute(arg.field) === value)
                return;
            eventDetails.element.setAttribute(arg.field, value);
            return;
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.event), (arg, eventDetails) => {
            // if(eventDetails.modelName !== "" && eventDetails.model == null)
            //     return;
            if (arg.field !== "*" && arg.field !== eventDetails.type)
                return;
            eventDetails.hydrate.resolveArgumentValue(eventDetails, arg, null);
        });
        this.#options.attribute.handlers.set(this.attribute(this.#options.attribute.names.component), (arg, eventDetails) => {
            if (eventDetails.modelName !== "" && eventDetails.model == null)
                return;
            //Only generate the component if the model changed, not the child properties
            let modelAttribute = this.attribute(this.#options.attribute.names.model);
            if (eventDetails.element.getAttribute(modelAttribute) !== eventDetails.modelPath)
                return;
            let element = eventDetails.element;
            let templateAttribute = this.attribute(this.#options.attribute.names.template);
            let template = this.#root.querySelector(`template[${templateAttribute}=${arg.expression}]`);
            if (template == null)
                return;
            let modelSelector = `[${modelAttribute}^=\\^]`;
            const insertModelPath = function (element, path) {
                element.setAttribute(modelAttribute, element.getAttribute(modelAttribute).replace("^", path));
            };
            let children = [];
            let modelPaths = Array.isArray(eventDetails.state)
                ? Object.keys(eventDetails.state).map(x => `${eventDetails.modelPath}.${x}`)
                : [eventDetails.modelPath];
            for (let modelPath of modelPaths) {
                for (var child of template.content.childNodes) {
                    let node = child.cloneNode(true);
                    children.push(node);
                    if (!(node instanceof HTMLElement))
                        continue;
                    //Inject model name and initialize component
                    if (node.matches(modelSelector))
                        insertModelPath(node, modelPath);
                    if (node.matches(modelSelector))
                        insertModelPath(node, modelPath);
                    for (let element of node.querySelectorAll(modelSelector))
                        insertModelPath(element, modelPath);
                }
            }
            //delete the current content
            while (element.firstChild)
                element.removeChild(element.firstChild);
            for (let node of children)
                eventDetails.element.appendChild(node);
        });
    }
    resolveArgumentValue(detail, arg, event) {
        let app = this;
        let functionArgs = {
            $hydrate: this,
            $element: detail.element,
            $detail: detail,
            $model: detail.model,
            $event: event,
            $script: function (name) {
                let selector = `[${app.attribute(app.options.attribute.names.script)}=${name}]`;
                let scriptElement = app.root.querySelector(selector);
                if (scriptElement == null)
                    return null;
                let func = new Function(`'use strict'; return ${scriptElement.textContent.trim()}`)();
                if (!(func instanceof Function))
                    return null;
                return func;
            }
        };
        const validIndentifier = /^[$A-Z_][0-9A-Z_$]*$/i;
        var stateKeys = Object.keys(detail.state ?? {}).filter(x => x.match(validIndentifier));
        var keys = Object.keys(functionArgs).concat(stateKeys);
        var values = Object.values(functionArgs);
        if (typeof detail.state === "object")
            for (let key of stateKeys)
                values.push(detail.state[key]);
        let func = new Function(...keys, `'use strict'; return ${arg.expression}`).bind(detail.state);
        if (typeof detail.state === "object")
            func = func.bind(detail.state);
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
        let addArgument = function () {
            actions.push({
                field: expression.substring(fieldStart, fieldEnd).replace(/['"`]/g, "").trim(),
                expression: expression.substring(fieldEnd + 1, i).trim()
            });
            fieldStart = i + 1;
            searchingForExpression = false;
        };
        for (; i < expression.length; i++) {
            switch (expression[i]) {
                case ":":
                    {
                        searchingForExpression = true;
                        break;
                    }
                case "'":
                case '"':
                case "`":
                    if (!searchingForExpression) {
                        if (!matchCharacters(expression[i]))
                            throw new Error("invalid field name");
                        fieldStart++;
                        searchingForExpression = true;
                        break;
                    }
                default:
                    {
                        if (!searchingForExpression)
                            break;
                        fieldEnd = i - 1;
                        if (!matchCharacters(";"))
                            throw new Error("invalid expression");
                        addArgument();
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
        let newTrack = this.#updateExecuters(element);
        if (newTrack) {
            //Send a track event
            let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
            let state = modelName === undefined ? undefined : this.state(modelName);
            this.#dispatch(element, "track", modelName, state, undefined);
        }
        return newTrack;
    }
    #untrackElement(element) {
        let elementExecuters = this.#htmlExcecuters.get(element);
        if (elementExecuters === undefined)
            return;
        //Send an untrack event
        let modelName = element.getAttribute(this.attribute(this.#options.attribute.names.model)) ?? undefined;
        let state = modelName === undefined ? undefined : this.state(modelName);
        if (this.#dispatch(element, "untrack", modelName, state, undefined))
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
        let mutationEvents = this.#parseElementMutationEvents(element);
        let possibleEventTypes = [
            'track',
            'bind',
            'set'
        ];
        for (let key of mutationEvents.keys()) {
            if (mutationEvents.get(key) === true)
                possibleEventTypes.push(key);
        }
        this.#addSetPropertyHandler(element, modelPath, possibleEventTypes);
        this.#addSetAttributeHandler(element, modelPath, possibleEventTypes);
        this.#addExecuteEventCallbackHandler(element, modelPath, possibleEventTypes);
        this.#addGenerateComponentHandler(element, modelPath, possibleEventTypes);
        return created;
    }
    #addSetPropertyHandler(element, modelPath, possibleEventTypes) {
        let attribute = this.attribute(this.#options.attribute.names.property);
        let eventTypes = [
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
    #addSetAttributeHandler(element, modelPath, possibleEventTypes) {
        let attribute = this.attribute(this.#options.attribute.names.attribute);
        let eventTypes = [
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
    #addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, parseArgs) {
        if (!element.hasAttribute(attribute))
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
        for (let eventType of eventTypes) {
            if (!possibleEventTypes.includes(eventType))
                continue;
            for (let arg of args) {
                let eventExecuters = elementExecuters.get(eventType);
                if (eventExecuters === undefined) {
                    eventExecuters = new Map();
                    elementExecuters.set(eventType, eventExecuters);
                }
                let modelExecuters = eventExecuters.get(modelPath);
                if (modelExecuters === undefined) {
                    modelExecuters = [];
                    eventExecuters.set(modelPath, modelExecuters);
                }
                modelExecuters.push({
                    arg: arg,
                    handler: handler
                });
            }
        }
    }
    #addExecuteEventCallbackHandler(element, modelPath, possibleEventTypes) {
        let attribute = this.attribute(this.#options.attribute.names.event);
        let eventTypes = [
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
    #addGenerateComponentHandler(element, modelPath, possibleEventTypes) {
        let attribute = this.attribute(this.#options.attribute.names.component);
        let eventTypes = [
            'track',
            'bind',
            "set",
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
        this.#addExecuters(element, attribute, modelPath, eventTypes, possibleEventTypes, false);
    }
    #getTrackableElements(target) {
        if (target == null)
            target = this.#root;
        let selector = this.#trackableElementSelector;
        let elements = [];
        if (target.matches(selector))
            elements.push(target);
        return elements.concat([...target.querySelectorAll(selector)]);
    }
    get #trackableElementSelector() {
        let modelAttribute = this.attribute(this.#options.attribute.names.model);
        return `[${modelAttribute}]`;
    }
    #getExcecuters(eventType, targets = [], propPath = undefined) {
        let details = this.#determineEventDetailProperties(propPath, "property");
        let results = new Map();
        if (targets == null)
            return results;
        let filterModels = propPath != undefined && propPath.trim() != "";
        for (let element of this.#htmlExcecuters.keys()) {
            let nested = element.hasAttribute(this.attribute(this.#options.attribute.names.nested));
            if (targets != null && targets.length > 0 && !targets.includes(element))
                continue;
            let eventExecuters = this.#htmlExcecuters.get(element).get(eventType);
            if (eventExecuters == undefined || eventExecuters.size === 0)
                continue;
            let exectuers = new Map();
            if (filterModels) {
                for (let modelPath of eventExecuters.keys()) {
                    //if(nested)
                    if (modelPath !== propPath
                        && modelPath !== details.modelPath //Not a change to a property on our model
                        && !modelPath.startsWith(propPath) //Not a change in our parent
                        && (!nested || !propPath.startsWith(modelPath))) //not a nested change we're looking for
                        continue;
                    let modelExecuters = eventExecuters.get(modelPath);
                    if (modelExecuters == undefined || modelExecuters.length === 0)
                        continue;
                    exectuers.set(modelPath, modelExecuters);
                }
            }
            else {
                for (let property of eventExecuters.keys())
                    exectuers.set(property, eventExecuters.get(property));
            }
            results.set(element, exectuers);
        }
        //TODO: filter out any conditionals, static, etc.
        return results;
    }
    #dispatch(target, eventType, propPath, previousValue, data) {
        //Data is any additional object data that may be needed for an event
        let detail = this.#determineEventDetailProperties(propPath, "property");
        let listenerEvent = this.#createEvent(target, eventType, previousValue, detail, null, data);
        let dispatchElement = target.isConnected ? target : this.#root;
        dispatchElement.dispatchEvent(listenerEvent);
        if (listenerEvent.defaultPrevented)
            return true;
        let elements;
        if (eventType.startsWith("mutation.child"))
            elements = target.parentElement !== null ? [target.parentElement] : [];
        else if (eventType.startsWith("mutation.target"))
            elements = [target];
        else if (eventType.startsWith("mutation.parent")) {
            elements = [];
            for (let node of target.childNodes)
                if (node instanceof HTMLElement)
                    elements.push(node);
            if (elements.length === 0)
                elements = null;
        }
        else
            elements = this.#getTrackableElements(target);
        let elementExecuters = this.#getExcecuters(eventType, elements, propPath);
        for (let element of elementExecuters.keys()) {
            let modelExecuters = elementExecuters.get(element);
            for (let modelPath of modelExecuters.keys()) {
                // let nameIndex = property.indexOf(".");
                // let rootModelName = nameIndex < 0 ? property : property.substring(0, nameIndex);
                // let state = this.state(rootModelName);
                let event;
                if (propPath === modelPath) {
                    event = this.#createEvent(element, eventType, previousValue, this.#determineEventDetailProperties(propPath, "model"), null, data);
                }
                else if (modelPath === detail.modelPath) {
                    //Touched property of the model
                    event = this.#createEvent(element, eventType, previousValue, this.#determineEventDetailProperties(propPath, "property"), null, data);
                    //eventDetails = new HydrateModelEventDetails(this, element, eventType, property, this.state(property), nestedEvent);
                }
                else {
                    let nestedEvent = this.#createEvent(target, eventType, previousValue, this.#determineEventDetailProperties(propPath, "property"), null, data);
                    event = this.#createEvent(element, eventType, this.state(modelPath), this.#determineEventDetailProperties(modelPath, "model"), nestedEvent.detail, data);
                }
                for (let executer of modelExecuters.get(modelPath)) {
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
    #createEvent(target, eventType, previousValue, properties, nested, data) {
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
                    let detail = new HydrateElementMutationEventDetails(this, target, eventType, properties.baseName, properties.modelName, properties.modelPath, properties.propName, properties.propPath, previousValue, data);
                    return new HydrateElementMutationEvent(detail);
                }
        }
    }
    #determineEventDetailProperties(path, type) {
        let index = path != null ? path.lastIndexOf(".") : -1;
        let propName = type === "model" || index < 0 ? undefined : path.substring(index + 1);
        let propPath = type === "model" || index < 0 ? undefined : path;
        let modelPath = type === "model" || index < 0 ? path : path.substring(0, index);
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
