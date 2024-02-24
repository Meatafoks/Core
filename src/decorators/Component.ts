import { MetafoksRegistry } from '../registry';
import { ComponentConstructor } from '../component';
import { DEFAULT_CONTAINER_ID } from '../symbols';
import { ContainerId } from './ContainerId';

export const Component = (target: ComponentConstructor<any>) => {
    if (!target.containerId) ContainerId(DEFAULT_CONTAINER_ID)(target);
    MetafoksRegistry.get(target.containerId ?? DEFAULT_CONTAINER_ID).registerClass(target);
};
