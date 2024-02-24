import { ComponentConstructor, isConstructor } from '../component';

export type ComponentIdentifier<T = undefined> = ComponentConstructor<T> | string | symbol;

export function getComponentIdentifierString(identifier: ComponentIdentifier<any>) {
    if (isConstructor(identifier)) {
        return identifier.name;
    }
    return String(identifier);
}
