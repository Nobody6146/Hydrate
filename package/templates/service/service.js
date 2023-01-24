import { HydrateAppService } from "../lib/hydrate/hydrate.js";
export class SERVICE_NAMEService extends HydrateAppService {
    constructor() {
        super();
    }
}
export let SERVICE_NAMEServiceFactory = function (hydrate, source) {
    return new SERVICE_NAMEService();
};
