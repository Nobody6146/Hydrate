import { HydrateRoute, HydrateRouteRequest } from "../lib/hydrate/hydrate.js";

export const ROUTE_NAMEMiddleware:HydrateRoute = {
    name: "ROUTE_NAME",
    path: "#ROUTE_PATH",
    action: async function(request:HydrateRouteRequest) {
        
    }
}