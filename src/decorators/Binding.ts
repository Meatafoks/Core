import { MetafoksRegistry } from '../registry';
import { ComponentIdentifier } from '../identifiers';
import { DEFAULT_CONTAINER_ID } from '../symbols';

export function Binding<T>(identifier: ComponentIdentifier<T>) {
    return (target: any, propertyName: string | symbol, index?: any) => {
        const originalMethod = target[propertyName];
        const containerId = target.containerId ?? DEFAULT_CONTAINER_ID;
        const container = MetafoksRegistry.get(containerId);

        container.register(identifier, () => {
            const targetContext = container.resolve(target.constructor);
            return originalMethod.bind(targetContext)();
        });
    };
}
