# Hydrate
## Hydrate is a lightweight JS library for generating client-side web applications without the need for a build step using various levels of hydration, partial hydration, and resumability.

Here are some of the features Hydrate supports out of the box:
* Create dynamic websites at runtime from static files without the need for a build step (excluding the TypeScript compiler)
* Client-side rendering, partial hydration, and resumability
* HTML templating and custom components
* Lazy loading templates and components
* Partial state updates (the entire app state doesn't have to be updated meaning you can do partial rerenders)
* Modular HTML manipulation via HTML element attributes
* One-way and two-way model binding
* Global state management and listenable event based changes (such as state changes, routing events, and more)
* Client-side routing and routing middleware
* Depdency injection
* JS Modules and TypeScript support

## What to know
Hydrate is a modular library. You can opt in to use any features you would like while ignoring others. The design is to give you a toolbox of HTML attributes that you can combine on elements to customize the type of behavior you are trying to accomplish. Once you've installed the CLI in the instuctions in the next section, you can allows use the command `hydrate documentation` to open up the manual for further instruction.

## CLI install instructions
1. Install the <a href="https://www.npmjs.com/package/@nobody6146/hydrateapp">NPM package</a> globally: `npm install -g @nobody6146/hydrateapp`
2. Navigate to your project directory
3. You can type `hydrate version` to check version informaiton or type `hydrate help` to see a list of commands. Additionally, typing `--help` or `-h` on any command will display help information about that command.
4. Start using the CLI!

## How to make a brand new Hydrate App project
Although you don't need a whole project template to use Hydrate, the built in scaffolder generates a project setup that allows you to rapidly build a client-side routing application by organizing code, automatically connecting components/routes/depedencies into your application and being able to see them instantly.
1. Install the CLI from the CLI inall instructions above
2. Type `hydrate new app 'Demo App'` to scaffold out a new project in a folder called "Demo App", and then navigate to that folder (This command will create a `hydrateconfig.json` file that the CLI will use to determine how future commands will need to function)
3. Once inside, using your prefereed method to host static files (such as VS Code's Live Server extension or a NodeJS server), serve this folder as the root directory so the application will be able to access all the files
4. `index.html` will be the application entry point
5. Use the commands `hydrate new component`, `hydrate new route`, `hydrate new middleware`, and `hydrate new service` to create additional components, routes, middleware, and services for your application. These commands will automatically scaffold out the resources needed and automatically include them in necessary files to get the new piece connected and ready to use immedately.
6. If you have questions about how some Hydrate features work, again, type `hydrate documentation` to open up the manual to read up on the different HTML attributes in Hydrate as well as how additional features of the framework function.

## Import Hydrate into an existing application
Hydrate is not a structured framework, but a library. This makes it easy to add to existing projects if you just need a little bit of interactivity, and makes importing the newest version of Hydrate easy. You can accomplish this with the following steps:
1. Install the CLI from the CLI inall instructions above
2. Use the `hydrate import` command to copy the Hydrate library files into your project
3. That is it! Hydrate is now ready to use how you like! If you would like to use the CLI as well, continue reading the additional steps
4. The CLI needs a `hydrateconfig.json` file to know how to execute it's commands. You can manually do this by using the command `hydrate new config`. Here you can see and edit the registered name of your app, the version of the framework it was generated with, the relative path to the library folder containing the Hydrate source files, and the custom element tag prefix used by the component created via CLI.
5. If you forget to manually create a Hydrate config file, the CLI will automatically generate one in the active directory before executing further commands