import { MetafoksRegistry } from '../registry';
import { ComponentIdentifier } from '../identifiers';
import { MetafoksContainer } from '../container';
import { DEFAULT_CONTAINER_ID } from '../symbols';

export function Binding<T>(identifier: ComponentIdentifier<T>) {
    return (target: any, propertyName: string | symbol, index?: any) => {
        const originalMethod = target[propertyName];

        MetafoksContainer.default.register(identifier, () => {
            const containerId = target.constructor.containerId ?? DEFAULT_CONTAINER_ID;
            const container = MetafoksRegistry.get(containerId);
            const targetContext = container.resolve(target.constructor);
            return originalMethod.bind(targetContext)();
        });
    };
}
