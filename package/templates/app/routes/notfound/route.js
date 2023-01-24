import { HomeRoute } from "../home/route.js";
export const NotFoundRoute = {
    path: "",
    action: async (request) => request.redirect(HomeRoute.path)
};
