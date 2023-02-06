import { HydrateComponent } from "../../lib/hydrate/hydrate.js";
export class PageComponent extends HydrateComponent {
    onInit(eventDetails) {
    }
    onPreRender(eventDetails) {
    }
    onPostRender(eventDetails) {
    }
    onDestroy() {
    }
    scaffoldRoute(element, detail) {
        const routeAttribute = this.hydrate.attribute(this.hydrate.options.attribute.names.route);
        const page = this.state[detail.modelName];
        element.setAttribute(routeAttribute, page.route);
    }
    scaffoldPage(element, detail) {
        const componentAttribute = this.hydrate.attribute(this.hydrate.options.attribute.names.component);
        const page = this.state[detail.modelName];
        element.setAttribute(componentAttribute, page.component);
    }
    title(id) {
        return this.state[id].title;
    }
    component(id) {
        console.warn(this.route);
        return this.state[id].component;
    }
    route(id) {
        return this.state[id].route;
    }
}
