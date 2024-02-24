import { createLogger } from '@metafoks/logger';
import { MetafoksContainer } from '../container';
import { ContainerIdentifier, getContainerIdentifierString } from '../identifiers';
import { DEFAULT_CONTAINER_ID } from '../symbols';

export class MetafoksRegistry {
    private static readonly logger = createLogger(MetafoksRegistry);
    private static readonly containersMap = new Map<ContainerIdentifier, MetafoksContainer>();

    public static has(id: ContainerIdentifier) {
        return this.containersMap.has(id);
    }

    public static add(container: MetafoksContainer) {
        this.containersMap.set(container.id, container);
        this.logger.info(`added new container id=${String(container.id)}`);
    }

    public static getDefaultContainer() {
        return this.get(DEFAULT_CONTAINER_ID);
    }

    public static get(id: ContainerIdentifier) {
        const container = this.containersMap.get(id);

        if (!container) throw new Error(`no container ${getContainerIdentifierString(id)}`);
        return container;
    }
}
