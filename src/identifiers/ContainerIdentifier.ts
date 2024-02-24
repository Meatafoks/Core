import { DEFAULT_CONTAINER_ID } from '../symbols';

export type ContainerIdentifier = string | symbol;

export function getContainerIdentifierString(containerId: ContainerIdentifier) {
    if (containerId === DEFAULT_CONTAINER_ID) {
        return 'MetafoksContainer';
    }

    return String(containerId);
}
