export const ROUTE_NAMERoute = {
    name: "ROUTE_NAME",
    path: "#ROUTE_PATH",
    action: async function (request, match) {
        return request.resolve();
    }
};
