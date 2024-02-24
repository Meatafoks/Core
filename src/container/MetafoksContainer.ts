import { MetafoksContainerProperties } from './MetafoksContainerProperties';
import { MetafoksRegistry } from '../registry';
import { Logger, LoggerFactory } from '@metafoks/logger';
import { ComponentUndefinedError } from '../errors';
import {
    ComponentConstructor,
    ComponentMetadata,
    ComponentType,
    FunctionReturning,
    isConstructor,
    isFunctionReturning,
} from '../component';
import 'reflect-metadata';
import {
    ComponentIdentifier,
    ContainerIdentifier,
    getComponentIdentifierString,
    getContainerIdentifierString,
} from '../identifiers';
import { COMPONENT_NOT_INITED, DEFAULT_CONTAINER_ID } from '../symbols';
import { merge } from '@metafoks/utils';

export class MetafoksContainer {
    private logger: Logger;
    public static default = new MetafoksContainer(DEFAULT_CONTAINER_ID);

    private readonly metadataMap = new Map<ComponentIdentifier<any>, ComponentMetadata<any>>();
    private properties: MetafoksContainerProperties = {
        disableRegistration: [],
    };

    public constructor(
        public readonly id: ContainerIdentifier,
        properties: Partial<MetafoksContainerProperties> = {},
    ) {
        this.logger = LoggerFactory.createLoggerByName(
            `MetafoksContainer#${getContainerIdentifierString(id)}`,
        );
        this.setProperties(properties);
        this.logger.info(`created container ${getContainerIdentifierString(id)}`);

        MetafoksRegistry.add(this);
    }

    public has<T>(identifier: ComponentIdentifier<T>) {
        return this.metadataMap.has(identifier);
    }

    public setProperties(properties?: Partial<MetafoksContainerProperties>) {
        if (properties) {
            this.properties = merge(this.properties, properties ?? {});
            this.logger.info(`changed properties=${JSON.stringify(properties)}`);
        }
    }

    public isEnabledRegistrationFor<T>(identifier: ComponentIdentifier<T>) {
        if (typeof this.properties.disableRegistration === 'boolean') {
            return !this.properties.disableRegistration;
        }
        return !this.properties.disableRegistration?.includes(getComponentIdentifierString(identifier));
    }

    public registerClass<T>(target: ComponentConstructor<T>) {
        return this.register(target, target);
    }

    public registerFunction<T>(identifier: ComponentIdentifier<T>, target: FunctionReturning<T>) {
        return this.register(identifier, target);
    }

    public registerValue<T>(identifier: ComponentIdentifier<T>, target: T) {
        return this.register(identifier, target);
    }

    /**
     * Регистрирует новый компонент
     * @param identifier
     * @param component
     */
    public register<T>(identifier: ComponentIdentifier<T>, component: ComponentType<T>) {
        if (!this.isEnabledRegistrationFor(identifier)) {
            this.logger.warn(
                `disabled registration for identifier=<${getComponentIdentifierString(identifier)}>`,
            );
            return;
        }

        if (isConstructor(component)) {
            // Для классовых компонентов прописываем containerId
            component.containerId = this.id;
        }

        const metadata = this.createComponentMetadata(identifier, component);
        this.metadataMap.set(identifier, metadata);
        this.logger.debug(`registered new identifier=<${getComponentIdentifierString(identifier)}>`);
    }

    /**
     * Возвращает компонент из контекста
     * @param identifier
     */
    public resolve<T>(identifier: ComponentIdentifier<T>): T {
        const metadata = this.metadataMap.get(identifier);
        if (!metadata) throw new ComponentUndefinedError(identifier, this.id);

        return this.resolveComponentValue<T>(metadata);
    }

    private resolveComponentValue<T>(metadata: ComponentMetadata<T>): T {
        if (metadata.value !== COMPONENT_NOT_INITED) {
            return metadata.value as T;
        }

        if (isConstructor(metadata.type)) {
            this.logger.debug(
                `creating instance of component for identifier=<${getComponentIdentifierString(metadata.id)}>`,
            );
            const props = Reflect.getMetadata('design:paramtypes', metadata.type);
            const args = this.resolveMany(props);

            if (args) metadata.value = new metadata.type(...args);
            else metadata.value = new metadata.type();
        } else if (isFunctionReturning(metadata.type)) {
            this.logger.debug(
                `creating instance by calling component function for identifier=<${getComponentIdentifierString(metadata.id)}>`,
            );
            // const props = Reflect.getMetadata('design:paramtypes', metadata.type);
            metadata.value = metadata.type();
        } else {
            this.logger.debug(
                `creating instance by setting component object for identifier=<${getComponentIdentifierString(metadata.id)}>`,
            );
            metadata.value = metadata.type as T;
        }

        if (metadata.value === COMPONENT_NOT_INITED) {
            throw new Error('something went wrong');
        }
        return metadata.value;
    }

    private resolveMany(obj: any) {
        if (obj instanceof Array) {
            return obj.map(value => this.resolve(value));
        }
        return null;
    }

    private createComponentMetadata<T>(
        identifier: ComponentIdentifier<T>,
        component: ComponentType<T>,
    ): ComponentMetadata<T> {
        return {
            id: identifier,
            type: component,
            value: COMPONENT_NOT_INITED,
        };
    }
}

export function registerComponent<T>(identifier: ComponentIdentifier<T>, component: T) {
    return MetafoksContainer.default.register(identifier, component);
}

export function resolveComponent<T>(identifier: ComponentIdentifier<T>) {
    return MetafoksContainer.default.resolve(identifier);
}
