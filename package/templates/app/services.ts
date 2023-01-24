import { HydrateAppServiceDefinition, HydrateAppServiceFactory, HydrateAppDependencyType } from "./lib/hydrate/hydrate.js";

import { LoggerService, LoggerServiceFactory } from "./services/logger/service.js";
export interface AppDependency<T> {
    type: HydrateAppDependencyType;
    definition: HydrateAppServiceDefinition<T>;
    factory: HydrateAppServiceFactory<T>;
}

export let AppServices: AppDependency<any>[] = [
	{ type: "scoped", definition: LoggerService, factory: LoggerServiceFactory}
];