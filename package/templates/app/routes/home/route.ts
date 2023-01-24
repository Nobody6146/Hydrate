import { HydrateRoute, HydrateRouteRequest } from "../../lib/hydrate/hydrate.js";

export const HomeRoute:HydrateRoute = {
    path: "#home",
    action: async (request:HydrateRouteRequest) => request.resolve()
}