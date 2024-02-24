import { ComponentConstructor } from '../component';
import { MetafoksRegistry } from '../registry';
import { MetafoksContainer } from '../container';
import { ContainerIdentifier } from '../identifiers';

export const ContainerId = (containerId: ContainerIdentifier) => (target: ComponentConstructor<any>) => {
    if (!MetafoksRegistry.has(containerId)) new MetafoksContainer(containerId);
    target.containerId = containerId;
};
