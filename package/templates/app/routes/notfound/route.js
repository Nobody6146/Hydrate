import { HomeRoute } from "../home/route.js";
export const NotFoundRoute = {
    name: "NotFound",
    path: "",
    action: async (request, match) => request.redirect(HomeRoute.path)
};
