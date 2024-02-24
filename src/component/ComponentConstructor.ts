import { ContainerIdentifier } from '../identifiers';

export interface ComponentConstructor<T> {
    new (...args: any[]): T;
    containerId?: ContainerIdentifier;
}
