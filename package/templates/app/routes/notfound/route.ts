import { HydrateRoute, HydrateRouteMatch, HydrateRouteRequest } from "../../lib/hydrate/hydrate.js";
import { HomeRoute } from "../home/route.js";

export const NotFoundRoute:HydrateRoute = {
    name: "NotFound",
    path: "",
    action: async (request:HydrateRouteRequest, match:HydrateRouteMatch) => request.redirect(HomeRoute.path)
}