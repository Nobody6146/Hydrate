#!/usr/bin/env node 

const fs = require("fs");
const path = require("path");
const childProcess = require('child_process');

//console.log("Hydrate cli", process.argv);

const [nodePath, commandPath, command, ...args] = process.argv;
const workingDir = process.cwd();
const commandDir = commandPath.substring(0, commandPath.lastIndexOf("\\"));

const templateFolder = `${commandDir}\\templates`;
const libFolder = `${templateFolder}\\lib`;
const hydratePath = `hydrate\\hydrate.js`;
const configfileName = "hydrateconfig.json";
const configFile = `${workingDir}\\${configfileName}`;

const needsHelp = args.indexOf("--help") > -1 || args.indexOf("-h") > -1;

switch(command) {
    case "help":
        processHelp();
        break;
    case "version":
        processVersionCommand();
        break;
    case "manual":
        processViewManualCommand();
        break;
    case "import":
        processImportCommand(args);
        break;
    case "new":
        processCreateCommand(args);
        break;
    default:
        console.error(`Command "${command}" is an unrecongnized command`);
        break;
}

return;

function processHelp() {
    console.log("Help Menu:");
    console.log("Usage: hydrate <command>");
    console.log("Where <command> is one of:");
    console.log("\thelp, version, manual, import, new\n");
    console.log();
}

function processVersionCommand() {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate version \tOutputs the version number of the framewowrk");
        console.log();
        return;
    }
    console.log(`Hydrate App v${getVersion()}`)
}

function processViewManualCommand() {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate manual \tOpens the Hydrate framework and CLI manual in your default browser.");
        console.log();
        return;
    }
    childProcess.exec(`${commandDir}\\manual.html`);
    return;
}

function processImportCommand([location, ...args]) {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate import <relativePath>\tAdds the Hydrate library source files (.js and .ts) to the directory provided.");
        console.log();
        return;
    }
    if(location == null)
    {
        console.error(`Relative path was not specified "hydrate import <relativePath>`);
        return;
    }
    const destination = `${workingDir}\\${location}`;
    copyRecursiveSync(libFolder, destination);
}

function processCreateCommand([resourceType, resourceName, ...args]) {
    switch(resourceType) {
        case "config":
            return processCreateConfigCommand(args);
        case "app":
            return processCreateAppCommand(resourceName, args);
        case "component":
            return processCreateComponentCommand(resourceName);
        case "service":
            return processCreateServiceCommand(resourceName);
        case "route":
            return processCreateRouteCommand(resourceName);
        default:
            if(needsHelp)
            {
                console.log("Help Menu:");
                console.log("hydrate new <subCommand> <name> \tcreates the resource of the provided type");
                console.log("hydrate new config <name> \tcreates a new CLI config file");
                console.log("hydrate new app <name> \tcreates a project template for an app powered by Hydrate");
                console.log("hydrate new component <name> \tcreates a new Hydrate component");
                console.log("hydrate new service <name> \tcreates a new Hydrate service");
                console.log("hydrate new route <name> \tcreates a new Hydrate route or middleware\n");
                return;
            }
            console.error(`Type "${resourceType}" is an unrecongnized resource`);
            return;
    }
}

function processCreateConfigCommand(args, path) {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate new config \tcreates a new \"hydrateconfig.json\" that is used to configure the Hydrate CLI for the project.");
        console.log("hydrate new config --path|-p <relativePath> \tcreates a new \"hydrateconfig.json\" in the relative path specified");
        console.log("hydrate new config --name|-n <appName> \tcreates a new \"hydrateconfig.json\" with the \"name\" config setting set to the specified value. This sets the app's name.");
        console.log("hydrate new config --lib|-l <relativePath> \tcreates a new \"hydrateconfig.json\" with the \"lib\" config setting set to the specified path. This tells the CLI the location of the hydrate libraries in the project.");
        console.log("hydrate new config --componentPrefix|-cp <prefix> \tcreates a new \"hydrateconfig.json\" with the \"componentPrefix\" config setting set to the specified value. This is used to prefix the custom element name of Hydrate components.");
        console.log();
        return;
    }

    let appName = null;
    let libFolder = null;
    let componentPrefix = null;

    if(args?.length)
    {
        for(let i = 0; i < args.length; i++)
        {
            switch(args[i])
            {
                case "--name":
                case "-n":
                    i++;
                    appName = args[++i] ?? null;
                    continue;
                case "--lib":
                case "-l":
                    libFolder = args[++i] ?? null;
                    continue;
                case "--path":
                case "-p":
                    path = args[++i] ?? null;
                    continue;
                case "--componentprefix":
                case "-cp":
                    componentPrefix = args[++i] ?? null;
                    continue;
                default:
                    console.error(`Unknown argument "${args[i]}" provided`);
                    return;
            }
        }
    }
    
    const destination = path != null ? `${workingDir}\\${path}\\${configfileName}` : configFile;
    return createConfigFile(destination, appName, libFolder, componentPrefix);
}

function createConfigFile(path, appName, libFolder, componentPrefix) {
    const config = {
        name: appName ?? "Demo App",
        version: getVersion(),
        lib: libFolder ?? "lib",
        componentPrefix: componentPrefix ?? "app"
    }
    fs.writeFileSync(path, JSON.stringify(config));
    return config;
}

function loadConfig() {
    if(!fs.existsSync(configFile))
        return createConfigFile(configFile);
    const data = fs.readFileSync(configFile).toString();
    console.log(data);
    return JSON.parse(data);
}

function processCreateAppCommand(resourceName, args) {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate new app <name> \tscaffolds a project folder that generates a static website utilizing the Hdrate framework.");
        console.log("<name> \tthe name of the application.");
        console.log("hydrate new app Demo \tcreates a new application named \"Demo\" and places it in a folder called \"Demo\".");
        console.log("hydrate new app \"app\\Hello World\" \tcreates a new application named \"Hello World\" in the folder \"app\\Hello World\".");
        console.log();
        return;
    }
    if(resourceName == null)
    {
        console.error("Resource name was not provide for create Hydrate app");
        return;
    }

    const destination = `${workingDir}\\${resourceName}`;

    const index = resourceName.lastIndexOf("\\");
    let className = index > -1 ? resourceNameToClass(resourceName) : resourceNameToClass(resourceName.substring(index + 1, resourceName.length));
    const source = `${templateFolder}\\app`;
    copyRecursiveSync(source, destination, true);
}

function processCreateComponentCommand(resourceName) {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate new component <name> \tcreates a new Hydrate component with the given name.");
        console.log("hydrate new component home \tcreates a new Hydrate component with the name \"Home\" and tag \"app-home\" in the default components folder.");
        console.log("hydrate new component pages\\home \tcreates a new Hydrate component with the name \"Home\" and tag \"app-home\" in a folder called \"pages\".");
        console.log("hydrate new component home --prefix|-p <name> \tcreates a new Hydrate component with the name \"Home\" and tag \"app-<name>\".");
        console.log("hydrate new component home --lazy|-l \tcreates a new Hydrate component that will have it's template and component be lazy loaded.");
        console.log("hydrate new component home --init|-i \tcreates a new Hydrate component that will automatically initialize it's model if it isn't already.");
        console.log("hydrate new component home --shadow|-s \tcreates a new Hydrate component that will render using the shadow DOM.");
        console.log("hydrate new component home --model|-m <name> \tcreates a new Hydrate component bound to the model with the specified name.");
        console.log();
        return;
    }
    if(resourceName == null)
    {
        console.error("Resource name was not provide for create Hydrate app component");
        return;
    }

    const config = loadConfig();
    let prefix = config.componentPrefix;

    let modifiers = [];
    if(args?.length)
    {
        for(let i = 0; i < args.length; i++)
        {
            switch(args[i])
            {
                case "--prefix":
                case "-p":
                    prefix = args[++i] ?? config.componentPrefix;
                    break;
                case "--lazy":
                case "-l":
                    modifiers.push("h-lazy");
                    break;
                case "--init":
                case "-i":
                    modifiers.push("h-init");
                    break;
                case "--shadow":
                case "-s":
                    modifiers.push("h-shadow");
                    break;
                case "--model":
                case "-m":
                    const modelName = args[++i] ?? "";
                    modifiers.push(`h-model="${modelName}"`);
                    break;
            }
        }
    }

    const source = `${templateFolder}\\component`;
    const folder = resourceName.indexOf("\\") > -1 ? resourceName : `components\\${resourceName}`;
    const destination = `${workingDir}\\${folder}`;
    
    const hydrateFile = `${workingDir}\\${config.lib}\\${hydratePath}`;
    const replacements = {
        "COMPONENT_NAME": resourceNameToClass(resourceName),
        "../lib/hydrate/hydrate.js": relativeUrl(destination, hydrateFile),
        "TEMPLATE_NAME": `${prefix}-${resourceNameToPath(resourceName)}`,
        " MODIFIERS": modifiers.length === 0 ? "" : ` ${modifiers.join(" ")}`
    }
    cloneAndFillTemplate(source, destination, replacements);
    const templateFile = `${workingDir}\\templates.html`;
    addComponentToTemplatesFile(templateFile, replacements.TEMPLATE_NAME, relativeUrl(workingDir, `${destination}`));
}

function processCreateServiceCommand(resourceName) {
    if(resourceName == null)
    {
        console.error("Resource name was not provide for create Hydrate service");
        return;
    }
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate new service <name> --<scope-flag> \tcreates a new Hydrate service with the given name with the scope specified. Generation will fail if you don't provide a scope.");
        console.log("hydrate new service task \tcreates a new Hydrate service with the given name \"Task\" in the default services folder.");
        console.log("hydrate new service utils/task \tcreates a new Hydrate service with the given name \"Task\" in the folder \"utils\".");
        console.log("hydrate new service <name> \tcreates a new Hydrate service with the given name \"Task\" in the default services folder.")
        console.log("hydrate new service <name> --singleton|-s \tcreates a dependency with the level of \"singleton\".");
        console.log("hydrate new service <name> --scoped|-sc \tcreates a dependency with the level of \"scoped\".");
        console.log("hydrate new service <name> --transient|-t \tcreates a dependency with the level of \"transient\".");
        console.log();
    }

    let dependencyType = null;
    if(args?.length)
    {
        for(let i = 0; i < args.length; i++)
        {
            switch(args[i])
            {
                case "--singleton":
                case "-s":
                    dependencyType = "singleton";
                    break;
                case "--scoped":
                case "-sc":
                    dependencyType = "scoped";
                    break;
                case "--transient":
                case "-t":
                    dependencyType = "transient"
                    break;
            }
        }
    }

    if(dependencyType == null)
    {
        //dependencyType = "singleton";
        //console.error(`Service dependency type was not specified. Scoping was defaulted ${dependencyType}. See "hydrate new service -h" for more info.`);
        console.error(`Service dependency scope was not specified. Please provide a scope. See "hydrate new service -h" for more info.`);
        return;
    }

    const source = `${templateFolder}\\service`;
    const folder = resourceName.indexOf("\\") > -1 ? resourceName : `services\\${resourceName}`;
    const destination = `${workingDir}\\${folder}`;
    const config = loadConfig();
    const hydrateFile = `${workingDir}\\${config.lib}\\${hydratePath}`;
    const replacements = {
        "SERVICE_NAME": resourceNameToClass(resourceName),
        "../lib/hydrate/hydrate.js": relativeUrl(destination, hydrateFile),
    }
    cloneAndFillTemplate(source, destination, replacements);
    const servicesJsFile = `${workingDir}\\services.js`;
    const servicesTsFile = `${workingDir}\\services.ts`;
    addServiceToServicesFile(servicesJsFile, replacements.SERVICE_NAME, relativeUrl(workingDir, `${destination}\\service.js`), dependencyType);
    addServiceToServicesFile(servicesTsFile, replacements.SERVICE_NAME, relativeUrl(workingDir, `${destination}\\service.js`), dependencyType);
}

function processCreateRouteCommand(resourceName) {
    if(needsHelp)
    {
        console.log("Help Menu:");
        console.log("hydrate new service <name> \tcreates a new Hydrate service with the given name.");
        console.log("hydrate new service task \tcreates a new Hydrate service with the given name \"Task\" in the default services folder.");
        console.log("hydrate new service utils/task \tcreates a new Hydrate service with the given name \"Task\" in the folder \"utils\".");
        console.log("hydrate new service <name> \tcreates a new Hydrate service with the given name \"Task\" in the default services folder.")
        console.log();
    }
    if(resourceName == null)
    {
        console.error("Resource name was not provide for create Hydrate route");
        return;
    }
    const source = `${templateFolder}\\route`;
    const folder = resourceName.indexOf("\\") > -1 ? resourceName : `routes\\${resourceName}`;
    const destination = `${workingDir}\\${folder}`;
    const config = loadConfig();
    const hydrateFile = `${workingDir}\\${config.lib}\\${hydratePath}`;
    const className = resourceNameToClass(resourceName);
    const replacements = {
        "ROUTE_NAME": className,
        "ROUTE_PATH": resourceNameToPath(resourceName),
        "../lib/hydrate/hydrate.js": relativeUrl(destination, hydrateFile)
    }
    cloneAndFillTemplate(source, destination, replacements);
    const routeJsFile = `${workingDir}\\routes.js`;
    const routeTsFile = `${workingDir}\\routes.ts`;
    addRouteToRoutesFile(routeJsFile, replacements.ROUTE_NAME, relativeUrl(workingDir, `${destination}\\route.js`));
    addRouteToRoutesFile(routeTsFile, replacements.ROUTE_NAME, relativeUrl(workingDir, `${destination}\\route.js`));
}

function addComponentToTemplatesFile(templatesFile, templateName, componentSource) {
    if(!fs.existsSync(templatesFile))
        return;
    const lines = fs.readFileSync(templatesFile).toString().split(/\r?\n/);
    for(let i = lines.length - 1; i > -1; i--)
    {
        //We found the ending template tag
        if(lines[i].match(/^\s*\<\/template\>/))
        {
            lines.push(lines[i]);
            lines[i] = `\t<template h-template="${templateName}" h-source="${componentSource}"></template>`;
            fs.writeFileSync(templatesFile, lines.join("\n"));
            return;
        }
    }
}

function addRouteToRoutesFile(routesFile, routeName, routeSource) {
    if(!fs.existsSync(routesFile))
        return;
    const lines = fs.readFileSync(routesFile).toString().split(/\r?\n/);
    const result = [];
    
    for(let i = 0; i < lines.length; i++)
    {
        //We found the export routes
        if(lines[i].match(/^\s*export const AppRoutes = \[|^\s*export const AppRoutes:HydrateRoute\[\] = \[/))
        {
            const arrayStart = i;
            //Insert the import statement
            result.push(`import { ${routeName}Route } from "${routeSource}";`);
            result.push(lines[i]);

            //Find the end of the exported routes list
            for(i += 1; i < lines.length; i++) {
                if(lines[i].match(/^\s*\];/))
                {
                    //Add the route to exports
                    if(i > arrayStart + 1)
                        result[i] = `${result[i]},`
                    result.push(`\t${routeName}Route,`);
                    result.push(lines[i]);

                    //Copy the remainder of the file
                    for(i += 1; i < lines.length; i++)
                        result.push(lines[i]);

                    //Save changes
                    fs.writeFileSync(routesFile, result.join("\n"));
                    break;
                }
                else
                    result.push(lines[i]);
            }
            return;
        }
        else
            result.push(lines[i]);
    }
}

function addServiceToServicesFile(servicesFile, serviceName, serviceSource, serviceType) {
    if(!fs.existsSync(servicesFile))
        return;
    const lines = fs.readFileSync(servicesFile).toString().split(/\r?\n/);
    const result = [];
    
    for(let i = 0; i < lines.length; i++)
    {
        //add the imports for the TS or correspondending js (since js won't have interfaces)
        if(lines[i].match(/^\s*export interface AppDependency<T>|^\s*export let AppServices = \[/))
        {
            //Insert the import statement
            result.push(`import { ${serviceName}Service, ${serviceName}ServiceFactory } from "${serviceSource}";`);
            // result.push(lines[i]);
        }

        //We found the export routes
        if(lines[i].match(/^\s*export let AppServices = \[|^\s*export let AppServices: AppDependency<any>\[\] = \[/))
        {
           result.push(lines[i]);

            const arrayStart = i;
            //Find the end of the exported routes list
            for(i += 1; i < lines.length; i++) {
                if(lines[i].match(/^\s*\];/))
                {
                    //Add the route to exports
                    if(i > arrayStart + 1)
                        result[i] = `${result[i]},`
                    result.push(`\t{ type: "${serviceType}", definition: ${serviceName}Service, factory: ${serviceName}ServiceFactory}`);
                    result.push(lines[i]);

                    //Copy the remainder of the file
                    for(i += 1; i < lines.length; i++)
                        result.push(lines[i]);

                    //Save changes
                    fs.writeFileSync(servicesFile, result.join("\n"));
                    break;
                }
                else
                    result.push(lines[i]);
            }
            return;
        }
        else
            result.push(lines[i]);
    }
}

function getVersion() {
    return JSON.parse(fs.readFileSync(`${commandDir}\\package.json`).toString()).version;
}

function relativeUrl(from, to) {
    const url = path.relative(from, to).replace(/\\/g, "/");
    //If we got a relative path without a relative specifier, add it
    return url.startsWith(".") ? url : `./${url}`;
}

function resourceNameToClass(resourceName) {
    const index = resourceName.lastIndexOf("\\");
    let name = index > -1 ? resourceName.substring(index + 1, resourceName.length) : resourceName;
    let result = "";
    let capitalize = true;
    //Pascal case the name
    for(let i = 0; i < name.length; i++)
    {
        let c = name.charAt(i);
        if(c.match(/[a-zA-Z]/))
        {
            if(capitalize)
            {
                c = c.toUpperCase();
                capitalize = false;
            }
        }
        else
            capitalize = true;
        result += c;
    }
    //Remove our invalid characters
    return result.replace(/[^0-9a-zA-Z_$]/g, "");
}

function resourceNameToPath(resourceName) {
    const index = resourceName.lastIndexOf("\\");
    let name = index > -1 ? resourceName.substring(index + 1, resourceName.length) : resourceName;
    return name.toLowerCase().replace(/[^0-9a-zA-Z_$\-]/g, "");
}

function copyRecursiveSync(src, dest, recursive = false) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if(!fs.existsSync(dest))
        fs.mkdirSync(dest, { recursive: recursive,});
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

function cloneAndFillTemplate(source, destination, replacements) {
    const files = fs.readdirSync(source);
    fs.mkdirSync(destination, {recursive: true});
    for(let file of files)
    {
        let content = fs.readFileSync(path.join(source, file)).toString();
        for(let key of Object.keys(replacements))
            content = content.replace(new RegExp(key, "g"), replacements[key]);
        fs.writeFileSync(path.join(destination, file), content);
    }
}

