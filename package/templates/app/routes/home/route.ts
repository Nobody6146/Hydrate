import { HydrateRoute, HydrateRouteMatch, HydrateRouteRequest } from "../../lib/hydrate/hydrate.js";

export const HomeRoute:HydrateRoute = {
    name: "Home",
    path: "#home",
    action: async (request:HydrateRouteRequest, match:HydrateRouteMatch) => request.resolve()
}