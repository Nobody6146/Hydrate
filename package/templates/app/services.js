import { LoggerService, LoggerServiceFactory } from "./services/logger/service.js";
export let AppServices = [
    { type: "scoped", definition: LoggerService, factory: LoggerServiceFactory }
];
