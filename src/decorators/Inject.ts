import { MetafoksRegistry } from '../registry';
import 'reflect-metadata';
import { ComponentIdentifier } from '../identifiers';
import { DEFAULT_CONTAINER_ID } from '../symbols';

export function Inject<T>(identifier: ComponentIdentifier<T>) {
    return (target: any, propertyName: string | symbol | any, index?: number) => {
        if (propertyName) {
            Object.defineProperty(target, propertyName, {
                get(): any {
                    const containerId = target.constructor.containerId ?? DEFAULT_CONTAINER_ID;

                    const container = MetafoksRegistry.get(containerId)!;
                    return container.resolve(identifier);
                },
            });
        }
    };
}
