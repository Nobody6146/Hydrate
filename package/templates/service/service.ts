import { HydrateApp, HydrateAppService, HydrateAppServiceFactory } from "../lib/hydrate/hydrate.js";

export class SERVICE_NAMEService extends HydrateAppService
{
    constructor() {
        super();
    }
}

export let SERVICE_NAMEServiceFactory:HydrateAppServiceFactory<SERVICE_NAMEService> = function(hydrate:HydrateApp, source:any) {
    return new SERVICE_NAMEService();
}