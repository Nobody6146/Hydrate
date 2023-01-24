//Load all of our routes
import { HydrateRoute } from "./lib/hydrate/hydrate.js";
import { HomeRoute } from "./routes/home/route.js";
import { NotFoundRoute } from "./routes/notfound/route.js";

export const AppRoutes:HydrateRoute[] = [
    HomeRoute,
    NotFoundRoute
];