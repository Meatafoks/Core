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
import { MetadataUtils } from '../utils';

export class MetafoksContainer {
    public static default = new MetafoksContainer(DEFAULT_CONTAINER_ID);

    private readonly logger: Logger;
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
        return !this.properties.disableRegistration?.includes(getComponentIdentifierString(identifier));
    }

    /**
     * Регистрирует класс в контроллере
     * @param target
     */
    public registerClass<T>(target: ComponentConstructor<T>) {
        return this.register(target, target);
    }

    /**
     * Регистрирует функции в контроллере
     * При resolve() значения будет возвращаться не сама функция, а ее результат
     *
     * @Example example from testing
     * ```
     * const foo = () => ({ value: 15 });
     *
     * MetafoksContainer.default.registerFunction('foo', foo);
     * const resolved = MetafoksContainer.default.resolve<ReturnType<typeof foo>>('foo');
     *
     * expect(resolved.value).toEqual(15); // ok
     * ```
     *
     * @param identifier
     * @param target
     */
    public registerFunction<T>(identifier: ComponentIdentifier<T>, target: FunctionReturning<T>) {
        return this.register(identifier, target);
    }

    /**
     * Регистрирует значение в контроллере
     * @param identifier
     * @param target
     */
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

        if (this.has(identifier)) {
            this.logger.warn(`identifier=<${getComponentIdentifierString(identifier)}> will be overridden!`);
            this.logger.trace(`overridden by value <${component}>`);
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

        const componentIdString = getComponentIdentifierString(metadata.id);
        if (isConstructor(metadata.type)) {
            this.logger.debug(`creating component for identifier=<${componentIdString}>`);

            const params = this.resolveFunctionParameters(metadata.type);
            metadata.value = new metadata.type(...params);
        } else if (isFunctionReturning(metadata.type)) {
            this.logger.debug(`creating component function for identifier=<${componentIdString}>`);

            metadata.value = metadata.type();
        } else {
            this.logger.debug(`creating component object for identifier=<${componentIdString}>`);

            metadata.value = metadata.type as T;
        }

        return metadata.value;
    }

    /**
     * Возвращает разрешенные параметры функции (в той же последовательности)
     * @param fn
     * @private
     */
    private resolveFunctionParameters(fn: Function) {
        const props = MetadataUtils.getFunctionParametersTypes(fn);
        return props.map(value => this.resolve(value));
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

    /**
     * Удаляет компонент из контекста
     * @param identifier
     */
    public dispose<T>(identifier: ComponentIdentifier<T>) {
        this.metadataMap.delete(identifier);
    }

    /**
     * Запрещает регистрацию идентификатора компонента
     * @param identifier
     * @param dispose
     */
    public disable<T>(identifier: ComponentIdentifier<T>, dispose = false) {
        if (dispose) this.dispose(identifier);
        if (!this.properties.disableRegistration) this.properties.disableRegistration = [];
        this.properties.disableRegistration.push(getComponentIdentifierString(identifier));
    }

    /**
     * Очищает контейнер и удаляет блокировки регистраций компонентов
     */
    public clear() {
        this.logger.debug('clearing container');

        this.metadataMap.clear();
        this.properties.disableRegistration = undefined;
        this.logger.info('container cleared');
    }
}
