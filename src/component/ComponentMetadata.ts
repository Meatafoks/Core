import { ComponentIdentifier } from 'identifiers';
import { ComponentType } from './ComponentType';

export interface ComponentMetadata<T = unknown> {
    id: ComponentIdentifier<T>;
    type?: ComponentType<T>;
    value?: T | symbol;
}
