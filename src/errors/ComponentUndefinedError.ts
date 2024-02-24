import {
    ComponentIdentifier,
    ContainerIdentifier,
    getComponentIdentifierString,
    getContainerIdentifierString,
} from '../identifiers';

export class ComponentUndefinedError extends Error {
    name = 'ComponentUndefinedError';
    message =
        `Component with identifier=<${getComponentIdentifierString(this.identifier)}> is undefined in container=<${getContainerIdentifierString(this.containerId)}>! ` +
        `Check that required type registered with @Component decorator`;

    public constructor(
        private identifier: ComponentIdentifier<any>,
        private containerId: ContainerIdentifier,
    ) {
        super();
    }
}
