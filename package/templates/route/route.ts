import { HydrateRoute, HydrateRouteRequest } from "../lib/hydrate/hydrate.js";

export const ROUTE_NAMERoute:HydrateRoute = {
    name: "ROUTE_NAME",
    path: "#ROUTE_PATH",
    action: async function(request:HydrateRouteRequest) {
        return request.resolve();
    }
}